import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Card, Button} from 'antd';
import {useRouter} from 'next/router'
import {useQuery} from '@apollo/react-hooks';
import {DynamicHtml, Spinner} from '../../../../components';
import {GET_INITIATIVES} from '../../../../graphql/queries';
import {randomKeys} from '../../../../utilities/utils';
import AddInitiative from '../../../../components/Products/AddInitiative';
import {getProp} from '../../../../utilities/filters';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';

type Params = {
  userRole?: string;
};

const InitiativeList: React.FunctionComponent<Params> = ({userRole}) => {
  const router = useRouter();
  let {productSlug} = router.query;
  productSlug = String(productSlug);

  const [showEditModal, setShowEditModal] = useState(false);
  const {data, error, loading, refetch} = useQuery(GET_INITIATIVES, {
    variables: {productSlug}
  });

  const goToDetails = (id: number) => {
    router.push(`/products/${productSlug}/initiatives/${id}`).then();
  }

  if (loading) return <Spinner/>

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
                  {data.initiatives
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
                data.initiatives && data.initiatives.map((initiative: any) => (
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