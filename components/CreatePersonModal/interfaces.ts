import {UploadFile} from "antd/es/upload/interface";
import {Category, SkillExpertise} from "../SkillsComponents/interfaces";
import {Skill} from "./index";

export interface CreatePersonProps {
    modal: boolean
    closeModal: Function
}

export interface Person {
    firstName: string
    lastName: string
    bio: string
}

export interface AvatarUpload {
    open: boolean
    setOpen: Function
    fileList: UploadFile[]
    setFileList: Function
    upload: Function
}

export interface FirstStepProps {
    setStep: Function
    setAvatarId: Function
    avatarUrl: string
    setAvatarUrl: Function
    firstName: string
    setFirstName: Function
    lastName: string
    setLastName: Function
    bio: string
    setBio: Function
}

export interface SecondStepProps {
    submit: Function
    previous: Function
    setSkills: Function
    allCategories: Category[]
    skillExpertise: SkillExpertise[]
    setSkillExpertise: Function
    skills: Skill[]
}

export interface StepSwitcherProps {
    first: boolean
    second: boolean
    step: number
}

export interface StepProps {
    step: number
    description: string
    valid: boolean
    current: boolean
}

export interface SkillsSelectProps {
    setSkills: Function
    allCategories: Category[]
    skillExpertise: SkillExpertise[]
    setSkillExpertise: Function
}

export interface ExpertiseTableProps {
    setSkills: Function
    skillExpertise: SkillExpertise[]
    skills: Skill[]
}
