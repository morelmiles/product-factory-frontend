import React from "react";
import {ContributionsProps} from "../interfaces";
import {Avatar, Button, Col, Row, Typography} from "antd";
import PagesBar from "../PagesBar";

const Contributions = ({tasks, changePage, pagesNumber, activePage, hasNext, hasPrev}: ContributionsProps) => {
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
            {tasks.map(task => (
                <Row gutter={[10, 0]} justify={"space-between"} style={{height: 75}}>
                    <Col>
                        <Row gutter={[15, 0]}>
                            <Col>
                                <Row align={"middle"}>
                                    <Avatar size={32} shape="circle" src={task.productAvatar}/>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Row align={"top"}>
                                        <Typography.Text style={{
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
                    <Col>
                        <Row justify={"end"}>
                            <Row align={"top"} >
                                <Typography.Text style={{
                                    fontSize: 14,
                                    fontFamily: "Roboto",
                                    color: "rgba(0, 0, 0, 0.45)",
                                    marginRight: 9
                                }}>
                                    {task.date} days ago
                                </Typography.Text>
                            </Row>
                            <Row align={"bottom"}>
                                {/*<Button>View Delivery Details</Button>*/}
                            </Row>
                        </Row>
                    </Col>
                </Row>
            ))}
            <Row justify={"space-around"}>
                <PagesBar hasNext={hasNext} hasPrev={hasPrev} number={pagesNumber} active={activePage} changePage={changePage}/>
            </Row>
        </div>
    );
}

export default Contributions;
