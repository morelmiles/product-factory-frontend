import React, {useEffect, useState} from "react";
// @ts-ignore
import styles from "./FormInput.scss";
import {TreeSelect} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Category, Skill, ExpertiseAreaInterface} from "../../interfaces";

const ExpertiseArea = ({
                           skills,
                           setSkills,
                           allCategories,
                           skillExpertise,
                           expertiseList,
                           setExpertiseList
                       }: ExpertiseAreaInterface) => {
    const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);

    useEffect(() => {
        if (currentSkills.length < 1) {
            setCurrentSkills(skills);
            setExpertiseList(skills.map(skill => skill.expertise ? skill.expertise : skill.category));
        }
    }, [skills]);

    const expertiseSelectChange = (skill: string, value: string, index: number) => {
        setSkills((prevState: Skill[]) => {
            let {category} = prevState[index];
            return [...prevState.slice(0, index), {category, value}, ...prevState.slice(index + 1)];
        });
        setExpertiseList((prevState: string[]) => [...prevState.slice(0, index), value, ...prevState.slice(index + 1)]);
    }

    const makeCategoriesTree = (categories: Category[]) => {
        return categories.map((category, index) => (
            <TreeNode id={index} selectable={category.selectable} value={category.name} title={category.name}>
                {category.children ? makeCategoriesTree(category.children) : null}
            </TreeNode>));
    }

    const findCategory = (categories: Category[], value: string): Category | undefined => {
        for (let category of categories) {
            if (category.children && category.children.length > 0) {
                const skill = findCategory(category.children, value);
                if (skill) {
                    return skill;
                }
            } else if (category.name === value) return category;
        }
    }

    const findExpertise = (category: string) => {
        return (findCategory(allCategories, category) as Category).expertise;
    }

    return (
        <div id="profile-area" style={{width: 460, minHeight: 80, border: "1px solid #d9d9d9"}}>
            {skillExpertise && skillExpertise.map((skillExpertise, index) => {
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
            })}
            {currentSkills && currentSkills.map((skill, index) => (
                <div key={index} className={"skill-div"}
                     style={{
                         backgroundColor: "#F5F5F5",
                         borderRadius: 2,
                         border: "none",
                         color: "#595959",
                         fontSize: 12,
                         width: "max-content"
                     }}>
                    <div style={{display: 'flex', alignItems: 'center', color: "#595959"}}>
                        <div>#</div>
                        {<TreeSelect
                            style={{width: 120, minWidth: "max-content"}}
                            allowClear={false}
                            onChange={(value) => expertiseSelectChange(skill.category, value, index)}
                            value={expertiseList[index]}
                            bordered={false}
                            showArrow={false}>
                            {
                                Object.keys(findExpertise(skill.category)).map((expertise) => (
                                    <TreeNode
                                        value={expertise}
                                        selectable={false}
                                        title={expertise}
                                    >
                                        {(Object(findExpertise(skill.category))[expertise] as string[]).map((value, index) => (
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
            ))}
            {currentSkills.length > 0 || skillExpertise.length > 0 ? null :
                <p style={{color: "rgb(195, 195, 195)", margin: "5px 10px"}}>Add Expertise</p>}
        </div>
    );
};

export default ExpertiseArea;
