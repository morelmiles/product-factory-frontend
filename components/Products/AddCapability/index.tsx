import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Input, message, Button, Select } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_CAPABILITY, UPDATE_CAPABILITY } from '../../../graphql/mutations';
import Attachment from '../../../components/Attachment';
import { getProp } from '../../../utilities/filters';
import { addCapability } from '../../../lib/actions';

const { Option } = Select;

type Props = {
  modal?: boolean;
  productSlug: string;
  capability?: any;
  closeModal: any;
  modalType: boolean;
  submit: Function;
  userRole: string;
  currentProduct?: any;
  addCapability: any;
  hideParentOptions?: boolean;
};

const AddCapability: React.FunctionComponent<Props> = ({
  modal,
  productSlug,
  capability,
  closeModal,
  modalType,
  submit,
  userRole,
  currentProduct,
  addCapability,
  hideParentOptions,
}) => {
  const [title, setTitle] = useState(
    modalType ? getProp(capability, 'name', '') : ''
  );
  const [parent, setParent] = useState(
    modalType ? getProp(capability, 'parent.id', '') : ''
  );
  const [attachments, setAttachments] = useState(
    modalType ? getProp(capability, 'attachment', []) : []
  );
  const [createCapability] = useMutation(CREATE_CAPABILITY);
  const [updateCapability] = useMutation(UPDATE_CAPABILITY);
  
  const handleCancel = () => {
    closeModal(!modal);
  };

  const handleOk = () => {
    if (title === "") {
      message.error("Title can't be empty!");
      return;
    }

    if (modalType) {
      onUpdate();
    } else {
      onCreate();
    }

    closeModal();
  }

  const onUpdate = async () => {
    const input = {
      name: title,
      productSlug,
      parent: parent ? parseInt(parent) : 0,
      attachments: attachments.map((item: any) => item.id)
    };
    
    try {
      const res = await updateCapability({
        variables: {
          input,
          id: capability ? capability.id : 0
        }
      });
      
      if (res.data && res.data.updateCapability) {
        message.success('Capability is updated successfully!');
        submit();
      }
    } catch (e) {
      message.success(`Capability modification is failed!  Reason: ${e.message}`);
    }
  }
  
  const onCreate = async () => {
    const input = {
      name: title,
      productSlug,
      parent: capability ? capability.id : parseInt(parent),
      attachments: attachments.map((item: any) => item.id)
    };
    
    try {
      const res = await createCapability({
        variables: { input }
      });
      
      if (res.data && res.data.createCapability) {
        message.success('Capability is created successfully!');
        addCapability(res.data.createCapability.capability);
        submit();
      }
    } catch (e) {
      message.success(`Capability creation is failed!: Reason: ${e.message}`);
    }
  }

  return (
    <>
      <Modal
        title={ modalType ? "Edit capability" : "Add capability" }
        visible={modal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            { modalType ? "Edit" : "Add" }
          </Button>
        ]}
      >
        <>
          <Row className="mb-15">
            <label>Name*:</label>
            <Input
              placeholder="Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Row>
          {!hideParentOptions && currentProduct && currentProduct.capabilitySet && (
            <Row className="mt-15">
              <label>Parent capability:</label>
              <Select
                defaultValue={parent}
                onChange={setParent}
              >
                <Option value={0}>Select parent</Option>
                {currentProduct.capabilitySet.map((option: any, idx: number) => (
                  <Option key={`cap${idx}`} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Row>
          )}
          {<Attachment
            attachments={attachments}
            capabilityId={capability ? capability.id : null}
            editMode={true}
            setAttachments={setAttachments}
          />}
        </>
      </Modal>
    </>
  );
}


const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct,
  userRole: state.work.userRole,
  allTags: state.work.allTags
});

const mapDispatchToProps = (dispatch: any) => ({
  addCapability: (data: any) => dispatch(addCapability(data))
});

const AddCapabilityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCapability);

export default AddCapabilityContainer;