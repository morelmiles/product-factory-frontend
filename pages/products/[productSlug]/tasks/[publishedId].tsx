import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Divider, message, Button, Tag} from 'antd';
import Link from "next/link";
import {useRouter} from 'next/router';
import {useQuery, useMutation} from '@apollo/react-hooks';
import ReactPlayer from 'react-player'
import {GET_PRODUCT_INFO_BY_ID, GET_TASK_BY_ID, GET_TASKS_BY_PRODUCT_SHORT} from '../../../../graphql/queries';
import {TASK_TYPES} from '../../../../graphql/types';
import {CLAIM_TASK, DELETE_TASK, IN_REVIEW_TASK, LEAVE_TASK} from '../../../../graphql/mutations';
import {getProp} from '../../../../utilities/filters';
import {CustomAvatar, EditIcon, TaskTable} from '../../../../components';
import DeleteModal from '../../../../components/Products/DeleteModal';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import Attachments from "../../../../components/Attachments";
import CustomModal from "../../../../components/Products/CustomModal";
import Priorities from "../../../../components/Priorities";
import Loading from "../../../../components/Loading";
import parse from "html-react-parser";
import CheckableTag from "antd/lib/tag/CheckableTag";
import {getUserRole, hasManagerRoots} from "../../../../utilities/utils";
import AddTaskContainer from "../../../../components/Products/AddTask";
import Comments from "../../../../components/Comments";


type Params = {
  user?: any;
  currentProduct: any;
};

