import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Modal, Row, Input, message, Button, Select} from 'antd';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {CREATE_CAPABILITY, UPDATE_CAPABILITY} from '../../../graphql/mutations';
import Attachment from '../../../components/Attachment';
import {getProp} from '../../../utilities/filters';
import {useRouter} from "next/router";
import {GET_STACKS} from "../../../graphql/queries";


const {Option} = Select;


type Props = {
  modal?: boolean;
  capability?: any;
  closeModal: any;
  modalType: string;
  submit: Function;
  userRole: string;
  currentProduct?: any;
  hideParentOptions?: boolean;
};

const AddOrEditCapability: React.FunctionComponent<Props> = (
  {
    modal,
    capability,
    closeModal,
    modalType,
    submit
  }
) => {
  const router = useRouter();
  const {productSlug} = router.query;

  const {data: stacksData, error: stacksError} = useQuery(GET_STACKS);
  const [allStacks, setAllStacks] = useState([])

  useEffect(() => {
    if (!stacksError) {
      setAllStacks(getProp(stacksData, 'stacks', []));
    }
  }, [stacksData])

  const [name, setName] = useState(
    modalType === 'edit' ? getProp(capability, 'name', '') : ''
  );
  const [description, setDescription] = useState(
    modalType === 'edit' ? getProp(capability, 'description', '') : ''
  );
  const [stacks, setStacks] = useState(
    modalType === 'edit' ? getProp(capability, 'stacks', []).map((stack: any) => (
      stack.id
    )) : []
  );
  const [videoLink, setVideoLink] = useState(
    modalType === 'edit' ? getProp(capability, 'videoLink', '') : ''
  );
  const [attachments, setAttachments] = useState(
    modalType === 'edit' ? getProp(capability, 'attachment', []) : []
  );
  const [createCapability] = useMutation(CREATE_CAPABILITY);
  const [updateCapability] = useMutation(UPDATE_CAPABILITY);

  const handleCancel = () => {
    closeModal(!modal);
  };

  const handleOk = () => {
    if (name === '') {
      message.error("Name can't be empty").then();
      return;
    } else if (description === '') {
      message.error("Description can't be empty").then();
      return;
    }

    if (modalType === 'edit') {
      onUpdate().then();
    } else if (modalType === 'add-child' || modalType === 'add-root') {
      onCreate().then();
    }

    closeModal();
  }

  const onUpdate = async () => {
    try {
      const res = await updateCapability({
        variables: {
          productSlug: null,
          nodeId: capability.id,
          name,
          description,
          stacks,
          videoLink,
          attachments: attachments.map((item: any) => item.id)
        }
      });

      if (res.data && res.data.updateCapability && res.data.updateCapability.status) {
        message.success('Capability is updated successfully!');
        submit();
      }
    } catch (e) {
      message.success(`Capability modification is failed!  Reason: ${e.message}`);
    }
  }

  const onCreate = async () => {
    try {
      const res = await createCapability({
        variables: {
          productSlug: modalType === 'add-root' ? productSlug : null,
          nodeId: modalType === 'add-child' ? capability.id : null,
          name,
          description,
          stacks,
          videoLink,
          attachments: attachments.map((item: any) => item.id)
        }
      });

      if (res.data && res.data.createCapability && res.data.createCapability.status) {
        message.success('Capability is created successfully!');
        submit();
      }
    } catch (e) {
      message.error(`Capability creation is failed!: Reason: ${e.message}`);
    }
  }

  return (
    <>
      <Modal
        title={modalType === 'edit' ? 'Edit capability' : 'Add capability'}
        visible={modal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {modalType === 'edit' ? 'Edit' : 'Add'}
          </Button>
        ]}
      >
        <>
          <Row className="mb-15">
            <label>Name*:</label>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Row>
          <Row className="mb-15">
            <label>Description*:</label>
            <Input.TextArea
              rows={2}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Row>
          <Row className="mb-15">
            <label>Stacks:</label>
            <Select
              placeholder="Stacks"
              mode="multiple"
              defaultValue={stacks}
              onChange={setStacks}
            >
              {allStacks && allStacks.map((option: any, idx: number) => (
                <Option key={`cap${idx}`} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Row>
          <Row className="mb-15">
            <label>Video link:</label>
            <Input
              placeholder="Video link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              required
            />
          </Row>
          {
            <Attachment
              attachments={attachments}
              capabilityId={capability ? capability.id : null}
              editMode={true}
              setAttachments={setAttachments}
            />
          }
        </>
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct,
  userRole: state.work.userRole,
  allTags: state.work.allTags
});

const mapDispatchToProps = () => ({});

const AddCapabilityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddOrEditCapability);

export default AddCapabilityContainer;