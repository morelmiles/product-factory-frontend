import React from "react";
// @ts-ignore
import styles from "./FormInput.scss";
import {message, TreeSelect} from "antd";
import {Skill, SkillExpertise, SkillsAreaInterface} from "../../interfaces";
import {checkCategoryExists, findCategory, makeCategoriesTree} from "../../helpers";

const SkillsArea = ({
                        setSkills,
                        allCategories,
                        setExpertiseList,
                        setSkillExpertise,
                        skillExpertise
                    }: SkillsAreaInterface) => {

    const categorySelectChange = (value: string) => {
        if (!checkCategoryExists(value, skillExpertise)) {
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
            {skillExpertise && skillExpertise.map((skillExpertise, index) => (
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
            ))}
        </div>
    );
};

export default SkillsArea;
