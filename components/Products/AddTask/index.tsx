import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Input, Select, message, Button } from 'antd';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {GET_INITIATIVES, GET_TASKS_BY_PRODUCT} from '../../../graphql/queries';
import { CREATE_TASK, CREATE_CODE_REPOSITORY, UPDATE_TASK } from '../../../graphql/mutations';
import { TASK_TYPES } from '../../../graphql/types';
import { addRepository } from '../../../lib/actions';
import { WorkState } from '../../../lib/reducers/work.reducer';
import AddInitiative from '../AddInitiative';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { RICHTEXT_EDITOR_WIDTH } from '../../../utilities/constants';
import dynamic from "next/dynamic";

const { Option } = Select;
const { TextArea } = Input;

const RichTextEditor = dynamic(
  () => import('../../TextEditor'),
  { ssr: false }
);

const filterRepositoryId = (arr: Array<any>, url: string) => {
  const filteredArr = arr.filter((item: any) => item.repository === url);
  return filteredArr.length ? filteredArr[0].id : null;
}

type Props = {
  modal?: boolean;
  productSlug?: string;
  closeModal: any;
  currentProduct?: any;
  repositories?: Array<any>;
  addRepository?: any;
  allTags?: any;
  tags?: any;
  modalType?: boolean;
  task?: any;
  submit?: any;
  tasks?: Array<any>;
};

