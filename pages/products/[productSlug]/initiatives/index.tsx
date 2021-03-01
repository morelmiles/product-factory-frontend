import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Card, Button, Tag, Select} from 'antd';
import {useRouter} from 'next/router'
import {useQuery} from '@apollo/react-hooks';
import {DynamicHtml} from '../../../../components';
import {GET_INITIATIVES, GET_TAGS} from '../../../../graphql/queries';
import {randomKeys} from '../../../../utilities/utils';
import AddInitiative from '../../../../components/Products/AddInitiative';
import {getProp} from '../../../../utilities/filters';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import Loading from "../../../../components/Loading";
// @ts-ignore
import CheckCircle from "../../../../public/assets/icons/check-circle.svg";
import {pluralize} from "apollo/lib/utils";
import {TagType} from "../../../../graphql/types";

type Params = {
  userRole?: string;
};

const InitiativeList: React.FunctionComponent<Params> = ({userRole}) => {
  const router = useRouter();
  const [tags, setTags] = useState([]);
  let {productSlug} = router.query;
  productSlug = String(productSlug);
  const initialQueryVariables = {productSlug, tags};

  const [showEditModal, setShowEditModal] = useState(false);
  const {data, error, loading, refetch} = useQuery(GET_INITIATIVES, {
    variables: initialQueryVariables
  });

  const goToDetails = (id: number) => {
    router.push(`/products/${productSlug}/initiatives/${id}`).then();
  }

  const tagsData = useQuery(GET_TAGS);

  if (loading) return <Loading/>

  const getAvailableTaskText = (availableTasks: number) => {
    return `${pluralize(availableTasks, "available task")}`;
  }

  return (
    <LeftPanelContainer>
      {
        !error && (
          <React.Fragment key={randomKeys()}>
            <Row
              justify="space-between"
              className="right-panel-headline mb-15"
            >
              <Col>
                <div className="page-title text-center">
                  {data?.initiatives
                    ? `Explore ${data?.initiatives?.length} initiatives`
                    : 'No initiatives'
                  }
                </div>
              </Col>
              <Col>
                <Row className="">
                  <div>
                    <Select
                      defaultValue={tags}
                      mode="multiple"
                      placeholder="Filter by tags..."
                      style={{minWidth: 150}}
                      onChange={(value: any[]) => setTags(value)}
                    >
                      {tagsData?.data ? tagsData.data.tags.map((tag: { id: string, name: string }) =>
                        <Select.Option key={tag.id} value={tag.id}>{tag.name}</Select.Option>) : []
                      }
                    </Select>
                  </div>
                  {(userRole === "Manager" || userRole === "Admin") && (
                    <Col>
                      <Button
                        className="ml-10"
                        onClick={() => setShowEditModal(!showEditModal)}
                      >
                        Add new initiative
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {
                data?.initiatives && data.initiatives.map((initiative: any) => (
                  <Col key={randomKeys()} xs={24} sm={12} md={8}>
                    {/* <Card
                    cover={
                      <ReactPlayer
                        width="100%"
                        height="172px"
                        url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                      />
                    }
                  > */}
                    <Card>
                      <div
                        className='pointer'
                        onClick={() => goToDetails(initiative.id)}
                      >
                        <div>
                          <h4 className='mt-5'>{initiative.name}</h4>
                          {
                            getProp(initiative, 'taskTags', []).map((tag: TagType, idx: number) => (
                              <Tag key={`tag-${idx}`}>{tag.name}</Tag>
                            ))
                          }
                          <div>
                            <img
                              src={CheckCircle}
                              className="check-circle-icon"
                              alt="status"
                            />
                            <span>
                              {getAvailableTaskText(initiative.availableTaskCount)}
                            </span>
                          </div>
                          <DynamicHtml
                            text={getProp(initiative, 'description', '')}
                          />
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))
              }
              {
                showEditModal &&
                <AddInitiative
                    modal={showEditModal}
                    productSlug={productSlug}
                    modalType={false}
                    closeModal={setShowEditModal}
                    submit={() => refetch()}
                />
              }
            </Row>
          </React.Fragment>
        )
      }
    </LeftPanelContainer>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole
});

const mapDispatchToProps = () => ({});

const InitiativeListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeList);

export default InitiativeListContainer;