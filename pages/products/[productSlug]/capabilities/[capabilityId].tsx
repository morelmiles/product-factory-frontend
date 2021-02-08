
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Link from "next/link";
import { useRouter } from 'next/router'
import { Row, Col, Tag, Button, message, Layout } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ReactPlayer from 'react-player';
import parse from 'html-react-parser';
import { GET_CAPABILITY_BY_ID } from '../../../../graphql/queries';
import { DELETE_CAPABILITY } from '../../../../graphql/mutations';
import { TagType } from '../../../../graphql/types';
import { getProp } from '../../../../utilities/filters';
import { TaskTable, Attachment, DynamicHtml, Spinner, ContainerFlex, Header } from '../../../../components';
import DeleteModal from '../../../../components/Products/DeleteModal';
import AddCapability from '../../../../components/Products/AddCapability';
import EditIcon from '../../../../components/EditIcon';

const { Content } = Layout;


type Params = {
  productSlug?: any;
  capabilityId?: any;
  userRole?: string;
};

const CapabilityDetail: React.FunctionComponent<Params> = ({ userRole, capabilityId, productSlug }) => {
  const router = useRouter();
  
  const [capability, setCapability] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  console.log('capabilityId',capabilityId);
  console.log('productSlug',productSlug)
  const { data: original, error, loading, refetch } = useQuery(
    GET_CAPABILITY_BY_ID,
    {
      variables: { id: capabilityId }
    }
  );

  const [deleteModal, showDeleteModal] = useState(false);

  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
    variables: {
      id: capabilityId
    },
    onCompleted() {
      message.success("Item is successfully deleted!");
      router.push(`/products/${productSlug}/capabilities`);
    },
    onError(err) {
      console.log("Delete item error: ", err);
      message.error("Failed to delete item!");
    }
  });

  const getBasePath = () => {
    if (router.asPath.includes("/products")) {
      return `/products/${productSlug}/capabilities`;
    }
    return "/capabilities";
  }

  const fetchData = async () => {
    const data = await refetch({
      id: capabilityId
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

  if(loading) return <Spinner/>

  return (
    <ContainerFlex>
        <Layout>
        <Header/>
        <Content className="container product-page">
      {
        !error && (
          <>
            <div className="text-grey">
              <Link href={getBasePath()}>
                Capabilities
              </Link>
              <span> / </span>
              {getProp(capability, 'breadcrumb', []).map((item: any, idx: number) => (
                <React.Fragment key={`breadcrumb-${idx}`}>
                  <Link href={getBasePath() + `/${item.id}`}>
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
                    capabilityId={capabilityId}
                    editMode={false}
                  />
                )}
              </Col>
            </Row>
            <TaskTable
              tasks={getProp(capability, 'tasks', [])}
              productSlug={productSlug}
            />
            {deleteModal && (
              <DeleteModal
                modal={deleteModal}
                productSlug={productSlug}
                closeModal={() => showDeleteModal(false)}
                submit={deleteCapability}
                title="Delete iniatiative"
              />
            )}
            {
              showEditModal && <AddCapability
                modal={showEditModal}
                productSlug={productSlug}
                modalType={true}
                closeModal={setShowEditModal}
                submit={fetchData}
                capability={capability}
              />
            }
          </>
        )
      }
    </Content>
    </Layout>
    </ContainerFlex>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole
});

const mapDispatchToProps = (dispatch: any) => ({
});

const CapabilityDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CapabilityDetail);


CapabilityDetailContainer.getInitialProps = async ({ query }) => {
    const { capabilityId, productSlug } = query;
    return { capabilityId, productSlug };
}
export default CapabilityDetailContainer;