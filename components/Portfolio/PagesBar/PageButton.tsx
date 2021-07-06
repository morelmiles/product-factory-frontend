import {Button} from "antd";

interface PageButtonProps {
    number: number,
    active: boolean
}

const PageButton = ({number, active}: PageButtonProps) => {
    const style = active ? "" : ""
    return (
        <Button className={style}>
            {number}
        </Button>
    );
}

export default PageButton;
