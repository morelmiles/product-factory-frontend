export interface PortfolioProps {

}

export interface ProfileType {
    id: string,
    firstName: string,
    bio: string,
    avatar: string,
    skills: Skill[]
}

export interface Skill {
    category: string,
    expertise: string | null
}

export interface Task {
    id: number
    title: string
    productAvatar: string
    date: string
    skills: Skill[]
    reviewerPerson: Reviewer
}

export interface Reviewer {
    id: string
    firstName: string
    avatar: string
}

export interface Paginator {
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

export interface EditProfileProps {
    visible: boolean
    setVisible: Function
}

export interface TaskDetailProps {
    task: Task
}

export interface ProfileProps {
    profile: ProfileType
    setTaskDetailModal: Function
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
