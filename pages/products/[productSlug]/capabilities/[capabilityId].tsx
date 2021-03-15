import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Link from "next/link";
import {useRouter} from 'next/router'
import {Row, Col, Tag, Button, message, Layout, Space, Breadcrumb, Dropdown, Menu} from 'antd';
import {useQuery, useMutation} from '@apollo/react-hooks';
import ReactPlayer from 'react-player';
import {GET_CAPABILITY_BY_ID, GET_CAPABILITY_PARENT_CRUMBS} from '../../../../graphql/queries';
import {DELETE_CAPABILITY} from '../../../../graphql/mutations';
import {TagType} from '../../../../graphql/types';
import {getProp} from '../../../../utilities/filters';
import {TaskTable, DynamicHtml, ContainerFlex, Header} from '../../../../components';
import DeleteModal from '../../../../components/Products/DeleteModal';
import AddOrEditCapability from '../../../../components/Products/AddOrEditCapability';
import EditIcon from '../../../../components/EditIcon';
import Attachments from "../../../../components/Attachments";
import Loading from "../../../../components/Loading";
import {DownOutlined} from "@ant-design/icons";
import CheckableTag from "antd/lib/tag/CheckableTag";


interface ICrumb {
  id: number
  name: string
  siblings: [{
    id: number
    name: string
  }]
}

interface IParentsCrumbsProps {
  productSlug: string
  crumbs: ICrumb[]
  capabilityName: string
}

const {Content} = Layout;

const ParentsCrumbs: React.FunctionComponent<IParentsCrumbsProps> = (
  {productSlug, crumbs, capabilityName}
) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link href={`/products/${productSlug}/capabilities`}>Capabilities</Link>
      </Breadcrumb.Item>

      {
        crumbs.map(crumb => (
          <>
            <Link href={`/products/${productSlug}/capabilities/${crumb.id}`}>{crumb.name}</Link>

            <Breadcrumb.Item key={crumb.id}>

              <Dropdown trigger={['click']} overlay={
                <Menu>
                  {
                    crumb.siblings.map(sibling => (
                      <Menu.Item key={sibling.id}>
                        <Link href={`/products/${productSlug}/capabilities/${sibling.id}`}>
                          {sibling.name}
                        </Link>
                      </Menu.Item>
                    ))
                  }
                </Menu>
              }>
                <a href={`/products/${productSlug}/capabilities/${crumb.id}`}>
                  <DownOutlined style={{marginLeft: 5}}/>
                </a>
              </Dropdown>
            </Breadcrumb.Item>
          </>
        ))
      }

      <Breadcrumb.Item>{capabilityName}</Breadcrumb.Item>
    </Breadcrumb>
  )
}

const CapabilityDetail: React.FunctionComponent = () => {
  const router = useRouter();
  let {capabilityId, productSlug} = router.query;
  productSlug = String(productSlug);

  const [capability, setCapability] = useState({});
  const [isAdminOrManager, setIsAdminOrManager] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formattedCrumbs, setFormattedCrumbs] = useState<Array<ICrumb>>([]);

  const {data, error, loading, refetch} = useQuery(GET_CAPABILITY_BY_ID, {
    variables: {nodeId: capabilityId, slug: productSlug}
  });

  const {data: crumbs, error: crumbsError, loading: crumbsLoading} = useQuery(GET_CAPABILITY_PARENT_CRUMBS, {
    variables: {nodeId: capabilityId}
  });

  useEffect(() => {
    if (!crumbsError && crumbs) {
      setFormattedCrumbs(JSON.parse(crumbs.capabilityParentCrumbs));
    }
  }, [crumbs])

  const [deleteModal, showDeleteModal] = useState(false);

  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
    variables: {
      nodeId: capabilityId
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      refetch().then();
      router.push(`/products/${productSlug}/capabilities`).then();
    },
    onError() {
      message.error("Failed to delete item!").then();
    }
  });

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  useEffect(() => {
    if (!error) {
      setCapability(getProp(data, 'capability', {}));
      setIsAdminOrManager(getProp(data, 'isAdminOrManager', false));
    }
  }, [data]);
    console.log(getProp(capability, 'tasks', []));

  if (loading || crumbsLoading) return <Loading/>



  return (
    <ContainerFlex>
      <Layout>
        <Header/>
        <Content className="container product-page" style={{marginTop: 20, marginBottom: 80}}>
          {
            !error && !crumbsError && (
              <>
                <ParentsCrumbs
                  productSlug={productSlug}
                  crumbs={formattedCrumbs}
                  capabilityName={getProp(capability, 'name', '')}
                />
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
                  {
                    isAdminOrManager &&
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
                  }
                </Row>
                <Space align="start" size={20} direction="vertical">
                  {getProp(capability, 'videoLink', null) && (
                    <Row>
                      <Col span={24}>
                        <ReactPlayer
                          width="100%"
                          height="170px"
                          className="mr-10"
                          url={getProp(capability, 'videoLink')}
                        />
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col span={24}>
                      <DynamicHtml
                        className='mb-10'
                        text={getProp(capability, 'description', '')}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      {
                        getProp(capability, 'stacks', []).map((tag: TagType, index: number) => (
                          <CheckableTag key={`tag-${index}`} checked={true}>{tag.name}</CheckableTag>
                        ))
                      }
                    </Col>
                  </Row>
                </Space>

                <Row>
                  <Col span={12}>
                    {
                      getProp(capability, 'attachments', []).length > 0 && (
                        <Attachments style={{marginTop: 20, marginBottom: 50}}
                                     data={getProp(capability, 'attachments', [])}/>
                      )
                    }
                  </Col>
                </Row>

                <TaskTable
                  submit={() => refetch()}
                  tasks={getProp(capability, 'tasks', [])}
                  productSlug={productSlug}
                />

                {
                  deleteModal &&
                  <DeleteModal
                      modal={deleteModal}
                      productSlug={productSlug}
                      closeModal={() => showDeleteModal(false)}
                      submit={deleteCapability}
                      title="Delete capability"
                  />
                }
                {
                  showEditModal &&
                  <AddOrEditCapability
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


export default CapabilityDetail;