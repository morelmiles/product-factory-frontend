import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Modal, Row, Input, message, Button, Select} from 'antd';
import {useMutation} from '@apollo/react-hooks';
import {CREATE_CAPABILITY, UPDATE_CAPABILITY} from '../../../graphql/mutations';
import Attachment from '../../../components/Attachment';
import {getProp} from '../../../utilities/filters';
import {useRouter} from "next/router";


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
    submit,
    // userRole,
    currentProduct,
    hideParentOptions,
  }
) => {
  const router = useRouter();
  const {productSlug} = router.query;

  const [title, setTitle] = useState(
    modalType === 'edit' ? getProp(capability, 'name', '') : ''
  );
  const [parent, setParent] = useState(
    modalType === 'edit' ? getProp(capability, 'parent.id', '') : ''
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
    if (title === '') {
      message.error("Title can't be empty!").then();

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
          nodeId: capability.id,
          name: title,
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
      let input = {};

      let nodeTitle = title;
      nodeTitle = nodeTitle.replaceAll("'", "\\'");
      nodeTitle = nodeTitle.replaceAll('"', "\\'");

      if (modalType === 'add-root') {
        input = {
          name: nodeTitle,
          productSlug: productSlug,
          attachments: attachments.map((item: any) => item.id)
        };
      } else if (modalType === 'add-child') {
        input = {
          name: nodeTitle,
          nodeId: capability.id,
          attachments: attachments.map((item: any) => item.id)
        };
      } else {
        return;
      }

      const res = await createCapability({variables: input});

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Row>
          {
            !hideParentOptions && currentProduct && currentProduct.capabilitySet && (
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
            )
          }
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