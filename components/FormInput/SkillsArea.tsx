import React, {useEffect, useState} from "react";
// @ts-ignore
import styles from "./FormInput.scss";
import {Button, Input, TreeSelect} from "antd";
import {useQuery} from "@apollo/react-hooks";
import {GET_CATEGORIES_LIST} from "../../graphql/queries";
import {TreeNode} from "antd/lib/tree-select";
import {CloseOutlined} from "@ant-design/icons";


export interface SkillsAreaInterface {
    skills: string[]
    setSkills: Function
}

const SkillsArea = ({skills, setSkills}: SkillsAreaInterface) => {
    const [focus, setFocus] = useState(false);
    const [focused, setFocused] = useState(false);
    const labelClass = focus ? `${styles.label} ${styles.labelfloat}` : (focused ? (`${styles.labelfilled} ${styles.label}`) : (`${styles.label}`));
    const [allCategories, setAllCategories] = React.useState([]);

    const {data: categories} = useQuery(GET_CATEGORIES_LIST);

    useEffect(() => {
        if (categories?.taskCategoryListing) {
            setAllCategories(JSON.parse(categories.taskCategoryListing));
        }
    }, [categories])

    const selectChange = (value: string) => {
        setSkills((prevState: string[]) => [...Array.from(new Set<string>([...prevState, value]))]);
    }

    return (
        <div className={`${styles.floatlabel}`} onBlur={() => setFocus(false)} onFocus={() => {
            setFocus(true);
            setFocused(true)
        }}>
            <label className={labelClass}>Skills</label>
            <div id="profile-area" style={{borderRadius: 10, width: 371, minHeight: 80, border: "1px solid #d9d9d9"}}>
                <TreeSelect
                    allowClear={false}
                    onChange={selectChange}
                    placeholder="Add Skills"
                    value={"Add Skills"}
                    bordered={false}
                    style={{width: 120, color: "#c3c3c3"}}
                    showArrow={false}
                >
                    {allCategories && allCategories.map((category) => (
                        // @ts-ignore
                        <TreeNode selectable={!category.parent} value={category.name} title={category.name}>
                            {category.parent ?
                                // @ts-ignore
                                <TreeNode value={category.parent.id} title={category.parent.name}/> : null}
                        </TreeNode>
                    ))}
                </TreeSelect>
                {skills.map((skill, index) => {
                    return (
                        <div key={index} className={"skill-div"}>
                            {'#' + skill}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsArea;
