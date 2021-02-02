import React from 'react';
import { Modal, Button, Select } from 'antd';

const { Option } = Select;

type Props = {
    modal?: boolean;
    productSlug: string;
    closeModal: any;
    submit: Function;
    title: string;
};

const DeleteModal: React.SFC<Props> = ({
  modal,
  productSlug,
  closeModal,
  submit,
  title
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
            Submit
          </Button>,
        ]}
      >
        <h3>Are you sure?</h3>
      </Modal>
    </>
  );
}

export default DeleteModal;