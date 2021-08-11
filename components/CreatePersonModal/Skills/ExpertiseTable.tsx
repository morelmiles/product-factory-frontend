import React from "react";
import {ExpertiseTableProps} from "../interfaces";
import {Col, Row, TreeSelect} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Skill} from "../../Portfolio/interfaces";

const ExpertiseTable = ({setSkills, skillExpertise, expertiseList, setExpertiseList}: ExpertiseTableProps) => {

    const expertiseSelectChange = (skill: string, value: string, index: number) => {
        setSkills((prevState: Skill[]) => {
            let {category} = prevState[index];
            return [...prevState.slice(0, index), {category, expertise: value}, ...prevState.slice(index + 1)];
        });
        setExpertiseList((prevState: string[]) => [...prevState.slice(0, index), value, ...prevState.slice(index + 1)]);
    }

    return (
        <>
            <Col>
                <Row>
                    Skill
                </Row>
                {skillExpertise.length > 0 && skillExpertise.map((skillExpertise, index) => (
                    <Row key={index}>
                        {skillExpertise[0] > skillExpertise[1]}
                    </Row>
                ))}
            </Col>
            <Col>
                <Row>
                    Expertise
                </Row>
                {skillExpertise.length > 0 && skillExpertise.map((skillExpertise, index) => (
                    <Row key={index}>
                        <TreeSelect
                            style={{width: 120, minWidth: "max-content", color: "#595959"}}
                            allowClear={false}
                            onChange={(value) => expertiseSelectChange(skillExpertise.skill, value, index)}
                            value={expertiseList[index]}
                            bordered
                            showArrow>
                            {
                                Object.keys(skillExpertise.expertise).map((expertise) => (
                                    <TreeNode
                                        value={expertise}
                                        selectable={false}
                                        title={expertise}
                                    >
                                        {(Object(skillExpertise.expertise)[expertise] as string[]).map((value) => (
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
                ))}
            </Col>
        </>
    );
}

export default ExpertiseTable;