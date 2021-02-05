
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Row, Col, Avatar, message, Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ReactPlayer from 'react-player';
import parse from 'html-react-parser';
import { GET_INITIATIVE_BY_ID } from '../../../../graphql/queries';
import { DELETE_INITIATIVE } from '../../../../graphql/mutations';
import DeleteModal from '../../../../components/Products/DeleteModal';
import AddInitiative from '../../../../components/Products/AddInitiative';
import { TaskTable, DynamicHtml, Spinner } from '../../../../components';
import EditIcon from '../../../../components/EditIcon';
import { getProp } from '../../../../utilities/filters';
import { getInitialName, randomKeys } from '../../../../utilities/utils';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';

type Params = {
  productSlug?: any;
  initiativeId?: any;
  userRole?: string;
  currentProduct: any;
};

const InitiativeDetail: React.FunctionComponent<Params> = ({ productSlug, initiativeId, userRole, currentProduct = {} }) => {
//   const params: any = matchPath(match.url, {
//     path: "/products/:productSlug/initiatives/:initiativeId",
//     exact: false,
//     strict: false
//   });
  console.log('initiativeId in initiative details', initiativeId)
  const router = useRouter();
  const { data: original, error, loading, refetch } = useQuery(GET_INITIATIVE_BY_ID, {
    variables: { id: initiativeId }
  });
  const [initiative, setInitiative] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [deleteInitiative] = useMutation(DELETE_INITIATIVE, {
    variables: {
      id: initiativeId
    },
    onCompleted() {
      message.success("Item is successfully deleted!");
      router.push(`/products/${productSlug}/initiatives`);
    },
    onError(err) {
      console.log("Delete item error: ", err);
      message.error("Failed to delete item!");
    }
  });

  const fetchData = async () => {
    const data: any = await refetch({
      id: initiativeId
    });

    if (!data.errors) {
      setInitiative(data.data.initiative);
    }
  }

  useEffect(() => {
    if (original) {
      setInitiative(original.initiative);
    }
  }, [original]);

  console.log('original',original);
  console.log('currentProduct',currentProduct)
  if(loading) return <Spinner/>

  return (
    <LeftPanelContainer productSlug={productSlug}>
      {
        !error && (
          <React.Fragment key={randomKeys()}>
            <div className="text-grey">
              {
                <>
                  <Link
                    href={`/products/${productSlug}`}
                    className="text-grey"
                  >
                    {getProp(currentProduct, 'name', '')}
                  </Link>
                  <span> / </span>
                  <Link
                    href={`/products/${productSlug}/initiatives`}
                    className="text-grey"
                  >
                    Initiatives
                  </Link>
                  <span> / </span>
                </>
              }
              <span>{getProp(original.initiative, 'name', '')}</span>
            </div>
            <Row
              justify="space-between"
              className="right-panel-headline mb-15"
            >
              <div className="page-title">
                {getProp(original.initiative, 'name', '')}
              </div>
              {(userRole === "Manager" || userRole === "Admin") && (
                <Col>
                  <Button
                    onClick={() => showDeleteModal(true)}
                  >
                    Delete
                  </Button>
                  <EditIcon
                    className='ml-10'
                    onClick={() => setShowEditModal(true)}
                  />
                </Col>
              )}
            </Row>
            <Row>
              {/* <Col>
                <ReactPlayer
                  width="100%"
                  height="170px"
                  url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                />
              </Col> */}
              <Col span={10}>
                <DynamicHtml
                  className='mb-10'
                  text={getProp(original.initiative, 'description', '')}
                />
              </Col>
            </Row>
            <TaskTable
              tasks={getProp(original.initiative, 'taskSet', [])}
              productSlug={productSlug}
            />
            {deleteModal && (
              <DeleteModal
                modal={deleteModal}
                productSlug={productSlug}
                closeModal={() => showDeleteModal(false)}
                submit={deleteInitiative}
                title="Delete iniatiative"
              />
            )}
            {
              showEditModal && <AddInitiative
                modal={showEditModal}
                productSlug={productSlug}
                modalType={true}
                closeModal={setShowEditModal}
                submit={fetchData}
                initiative={initiative}
              />
            }
          </React.Fragment>
        )
      }
    </LeftPanelContainer>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole,
  currentProduct: state.work.currentProduct,
});

const mapDispatchToProps = (dispatch: any) => ({
});

const InitiativeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeDetail);

InitiativeDetailContainer.getInitialProps = async ({ query }) => {
    console.log('initiativeId in getInitialProps',query)
    const { initiativeId, productSlug } = query;
    return { initiativeId, productSlug }
  
  }
export default InitiativeDetailContainer;