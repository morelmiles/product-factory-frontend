import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Link from "next/link";
import {useRouter} from 'next/router'
import {Row, Col, Tag, Button, message, Layout, Space} from 'antd';
import {useQuery, useMutation} from '@apollo/react-hooks';
import ReactPlayer from 'react-player';
import {GET_CAPABILITY_BY_ID} from '../../../../graphql/queries';
import {DELETE_CAPABILITY} from '../../../../graphql/mutations';
import {TagType} from '../../../../graphql/types';
import {getProp} from '../../../../utilities/filters';
import {TaskTable, DynamicHtml, Spinner, ContainerFlex, Header} from '../../../../components';
import DeleteModal from '../../../../components/Products/DeleteModal';
import AddCapability from '../../../../components/Products/AddOrEditCapability';
import EditIcon from '../../../../components/EditIcon';
import Attachments from "../../../../components/Attachments";


const {Content} = Layout;

type Params = {
  userRole?: string;
  user: any;
};

const CapabilityDetail: React.FunctionComponent<Params> = ({userRole, user}) => {
  const router = useRouter();
  let {capabilityId, productSlug} = router.query;
  productSlug = String(productSlug);
  // console.log('role', user);

  const [capability, setCapability] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  const {data, error, loading, refetch} = useQuery(GET_CAPABILITY_BY_ID, {
    variables: {nodeId: capabilityId}
  });

  const [deleteModal, showDeleteModal] = useState(false);

  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
    variables: {
      id: capabilityId
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      router.push(`/products/${productSlug}/capabilities`).then();
    },
    onError() {
      message.error("Failed to delete item!").then();
    }
  });

  const getBasePath = () => {
    if (router.asPath.includes("/products")) {
      return `/products/${productSlug}/capabilities`;
    }
    return "/capabilities";
  }

  useEffect(() => {
    if (!error) {
      setCapability(getProp(data, 'capability', {}));
    }
  }, [data]);

  if (loading) return <Spinner/>

  return (
    <ContainerFlex>
      <Layout>
        <Header/>
        <Content className="container product-page" style={{marginTop: 20, marginBottom: 80}}>
          {
            !error && (
              <>
                <div className="text-grey">
                  <Link href={getBasePath()}>
                    Capabilities
                  </Link>
                  <span> / </span>
                  {getProp(capability, 'name', '')}
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
                  <Space align="start" size={20}>
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
                      <Attachments style={{marginTop: 20}} data={getProp(capability, 'attachment', [])}/>
                    )}
                  </Col>
                  </Space>
                </Row>
                <TaskTable
                  tasks={getProp(capability, 'tasks', [])}
                  productSlug={productSlug}
                />
                {
                  deleteModal && (
                    <DeleteModal
                      modal={deleteModal}
                      productSlug={productSlug}
                      closeModal={() => showDeleteModal(false)}
                      submit={deleteCapability}
                      title="Delete initiative"
                    />
                  )
                }
                {
                  showEditModal && <AddCapability
                      modal={showEditModal}
                      modalType={'edit'}
                      closeModal={setShowEditModal}
                      submit={() => refetch()}
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

const mapDispatchToProps = () => ({});

const CapabilityDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CapabilityDetail);

export default CapabilityDetailContainer;