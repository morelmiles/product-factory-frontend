import React, {useEffect, useState} from 'react';
import {Modal, Select, Form, Typography, Input, message} from 'antd';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {connect} from "react-redux";
import {WorkState} from "../../lib/reducers/work.reducer";
import RichTextEditor from "../RichTextEditor";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./style.less";
import {UPDATE_CONTRIBUTION_GUIDE, CREATE_CONTRIBUTION_GUIDE} from "../../graphql/mutations";

const { Option } = Select;

type Props = {
  modal: boolean;
  closeModal: (updateGuides?: boolean) => void;
  stacks: any[],
  saveStacks: Function,
  productSlug?: string,
  item: null | {
    id?: string,
    title: string,
    stack: { id: string, name: string }[],
    description: string
  }
};

const ContributionGuideModal: React.FunctionComponent<Props> = ({
  modal,
  closeModal,
  item,
  stacks,
  productSlug,
  saveStacks,
}) => {
  const [form] = Form.useForm()
  const handleCancel = () => {
    closeModal();
    clearData();
  }
  const [description, setDescription] = useState(item?.description || "");
  const [longDescriptionClear, setLongDescriptionClear] = useState(0);
  let initialForm = {
    title: "",
    description: "",
  };


  const [createGuide] = useMutation(CREATE_CONTRIBUTION_GUIDE, {
    onCompleted(res) {
      if (res.createContributionGuide.status) {
        message.success(res.createContributionGuide.message).then();
        closeModal(true);
      } else {
        message.error(res.createContributionGuide.message).then();
      }
    },
    onError({ message: sysMessage}) {
      message.error(sysMessage || "Can't save the guide").then();
    }
  })

  const [updateGuide] = useMutation(UPDATE_CONTRIBUTION_GUIDE, {
    onCompleted(res) {
      if (res.updateContributionGuide.status) {
        message.success(res.updateContributionGuide.message).then();
        closeModal(true);
      } else {
        message.error(res.updateContributionGuide.message).then();
      }
    },
    onError({ message: sysMessage}) {
      message.error(sysMessage || "Can't save the guide").then();
    }
  })

  const clearData = () => {
    form.resetFields();
    setLongDescriptionClear(prev => prev + 1);
  };

  useEffect(() => {
    if (item) {
      form.setFields([
        {name: "title", value: item.title},
        {name: "description", value: item.description},
        {name: "stacks", value: item.stack.map(s => s.id)}
      ]);
      setDescription(item.description)
    }
  }, [item])

  const onFinish = (values: any) => {
    if (!values.title) {
      message.error("Guide title is required. Please fill out headline").then();
      return;
    }
    if (!description || description === "<p></p>") {
      message.error("Guide description is required. Please fill out description").then();
      return;
    }
    const input = {
      description,
      title: values.title,
      stacks: values.stacks,
      productSlug
    };
    if (item) {
      updateGuide({variables: {input, id: item.id}}).then()
    } else {
      createGuide({variables: {input}}).then()
    }
  }

  const filterOption = (input: string, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  return (
    <>
      <Modal
        title={false}
        visible={modal}
        width={720}
        onCancel={handleCancel}
        okText="Save"
        className="contribution-guide-modal"
        okButtonProps={{
          htmlType: "submit",
          form: "contribution-guide-form"
        }}
      >
        <div className="info-container">
          <InfoCircleOutlined style={{fontSize: 20}} />
        </div>

        <Form layout="vertical"
              form={form}
              initialValues={initialForm}
              name="control-ref"
              id="contribution-guide-form"
              onFinish={onFinish}>
          <Typography.Text  style={{paddingBottom: 20, display: "block"}}>
            The guide you will add here will be accessible during task creation and you can add it to the tasks.
            Give it a descriptive title so you can easily distinguish it during the task creation. Optionally
            you can associate it with specific stacks and the task that includes any of these stacks will have
            this contribution guide by default where you can change if necessary.
          </Typography.Text>
          <Form.Item name="title" label="Guide Title *">
            <Input name="title" />
          </Form.Item>
          <Form.Item name="description" label="Guide Content *">
            <RichTextEditor initialHTMLValue={description}
                            onChangeHTML={setDescription}
                            clear={longDescriptionClear} />
          </Form.Item>
          <Form.Item name="stacks" label="Skills">
            <Select
              placeholder="Specify skills"
              mode="multiple"
              showSearch={true}
              filterOption={filterOption}
              allowClear
            >
              {stacks.map((tag: {id: string, name: string}) =>
                <Option key={tag.id} value={tag.id}>{tag.name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: any) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContributionGuideModal);