const Task: React.FunctionComponent<Params> = ({user, currentProduct}) => {
  const router = useRouter();
  const {publishedId, productSlug} = router.query;

  const [deleteModal, showDeleteModal] = useState(false);
  const [leaveTaskModal, showLeaveTaskModal] = useState(false);
  const [reviewTaskModal, showReviewTaskModal] = useState(false);
  const [task, setTask] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const {data: original, error, loading, refetch} = useQuery(GET_TASK_BY_ID, {
    variables: {publishedId, productSlug, userId: userId == null ? 0 : userId}
  });


  const {data: tasksData} = useQuery(GET_TASKS_BY_PRODUCT_SHORT, {
    variables: {
      productSlug, input: {},
      userId: user.id
    }
  });

  const userRole = getUserRole(user.roles, productSlug);
  const userHasManagerRoots = hasManagerRoots(userRole);

  let {data: product} = useQuery(GET_PRODUCT_INFO_BY_ID, {variables: {slug: productSlug}});
  product = product?.product || {};

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  useEffect(() => {
    if (tasksData && tasksData.tasksByProduct) {
      setTasks(tasksData.tasksByProduct)
    }
  }, [tasksData])

  useEffect(() => {
    if (!error) {
      setTaskId(getProp(original, 'task.id', 0));
    }
  }, [original]);

  const getBasePath = () => {
    return `/products/${productSlug}`;
  }

  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: {
      id: taskId
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      router.push(getBasePath() === "" ? "/" : `${getBasePath()}/tasks`).then();
    },
    onError() {
      message.error("Failed to delete item!").then();
    }
  });

  const [leaveTask] = useMutation(LEAVE_TASK, {
    variables: {
      taskId,
      userId: user.id
    },
    onCompleted(data) {
      const {leaveTask} = data;
      const responseMessage = leaveTask.message;
      if (leaveTask.success) {
        message.success(responseMessage).then();
        fetchData().then();
        showLeaveTaskModal(false);
      } else {
        message.error(responseMessage).then();
      }
    },
    onError() {
      message.error("Failed to leave a task!").then();
    }
  });

  const [submitTask] = useMutation(IN_REVIEW_TASK, {
    variables: {
      taskId,
      userId: user.id
    },
    onCompleted(data) {
      const {inReviewTask} = data;
      const responseMessage = inReviewTask.message;
      if (inReviewTask.success) {
        message.success(responseMessage).then();
        fetchData().then();
        showReviewTaskModal(false);
      } else {
        message.error(responseMessage).then();
      }
    },
    onError() {
      message.error("Failed to submit the task in review!").then();
    }
  });

  const [claimTask] = useMutation(CLAIM_TASK, {
    variables: {
      taskId,
      userId: user.id
    },
    onCompleted(data) {
      const {claimTask} = data;
      const responseMessage = claimTask.message;
      if (claimTask.success) {
        message.success(responseMessage).then();
        fetchData().then();
      } else {
        message.error(responseMessage).then();
      }
    },
    onError() {
      message.error("Failed to claim a task!").then();
    }
  });

  const claimTaskEvent = () => {
    if (user.id === undefined) {
      message.error("You cannot claim the task, please authenticate to the system").then()
      return
    }

    claimTask().then();
  }

  const getCausedBy = (assignedTo: any) => {
    let status = TASK_TYPES[getProp(task, 'status')];

    switch (status) {
      case "Claimed":
        return assignedTo ? status : "Proposed By";
      case "Done":
        return "Done By";
      default:
        return status;
    }
  }

  const fetchData = async () => {
    const data: any = await refetch()

    if (!data.errors) {
      setTask(data.data.task);
    }
  }

  useEffect(() => {
    if (original) {
      setTask(getProp(original, 'task', {}));
    }
  }, [original]);

  if (loading) return <Loading/>

  const showAssignedUser = () => {
    const assignee = getProp(task, 'assignedTo', null);
    return (
      <Row className="text-sm mb-10">
        {assignee ? (
          <>
            {assignee.id === user.id
              ? (
                <div className="flex-column">
                  <strong className="my-auto">Assigned to you</strong>
                </div>
              )
              : (<>
                <strong className="my-auto">Assigned to: </strong>
                <div className="ml-12">
                  {CustomAvatar(
                    assignee,
                    "fullName",
                    "default",
                    null,
                    {margin: 'auto 8px auto 0'}
                  )
                  }
                </div>
                <div className="my-auto">
                  <Link href={`/people/${getProp(assignee, 'slug', '')}`}>
                    <a className="text-grey-9">{getProp(assignee, 'fullName', '')}</a>
                  </Link>
                </div>
              </>)
            }
          </>
        ) : null}
      </Row>
    )
  }

  const assignedTo = getProp(task, 'assignedTo');
  const stacks = getProp(task, 'stack', []);
  const tags = getProp(task, 'tag', []);

  const showTaskEvents = () => {
    const assignee = getProp(task, 'assignedTo', null);
    const taskStatus = TASK_TYPES[getProp(task, 'status')];
    const inReview = getProp(task, 'inReview', false);

    return (
      <Row className="text-sm">
        {assignee && taskStatus !== "Done" ? (
          <>
            {assignee.id === user.id
              ? (
                <div className="flex-column ml-auto">
                  {inReview ? <div className="mb-10">The task is submitted for review</div> : (
                    <Button type="primary"
                            className="mb-10"
                            onClick={() => showReviewTaskModal(true)}>Submit for review</Button>
                  )}
                  <Button type="primary"
                          onClick={() => showLeaveTaskModal(true)}>Leave the task</Button>
                </div>
              )
              : null
            }
          </>
        ) : null}
        {(taskStatus === "Available" && userRole === "Contributor") && (
          <>
            <div className="flex-column ml-auto">
              <Button type="primary"
                      onClick={() => claimTaskEvent()}>Claim the task</Button>
            </div>
          </>
        )}
      </Row>
    )
  }


  return (
    <LeftPanelContainer>
      {
        !error && (
          <>
            <div className="text-grey">
              {getBasePath() !== "" && (
                <>
                  <Link href={getBasePath()}>
                    <a className="text-grey">{getProp(product, 'name', '')}</a>
                  </Link>
                  <span> / </span>
                  <Link href={`${getBasePath()}/tasks`}>
                    <a className="text-grey">Tasks</a>
                  </Link>
                  <span> / </span>
                  <Link
                    href={`/products/${getProp(product, 'slug', '')}/initiatives/${getProp(task, 'initiative.id', '')}`}>
                    <a className="text-grey">{getProp(task, 'initiative.name', '')}</a>
                  </Link>
                  <span> / </span>
                </>
              )}
              <span>{getProp(original, 'task.title', '')}</span>
            </div>
            <Row
              justify="space-between"
              className="right-panel-headline strong-height"
            >
              <Col md={16}>
                <div className="section-title">
                  {getProp(task, 'title', '')}
                </div>
              </Col>
              <Col md={8} className="text-right">
                {userHasManagerRoots ? (
                  <Col>
                    <Button
                      onClick={() => showDeleteModal(true)}
                    >
                      Delete
                    </Button>
                    <EditIcon
                      className="ml-10"
                      onClick={() => setShowEditModal(true)}
                    />
                  </Col>
                ) : showTaskEvents()}
              </Col>


            </Row>
            <Row>
              {getProp(task, 'videoUrl', null) && (
                <Col>
                  <ReactPlayer
                    width="100%"
                    height="170px"
                    className="mr-10"
                    url={getProp(task, 'videoUrl')}
                  />
                </Col>
              )}
              <Col xs={24} md={18} className="pt-20">
                {parse(getProp(task, 'description', ''))}
                <div className="mt-22">
                  {showAssignedUser()}
                  <Row className="text-sm">
                    <strong className="my-auto">Created By: </strong>
                    <div className="ml-12">
                      {
                        getProp(task, 'createdBy', null) !== null
                          ? CustomAvatar(
                          getProp(task, 'createdBy'),
                          "fullName",
                          "default",
                          null,
                          {margin: 'auto 8px auto 0'}
                          )
                          : null
                      }
                    </div>
                    <div className="my-auto">
                      <Link href={`/people/${getProp(task, 'createdBy.slug', '')}`}>
                        <a className="text-grey-9">{getProp(task, 'createdBy.fullName', '')}</a>
                      </Link>
                    </div>
                  </Row>

                  <Row className="text-sm mt-8">
                    {
                      (
                        TASK_TYPES[getProp(task, 'status')] === "Available" ||
                        TASK_TYPES[getProp(task, 'status')] === "Draft" ||
                        TASK_TYPES[getProp(task, 'status')] === "Pending"
                      ) ? (
                        <strong className="my-auto">
                          Status: {TASK_TYPES[getProp(task, 'status')]}
                        </strong>
                      ) : (
                        <>
                          <strong className="my-auto">
                            Status: {getCausedBy(assignedTo)}
                          </strong>
                          <div className='ml-5'>
                            {
                              getProp(task, 'createdBy', null) !== null && !assignedTo
                                ? (
                                  <Row>
                                    {
                                      CustomAvatar(
                                        getProp(task, 'createdBy'),
                                        "fullName"
                                      )
                                    }
                                    <div className="my-auto">
                                      {
                                        getProp(
                                          getProp(task, 'createdBy'),
                                          'fullName',
                                          ''
                                        )
                                      }
                                    </div>
                                  </Row>
                                ) : null
                            }
                          </div>
                        </>
                      )
                    }
                  </Row>
                  {
                    getProp(task, 'priority', null) &&
                    <Row style={{marginTop: 10}} className="text-sm mt-8">
                        <strong className="my-auto">Priority:&nbsp;</strong>
                        <Priorities task={task} submit={() => refetch()}/>
                    </Row>
                  }
                  {stacks.length > 0 && (
                    <Row style={{marginTop: 10}} className="text-sm mt-8 tag-bottom-0">
                      <strong className="my-auto">Stacks:&nbsp;</strong>
                      {stacks.map((tag: any, taskIndex: number) =>
                        <CheckableTag key={`tag-${taskIndex}`} checked={true}>{tag.name}</CheckableTag>
                      )}
                    </Row>
                  )}

                  {tags.length > 0 && (
                    <Row style={{marginTop: 10}} className="text-sm mt-8 tag-bottom-0">
                      <strong className="my-auto">Tags:&nbsp;</strong>
                      {tags.map((tag: any, taskIndex: number) =>
                        <Tag key={`stack-${taskIndex}`}>{tag.name}</Tag>
                      )}
                    </Row>
                  )}

                  {
                    getProp(task, 'capability.id', null) && (
                      <Row
                        className="text-sm mt-8"
                      >
                        <strong className="my-auto">
                          Related Capability:
                        </strong>
                        <Link href={`${getBasePath()}/capabilities/${getProp(task, 'capability.id')}`}>
                          <a className="ml-5">{getProp(task, 'capability.name', '')}</a>
                        </Link>
                      </Row>
                    )
                  }
                </div>
              </Col>
            </Row>

            <TaskTable
              title={'Dependant Tasks'}
              tasks={getProp(task, 'dependOn', [])}
              productSlug={String(productSlug)}
              hideEmptyList={true}
              statusList={getProp(original, 'statusList', [])}
              submit={() => {
              }}
            />

            <Divider style={{marginTop: 50}}/>
            <Comments taskId={getProp(task, 'id', 0)}/>

            <Attachments data={getProp(original, 'task.attachment', [])}/>

            {deleteModal && (
              <DeleteModal
                modal={deleteModal}
                productSlug={''}
                closeModal={() => showDeleteModal(false)}
                submit={deleteTask}
                title='Delete task'
              />
            )}
            {leaveTaskModal && (
              <CustomModal
                modal={leaveTaskModal}
                productSlug={''}
                closeModal={() => showLeaveTaskModal(false)}
                submit={leaveTask}
                title="Leave the task"
                message="Do you really want to leave the task?"
                submitText="Yes, leave"
              />
            )}
            {reviewTaskModal && (
              <CustomModal
                modal={reviewTaskModal}
                productSlug={''}
                closeModal={() => showReviewTaskModal(false)}
                submit={submitTask}
                title="Submit for review"
                message="Do you really want to submit the task for review?"
                submitText="Yes, submit"
              />
            )}
            {showEditModal && <AddTaskContainer
                modal={showEditModal}
                productSlug={String(productSlug)}
                modalType={true}
                closeModal={setShowEditModal}
                task={task}
                submit={fetchData}
                tasks={tasks}
            />
            }
          </>
        )
      }
    </LeftPanelContainer>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct || {}
});

const mapDispatchToProps = () => ({});

const TaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);

export default TaskContainer;
