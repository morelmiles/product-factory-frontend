import React from "react";
// @ts-ignore
import styles from "./FormInput.scss";
import {TreeSelect} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Skill, ExpertiseAreaInterface} from "../../interfaces";

const ExpertiseArea = ({
                           setSkills,
                           skillExpertise,
                           expertiseList,
                           setExpertiseList,
                       }: ExpertiseAreaInterface) => {

    const expertiseSelectChange = (skill: string, value: string, index: number) => {
        setSkills((prevState: Skill[]) => {
            let {category} = prevState[index];
            return [...prevState.slice(0, index), {category, expertise: value}, ...prevState.slice(index + 1)];
        });
        setExpertiseList((prevState: string[]) => [...prevState.slice(0, index), value, ...prevState.slice(index + 1)]);
    }

    return (
        <div id="profile-area" style={{width: 460, minHeight: 80, border: "1px solid #d9d9d9"}}>
            {skillExpertise.length > 0 ? skillExpertise.map((skillExpertise, index) => {
                return (
                    <div key={index} className={"skill-div"}
                         style={{
                             backgroundColor: "#F5F5F5",
                             borderRadius: 2,
                             border: "none",
                             color: "#595959",
                             fontSize: 12,
                             width: "max-content"
                         }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div>#</div>
                            {<TreeSelect
                                style={{width: 120, minWidth: "max-content", color: "#595959"}}
                                allowClear={false}
                                onChange={(value) => expertiseSelectChange(skillExpertise.skill, value, index)}
                                value={expertiseList[index]}
                                bordered={false}
                                showArrow={false}>
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
                            </TreeSelect>}
                        </div>

                    </div>
                );
            }) : <p style={{color: "rgb(195, 195, 195)", margin: "5px 10px"}}>Add Expertise</p>}
        </div>
    );
};

export default ExpertiseArea;
