import React from 'react'
import {Row, Col, Spin} from 'antd'
import {useQuery} from '@apollo/react-hooks'
import {GET_REVIEWS} from '../../../graphql/queries'
import ReactPlayer from 'react-player'
import {StarScore, DynamicTextPanel, Spinner} from '../../../components'
import {getProp} from '../../../utilities/filters';
import {formatDate} from '../../../utilities/utils';
import {useRouter} from "next/router";


const Portfolio: React.FC = () => {
    const router = useRouter()
    const {personSlug} = router.query

    const {
        data: reviews,
        error: reviewError,
        loading: reviewLoading
    } = useQuery(GET_REVIEWS, {
        variables: {personSlug}
    })

    console.log(reviews, reviewError, reviewLoading)

    if (reviewLoading) return <Spinner/>

    return (
        <>
            <div className="profile-section">
                <h3 className="section-title">Portfolio</h3>
                {reviewLoading ? (
                    <Spin size="large"/>
                ) : !reviewError && (
                    <>
                        {reviews && getProp(reviews, 'reviews', []).map((review: any, idx: number) => {
                            const reviewInitiative = getProp(review, 'product.initiative', null)
                            return (
                                <div key={`review-${idx}`} className="grey-border p-24 mb-24">
                                    <Row>
                                        <Col span={18}>
                                            {/*<Link*/}
                                            {/*  to={`${match.url}/profiles/${getProp(review, 'id', '')}`}*/}
                                            {/*  className="text-grey-9"*/}
                                            {/*>*/}
                                            {/*  {getProp(review, 'product.name', '')}*/}
                                            {/*</Link>*/}
                                            {/*{reviewInitiative && (*/}
                                            {/*  <>*/}
                                            {/*    &nbsp*/}
                                            {/*    <Link to={`/initiatives/${reviewInitiative.id}`}>*/}
                                            {/*      <h4>*/}
                                            {/*        {`/ ${reviewInitiative.name}`}*/}
                                            {/*      </h4>*/}
                                            {/*    </Link>*/}
                                            {/*  </>*/}
                                            {/*)}*/}
                                            <p className="pr-15 text-sm mb-14">
                                                <strong>Summary: </strong>
                                                <DynamicTextPanel
                                                    text={getProp(review, 'product.shortDescription', '')}
                                                    className="text-grey"
                                                />
                                            </p>
                                            <Row className="mb-14">
                                                <StarScore
                                                    score={parseInt(getProp(review, 'score', 0))}
                                                    style={{margin: '1px 16px 0px 0'}}
                                                />
                                                <span className="text-grey-9 text-sm">
                                                            {formatDate(getProp(review, 'updatedAt', new Date()))}
                                                        </span>
                                            </Row>
                                            <p className="pr-15 text-sm">
                                                <strong>Review: </strong>
                                                <DynamicTextPanel
                                                    text={getProp(review, 'text', '')}
                                                    className="text-grey"
                                                />
                                            </p>
                                        </Col>
                                        <Col span={6}>
                                            <ReactPlayer
                                                width="100%"
                                                height="160px"
                                                url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })}
                    </>
                )}
            </div>
        </>
    )
}

export default Portfolio