import React from 'react';
import { Modal, Button, Select } from 'antd';

const { Option } = Select;

type Props = {
    modal?: boolean;
    productSlug: string;
    closeModal: any;
    submit: Function;
    title: string;
    message?: string;
    submitText?: string;
};

const CustomModal: React.SFC<Props> = ({
  modal,
  productSlug,
  closeModal,
  submit,
  title,
  message  = "Are you sure?",
  submitText = "Submit",
}) => {  
  const handleCancel = () => {
    closeModal(!modal);
  };

  const handleOk = () => {
    submit();
  }

  return (
    <>
      <Modal
        title={title}
        visible={modal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {submitText}
          </Button>,
        ]}
      >
        <h3>{message}</h3>
      </Modal>
    </>
  );
}

export default CustomModal;