import React from 'react'
import {Row, Col, Spin, Space} from 'antd'
import {StarFilled} from '@ant-design/icons';
import {useQuery} from '@apollo/react-hooks'
import {GET_PERSON_PROFILE, GET_PERSON_SOCIALS} from '../../../graphql/queries'
import {CustomAvatar} from '../../CustomAvatar'
import {getProp} from '../../../utilities/filters'
import {formatDate} from '../../../utilities/utils'
import {BehanceSquareOutlined, DribbbleSquareOutlined, InstagramFilled, LinkedinFilled} from "@ant-design/icons"
import {useRouter} from "next/router"


type SocialProps = {
    name: string
};

const Social: React.FunctionComponent<SocialProps> = ({name}) => {
    switch (name) {
        case 'instagram':
            return <InstagramFilled/>
        case 'linkedin':
            return <LinkedinFilled/>
        case 'behance':
            return <BehanceSquareOutlined/>
        case 'dribbble':
            return <DribbbleSquareOutlined/>
        default:
            return null
    }

};


const ProfileTop: React.FunctionComponent = () => {
    const router = useRouter()
    const {personSlug} = router.query

    const {data, error, loading} = useQuery(GET_PERSON_PROFILE, {
        variables: {personSlug}
    });


    const {
        data: socialsData,
        error: socialsDataError,
        loading: socialsDataLoading
    } = useQuery(GET_PERSON_SOCIALS, {
        variables: {personId: getProp(data, 'personProfile.person.id', '') | 0}
    });
    const socials = getProp(socialsData, 'personSocials', []);


    return (
        <>
            {
                loading && socialsDataLoading ? (
                    <Spin size="large"/>
                ) : !error && !socialsDataError && (
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
                                        <StarFilled
                                            style={{color: '#FAAD14', marginLeft: 8, marginRight: 3, fontSize: 16}}/>
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
                                        {
                                            socials.map((social: any, index: number) => (
                                                <a key={index} style={{color: '#999'}} href={social.url}>
                                                    <Social name={social.name}/>
                                                </a>
                                            ))
                                        }

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

export default ProfileTop;