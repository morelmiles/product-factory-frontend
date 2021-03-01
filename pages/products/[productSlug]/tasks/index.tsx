import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Select, Spin, Button} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {GET_TAGS, GET_TASKS_BY_PRODUCT} from '../../../../graphql/queries';
import {TaskTable} from '../../../../components';
import AddTask from '../../../../components/Products/AddTask';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import {useRouter} from "next/router";
import {TASK_LIST_TYPES} from "../../../../graphql/types";
import {getProp} from "../../../../utilities/filters";
import Loading from "../../../../components/Loading";

const {Option} = Select;

type Props = {
  onClick?: () => void;
  userRole: string;
  productSlug: string;
};

const TasksPage: React.FunctionComponent<Props> = (props: Props) => {
  const router = useRouter()
  const {productSlug} = router.query
  const {userRole} = props;
  const [tags, setTags] = useState([]);
  const [sortedBy, setSortedBy] = useState("priority");
  const [statuses, setStatuses] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const productsVariable = {
    productSlug,
    userId: userId == null ? 0 : userId,
    input: {sortedBy, statuses, tags}
  };

  let {data, error, loading, refetch} = useQuery(GET_TASKS_BY_PRODUCT, {
    variables: productsVariable
  });

  const closeTaskModal = (flag: boolean) => {
    setShowAddTaskModal(flag);
    refetch(productsVariable);
  };

  const tagsData = useQuery(GET_TAGS);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const fetchTasks = async () => {
    await refetch(productsVariable);
  }

  if (loading) return <Loading/>;

  return (
    <LeftPanelContainer>
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
                closeModal={closeTaskModal}
                tasks={data?.tasks}
                submit={fetchTasks}
              />
            </Col>
          )}
          <Col className="tag-section ml-auto">
            <div>
              <label className='mr-15'>Tags: </label><br/>
              <Select
                defaultValue={tags}
                mode="multiple"
                placeholder="Select tags"
                style={{minWidth: 120}}
                onChange={(value: any[]) => setTags(value)}
              >
                {tagsData?.data ? tagsData.data.tags.map((tag: { id: string, name: string }) =>
                  <Option key={tag.id} value={tag.id}>{tag.name}</Option>) : []}
              </Select>
            </div>
            <div className='ml-15'>
              <label className='mr-15'>Sorted by: </label><br/>
              <Select
                defaultValue={sortedBy}
                style={{width: 150}}
                onChange={(value: string) => setSortedBy(value)}
              >
                <Option value="title">Name</Option>
                <Option value="priority">Priority</Option>
                <Option value="status">Status</Option>
              </Select>
            </div>
            <div className='ml-15'>
              <label className='mr-15'>Status: </label>
              <Select
                value={statuses}
                style={{minWidth: 120}}
                mode="multiple"
                placeholder="Select statuses"
                onChange={(value: any[]) => setStatuses(value)}
              >
                {TASK_LIST_TYPES.map((option: { id: number, name: string }) => (
                  <Option key={`status-${option.id}`} value={option.id}>{option.name}</Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        {
          !error ?
            <TaskTable submit={() => refetch(productsVariable)}
                       tasks={getProp(data, 'tasksByProduct', [])}
                       statusList={getProp(data, 'statusList', [])}
                       showInitiativeName={true}
                       hideTitle={true}
                       showPendingTasks={userRole === "Manager" || userRole === "Admin"}
            /> : (
              <h3 className="text-center mt-30">No tasks</h3>
            )
        }
      </div>
    </LeftPanelContainer>
  )
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole
});

const mapDispatchToProps = (dispatch: any) => ({});

const TasksPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksPage);

export default TasksPageContainer;
