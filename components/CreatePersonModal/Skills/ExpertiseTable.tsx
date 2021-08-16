import React from "react";
import {ExpertiseTableProps} from "../interfaces";
import {Col, Row, TreeSelect, Typography} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Skill} from "../../Portfolio/interfaces";

const ExpertiseTable = ({setSkills, skillExpertise}: ExpertiseTableProps) => {

    const expertiseSelectChange = (skill: string, value: string[], index: number) => {
        setSkills((prevState: Skill[]) => {
            let {category} = prevState[index];
            return [...prevState.slice(0, index), {category, expertise: value}, ...prevState.slice(index + 1)];
        });
    }

    return (
        <>
            <Row>
                <Col>
                    <Row style={{backgroundColor: '#FAFAFA', padding: '11px 42px', minWidth: 200}}>
                        Skill
                    </Row>
                </Col>
                <Col>
                    <Row style={{backgroundColor: '#FAFAFA', padding: '11px 42px', minWidth: 200}}>
                        Expertise
                    </Row>
                </Col>
            </Row>
            {skillExpertise.length > 0 && skillExpertise.map((skillExp, index) => (
                <>
                    <Col>
                        <Row style={{borderBottom: '1px solid #FAFAFA', height: "100%", alignItems: "center"}}
                             key={index}>
                            <Typography.Text style={{
                                fontSize: 9,
                                minWidth: 200,
                                padding: 5,
                            }}>{skillExp.skill[0].slice(0, 12) + '... > ' + skillExp.skill[1]}</Typography.Text>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={{borderBottom: '1px solid #FAFAFA'}} key={index}>
                            <TreeSelect
                                key={index}
                                style={{minWidth: 200, padding: 5}}
                                allowClear={false}
                                onChange={(value) => expertiseSelectChange(skillExp.skill[1], value as string[], index)}
                                placeholder={"Please Select Expertise"}
                                multiple
                                bordered
                                showArrow>
                                {
                                    Object.keys(skillExp.expertise).map((expertise) => (
                                        <TreeNode
                                            value={expertise}
                                            selectable={false}
                                            title={expertise}
                                        >
                                            {(Object(skillExp.expertise)[expertise] as string[]).map((value) => (
                                                <TreeNode
                                                    value={value}
                                                    selectable={true}
                                                    title={value}
                                                >
                                                    {value}
                                                </TreeNode>
                                            ))}
                                        </TreeNode>
                                    ))
                                }
                            </TreeSelect>
                        </Row>
                    </Col>
                </>
            ))}
        </>
    );
}

export default ExpertiseTable;