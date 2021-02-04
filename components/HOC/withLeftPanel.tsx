import React from 'react';
import { Layout, Row, Col } from 'antd';
import ContainerFlex from '../../components/ContainerFlex';
import HeaderMenu from '../../components/Header'
import LeftPanel from '../../components/Products/LeftPanel';


const { Content } = Layout;

interface IProps {
    productSlug: string;
    children: React.FunctionComponent
} 
const LeftPanelContainer: React.FunctionComponent = ({ productSlug, children }) => {

    // if (!productSlug) {
    //     return <Redirect to="/404" />;
    //   }
    console.log('productSlug in hoc', productSlug);
    return (
    <ContainerFlex>
        <Layout>
        <HeaderMenu/>
        <Content className="container product-page">
            <Row gutter={16} className='mt-30'>
            <Col xs={24} sm={8} md={6}>
                <LeftPanel productSlug={productSlug}/>
            </Col>
            <Col xs={24} sm={16} md={18}>
                {children}
            </Col>
            </Row>
        </Content>
        </Layout>
    </ContainerFlex>
    );
};


export default LeftPanelContainer;
