import React, { useState } from 'react';
import { Typography, Row, Col, Radio, Select } from 'antd';
import { useRouter } from 'next/router'
import { TASK_TYPES } from '../../graphql/types';
import { RadioChangeEvent } from 'antd/lib/radio';
import ProductTab from './ProductTab';
import TaskTab from './TaskTab';
import classnames from 'classnames';

const { Title } = Typography;
const { Option } = Select;

type Props = {
  onClick?: () => void;
  userLogInAction: any;
};

const Dashboard: React.FunctionComponent<Props> = ({ history, match, userLogInAction, ...rest }) => {
  const router = useRouter();
  let searchParams: any = new URLSearchParams(router.asPath.split('?')[1]);
  const [mode, setMode] = useState('products');
  const [tagType, setTagType] = useState("all");
  const [sortType, setSortType] = useState("initiatives");
  const [taskStatus, setTaskStatus] = useState(-1);
  const [productNum, setProductNum] = useState(0);
  const [taskNum, setTaskNum] = useState(0);

  const handleModeChange = (e: RadioChangeEvent): void => {
    setMode(e.target.value);
  };

  const changeSearchTerm = (key: string, value: any) => {
    searchParams.set(key, value.toString());
    router.push({
      pathname: location.pathname,
      search: searchParams.toString()
    });

    switch(key) {
      case "tag":
        setTagType(value.toString());
        break;
      case "initiatives":
        setSortType(value.toString());
        break;
      case "status":
        setTaskStatus(value.toString());
        break;
      default:
        break;
    }
  }

  return (
    <>
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
              className={classnames("tag-section", { 'mr-16': mode === "products" })}
            >
              <div>
                <label className='mr-15'>Tags: </label>
                <Select
                  defaultValue={tagType}
                  style={{ minWidth: 120 }}
                  onChange={(value: any) => changeSearchTerm("tag", value)}
                >
                  <Option value="all">All</Option>
                  <Option value="django">Django</Option>
                  <Option value="react">React</Option>
                  <Option value="graphql">Graphql</Option>
                </Select>
              </div>
              {mode === "products" ? (
                <div className='ml-15'>
                  <label className='mr-15'>Sorted by: </label>
                  <Select
                    defaultValue={sortType}
                    style={{ minWidth: 120 }}
                    onChange={(value: any) => changeSearchTerm("initiatives", value)}
                  >
                    <Option value="initiatives">Number of initiatives</Option>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                  </Select>
                </div>
              ) : (
                <div className='ml-15'>
                  <label className='mr-15'>Status: </label>
                  <Select
                    defaultValue={taskStatus}
                    style={{ minWidth: 120 }}
                    onChange={(value: any) => changeSearchTerm("status", value)}
                  >
                    <Option value={-1}>All</Option>
                    {TASK_TYPES.map((option: string, idx: number) => (
                      <Option key={`status${idx}`} value={idx}>{option}</Option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      {
        mode === "products" ? (
          <ProductTab setProductNum={setProductNum} history={history} />
        ) : (
          <TaskTab setTaskNum={setTaskNum} />
        )
      }
    </>
  )
};


export default Dashboard;