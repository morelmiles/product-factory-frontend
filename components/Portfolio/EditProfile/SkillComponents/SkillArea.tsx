import React, {useEffect, useState} from "react";
// @ts-ignore
import styles from "./FormInput.scss";
import {message, TreeSelect} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Category, Skill, SkillExpertise, SkillsAreaInterface} from "../../interfaces";

const SkillsArea = ({
                        skills,
                        setSkills,
                        allCategories,
                        setExpertiseList,
                        setSkillExpertise,
                        skillExpertise
                    }: SkillsAreaInterface) => {
    const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);

    useEffect(() => {
        if (currentSkills.length < 1) setCurrentSkills(skills);
    }, [skills]);

    const categorySelectChange = (value: string) => {
        if (!checkCategoryExists(value)) {
            const skill = findCategory(allCategories, value);
            if (skill) {
                const newSkill = {
                    category: skill.name,
                    expertise: null
                };
                const newSkillExpertise = {
                    skill: skill.name,
                    expertise: skill.expertise
                }
                setSkills((prevState: Skill[]) => [...prevState, newSkill]);
                setSkillExpertise((prevState: SkillExpertise[]) => [...prevState, newSkillExpertise]);
                setExpertiseList((prevState: string[]) => [...prevState, skill.name]);
                message.success("Please select expertise for this category", 10).then();
            }
        }
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

    const checkCategoryExists = (category: string): boolean => {
        return skillExpertise.find(skill => skill.skill === category) !== undefined;
    }

    const makeCategoriesTree = (categories: Category[]) => {
        return categories.map((category, index) => (
            <TreeNode id={index} selectable={category.selectable} value={category.name} title={category.name}>
                {category.children ? makeCategoriesTree(category.children) : null}
            </TreeNode>));
    }

    return (
        <div id="profile-area" style={{width: 460, minHeight: 80, border: "1px solid #d9d9d9"}}>
            <TreeSelect
                allowClear={false}
                onChange={categorySelectChange}
                placeholder="Add Your Skills"
                value={"Add Your Skills"}
                bordered={false}
                style={{width: 120, color: "#c3c3c3"}}
                showArrow={false}
            >
                {allCategories && makeCategoriesTree(allCategories)}
            </TreeSelect>
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
                            {skillExpertise.skill}
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
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div>#</div>
                        {skill.category}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkillsArea;
