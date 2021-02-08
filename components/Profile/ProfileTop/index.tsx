import React from 'react'
import {Row, Col, Spin, Space} from 'antd'
import {StarFilled} from '@ant-design/icons';
import {useQuery} from '@apollo/react-hooks'
import {GET_PERSON_PROFILE} from '../../../graphql/queries'
import {CustomAvatar} from '../../CustomAvatar'
import {getProp} from '../../../utilities/filters'
import {formatDate} from '../../../utilities/utils'
import {BehanceSquareOutlined, DribbbleSquareOutlined, InstagramFilled, LinkedinFilled} from "@ant-design/icons"
import {useRouter} from "next/router"


const ProfileTop: React.FunctionComponent = () => {
    const router = useRouter()
    const {personSlug} = router.query

    const {data, error, loading} = useQuery(GET_PERSON_PROFILE, {
        variables: {personSlug}
    })


    return (
        <>
            {
                loading ? (
                    <Spin size="large"/>
                ) : !error && (
                    <>
                        <Row>
                            <Col>
                                {CustomAvatar(getProp(data, 'personProfile.person', null), 'fullName', 100)}
                            </Col>
                            <Col span={10}>
                                <Row>
                                    <strong className="page-title">
                                        {getProp(data, 'personProfile.person.fullName', '')}
                                    </strong>
                                    <div className="my-auto">
                                        <StarFilled/>
                                        <strong>{getProp(data, 'personProfile.rank', 0)}</strong>
                                    </div>
                                </Row>
                                <Row>
                                  <span className="text-grey">
                                      Member since {formatDate(getProp(data, 'personProfile.person.createdAt', new Date()))}
                                  </span>
                                </Row>
                                <Row style={{fontSize: 24, color: '#8C8C8C'}}>
                                    <Space size={8}>
                                        <BehanceSquareOutlined/>
                                        <DribbbleSquareOutlined/>
                                        <LinkedinFilled/>
                                        <InstagramFilled/>
                                    </Space>
                                </Row>
                                <Row>
                                    <p>{getProp(data, 'personProfile.overview', '')}</p>
                                </Row>
                            </Col>
                        </Row>
                    </>
                )
            }
        </>
    )
}

export default ProfileTop