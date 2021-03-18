import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Modal, Row, Col, Input, Select, message, Button} from 'antd';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {
  GET_CAPABILITIES_BY_PRODUCT_AS_LIST,
  GET_INITIATIVES,
  GET_STACKS,
  GET_TAGS,
  GET_USERS
} from '../../../graphql/queries';
import {CREATE_TASK, UPDATE_TASK} from '../../../graphql/mutations';
import {TASK_TYPES} from '../../../graphql/types';
import AddInitiative from '../AddInitiative';
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
import {RICH_TEXT_EDITOR_WIDTH} from '../../../utilities/constants';
import dynamic from "next/dynamic";
import {getProp} from "../../../utilities/filters";


const {Option} = Select;
const {TextArea} = Input;

interface IUser {
  fullName: string
  slug: string
}

const RichTextEditor = dynamic(
  () => import('../../TextEditor'),
  {ssr: false}
);

type Props = {
  modal?: boolean;
  productSlug?: string;
  closeModal: any;
  currentProduct?: any;
  tags?: any;
  modalType?: boolean;
  task?: any;
  submit?: any;
  tasks?: Array<any>;
  stacks?: Array<any>;
};

const AddTask: React.FunctionComponent<Props> = (
  {
    modal,
    productSlug,
    closeModal,
    modalType,
    task,
    submit,
    tasks
  }
) => {
  const [title, setTitle] = useState(modalType ? task.title : '');
  const [description, setDescription] = useState(modalType ? task.description : '');
  const [allCapabilities, setAllCapabilities] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [skip, setSkip] = React.useState(false);
  const [allStacks, setAllStacks] = useState([]);
  const [shortDescription, setShortDescription] = useState(
    modalType ? task.shortDescription : ''
  );
  const [status, setStatus] = useState(modalType ? task.status : 2);
  const [capability, setCapability] = useState(
    modalType && task.capability ? task.capability.id : 0
  );
  const [initiative, setInitiative] = useState(
    modalType && task.initiative ? task.initiative.id : 0
  );
  const [initiatives, setInitiatives] = useState([])
  const [editInitiative, toggleInitiative] = useState(false);
  const [targetWorkLocation, setTargetWorkLocation] = useState(modalType ? task.targetWorkLocation : '');
  const [tags, setTags] = useState(
    modalType && task.tag ? task.tag.map((tag: any) => tag.name) : []
  );

  const [tagsSearchValue, setTagsSearchValue] = useState('');
  const tagsSearchValueChangeHandler = (val) => {
    const re = /^[a-zA-Z0-9-]{0,128}$/;

    if (re.test(val)) {
      setTagsSearchValue(val);
    } else if (val.length > 1 && (val[val.length - 1] === ' ' || val[val.length - 1] === ',')) {
      setTags(prev => [...prev, val.slice(0, -1)]);
      setTagsSearchValue('');
    } else {
      message.warn('Tags can only include letters, numbers and -, with the max length of 128 characters').then()
    }
  };

  const [stacks, setStacks] = useState(
    modalType && task.stack ? task.stack.map((stack: any) => stack.id) : []
  );
  const [dependOn, setDependOn] = useState(
    modalType && task.dependOn ? task.dependOn.map((tag: any) => tag.id) : []
  );

  const {data: originalInitiatives, loading: initiativeLoading, refetch: fetchInitiatives} = useQuery(GET_INITIATIVES, {
    variables: {productSlug}
  });
  const {data: capabilitiesData} = useQuery(GET_CAPABILITIES_BY_PRODUCT_AS_LIST, {
    variables: {productSlug}
  });
  const {data: tagsData} = useQuery(GET_TAGS, {
    variables: {productSlug}
  });
  const {data: stacksData} = useQuery(GET_STACKS);
  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [allUsers, setAllUsers] = useState([]);
  const [reviewSelectValue, setReviewSelectValue] = useState(getProp(task, 'reviewer.slug', ''));
  const {data: users} = useQuery(GET_USERS);

  const filterOption = (input: string, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  tasks = tasks.filter(dependOnTask => {
    let tId = task && task.hasOwnProperty("id") ? task.id : undefined;
    return tId != dependOnTask.id
  });

  useEffect(() => {
    setAllUsers(getProp(users, 'people', []));
  }, [users]);

  useEffect(() => {
    if (capabilitiesData && capabilitiesData.capabilitiesAsList) {
      setAllCapabilities(capabilitiesData.capabilitiesAsList);
    }
  }, [capabilitiesData]);

  useEffect(() => {
    if (tagsData && tagsData.tags) setAllTags(tagsData.tags)
  }, [tagsData]);

  useEffect(() => {
    if (stacksData && stacksData.stacks) setAllStacks(stacksData.stacks)
  }, [stacksData]);

  useEffect(() => {
    if (!initiativeLoading && !!originalInitiatives && !skip) {
      setSkip(true)
    }
  }, [originalInitiatives, initiativeLoading]);

  useEffect(() => {
    if (!skip) fetchInitiatives({productSlug})
  }, [skip]);

  useEffect(() => {
    if (originalInitiatives) {
      setInitiatives(originalInitiatives.initiatives);
    }
  }, [originalInitiatives]);

  const onDescriptionChange = (value: any) => {
    setDescription(value);
  };

  const handleOk = async () => {
    if (!title) {
      message.error("Title is required. Please fill out title");
      return;
    }
    if (!description) {
      message.error("Long description is required. Please fill out description");
      return;
    }
    if (!targetWorkLocation) {
      message.error("Target work location is required. Please fill out target work location");
      return;
    }
    if (!reviewSelectValue) {
      message.error("Reviewer is required. Please fill out reviewer");
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
    setTargetWorkLocation('');
    setCapability([]);
    setTags([]);
    setStacks([]);
    setDependOn([]);
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
      targetWorkLocation,
      tags,
      stacks,
      dependOn,
      reviewer: reviewSelectValue
    };

    try {
      const res = modalType
        ? await updateTask({
          variables: {input, id: parseInt(task.id)}
        })
        : await createTask({
          variables: {input}
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

  const updateInitiatives = async () => {
    const {data: newData} = await fetchInitiatives({
      productSlug: productSlug
    });

    setInitiatives(newData.initiatives);
  }

  const reviewSelectChange = (val: any) => {
    setReviewSelectValue(val);
  }

  return (
    <>
      <Modal
        title={`${modalType ? "Edit" : "Add"} Task`}
        visible={modal}
        onOk={handleOk}
        onCancel={handleCancel}
        className="add-modal add-task-modal"
        width={RICH_TEXT_EDITOR_WIDTH}
        maskClosable={false}
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
          <Col span={24}>
            <label>Short Description*:</label>
          </Col>
          <Col span={24}>
            <TextArea
              placeholder="Short Description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              maxLength={256}
              showCount
              required
            />
          </Col>
        </Row>
        <Row
          className="rich-editor mb-15"
        >
          <label>Long Description*:</label>
          <RichTextEditor
            initialValue={modalType ? task.description : ''}
            setValue={onDescriptionChange}
          />
        </Row>
        {
          allCapabilities.length > 0 && (
            <Row className='mb-15'>
              <label>Capability:</label>
              <Select
                placeholder='Select a capability'
                onChange={setCapability}
                filterOption={filterOption}
                showSearch
                defaultValue={capability ? capability : null}
              >
                {allCapabilities.map((option: any, idx: number) => (
                  <Option key={`cap${idx}`} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Row>
          )
        }
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
                  productSlug={String(productSlug)}
                  modalType={false}
                  closeModal={toggleInitiative}
                  submit={updateInitiatives}
                />
              )}
            </Row>
            <Row className='mb-15'>
              <Select
                onChange={setInitiative}
                placeholder="Select initiative"
                filterOption={filterOption}
                showSearch
                defaultValue={initiative ? initiative : null}
              >
                {initiatives.map((option: any, idx: number) => (
                  <Option key={`init${idx}`} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Row>
          </>
        )}
        <Row className='mb-15'>
          <label>Target work location*:</label>
          <Input
            placeholder="Target work location"
            value={targetWorkLocation}
            onChange={(e) => setTargetWorkLocation(e.target.value)}
            required
          />
        </Row>
        <Row className='mb-15'>
          <label>Status: </label>
          <Select
            defaultValue={status}
            onChange={setStatus}
            placeholder="Select status"
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
            onChange={setTags}
            searchValue={tagsSearchValue}
            onSearch={(e) => tagsSearchValueChangeHandler(e)}
            filterOption={filterOption}
            placeholder="Select tags"
            value={tags}
          >
            {allTags && allTags.map((option: any, idx: number) => (
              <Option key={`cap${idx}`} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Row>
        <Row className='mb-15'>
          <label>Stacks:</label>
          <Select
            mode="multiple"
            onChange={setStacks}
            defaultValue={stacks}
            filterOption={filterOption}
            placeholder="Select stacks"
          >
            {allStacks && allStacks.map((option: any, idx: number) => (
              <Option key={`cap${idx}`} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Row>
        <Row>
          <label>Dependant on:</label>
          <Select
            mode="multiple"
            onChange={setDependOn}
            filterOption={filterOption}
            placeholder="Select depend on tasks"
            defaultValue={dependOn}
          >
            {tasks &&
            tasks.map((option: any, idx: number) => (
              <Option key={`cap${idx}`} value={option.id}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Row>
        <Row style={{marginTop: 20}}>
          <label>Reviewer*:</label>

          <Select
            onChange={val => reviewSelectChange(val)}
            placeholder="Select a reviewer"
            showSearch
            filterOption={filterOption}
            defaultValue={reviewSelectValue ? reviewSelectValue : null}
          >
            {
              allUsers.map((user: IUser) => (
                <Option key={`user-${user.slug}`} value={user.slug}>{user.fullName}</Option>
              ))
            }
          </Select>
        </Row>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct,
  userRole: state.work.userRole,
  allTags: state.work.allTags,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTask);