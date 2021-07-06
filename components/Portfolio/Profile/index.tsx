import {Profile} from "../index";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar, Button, Col, Divider, Row, Typography} from "antd";
import React from "react";

interface ProfileProps {
    profile: Profile
    setEditModal: Function
}

const Profile = ({profile, setEditModal}: ProfileProps) => {
    return (
        <Col style={{border: " 1px solid #E7E7E7", borderRadius: 15}}>
            <Row>
                <Avatar size={80} icon={<UserOutlined/>} src={profile.avatar}/>
                <Button style={{float: "left", border: "none"}}
                        shape="circle"
                        onClick={() => setEditModal(true)}
                        icon={<EditOutlined/>}/>
            </Row>
            <Row>
                <Typography.Text style={{
                    color: "#262626",
                    fontSize: 20,
                    fontFamily: "SF Pro Display"
                }}>{profile.firstName}</Typography.Text>
            </Row>
            <Row>
                <Typography.Text style={{
                    maxWidth: 232
                }}
                >{profile.bio}</Typography.Text>
            </Row>
            <Row><Divider/></Row>
            <Row>
                <Typography.Text
                    style={{fontSize: 14, fontFamily: "SF Pro Display", color: "#262626"}}>Skills</Typography.Text>
                {profile.skills.map(skill => (
                    <div style={{padding: "5px 16px", borderRadius: 2, background: "#F5F5F5"}}>
                        {skill.category}{skill.expertise ? `(${skill.expertise})` : null}
                    </div>
                ))}
            </Row>
        </Col>
    );
}

export default Profile;
