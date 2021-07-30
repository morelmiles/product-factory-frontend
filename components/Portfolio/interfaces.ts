export interface PortfolioProps {

}

export interface ProfileType {
    id: string
    firstName: string
    bio: string
    avatar: string
    skills: Skill[]
    websites: Website[]
    websiteTypes: string[]
}

export interface Skill {
    category: string
    expertise: string | null
}

export interface Product {
    name: string
    avatar: string
    link: string
}

export interface Initiative {
    name: string
    link: string
}

export interface DeliveryMessage {
    message: string
    attachments: Attachment[]
}

export interface Task {
    id: number
    title: string
    date: string
    link: string
    product: Product
    skills: Skill[]
    reviewerPerson: Reviewer
    initiative: Initiative
}

export interface Reviewer {
    id: string
    firstName: string
    avatar: string
    link: string
}

export interface Paginator {
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

export interface EditProfileProps {
    profile: ProfileType
}

export interface TaskDetailProps {
    task: Task
    modal: boolean
    setModal: Function
    personSlug: string | string[] | undefined
}

export interface ProfileProps {
    profile: ProfileType
    user: {
        id: string
    }
    refetchProfile: Function
}

export interface PagesBarProps {
    changePage: Function
    number: number
    active: number
    hasNext: boolean
    hasPrev: boolean
}

export interface PageButtonProps {
    number: number
    active: boolean
    changePage: Function
}

export interface ContributionsProps {
    tasks: Task[]
    changePage: Function
    pagesNumber: number
    activePage: number
    hasNext: boolean
    hasPrev: boolean
}

export interface Website {
    type: number
    website: string
}

export interface Skill {
    category: string,
    expertise: string | null
}

export interface SkillsAreaInterface {
    skills: Skill[]
    setSkills: Function
    allCategories: Category[]
    setExpertiseList: Function
    skillExpertise: SkillExpertise[]
    setSkillExpertise: Function
}

export interface ExpertiseAreaInterface {
    skills: Skill[]
    setSkills: Function
    allCategories: Category[]
    skillExpertise: SkillExpertise[]
    expertiseList: string[]
    setExpertiseList: Function
}

export interface Category {
    active: boolean,
    selectable: boolean,
    id: number,
    expertise: Expertise,
    name: string,
    children: Category[]
}

export interface Expertise {
    [key: string]: string[]
}

export interface SkillExpertise {
    skill: string
    expertise: Expertise
}

export interface Attachment {
    path: string
    name: string
    type: string
}

export interface TaskDetailAttachmentsProps {
    attachments: Attachment[]
}

export interface TasksComponentProps {
    tasks: Task[]
    openTaskDetail: Function
}
