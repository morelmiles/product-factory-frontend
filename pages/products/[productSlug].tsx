import React, { useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import { useRouter } from 'next/router';
import ContainerFlex from '../../components/ContainerFlex';
import HeaderMenu from '../../components/Header'
import LeftPanel from '../../components/Products/LeftPanel';
import Summary from '../../components/Products/Summary';
import Initiatives from '../../components/Products/Initiatives';
import Capabilities from '../../components/Products/Capabilities';
import Task from '../../components/Products/Task';
import User from '../../components/Products/User';
import Commercial from '../../components/Products/Commercial';
import TasksPage from "../../components/Products/Tasks";
import { NotFound } from 'pages';


const { Content } = Layout;


const Products: React.FunctionComponent = ({ productSlug }) => {
  console.log('productSlug', productSlug)
  const router = useRouter();


  // if (!productSlug) {
  //   return <Redirect to="/404" />;
  // }

  return (
    <ContainerFlex>
      <Layout>
        <HeaderMenu/>
        <Content className="container product-page">
          <Row gutter={16} className='mt-30'>
            <Col xs={24} sm={8} md={6}>
              <LeftPanel productSlug={router.query.productSlug}/>
            </Col>
            <Col xs={24} sm={16} md={18}>
              {/* <Switch>
                <Route exact default path={match.url} component={Summary} />
                <Route path={`${match.url}/initiatives`} component={Initiatives} />
                <Route path={`${match.url}/capabilities`} component={Capabilities} />
                <Route exact path={`${match.url}/tasks`} component={TasksPage} />
                <Route path={`${match.url}/tasks/:taskId`} component={Task} />
                <Route path={`${match.url}/people`} component={User} />
                <Route path={`${match.url}/partners`} component={Commercial} />
                <Route path="*" component={NotFound} />
              </Switch> */}
            </Col>
          </Row>
        </Content>
      </Layout>
    </ContainerFlex>
  );
};

Products.getInitialProps = async ({ query }) => {
  const { productSlug } = query;
  return { productSlug }

}
export default Products;
