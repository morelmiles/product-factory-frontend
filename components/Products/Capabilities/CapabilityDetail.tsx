import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, matchPath} from 'react-router';
import {Link, withRouter} from "react-router-dom";
import {Row, Col, Tag, Button, message} from 'antd';
import {useQuery, useMutation} from '@apollo/react-hooks';
import ReactPlayer from 'react-player';
import {GET_CAPABILITY_BY_ID} from 'graphql/queries';
import {DELETE_CAPABILITY} from 'graphql/mutations';
import {TagType} from 'graphql/types';
import {getProp} from 'utilities/filters';
import {TaskTable, Attachment, DynamicHtml} from 'components';
import DeleteModal from 'pages/Products/DeleteModal';
import AddCapability from 'pages/Products/AddCapability';
import EditIcon from 'components/EditIcon';
import Loading from "../../Loading";
import {getUserRole, hasManagerRoots} from "../../../utilities/utils";


type Params = {
  productSlug?: any;
  capabilityId?: any;
  user: any;
  match: any;
} & RouteComponentProps;

const CapabilityDetail: React.FunctionComponent<Params> = ({match, history, user}) => {
  const params: any = match.url.includes("/products")
    ? matchPath(match.url, {
      path: "/products/:productSlug/capabilities/:capabilityId",
      exact: false,
      strict: false
    })
    : matchPath(match.url, {
      path: "/capabilities/:capabilityId",
      exact: false,
      strict: false
    })

  const [capability, setCapability] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  const {data: original, error, loading, refetch} = useQuery(
    GET_CAPABILITY_BY_ID,
    {
      variables: {id: params.params.capabilityId}
    }
  );

  const [deleteModal, showDeleteModal] = useState(false);

  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, params.params.productSlug));

  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
    variables: {
      id: params.params.capabilityId
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      history.push(`/products/${params.params.productSlug}/capabilities`);
    },
    onError() {
      message.error("Failed to delete item!").then();
    }
  });

  const getBasePath = () => {
    if (match.url.includes("/products")) {
      return `/products/${params.params.productSlug}/capabilities`;
    }
    return "/capabilities";
  }

  const fetchData = async () => {
    const data = await refetch({
      id: params.params.capabilityId
    })
    if (!data.errors) {
      setCapability(data.data.capability);
    }
  }

  useEffect(() => {
    if (original) {
      setCapability(original.capability);
    }
  }, [original]);

  if (loading) return <Loading/>

  return (
    <>
      {
        !error && (
          <>
            <div className="text-grey">
              <Link to={getBasePath()}>
                Capabilities
              </Link>
              <span> / </span>
              {getProp(capability, 'breadcrumb', []).map((item: any, idx: number) => (
                <React.Fragment key={`breadcrumb-${idx}`}>
                  <Link to={getBasePath() + `/${item.id}`}>
                    {item.name}
                  </Link>
                  {idx !== getProp(capability, 'breadcrumb', []).length - 1 && (
                    <><span> / </span></>
                  )}
                </React.Fragment>
              ))}
            </div>
            <Row
              justify="space-between"
              className="right-panel-headline mb-15"
            >
              <Col>
                <div
                  className="page-title"
                >
                  {getProp(capability, 'name', '')}
                </div>
              </Col>
              {userHasManagerRoots && (
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
              {getProp(capability, 'product.videoUrl', null) && (
                <Col>
                  <ReactPlayer
                    width="100%"
                    height="170px"
                    className="mr-10"
                    url={getProp(capability, 'product.videoUrl')}
                  />
                </Col>
              )}
              <Col xs={24} md={10}>
                <DynamicHtml
                  className='mb-10'
                  text={getProp(capability, 'product.shortDescription', '')}
                />
                {
                  getProp(capability, 'product.tag', []).map((tag: TagType, idx: number) => (
                    <Tag key={`tag-${idx}`}>{tag.name}</Tag>
                  ))
                }
                {getProp(capability, 'attachment', []).length > 0 && (
                  <Attachment
                    attachments={getProp(capability, 'attachment', [])}
                    capabilityId={match.params.capabilityId}
                    editMode={false}
                  />
                )}
              </Col>
            </Row>
            <TaskTable
              tasks={getProp(capability, 'tasks', [])}
              productSlug={params.params.productSlug}
            />
            {deleteModal && (
              <DeleteModal
                modal={deleteModal}
                productSlug={params.params.productSlug}
                closeModal={() => showDeleteModal(false)}
                submit={deleteCapability}
                title="Delete iniatiative"
              />
            )}
            {
              showEditModal && <AddCapability
                  modal={showEditModal}
                  productSlug={params.params.productSlug}
                  modalType={true}
                  closeModal={setShowEditModal}
                  submit={fetchData}
                  capability={capability}
              />
            }
          </>
        )
      }
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

const mapDispatchToProps = () => ({});

const CapabilityDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CapabilityDetail);

export default withRouter(CapabilityDetailContainer);