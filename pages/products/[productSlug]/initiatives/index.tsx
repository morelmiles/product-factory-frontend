import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Card, Button, Select} from 'antd';
import {useRouter} from 'next/router'
import {useQuery} from '@apollo/react-hooks';
import {DynamicHtml} from '../../../../components';
import {GET_INITIATIVES, GET_STACKS} from '../../../../graphql/queries';
import {getUserRole, hasManagerRoots, randomKeys} from '../../../../utilities/utils';
import AddInitiative from '../../../../components/Products/AddInitiative';
import {getProp} from '../../../../utilities/filters';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import Loading from "../../../../components/Loading";
// @ts-ignore
import CheckCircle from "../../../../public/assets/icons/check-circle.svg";
import {pluralize} from "apollo/lib/utils";
import {TagType} from "../../../../graphql/types";
import CheckableTag from "antd/lib/tag/CheckableTag";

type Params = {
  user: any
};

const InitiativeList: React.FunctionComponent<Params> = ({user}) => {
  const router = useRouter();
  const [stacks, setStacks] = useState([]);
  const [skip, setSkip] = React.useState(false);
  let {productSlug} = router.query;
  productSlug = String(productSlug);
  const initialQueryVariables = {productSlug, stacks};
  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, productSlug));

  const [showEditModal, setShowEditModal] = useState(false);
  const {data, error, loading, refetch} = useQuery(GET_INITIATIVES, {
    variables: initialQueryVariables
  });

  useEffect(() => {
    if (!loading && !!data && !skip) {
      setSkip(true)
    }
  }, [data, loading]);

  useEffect(() => {
    if (!skip) refetch(initialQueryVariables)
  }, [skip]);

  const goToDetails = (id: number) => {
    router.push(`/products/${productSlug}/initiatives/${id}`).then();
  }

  const stacksData = useQuery(GET_STACKS);

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
                      defaultValue={stacks}
                      mode="multiple"
                      placeholder="Filter by stacks..."
                      style={{minWidth: 150}}
                      onChange={(value: any[]) => setStacks(value)}
                    >
                      {stacksData?.data ? stacksData.data.stacks.map((tag: { id: string, name: string }) =>
                        <Select.Option key={tag.id} value={tag.id}>{tag.name}</Select.Option>) : []
                      }
                    </Select>
                  </div>
                  {userHasManagerRoots && (
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
            {loading ? <Loading/> : (
              <Row gutter={[16, 16]}>
              {
                data?.initiatives && data.initiatives.length > 0 ? data.initiatives.map((initiative: any) => (
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
                            getProp(initiative, 'taskStacks', []).map((tag: TagType, idx: number) => (
                              <CheckableTag checked={true} key={`stack-${idx}`}>{tag.name}</CheckableTag>
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
                )) : <div/>
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
            )}
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