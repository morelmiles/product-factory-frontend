import React from 'react'
import Link from 'next/link'

import {Row, Avatar} from 'antd'
import {getInitialName} from '../../utilities/utils'
import {USER_TYPES} from '../../graphql/types'
import {getProp} from '../../utilities/filters'

export const CustomAvatar: React.FC = (item: any, attr = "name", size: any = 'default', role?: any, avatarStyle?: any) => {
    if (!item) return

    return (
        <Row>
            {!item.photo ? (
                <Avatar
                    size={size}
                    style={avatarStyle ? avatarStyle : {
                        marginRight: 40,
                        background: 'linear-gradient(140deg, #F833CD, #1734CC)',
                        borderRadius: 100,
                        textAlign: 'center',
                        lineHeight: '100px',
                        color: 'white',
                        fontSize: '3rem',
                        userSelect: 'none'
                    }}
                >
                    {getInitialName(item[attr])}
                </Avatar>
            ) : (
                <Avatar size={size} src={item.photo}/>
            )}
            {role && (
                <div className="my-auto">
                    <div className="font-bold">
                        {attr === "fullName" ? (
                            <Link
                                className="text-grey-9"
                                href={`/people/${item.slug}`}
                            >
                                {item[attr]}
                            </Link>
                        ) : (
                            item[attr]
                        )}
                    </div>
                    <div>
                        {item.emailAddress},&nbsp
                        {USER_TYPES[getProp(role, 'right', 0)]} - {getProp(role, 'product.name', '')}
                    </div>
                </div>
            )}
        </Row>
    )
}

export default CustomAvatar