import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Select, Spin, Button } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_TASKS_BY_PRODUCT } from '../../../../graphql/queries';
import { TaskTable } from '../../../../components';
import AddTask from '../../../../components/Products/AddTask';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';

const { Option } = Select;

type Props = {
  onClick?: () => void;
  currentProduct: any;
  repositories: Array<any>;
  userRole: string;
  productSlug: string;
};

const TasksPage: React.FunctionComponent<Props> = (props: Props) => {
  const { currentProduct, repositories, userRole, productSlug } = props;
  const [tagType, setTagType] = useState("all");
  const [sortType, setSortType] = useState("initiatives");
  const [taskType, setTaskType] = useState("all");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

//   const params: any = matchPath(match.url, {
//     path: "/products/:productSlug/tasks",
//     exact: false,
//     strict: false
//   });
  const { data, error, loading, refetch } = useQuery(GET_TASKS_BY_PRODUCT, {
    variables: { productSlug }
  });

  const closeTaskModal = (flag: boolean) => {
    setShowAddTaskModal(flag);
    refetch({ productSlug });
  }

  const fetchTasks = async () => {
    await refetch({
      productSlug
    });
  }

  return (
    <LeftPanelContainer productSlug={productSlug}>
      <div>
        <Row>
          {(userRole === "Manager" || userRole === "Admin") && (
            <Col>
              <Button
                className="text-right add-task-btn mb-15"
                onClick={() => setShowAddTaskModal(true)}
              >
                Add Task
              </Button>
              <AddTask
                modal={showAddTaskModal}
                productSlug={productSlug}
                closeModal={closeTaskModal}
                tasks={data?.tasks}
                submit={fetchTasks}
              />
            </Col>
          )}
          <Col className="tag-section ml-auto">
            <div>
            <label className='mr-15'>Tags: </label>
              <Select
                defaultValue={tagType}
                style={{ width: 120 }}
                onChange={setTagType}
              >
                <Option value="all">All</Option>
                <Option value="django">Django</Option>
                <Option value="react">React</Option>
                <Option value="graphql">Graphql</Option>
              </Select>
            </div>
            <div className='ml-15'>
              <label className='mr-15'>Sorted by: </label>
              <Select
                defaultValue={sortType}
                style={{ width: 120 }}
                onChange={setSortType}
              >
                <Option value="initiatives">Number of initiatives</Option>
                <Option value="stroies">Number of tasks</Option>
              </Select>
            </div>
            <div className='ml-15'>
              <label className='mr-15'>Tasks: </label>
              <Select
                defaultValue={taskType}
                style={{ width: 120 }}
                onChange={setTaskType}
              >
                <Option value="all">All</Option>
                <Option value="django">Django</Option>
                <Option value="react">React</Option>
                <Option value="graphql">Graphql</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        {
          loading ? (
            <Spin size="large" />
          ) : data.tasks ? (
            <TaskTable
              hideTitle={true}
              tasks={data.tasks}
              productSlug={productSlug}
              statusList={data.statusList}
              showPendingTasks={userRole === "Manager" || userRole === "Admin"}
            />
          ) : (
            <h3 className="text-center mt-30">No tasks</h3>
          )
        }
      </div>
    </LeftPanelContainer>
  )
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct,
  repositories: state.work.repositories,
  userRole: state.work.userRole
});

const mapDispatchToProps = (dispatch: any) => ({
});

const TasksPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksPage);

TasksPageContainer.getInitialProps = async ({ query }) => {
    const { productSlug } = query;
    return { productSlug }
}
  
export default TasksPageContainer;
