import React, {useState} from 'react';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import {Avatar, Button, Col, Menu, Modal, Row, Typography} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {GET_PRODUCT_BY_SLUG, GET_PRODUCT_INFO_BY_ID} from '../../../graphql/queries';
import {getProp} from '../../../utilities/filters';
import {getInitialName, getUserRole, hasAdminRoots} from '../../../utilities/utils';
import {EditOutlined} from "@ant-design/icons";
import AddOrEditProduct from "../../AddOrEditProduct";
import {RICH_TEXT_EDITOR_WIDTH} from "../../../utilities/constants";


interface ILeftPanelProps {
  user: any
}

interface ILink {
  type: string
  name: string
  url: string
}

const LeftPanel: React.FunctionComponent<ILeftPanelProps> = ({user}): any => {
  const router = useRouter();
  const {productSlug} = router.query;

  const {data: productOriginal} = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: {slug: productSlug},
    fetchPolicy: "no-cache"
  });

  const [isEditingModalVisible, setIsEditingModalVisible] = useState(false);
  const [isDeleteProductModalVisible, setIsDeleteProductModalVisible] = useState(false);
  const [toUpdate, setToUpdate] = useState(0);
  const [toDelete, setToDelete] = useState(0);

  let links: ILink[] = [
    {url: '/', type: 'summary', name: 'Summary'},
    {url: '/initiatives', type: 'initiatives', name: 'Initiatives'},
    {url: '/tasks', type: 'tasks', name: 'Tasks'},
    {url: '/capabilities', type: 'capabilities', name: 'Product Map'},
    {url: '/people', type: 'people', name: 'People'},
    {url: '/partners', type: 'partners', name: 'Commercial Partners'}
  ];

  const userHasAdminRoots = hasAdminRoots((getUserRole(user.roles, productSlug)));

  if (userHasAdminRoots) {
    links.push(
      {url: '/settings', type: 'settings', name: 'Settings'}
    );
  }

  const {data: product, error: productError, loading} = useQuery(GET_PRODUCT_INFO_BY_ID, {
    variables: {slug: productSlug}
  });
  const selectedIndex: number = links.findIndex((item: any) => {
    return router.asPath.includes(item.type);
  });
  const selectedLink = selectedIndex === -1
    ? links[0].type : links[selectedIndex].type;

  const goToDetail = (type: string) => {
    router.push(`/products/${productSlug}${type}`).then();
  }

  if (loading) return null;


  const footerButtons = ([
    <Button type="danger" style={{float: "left"}} onClick={() => {
      setIsDeleteProductModalVisible(true)
    }}>Delete this product</Button>,
    <Button key="back" onClick={() => setIsEditingModalVisible(false)}>Cancel</Button>,
    <Button key="submit" type="primary" onClick={() => setToUpdate(prev => prev + 1)}>Edit</Button>
  ]);

  const footerDeleteProductButtons = ([
    <Button key="back" onClick={() => setIsDeleteProductModalVisible(false)}>No</Button>,
    <Button type="danger" onClick={() => setToDelete(prev => prev + 1)}>Yes, I'm sure</Button>
  ]);

  return (
    <>
      {
        !productError && (
          <div className="left-panel">
            <Row justify="space-between" align="middle" style={{margin: '15px 10px 20px 10px'}}>
              <Col>
                <Row align="middle">
                  <Col style={{marginRight: 10}}>
                    <Avatar>
                      {getInitialName(getProp(product, 'product.name', ''))}
                    </Avatar>
                  </Col>
                  <Col>
                    <Row>
                      <Typography.Title
                        style={{marginBottom: 5}}
                        level={4}
                      >{getProp(product, 'product.name', '')}</Typography.Title>
                    </Row>
                    <Row>
                      <Typography.Link className="gray-link" href={getProp(product, 'product.website', '')}>
                        {getProp(product, 'product.website', '')}
                      </Typography.Link>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col>
                {
                  userHasAdminRoots &&
                  <Button
                      onClick={() => setIsEditingModalVisible(true)}
                      type="primary"
                      icon={<EditOutlined/>}
                      style={{marginLeft: 10}}
                  />
                }
              </Col>
            </Row>
            <Menu mode="inline" selectedKeys={[selectedLink]}>
              {links.map((link: any, index: number) => (
                <Menu.Item
                  key={index}
                  onClick={() => goToDetail(link.url)}
                >
                  {link.name}
                </Menu.Item>
              ))}
            </Menu>
          </div>
        )
      }

      <Modal
        visible={isEditingModalVisible}
        footer={footerButtons}
        onCancel={() => setIsEditingModalVisible(false)}
        width={RICH_TEXT_EDITOR_WIDTH}
        title="Edit Product"
        maskClosable={false}
      >
        <AddOrEditProduct
          isEditing={true}
          productData={getProp(productOriginal, 'product')}
          toUpdate={toUpdate}
          toDelete={toDelete}
          closeModal={() => setIsEditingModalVisible(false)}
        />
      </Modal>

      <Modal
        visible={isDeleteProductModalVisible}
        footer={footerDeleteProductButtons}
        onCancel={() => setIsDeleteProductModalVisible(false)}
        title="Delete Product"
        maskClosable={false}
      >
        <Typography.Text>Are you sure you want to remove this product permanently?</Typography.Text>
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  work: state.work,
});

const mapDispatchToProps = () => ({});

const LeftPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPanel);

export default LeftPanelContainer;