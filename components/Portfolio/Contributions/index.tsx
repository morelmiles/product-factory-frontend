import React, {useEffect, useState} from "react";
import {ContributionsProps, Task} from "../interfaces";
import {Avatar, Button, Col, Row, Typography} from "antd";
import PagesBar from "../PagesBar";
import TaskDetail from "../TaskDetail";
import {useRouter} from "next/router";

const Contributions = ({tasks, changePage, pagesNumber, activePage, hasNext, hasPrev}: ContributionsProps) => {
    const router = useRouter();
    const {personSlug} = router.query;
    const [taskDetailModal, setTaskDetailModal] = useState<boolean>(false);
    const [detailTask, setDetailTask] = useState<Task>({
        id: 0,
        title: "",
        date: "",
        skills: [],
        reviewerPerson: {
            id: "",
            firstName: "",
            avatar: ""
        },
        product: {
            name: "",
            avatar: ""
        },
        initiative: ""
    });

    const openTaskDetail = (index: number) => {
        setDetailTask(tasks[index]);
        setTaskDetailModal(true);
    }

    return (
        <div>
            <Row>
                <Typography.Text style={{
                    fontSize: 16,
                    fontFamily: "Roboto",
                    border: " 1px solid #E7E7E7",
                    width: "100%",
                    padding: "16px 24px",
                    marginBottom: 20
                }}>
                    Most recent contributions
                </Typography.Text>
            </Row>
            {tasks.map((task, index) => (
                <Row key={index} gutter={[10, 0]} justify={"space-between"} style={{height: 75}}>
                    <Col>
                        <Row gutter={[15, 0]}>
                            <Col>
                                <Row align={"middle"}>
                                    <Avatar size={32} shape="circle" src={task.product.avatar}/>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Row align={"top"}>
                                        <Typography.Text strong style={{
                                            fontSize: 14,
                                            fontFamily: "Roboto",
                                        }}>{task.title}</Typography.Text>
                                    </Row>
                                    <Row align={"bottom"} justify={"space-between"}>
                                        {task.skills && task.skills.map((skill) => (<Col>
                                            <Typography.Text style={{fontSize: 12, fontFamily: "Roboto"}}>
                                                {skill.category} {skill.expertise ? `$(${skill.expertise})` : null}
                                            </Typography.Text>
                                        </Col>))}
                                    </Row>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col style={{marginLeft: 30}}>
                        <Row justify={"end"} align={"top"}>
                            <Typography.Text style={{
                                fontSize: 14,
                                fontFamily: "Roboto",
                                color: "rgba(0, 0, 0, 0.45)",
                                marginRight: 9
                            }}>
                                {task.date} days ago
                            </Typography.Text>
                        </Row>
                        <Row justify={"end"} align={"bottom"}>
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
                        </Row>
                    </Col>
                </Row>
            ))}
            <TaskDetail personSlug={personSlug} task={detailTask} modal={taskDetailModal}
                        setModal={setTaskDetailModal}/>
            <Row justify={"space-around"}>
                <PagesBar hasNext={hasNext} hasPrev={hasPrev} number={pagesNumber} active={activePage}
                          changePage={changePage}/>
            </Row>
        </div>
    );
}

export default Contributions;
