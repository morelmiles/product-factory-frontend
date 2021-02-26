import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Row, Col, message, Button} from 'antd';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_INITIATIVE_BY_ID, GET_PRODUCT_INFO_BY_ID} from '../../../../graphql/queries';
import {DELETE_INITIATIVE} from '../../../../graphql/mutations';
import DeleteModal from '../../../../components/Products/DeleteModal';
import AddInitiative from '../../../../components/Products/AddInitiative';
import {TaskTable, DynamicHtml} from '../../../../components';
import EditIcon from '../../../../components/EditIcon';
import {getProp} from '../../../../utilities/filters';
import {randomKeys} from '../../../../utilities/utils';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import Loading from "../../../../components/Loading";


type Params = {
  userRole?: string;
};

const InitiativeDetail: React.FunctionComponent<Params> = ({userRole}) => {
  const router = useRouter();
  let {initiativeId, productSlug} = router.query;
  productSlug = String(productSlug);

  const {data: product, error: productError, loading: productLoading} = useQuery(GET_PRODUCT_INFO_BY_ID, {
    variables: {slug: productSlug}
  });

  const [initiative, setInitiative] = useState({});
  const [userId, setUserId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [deleteInitiative] = useMutation(DELETE_INITIATIVE, {
    variables: {
      id: initiativeId
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      router.push(`/products/${productSlug}/initiatives`).then();
    },
    onError() {
      message.error("Failed to delete item!").then();
    }
  });

  const {data: original, error, loading, refetch} = useQuery(GET_INITIATIVE_BY_ID, {
    variables: {id: initiativeId, userId: userId == null ? 0 : userId }
  });

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

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

  if (loading || productLoading) return <Loading/>

  return (
    <LeftPanelContainer>
      {
        !error && !productError && (
          <React.Fragment key={randomKeys()}>
            <div className="text-grey">
              {
                <>
                  <Link href={`/products/${productSlug}`}>
                    <a className="text-grey">{getProp(product, 'name', '')}</a>
                  </Link>
                  <span> / </span>
                  <Link href={`/products/${productSlug}/initiatives`}>
                    <a className="text-grey">Initiatives</a>
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
              submit={fetchData}
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
});

const mapDispatchToProps = () => ({});

const InitiativeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeDetail);

export default InitiativeDetailContainer;