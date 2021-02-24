import React from 'react';
import {Layout, Row, Col} from 'antd';
import ContainerFlex from '../../components/ContainerFlex';
import HeaderMenu from '../../components/Header'
import LeftPanel from '../../components/Products/LeftPanel';
import {useRouter} from "next/router";


const {Content} = Layout;


const LeftPanelContainer: React.FunctionComponent = ({children}) => {
  const router = useRouter()
  const {productSlug} = router.query

  return (
    <ContainerFlex>
      <Layout>
        <HeaderMenu/>
        <Content className="container product-page">
          <Row gutter={16} className='mt-30'>
            <Col xs={24} sm={8} md={6}>
              <LeftPanel productSlug={productSlug}/>
            </Col>
            <Col xs={24} sm={16} md={18} style={{paddingLeft: 32, paddingRight: 32}}>
              {children}
            </Col>
          </Row>
        </Content>
      </Layout>
    </ContainerFlex>
  );
};

export default LeftPanelContainer;
