import React, {useState} from "react";
import {Modal, Button, message, Typography, Avatar, Col, Row, Form, Input} from "antd";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_PERSON} from "../../graphql/mutations";
import {getProp} from "../../utilities/filters";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import FormInput from "../FormInput/FormInput";
import SkillsArea from "../FormInput/SkillsArea";

interface CreatePersonProps {
    modal: boolean,
    closeModal: Function,
}

interface Person {
    firstName: string,
    lastName: string,
    bio: string
}


const CreatePersonModal = ({modal, closeModal}: CreatePersonProps) => {
    const [form] = Form.useForm();
    const [skills, setSkills] = useState<string[]>([]);
    const [createProfile] = useMutation(CREATE_PERSON, {
        onCompleted(data) {
            const status = getProp(data, 'status', false);
            const messageText = getProp(data, 'message', '');

            if (status) {
                message.success("Person profile successfully created", 10).then();
                closeModal(false);
            } else {
                message.error(messageText).then();
            }
        },
        onError() {
            message.error('Error with product creation').then();
        }
    });
    const submit = (values: Person) => {
        createProfile({variables: {...values, skills}});
    }


    const cancel = () => {
        closeModal(false);
    }

    return (
        <Modal
            visible={true}
            onCancel={cancel}
            maskClosable={false}
            footer={null}
            closable={false}
        >
            <Form form={form} onFinish={submit}>
                <Typography style={{fontSize: 24, fontFamily: "SF Pro Display"}}>Create Your Profile</Typography>
                <Row id={"profile-row"} style={{display: "flex", flexWrap: "nowrap"}}>
                    <Col style={{marginTop: 32, marginRight: 25}}>
                        <Avatar size={80} icon={<UserOutlined/>}/>
                        <Button style={{position: "absolute", left: 55}} type="primary" shape="circle"
                                icon={<EditOutlined/>}/>
                    </Col>
                    <Col style={{maxWidth: 177, maxHeight: 51, marginTop: 32, marginRight: 17}}>
                        <Form.Item name="firstName"
                                   rules={[
                                       {required: true},
                                   ]}>
                            <FormInput label="First Name" type="text" name="firstName" placeholder="First name"
                                       value={form.getFieldValue('firstName')}/>
                        </Form.Item>
                    </Col>
                    <Col style={{maxWidth: 177, maxHeight: 51, marginTop: 32}}>
                        <Form.Item name="lastName"
                                   rules={[
                                       {required: true},
                                   ]}>
                            <FormInput label="Last Name" name="lastName" placeholder="Last Name" type="text"
                                       value={form.getFieldValue('lastName')}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row id="profile-area-row" style={{flexFlow: "row-reverse"}}>
                    <Form.Item name="bio"
                               style={{float: "right"}}
                               rules={[
                                   {required: true},
                               ]}>
                        <FormInput label="Add Your Bio" name="bio" placeholder="Add Your Bio" type="textarea"
                                   value={form.getFieldValue('bio')}/>
                    </Form.Item>
                </Row>
                <Row id="profile-area-row" style={{flexFlow: "row-reverse"}}>
                    <Form.Item name="skills"
                               style={{float: "right"}}
                               rules={[
                                   {required: true},
                               ]}>
                        <SkillsArea skills={skills} setSkills={setSkills}/>
                    </Form.Item>
                </Row>
                <Row id="profile-btn" style={{flexFlow: "row-reverse"}}>
                    <Button style={{padding: "0 44px", fontSize: 16, borderRadius: 10}} type="primary" size="large" htmlType="submit">
                        Save
                    </Button>
                </Row>
            </Form>
        </Modal>
    )
}

export default CreatePersonModal;
