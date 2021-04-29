import React, { useState } from "react";
import { Row, Col, Button, Select, Layout, Space, Tabs } from "antd";
import ProductTab from "./ProductTab";
import TaskTab from "./TaskTab";
import { useQuery } from "@apollo/react-hooks";
import { GET_STACKS } from "../../graphql/queries";
import { getProp } from "../../utilities/filters";
import VacancyBox from "./vacancy";

const { Option } = Select;
const { Content } = Layout;
const { TabPane } = Tabs;

interface IStack {
  id: number;
  name: string;
}

const Dashboard: React.FunctionComponent = () => {
  const [tabkey, setTabkey] = useState("tasks");
  const [stacksFilter, setStacksFilter] = useState<any>([]);
  const [filterModal, setFilterModal] = useState(false);
  const { data: stacksData } = useQuery(GET_STACKS);

  const onChnageKey = (key: any) => {
    setTabkey(key);
  };

  const extraTabButtons = () => {
    if (tabkey === "products")
      return (
        <Space style={{ width: "100%" }}>
          <Select
            mode="multiple"
            placeholder="Specify skills required"
            style={{ minWidth: "170px", width: "auto" }}
            onChange={(val) => {
              setStacksFilter(val);
            }}
          >
            {getProp(stacksData, "stacks", []).map((stack: IStack) => (
              <Option key={`stack-${stack.id}`} value={stack.name}>
                {stack.name}
              </Option>
            ))}
          </Select>
        </Space>
      );
    return (
      <Button type="primary" onClick={() => setFilterModal(!filterModal)}>
        Filter
      </Button>
    );
  };

  return (
    <Content className="container main-page">
      <div className="mobile-select-tab">
        <Select
          style={{ width: "130px" }}
          onChange={onChnageKey}
          value={tabkey}
        >
          <Option key="tasks" value="tasks">
            Tasks
          </Option>
          <Option key="products" value="products">
            Products
          </Option>
        </Select>
        <div className="extra">{extraTabButtons()}</div>
      </div>
      <Row gutter={50} className="mb-40">
        {/*<Col md={18}>*/}
        <Col md={24}>
          <Tabs
            activeKey={tabkey}
            className="main-tab"
            onChange={onChnageKey}
            tabBarExtraContent={extraTabButtons()}
          >
            <TabPane tab="Tasks" key="tasks">
              <TaskTab
                showInitiativeName={true}
                showProductName={true}
                setFilterModal={setFilterModal}
                filterModal={filterModal}
              />
            </TabPane>
            <TabPane tab="Products" key="products">
              <ProductTab
                stacksFilter={stacksFilter}
              />
            </TabPane>
            {/* <TabPane tab="Vacancies" key="vacancies">
              <h1>This is vacancy tab</h1>
            </TabPane> */}
          </Tabs>
        </Col>
        {/*<Col md={6}>*/}
        {/*  <VacancyBox />*/}
        {/*</Col>*/}
      </Row>
    </Content>
  );
};

export default Dashboard;
