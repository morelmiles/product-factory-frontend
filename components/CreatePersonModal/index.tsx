import React, {useEffect, useState} from "react";
import {Modal, Button, message, Typography, Avatar, Col, Row, Form, Input} from "antd";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_PERSON, SAVE_AVATAR} from "../../graphql/mutations";
import {getProp} from "../../utilities/filters";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import FormInput from "../FormInput/FormInput";
import SkillsArea from "../FormInput/SkillsArea";
import AvatarUploadModal from "./AvatarUploadModal";
import {CreatePersonProps, Person} from "./interfaces";
import {UploadFile} from "antd/es/upload/interface";
import {apiDomain} from "../../utilities/constants";
import {useRouter} from "next/router";

export interface Skill {
    category: string,
    expertise: string | null
}


const CreatePersonModal = ({modal, closeModal}: CreatePersonProps) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [avatarId, setAvatarId] = useState<number>(-1);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [avatarUploadModal, setAvatarUploadModal] = useState<boolean>(false);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [createProfile] = useMutation(CREATE_PERSON, {
        onCompleted(data) {
            const status = getProp(data, 'createPerson.status', false);
            const messageText = getProp(data, 'createPerson.message', '');

            if (status) {
                message.success("Person profile successfully created", 10).then();
                closeModal(false);
                form.resetFields();
                router.push('/').then();
            } else {
                message.error(messageText).then();
            }
        },
        onError() {
            message.error('Error with person profile creation').then();
        }
    });

    const [saveAvatar] = useMutation(SAVE_AVATAR, {
        onCompleted(data) {
            const status = getProp(data, 'saveAvatar.status', false);
            const messageText = getProp(data, 'saveAvatar.message', '');

            if (status) {
                message.success("Avatar successfully uploaded", 10).then();
                setAvatarUrl(apiDomain + data.saveAvatar.avatarUrl);
                setAvatarId(data.saveAvatar.avatarId);
                setAvatarUploadModal(false);
            } else {
                message.error(messageText).then();
            }
        },
        onError() {
            message.error('Upload file failed').then();
        }
    });

    const submit = (values: Person) => {
        createProfile({variables: {...values, skills, avatar: avatarId}});
    }


    const cancel = () => {
        closeModal(false);
    }

    return (
        <Modal
            visible={modal}
            onCancel={cancel}
            maskClosable={false}
            footer={null}
            closable={false}
        >
            <Form form={form} onFinish={submit}>
                <Typography style={{fontSize: 24, fontFamily: "SF Pro Display"}}>Create Your Profile</Typography>
                <Row id={"profile-row"} style={{display: "flex", flexWrap: "nowrap"}}>
                    <Col style={{marginTop: 32, marginRight: 25}}>
                        <Avatar size={80} icon={<UserOutlined/>} src={avatarUrl}/>
                        <Button style={{position: "absolute", left: 55}} type="primary" shape="circle"
                                onClick={() => setAvatarUploadModal(true)}
                                icon={<EditOutlined/>}/>
                    </Col>
                    <Col style={{maxWidth: 177, maxHeight: 51, marginTop: 32, marginRight: 17}}>
                        <Form.Item name="firstName"
                                   rules={[
                                       {required: true, message: "First Name is required"},
                                   ]}>
                            <FormInput label="First Name" type="text" name="firstName" placeholder="First name"
                                       value={form.getFieldValue('firstName')}/>
                        </Form.Item>
                    </Col>
                    <Col style={{maxWidth: 177, maxHeight: 51, marginTop: 32}}>
                        <Form.Item name="lastName"
                                   rules={[
                                       {required: true, message: "Last Name is required"},
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
                                   {required: true, message: "Bio is required"},
                               ]}>
                        <FormInput label="Add Your Bio" name="bio" placeholder="Add Your Bio" type="textarea"
                                   value={form.getFieldValue('bio')}/>
                    </Form.Item>
                </Row>
                <Row id="profile-area-row" style={{flexFlow: "row-reverse", marginTop: 20}}>
                    <Form.Item name="skills"
                               style={{float: "right"}}
                    >
                        <SkillsArea skills={skills} setSkills={setSkills}/>
                    </Form.Item>
                </Row>
                <Row id="profile-btn" style={{flexFlow: "row-reverse"}}>
                    <Button style={{padding: "0 44px", fontSize: 16, borderRadius: 10}} type="primary" size="large"
                            htmlType="submit">
                        Save
                    </Button>
                </Row>
            </Form>
            <AvatarUploadModal open={avatarUploadModal} setOpen={setAvatarUploadModal} upload={saveAvatar}
                               fileList={fileList} setFileList={setFileList}/>
        </Modal>
    )
}

export default CreatePersonModal;
