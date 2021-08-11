import React from "react";
import {message, TreeSelect} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Category, SkillExpertise} from "../../SkillsComponents/interfaces";
import {Skill} from "../index";
import {SkillsSelectProps} from "../interfaces";

const SkillsSelect = ({allCategories, setSkills, setSkillExpertise, skillExpertise}: SkillsSelectProps) => {

    const makeCategoriesTree = (categories: Category[]) => {
        return categories.map((category, index) => (
            <TreeNode id={index} selectable={category.selectable} value={category.name} title={category.name}>
                {category.children ? makeCategoriesTree(category.children) : null}
            </TreeNode>));
    }

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

    return (
        <TreeSelect
            allowClear={false}
            onChange={categorySelectChange}
            placeholder="Please select skills"
            showArrow
            bordered
            style={{width: 250, color: "#c3c3c3"}}
            multiple={true}
        >
            {allCategories && makeCategoriesTree(allCategories)}
        </TreeSelect>
    );
}

export default SkillsSelect;