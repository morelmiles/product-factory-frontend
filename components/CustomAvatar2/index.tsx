import React from 'react'
import {Avatar} from 'antd'
import {getInitialName} from '../../utilities/utils'


interface ICustomAvatar2Props {
  size?: number
  fullname: string
}

const CustomAvatar2: React.FunctionComponent<ICustomAvatar2Props> = ({size = 40, fullname}) => {
  return (
    <Avatar
      size={size}
      style={{
        marginRight: size >= 100 ? 40 : 5,
        background: 'linear-gradient(140deg, #F833CD, #1734CC)',
        borderRadius: 100,
        textAlign: 'center',
        lineHeight: `${size}px`,
        color: 'white',
        fontSize: size >= 100 ? '3rem' : '1rem',
        userSelect: 'none'
      }}
    >
      {fullname && getInitialName(fullname)}
    </Avatar>
  )
}

export default CustomAvatar2;
