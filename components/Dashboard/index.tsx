import React, {useState} from 'react';
import {Row, Col, Radio, Select, Layout} from 'antd';
import {useRouter} from 'next/router'
import {TASK_LIST_TYPES} from '../../graphql/types';
import {RadioChangeEvent} from 'antd/lib/radio';
import ProductTab from './ProductTab';
import TaskTab from './TaskTab';
// import { ContainerFlex } from '../index';
import classnames from 'classnames';
import {useQuery} from "@apollo/react-hooks";
import {GET_TAGS} from "../../graphql/queries";

const {Option} = Select;
const {Content} = Layout;

// type Props = {
//   onClick?: () => void;
//   userLogInAction: any;
// };

const Dashboard: React.FunctionComponent = () => {
  const router = useRouter();
  let searchParams: any = new URLSearchParams(router.asPath.split('?')[1]);
  const [mode, setMode] = useState('products');
  const [productTags, setProductTags] = useState([]);
  const [taskTags, setTaskTags] = useState([]);
  const [productSortType, setProductSortType] = useState("initiatives");
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
      <div>
        <Row align="middle" justify="space-between" className="mb-15">
          <Col span={8} xs={24} md={8}>
            <Radio.Group onChange={handleModeChange} value={mode} className="mb-8">
              <Radio.Button value="products">Products</Radio.Button>
              <Radio.Button value="tasks">Tasks</Radio.Button>
            </Radio.Group>
          </Col>
          <Col
            xs={24}
            md={16}
          >
            <div
              className={classnames("tag-section", {'mr-16': mode === "products"})}
            >
              {mode === "products" ? (
                <>
                  <div>
                    <label className='mr-15'>Tags: </label>
                    <Select
                      defaultValue={productTags}
                      style={{minWidth: 120}}
                      onChange={(value: any) => changeSearchTerm("product-tag", value)}
                    >
                      {tagsData?.data ? tagsData.data.tags.map((tag: {id: string, name: string}) =>
                        <Option key={tag.id} value={tag.id}>{tag.name}</Option>) : []}
                    </Select>
                  </div>
                  <div className='ml-15'>
                    <label className='mr-15'>Sorted by: </label>
                    <Select
                      defaultValue={productSortType}
                      style={{minWidth: 120}}
                      onChange={(value: any) => changeSearchTerm("initiatives", value)}
                    >
                      <Option value="initiatives">Number of initiatives</Option>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className='mr-15'>Tags: </label>
                    <Select
                      value={taskTags}
                      mode="multiple"
                      style={{minWidth: 120}}
                      onChange={(value: any) => changeSearchTerm("task-tag", value)}
                      placeholder="Select tags"
                    >
                      {tagsData?.data ? tagsData.data.tags.map((tag: {id: string, name: string}) =>
                        <Option key={tag.id} value={tag.id}>{tag.name}</Option>) : []}
                    </Select>
                  </div>
                  <div className='ml-15'>
                    <label className='mr-15'>Sorted by: </label>
                    <Select
                      value={taskSortType}
                      style={{minWidth: 120}}
                      onChange={(value: any) => changeSearchTerm("task-sorted", value)}
                    >
                      <Option value="title">Name</Option>
                      <Option value="priority">Priority</Option>
                      <Option value="status">Status</Option>
                    </Select>
                  </div>
                  <div className='ml-15'>
                    <label className='mr-15'>Status: </label>
                    <Select
                      value={taskStatus}
                      style={{minWidth: 120}}
                      mode="multiple"
                      placeholder="Select statuses"
                      onChange={(value: any) => changeSearchTerm("status", value)}
                    >
                      {TASK_LIST_TYPES.map((option: { id: number, name: string }) => (
                        <Option key={`status-${option.id}`} value={option.id}>{option.name}</Option>
                      ))}
                    </Select>
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
      {
        mode === "products" ? (
          <ProductTab setProductNum={setProductNum}/>
        ) : (
          <TaskTab setTaskNum={setTaskNum}
                   showInitiativeName={true}
                   showProductName={true}
                   sortedBy={taskSortType}
                   statuses={taskStatus}
                   tags={taskTags} />
        )
      }
      <div style={{marginBottom: 50}}/>
    </Content>
  )
};


export default Dashboard;