const AddTask: React.FunctionComponent<Props> = ({
  modal,
  productSlug,
  closeModal,
  currentProduct,
  repositories,
  addRepository,
  allTags,
  modalType,
  task,
  submit,
  tasks
}) => {
  const [title, setTitle] = useState(modalType? task.title : '');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState(
    modalType ? task.shortDescription : ''
  );
  const [status, setStatus] = useState(modalType? task.status : 2);
  const [capability, setCapability] = useState(
    modalType && task.capability ? task.capability.id : 0
  );
  const [initiative, setInitiative] = useState(
    modalType && task.initiative ? task.initiative.id : 0
  );
  const [repository, setRepository] = useState(
    modalType && repositories && repositories.length > 0
      ? filterRepositoryId(repositories, task.repository)
      : null
  );
  const [initiatives, setInitiatives] = useState(
    currentProduct && currentProduct.initiativeSet ? currentProduct.initiativeSet : []
  )
  const [editRepository, toggleRepository] = useState(false);
  const [editInitiative, toggleInitiative] = useState(false);
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [detailUrl, setDetailUrl] = useState(modalType ? task.detailUrl : '');
  const [tags, setTags] = useState(
    modalType && task.tag ? task.tag.map((tag: any) => tag.id) : []
  );
  const [dependOns, setDependOns] = useState(
    modalType && task.dependOn ? task.dependOn.map((tag: any) => tag.id) : []
  );

  const { data: originalIniaitves, refetch: fetchIniatives } = useQuery(GET_INITIATIVES, {
    variables: { productSlug }
  });
  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [createCodeRepository] = useMutation(CREATE_CODE_REPOSITORY);

  // TextEditor configuration
  const onDescriptionChange = (value: any) => {
    setDescription(value);
  };

  const handleOk = async () => {
    if (!title) {
      message.error("Title is required. Please fill out title");
      return;
    }
    if (!description) {
      message.error("Title is required. Please fill out description");
      return;
    }

    if (capability === 0 && initiative === 0) {
      message.error("Task should have capability or initiative. Or both of them");
      return;
    }

    await addNewTask();
  };

  const handleCancel = () => {
    closeModal(!modal);
    clearData();
  };

  const clearData = () => {
    setTitle("");
    setStatus(2);
    setDescription("");
    setShortDescription("");
    setCapability(0);
    setInitiative(0);
    setRepository(null);
    setRepositoryUrl("");
    setTags([]);
    setDependOns([]);
  }

  const addNewTask = async () => {
    const input = {
      title,
      description: description.toString('html'),
      shortDescription: shortDescription,
      status: status,
      productSlug,
      initiative: initiative === 0 ? null : parseInt(initiative),
      capability: capability === 0 ? null : parseInt(capability),
      repository: repository === 0 ? null : parseInt(repository),
      tags,
      dependOns,
      detailUrl,
      userId: localStorage.getItem('userId'),
    };

    try {
      const res = modalType
        ? await updateTask({
            variables: { input, id: parseInt(task.id) }
          })
        : await createTask({
            variables: { input }
          })
      
      if (!res.errors) {
        submit();
        const messageType = modalType ? 'updated' : 'created';
        message.success(`Task is ${messageType} successfully!`);
        closeModal(!modal);
      } else {
        message.error(res.errors[0].message);
      }
    } catch (e) {
      message.error(e.message);
    }
  }

  const addNewRepository = async () => {
    if (!repositoryUrl || !accessToken) {
      message.error('Please type repository url and access token');
      return;
    }

    const input = {
      repository: repositoryUrl,
      accessToken,
      productSlug
    };

    try {
      const res = await createCodeRepository({
        variables: { input }
      });
      
      if (
        res.data &&
        res.data.createCodeRepository &&
        res.data.createCodeRepository.repository
      ) {
        addRepository(res.data.createCodeRepository.repository);
        message.success('Repository is created successfully!');
        setRepository(res.data.createCodeRepository.repository.id);
        toggleRepository(!editRepository);
      }
    } catch (e) {
      message.error(`Repository creation is failed! Reason: ${e.message}`);
    }
  }

  const updateIniatives = async () => {
    const { data: newData } = await fetchIniatives({
      productSlug: productSlug
    });

    setInitiatives(newData.initiatives);
  }

  useEffect(() => {
    if (originalIniaitves) {
      setInitiatives(originalIniaitves.initiatives);
    }
  }, [originalIniaitves]);

  return (
    <>
      <Modal
        title={`${modalType ? "Edit" : "Add"} Task`}
        visible={modal}
        onOk={handleOk}
        onCancel={handleCancel}
        className="add-modal add-task-modal"
        width={RICHTEXT_EDITOR_WIDTH}
      >
        <Row className='mb-15'>
          <label>Title*:</label>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Row>
        <Row className='mb-15'>
          <label>Short Description:</label>
          <TextArea
            placeholder="Short Description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </Row>
        <Row
          className="rich-editor mb-15"
        >
          <label>Description:</label>
          <RichTextEditor
            initialValue={modalType ? task.description : ''}
            setValue={onDescriptionChange}
          />
        </Row>
        {modalType && (
          <Row className='mb-15'>
            <label>Task detail url:</label>
            <Input
              placeholder="Task detail url"
              value={detailUrl}
              onChange={(e) => setDetailUrl(e.target.value)}
              required
            />
          </Row>
        )}
        {currentProduct && currentProduct.capabilitySet && (
          <Row className='mb-15'>
            <label>Capability*:</label>
            <Select
              defaultValue={capability}
              onChange={setCapability}
            >
              <Option value={0}>Select capability</Option>
              {currentProduct.capabilitySet.map((option: any, idx: number) => (
                <Option key={`cap${idx}`} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Row>
        )}
        {initiatives && (
          <>
            <Row justify="space-between" className='mb-5'>
              <Col>
                <label>Initiative:</label>
              </Col>
              <Col>
                {!editInitiative ? (
                  <PlusOutlined
                    className="my-auto mb-10"
                    onClick={() => toggleInitiative(!editInitiative)}
                  />
                ) : (
                  <MinusOutlined
                    className="my-auto mb-10"
                    onClick={() => toggleInitiative(!editInitiative)}
                  />
                )}
              </Col>
              {editInitiative && (
                <AddInitiative
                  modal={editInitiative}
                  productSlug={productSlug}
                  modalType={false}
                  closeModal={toggleInitiative}
                  submit={updateIniatives}
                />
              )}
            </Row>
            <Row className='mb-15'>
              <Select
                defaultValue={initiative}
                onChange={setInitiative}
              >
                <Option value={0}>Select initiative</Option>
                {initiatives.map((option: any, idx: number) => (
                  <Option key={`init${idx}`} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Row>
          </>
        )}
        {repositories && (
          <>
            <Row justify="space-between" className='mb-5'>
              <Col>
                <label>Repository:</label>
              </Col>
              <Col>
                {!editRepository ? (
                  <PlusOutlined
                    className="my-auto mb-10"
                    onClick={() => toggleRepository(!editRepository)}
                  />
                ) : (
                  <MinusOutlined
                    className="my-auto mb-10"
                    onClick={() => toggleRepository(!editRepository)}
                  />
                )}
              </Col>
            </Row>
            {editRepository && (
              <Row
                className='mb-15 p-15'
                style={{
                  background: "var(--bg-grey)"
                }}
              >
                <label>Repository url:</label>
                <Input
                  className='mb-15'
                  placeholder="https://github.com/<git_username>/<repo_name>"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                />
                <label>Git access token: </label>
                <Input
                  placeholder="Access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <Button
                  className="text-right mt-15"
                  onClick={() => addNewRepository()}
                >
                  Add Repository
                </Button>
              </Row>
            )}
            <Row
              justify="space-between"
              className='mb-15'
            >
              <Select
                defaultValue={repository}
                onChange={setRepository}
              >
                <Option value={0}>Select repository</Option>
                {repositories.map((option: any, idx: number) => (
                  <Option key={`init${idx}`} value={option.id}>
                    {option.repository}
                  </Option>
                ))}
              </Select>
            </Row>
          </>
        )}
        <Row className='mb-15'>
          <label>Status*: </label>
          <Select
            defaultValue={status}
            onChange={setStatus}
          >
            {TASK_TYPES.map((option: string, idx: number) => (
              <Option key={`status${idx}`} value={idx}>{option}</Option>
            ))}
          </Select>
        </Row>
        <Row className='mb-15'>
          <label>Tags:</label>
          <Select
            mode="multiple"
            defaultValue={tags}
            onChange={setTags}
          >
            <Option value={0}>Select tags</Option>
            {allTags && allTags.map((option: any, idx: number) => (
              <Option key={`cap${idx}`} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Row>
        <Row>
          <label>Depend on tasks:</label>
          <Select
            mode="multiple"
            defaultValue={dependOns}
            onChange={setDependOns}
          >
            <Option value={0}>Select depend on tasks</Option>
            {tasks &&
            tasks.map((option: any, idx: number) => (
              <Option key={`cap${idx}`} value={option.id}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Row>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct,
  repositories: state.work.repositories,
  userRole: state.work.userRole,
  allTags: state.work.allTags,
  tags: state.work.tags
});

const mapDispatchToProps = (dispatch: any) => ({
  addRepository: (data: WorkState) => dispatch(addRepository(data))
});

const AddTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTask);

export default AddTaskContainer;