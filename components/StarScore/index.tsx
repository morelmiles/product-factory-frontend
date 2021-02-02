import React from "react";
import { Row } from "antd";
import { randomKeys } from '../../utilities/utils';
//import StarIcon from "../../public/assets/icons/star.svg";
//import StarFilledIcon from "../../public/assets/icons/star-filled.svg";
import classnames from "classnames";

type Props = {
  score: any;
  style?: any;
  className?: string;
};

const StarScore = (props: Props) => {
  const { score, style, className } = props;

  const getStarItems = (score: any) => {
    const renderItems = [];
    for (let i = 0; i < 5; i += 1) {
      if (i < score) {
        renderItems.push(
          {/* <img
            key={randomKeys()}
            src={StarFilledIcon}
            className={classnames("star-icon", { 'mr-5': i !== 4 })}
            alt="star"
          /> */}
        )
      } else {
        renderItems.push(
          {/* <img
            key={randomKeys()}
            src={StarIcon}
            className={classnames("star-icon inactive", { 'mr-5': i !== 4 })}
            alt="star"
          /> */}
        )
      }
    }
    return renderItems;
  }

  const stars = getStarItems(score);

  return (
    <>
      <Row style={style} className={className}>{stars}</Row>
    </>
  )
}

export default StarScore;
