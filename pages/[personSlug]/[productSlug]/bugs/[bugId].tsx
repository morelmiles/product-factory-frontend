import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, message, Button, Spin, Typography, Breadcrumb} from 'antd';
import {useRouter} from 'next/router';
import {useQuery, useMutation} from '@apollo/react-hooks';
import { GET_PRODUCT_BUG_BY_ID } from '../../../../graphql/queries';
import {DELETE_BUG} from '../../../../graphql/mutations';
import {getProp} from '../../../../utilities/filters';
import {EditIcon} from '../../../../components';
import DeleteModal from '../../../../components/Products/DeleteModal';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import parse from "html-react-parser";
import {getUserRole, hasManagerRoots} from "../../../../utilities/utils";
import CustomAvatar2 from "../../../../components/CustomAvatar2";
import AddEditBug from "../../../../components/AddEditBug";


type Params = {
  user?: any;
};

const Task: React.FunctionComponent<Params> = ({user}) => {
  const router = useRouter();
  const {bugId, personSlug, productSlug} = router.query;

  const [deleteModal, showDeleteModal] = useState(false);
  const [bug, setBug] = useState<any>({});
  const [showEditModal, setShowEditModal] = useState(false);

  const {data: bugData, error, loading, refetch} = useQuery(GET_PRODUCT_BUG_BY_ID, {
    variables: {id: bugId}
  });

  const userRole = getUserRole(user.roles, productSlug);
  const userHasManagerRoots = hasManagerRoots(userRole);

  const getBasePath = () => `/${personSlug}/${productSlug}`;

  const [deleteBug] = useMutation(DELETE_BUG, {
    variables: {
      id: parseInt(bugId)
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      router.push(getBasePath() === "" ? "/" : `${getBasePath()}/ideas-and-bugs`).then();
    },
    onError() {
      message.error("Failed to delete item!").then();
    }
  });

  useEffect(() => {
    if (bugData) setBug(bugData?.bug || {});
  }, [bugData]);

  const fetchData = async () => await refetch();

  return (
    <LeftPanelContainer>
      <Spin tip="Loading..." spinning={loading} delay={200}>
        {
          !error && (
            <>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a href={getBasePath()}>{getProp(bug, 'product.name', '')}</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href={`${getBasePath()}/ideas-and-bugs`}>Ideas & Bugs</a>
                </Breadcrumb.Item>
              </Breadcrumb>

              <Row
                justify="space-between"
                className="right-panel-headline strong-height"
              >
                <Col md={16}>
                  <div className="section-title">
                    {getProp(bug, 'headline', '')}
                  </div>
                </Col>
                <Col md={8} className="text-right">
                  {userHasManagerRoots || getProp(bug, "person.id", undefined) === user.id && (
                    <Col>
                      <Button
                        onClick={() => showDeleteModal(true)}
                      >
                        Delete
                      </Button>
                      <EditIcon
                        className="ml-10"
                        onClick={() => setShowEditModal(true)}
                      />
                    </Col>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row className="html-description">
                    <Col style={{overflowX: 'auto', width: 'calc(100vw - 95px)', marginTop: 30}}>
                      {parse(getProp(bug, 'description', ''))}
                    </Col>
                  </Row>
                  <div className="mt-22">
                    <Row style={{marginTop: 10}} className="text-sm mt-8">
                      <strong className="my-auto">Bug Type: </strong>
                      &nbsp;{bug.bugType ? "Private" : "Public"}
                    </Row>
                    <Row style={{marginTop: 10}} className="text-sm mt-8">
                      <strong className="my-auto">Created By: </strong>

                      <Row align="middle" style={{marginLeft: 15}}>
                        <Col>
                          <CustomAvatar2 person={{
                            fullname: getProp(bug, 'person.fullName', ''),
                            slug: getProp(bug, 'person.slug', '')
                          }}/>
                        </Col>
                        <Col>
                          <Typography.Link className="text-grey-9"
                                           href={`/${getProp(bug, 'person.slug', '')}`}>
                            {getProp(bug, 'person.fullName', '')}
                          </Typography.Link>
                        </Col>
                      </Row>
                    </Row>

                    {
                      bug.relatedCapability && (
                        <Row
                          className="text-sm mt-8"
                        >
                          <strong className="my-auto">
                            Related Capability:
                          </strong>
                          <Typography.Link className="ml-5"
                                           href={`${getBasePath()}/capabilities/${getProp(bug, 'relatedCapability.id')}`}>
                            {getProp(bug, 'relatedCapability.name', '')}
                          </Typography.Link>
                        </Row>
                      )
                    }

                  </div>
                </Col>
              </Row>

              <div style={{marginTop: 30}}/>

              {deleteModal && (
                <DeleteModal
                  modal={deleteModal}
                  closeModal={() => showDeleteModal(false)}
                  submit={deleteBug}
                  title="Delete bug"
                  description="Are you sure you want to delete Bug?"
                />
              )}
              {
                showEditModal &&
                <AddEditBug
                    modal={showEditModal}
                    productSlug={productSlug}
                    editMode={true}
                    closeModal={setShowEditModal}
                    bug={bug}
                    submit={fetchData}
                />
              }
            </>
          )
        }
      </Spin>
    </LeftPanelContainer>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user
});

const mapDispatchToProps = () => ({});

const TaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);

export default TaskContainer;
