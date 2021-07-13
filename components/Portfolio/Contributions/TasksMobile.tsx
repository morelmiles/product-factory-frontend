import {TasksComponentProps} from "../interfaces";
import {Avatar, Button, Col, Row, Typography} from "antd";
import React from "react";

const TasksMobile = ({tasks, openTaskDetail}: TasksComponentProps) => {
    return (
        <>
            {tasks.map((task, index) => (
                <Row key={index} style={{minWidth: 350,marginBottom: 10}}>
                    <Col style={{minWidth: 350}}>
                        <Row justify={"start"} align={"middle"} style={{flexWrap: "nowrap"}}>
                            <Avatar size={32} shape="circle" src={task.product.avatar}/>
                            <Typography.Text strong style={{
                                fontSize: 14,
                                fontFamily: "Roboto",
                                marginLeft: 5
                            }}>{task.title}</Typography.Text>
                        </Row>
                        <Row align={"middle"} justify={"space-between"}>
                            {task.skills && task.skills.map((skill) => (<Col>
                                <Typography.Text style={{fontSize: 12, fontFamily: "Roboto"}}>
                                    {skill.category} {skill.expertise ? `$(${skill.expertise})` : null}
                                </Typography.Text>
                            </Col>))}
                        </Row>
                        <Row justify={"space-between"} align={"middle"}>
                            <Col style={{marginLeft: 30}}>
                                <Typography.Text style={{
                                    fontSize: 14,
                                    fontFamily: "Roboto",
                                    color: "rgba(0, 0, 0, 0.45)",
                                    marginRight: 9
                                }}>
                                    {task.date} days ago
                                </Typography.Text>
                            </Col>
                            <Col>
                                <Button style={{
                                    padding: 0,
                                    border: "none"
                                }} onClick={() => openTaskDetail(index)}>
                                    <Typography.Text style={{
                                        textDecoration: "underline #1D1D1B",
                                        color: "#1D1D1B",
                                        fontSize: 14,
                                        fontFamily: "Roboto",
                                    }}>View Delivery Details</Typography.Text></Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>)
            )}
        </>
    )
}

export default TasksMobile;
