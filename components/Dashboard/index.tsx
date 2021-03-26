import React, {useState} from 'react';
import {Row, Col, Radio, Select, Layout} from 'antd';
import {RadioChangeEvent} from 'antd/lib/radio';
import ProductTab from './ProductTab';
import TaskTab from './TaskTab';

const {Option} = Select;
const {Content} = Layout;

const Dashboard: React.FunctionComponent = () => {
  const [mode, setMode] = useState('products');
  const [productNum, setProductNum] = useState(0);
  const [taskNum, setTaskNum] = useState(0);

  const handleModeChange = (e: RadioChangeEvent): void => {
    setMode(e.target.value);
  };

  return (
    <Content className="container main-page">
      <div
        className="page-title text-center mb-40"
      >
        {
          mode === "products"
            ? `Explore ${productNum} Open Products`
            : `Explore ${taskNum} tasks across ${productNum} Open Products`
        }
      </div>

      <Row align="middle" justify="space-between" className="mb-15" style={{padding: 8}}>
        <Col xs={24} sm={12} md={8} style={{marginTop: 42}}>
          <Radio.Group onChange={handleModeChange} value={mode} className="mb-8">
            <Radio.Button value="products">Products</Radio.Button>
            <Radio.Button value="tasks">Tasks</Radio.Button>
          </Radio.Group>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} style={{marginTop: 20}}>
          {
            mode === "products" &&
            <Row gutter={10} justify="end">
                <Col span={12}>
                    <label>Tags: </label>

                </Col>
            </Row>
          }
        </Col>
      </Row>
      {
        mode === "products" ? (
          <ProductTab setProductNum={setProductNum}/>
        ) : (
          <TaskTab
            setTaskNum={setTaskNum}
            showInitiativeName={true}
            showProductName={true}
          />
        )
      }
      <div style={{marginBottom: 50}}/>
    </Content>
  )
};


export default Dashboard;