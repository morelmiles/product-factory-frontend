interface PortfolioProps {

}

export interface Profile {
    id: string,
    firstName: string,
    bio: string,
    avatar: string,
    skills: Skill[]
}

interface Skill {
    category: string,
    expertise: string | null
}

const Portfolio = ({}: PortfolioProps) => {
    return (
        <></>
    );
}

export default Portfolio;
