import React from 'react';
import {Layout, Row, Col} from 'antd';
import ContainerFlex from '../../components/ContainerFlex';
import HeaderMenu from '../../components/Header'
import LeftPanel from '../../components/Products/LeftPanel';


const {Content} = Layout;


const LeftPanelContainer: React.FunctionComponent = ({children}) => {
  return (
    <ContainerFlex>
      <Layout>
        <HeaderMenu/>
        <Content className="container product-page">
          <Row gutter={16} className='mt-30'>
            <Col xs={24} sm={8} md={8} lg={6}>
              <LeftPanel/>
            </Col>
            <Col xs={24} sm={16} md={16} lg={18} style={{paddingLeft: 32, paddingRight: 32}}>
              {children}
            </Col>
          </Row>
        </Content>
      </Layout>
    </ContainerFlex>
  );
};

export default LeftPanelContainer;
