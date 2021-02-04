
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Tag, Button } from 'antd';
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks';
import ReactPlayer from 'react-player';
import { DynamicHtml, Spinner } from '../../../../components';
import { GET_INITIATIVES } from '../../../../graphql/queries';
import { randomKeys } from '../../../../utilities/utils';
import AddInitiative from '../../../../components/Products/AddInitiative';
import { getProp } from '../../../../utilities/filters';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';

type Params = {
  productSlug?: any
  userRole?: string;
  match: any;
};

const InitiativeList: React.FunctionComponent<Params> = ({ productSlug, history, location, match, userRole }) => {
  // const params: any = matchPath(match.url, {
  //   path: "/products/:productSlug/initiatives",
  //   exact: false,
  //   strict: false
  // });
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const { data, error, loading, refetch } = useQuery(GET_INITIATIVES, {
    variables: { productSlug }
  });

  const goToDetails = (id: number) => {
    router.push(`/products/${productSlug}/initiatives/${id}`);
  }

  const fetchData = async () => {
    await refetch({
      productSlug
    });
  }




  if(loading) return <Spinner/>

  return (
    <LeftPanelContainer productSlug={productSlug}>
      {
        !error && (
          <React.Fragment key={randomKeys()}>
            <Row
              justify="space-between"
              className="right-panel-headline mb-15"
            >
              <Col>
                <div className="page-title text-center">
                  { data.initiatives
                      ? `Explore ${data?.initiatives?.length} initiatives`
                      : 'No initiatives'
                  }
                </div>
              </Col>
              {(userRole === "Manager" || userRole === "Admin") && (
                <Col>
                  <Button
                    onClick={() => setShowEditModal(!showEditModal)}
                  >
                    Add new initiative
                  </Button>
                </Col>
              )}
            </Row>
            <Row gutter={[16, 16]}>
            {
              data.initiatives && data.initiatives.map((initiative: any, idx: number) => (
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
              showEditModal && <AddInitiative
                modal={showEditModal}
                productSlug={productSlug}
                modalType={false}
                closeModal={setShowEditModal}
                submit={fetchData}
              />
            }
            </Row>
          </React.Fragment >
        )
      }
    </LeftPanelContainer>
  );
};

// const mapStateToProps = (state: any) => ({
//   user: state.user,
//   userRole: state.work.userRole
// });

// const mapDispatchToProps = (dispatch: any) => ({
// });

const InitiativeListContainer = connect(
  // mapStateToProps,
  // mapDispatchToProps
)(InitiativeList);

InitiativeListContainer.getInitialProps = async ({ query }) => {
  const { productSlug } = query;
  return { productSlug }

}

export default InitiativeListContainer;