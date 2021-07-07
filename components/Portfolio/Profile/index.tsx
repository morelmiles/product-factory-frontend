import React from "react";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar, Button, Col, Divider, Row, Typography} from "antd";
import {ProfileProps} from "../interfaces";

const Profile = ({profile, setTaskDetailModal}: ProfileProps) => {
    return (
        <div style={{border: " 1px solid #E7E7E7", borderRadius: 15, padding: 14, width: 300, marginRight: 10}}>
            <Row justify={"center"}>
                <Avatar size={80} icon={<UserOutlined/>} src={profile.avatar}/>
                <Button style={{float: "left", border: "none"}}
                        size={"large"}
                        shape="circle"
                        onClick={() => setTaskDetailModal(true)}
                        icon={<EditOutlined/>}/>
            </Row>
            <div style={{padding: 14}}>
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
                {profile.skills.length > 0 &&(<Row>
                    <Typography.Text
                        style={{fontSize: 14, fontFamily: "SF Pro Display", color: "#262626"}}>Skills</Typography.Text>
                    {profile.skills.map(skill => (
                        <div style={{padding: "5px 16px", borderRadius: 2, background: "#F5F5F5"}}>
                            {skill.category}{skill.expertise ? `(${skill.expertise})` : null}
                        </div>
                    ))}
                </Row>)}
            </div>
        </div>
    );
}

export default Profile;
