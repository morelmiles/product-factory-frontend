import React, {useState} from 'react';
import {Row, Col, Radio, Select, Layout} from 'antd';
import {useRouter} from 'next/router'
import {RadioChangeEvent} from 'antd/lib/radio';
import ProductTab from './ProductTab';
import TaskTab from './TaskTab';
import classnames from 'classnames';
import {useQuery} from "@apollo/react-hooks";
import {GET_TAGS} from "../../graphql/queries";


const {Option} = Select;
const {Content} = Layout;

const Dashboard: React.FunctionComponent = () => {
  const router = useRouter();
  let searchParams: any = new URLSearchParams(router.asPath.split('?')[1]);
  const [mode, setMode] = useState('products');
  const [productTags, setProductTags] = useState([]);
  const [taskTags, setTaskTags] = useState([]);
  const [taskSortType, setTaskSortType] = useState("priority");
  const [taskStatus, setTaskStatus] = useState([]);
  const [productNum, setProductNum] = useState(0);
  const [taskNum, setTaskNum] = useState(0);
  const tagsData = useQuery(GET_TAGS);

  const handleModeChange = (e: RadioChangeEvent): void => {
    setMode(e.target.value);
  };

  const changeSearchTerm = (key: string, value: any) => {
    searchParams.set(key, value.toString());
    router.push({
      pathname: location.pathname,
      search: searchParams.toString()
    }).then();

    switch (key) {
      case "product-tag":
        setProductTags(value);
        break;
      case "initiatives":
        setProductSortType(value.toString());
        break;
      case "task-sorted":
        setTaskSortType(value.toString());
        break;
      case "status":
        setTaskStatus(value);
        break;
      case "task-tag":
        setTaskTags(value);
        break;
      default:
        break;
    }
  }

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
                    <Select
                        defaultValue={productTags}
                        onChange={(value: any) => changeSearchTerm("product-tag", value)}
                    >
                      {tagsData?.data ? tagsData.data.tags.map((tag: { id: string, name: string }) =>
                        <Option key={tag.id} value={tag.id}>{tag.name}</Option>) : []}
                    </Select>
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
            sortedBy={taskSortType}
            statuses={taskStatus}
            tags={taskTags}
          />
        )
      }
      <div style={{marginBottom: 50}}/>
    </Content>
  )
};


export default Dashboard;