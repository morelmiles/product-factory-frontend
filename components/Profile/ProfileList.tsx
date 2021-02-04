
import React from 'react';
import { RouteComponentProps, matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import { Row, Col, Spin } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_PROFILE, GET_REVIEWS } from 'graphql/queries';
import ReactPlayer from 'react-player';
import { CustomAvatar, StarScore, DynamicTextPanel, Spinner } from 'components';
import { getProp } from 'utilities/filters';
import { formatDate } from 'utilities/utils';
import StarFilledIcon from 'assets/icons/star-filled.svg';
import InstagramIcon from 'assets/icons/instagram.svg';


const ProfileList: React.FunctionComponent<RouteComponentProps> = ({ match }) => {
  const params: any = matchPath(match.url, {
    path: "/people/:personSlug",
    exact: false,
    strict: false
  });
  const { data, error, loading } = useQuery(GET_PROFILE, {
    variables: { personSlug: params.params.personSlug }
  });
  const {
    data: reviews,
    error: reviewError,
    loading: reviewLoading
  } = useQuery(GET_REVIEWS, {
    variables: { personSlug: params.params.personSlug }
  });

  if(loading) return <Spinner/>

  return (
    <>
      {
        !error && (
          <>
            <Row>
              <Col>
                {CustomAvatar(data.profile.person, 'fullName', 80)}
              </Col>
              <Col span={10}>
                <Row>
                  <strong className="page-title">
                    {getProp(data, 'profile.person.fullName', '')}
                  </strong>
                  <div className="my-auto">
                    <span>
                      <img
                        src={StarFilledIcon}
                        className="profile-rank"
                        alt="star"
                      />
                    </span>
                    <strong>{getProp(data, 'profile.rank', 0)}</strong>
                  </div>
                </Row>
                <Row>
                  <span className="text-grey">
                    Member since {formatDate(getProp(data, 'profile.person.createdAt', new Date()))}
                  </span>
                </Row>
                <Row>
                  <img src={InstagramIcon} alt="star" />
                </Row>
                <Row>
                  <p>{getProp(data, 'profile.overview', '')}</p>
                </Row>
              </Col>
            </Row>
            <div className="profile-section">
              <h3 className="section-title">Portfolio</h3>
              {reviewLoading ? (
                <Spin size="large" />
              ) : !reviewError && (
                <>
                  {reviews && getProp(reviews, 'reviews', []).map((review: any, idx: number) => {
                    const reviewInitiative = getProp(review, 'product.initiative', null);
                    return (
                      <div key={`review-${idx}`} className="grey-border p-24 mb-24">
                        <Row>
                          <Col span={18}>
                            <Link
                              to={`${match.url}/profiles/${getProp(review, 'id', '')}`}
                              className="text-grey-9"
                            >
                              {getProp(review, 'product.name', '')}
                            </Link>
                            {reviewInitiative && (
                              <>
                                &nbsp;
                                <Link to={`/initiatives/${reviewInitiative.id}`}>
                                  <h4>
                                    {`/ ${reviewInitiative.name}`}
                                  </h4>
                                </Link>
                              </>
                            )}
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
                                style={{ margin: '1px 16px 0px 0' }}
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
                          {/* <Col span={6}>
                            <ReactPlayer
                              width="100%"
                              height="160px"
                              url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                            />
                          </Col> */}
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
    </>
  );
};

export default ProfileList;