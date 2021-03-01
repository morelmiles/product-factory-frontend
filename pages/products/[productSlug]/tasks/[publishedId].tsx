import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Divider, message, Comment, List, Tooltip, Form, Input, Button, Typography} from 'antd';
import Link from "next/link";
import {useRouter} from 'next/router';
import {useQuery, useMutation} from '@apollo/react-hooks';
import ReactPlayer from 'react-player'
import {GET_TASK_BY_ID} from '../../../../graphql/queries';
import {TASK_TYPES} from '../../../../graphql/types';
import {CLAIM_TASK, DELETE_TASK, LEAVE_TASK} from '../../../../graphql/mutations';
import {getProp} from '../../../../utilities/filters';
import {CustomAvatar, EditIcon, DynamicHtml} from '../../../../components';
// import AddTask from '../../../../components/Products/AddTask';
import {apiDomain} from "../../../../utilities/constants"
import DeleteModal from '../../../../components/Products/DeleteModal';
import moment from 'moment';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import Attachments from "../../../../components/Attachments";
import CustomModal from "../../../../components/Products/CustomModal";
import Priorities from "../../../../components/Priorities";
import Loading from "../../../../components/Loading";

interface CommentListProps {
  taskId: string | string[] | undefined,
  user: any,
}

interface AddCommentFormProps {
  taskId: string | string[] | undefined,
  user: any,
  onAdded: () => void,
  replyToID?: number,
}

const AddCommentForm: React.FunctionComponent<AddCommentFormProps> = ({taskId, replyToID = 0, onAdded}) => {
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  function handleCommentChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(event.target.value)
  }

  function submitComment() {
    setSubmittingComment(true);
    fetch(`${apiDomain}/comments/api/create/`, {
      method: 'POST',
      body: JSON.stringify({
        content_type: 'work.task',
        object_pk: taskId,
        text: comment,
        reply_to: replyToID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      if (response.status == 201) {
        setSubmittingComment(false)
        setComment('')
        onAdded();
      }
    })
  }

  return (
    <>
      <Form.Item className='mb-20'>
        <Input.TextArea rows={2} onChange={handleCommentChanged} value={comment}/>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submittingComment} onClick={submitComment} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  )
}

const CommentList: React.FunctionComponent<CommentListProps> = ({taskId, user}) => {
  const [comments, setComments] = useState([]);
  const [shownSubCommentID, setShownSubCommentID] = useState(0);

  const fetchComments = function () {
    fetch(`${apiDomain}/comments/api/list/?content_type=work.task&object_pk=${taskId}`)
      .then((response) => response.json())
      .then((commentsResponse) => {
        setComments(commentsResponse)
      })
  }

  const handleReplyToClicked = function (comment: any) {
    setShownSubCommentID(comment.id)
  }

  const handleSubCommentAdded = function () {
    setShownSubCommentID(0)
    fetchComments()
  }

  const SubCommentForm = function ({comment}: any) {
    if (shownSubCommentID != comment.id) {
      return null
    }

    return (
      <Row>
        <Col span={22} style={{marginLeft: "48px"}}>
          <AddCommentForm taskId={taskId} user={user} onAdded={handleSubCommentAdded} replyToID={comment.id}/>
        </Col>
      </Row>
    )
  }
  const RenderedComment = function ({comment}: any) {
    let renderedChildComments = [];

    if (comment.children) {
      renderedChildComments = comment.children.map((childComment: any) => (
        <>
          <RenderedComment comment={childComment}/>
        </>
      ))
    }

    return (
      <>
        <Row>
          <Col span={24}>
            <Comment
              author={comment.user_name}
              actions={[<span key="comment-nested-reply-to"
                              onClick={() => handleReplyToClicked(comment)}>Reply to</span>]}
              avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              content={<pre>{comment.text}</pre>}
              datetime={
                <Tooltip title={moment(comment.created).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment(comment.created).fromNow()}</span>
                </Tooltip>
              }>
              {renderedChildComments}
            </Comment>
          </Col>
        </Row>
        <SubCommentForm comment={comment}/>
      </>
    )
  }

  useEffect(() => {
    fetchComments()
  }, []);

  return (
    <>
      <List
        className="comment-list"
        header="Comments"
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item: any) => {
          return (
            <li>
              <RenderedComment comment={item}/>
            </li>
          )
        }
        }
      />
      {user && user.isLoggedIn ? <AddCommentForm taskId={taskId} user={user} onAdded={fetchComments}/> : <></>}
    </>
  )
}


type Params = {
  userRole?: string;
  user?: any;
  currentProduct: any;
};

const Task: React.FunctionComponent<Params> = ({userRole, user, currentProduct}) => {
  const router = useRouter();
  const {publishedId, productSlug} = router.query;

  const [deleteModal, showDeleteModal] = useState(false);
  const [leaveTaskModal, showLeaveTaskModal] = useState(false);
  const [task, setTask] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState(0);
  // const [showEditModal, setShowEditModal] = useState(false);

  const {data: original, error, loading, refetch} = useQuery(GET_TASK_BY_ID, {
    variables: {publishedId, productSlug, userId: userId == null ? 0 : userId}
  });

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  useEffect(() => {
    if (!error) {
      setTaskId(getProp(original, 'task.id', 0));
    }
  }, [original]);

  const getBasePath = () => {
    //fix it
    // if (match.url.includes("/products")) {
    //   const params: any = matchPath(match.url, {
    //     path: "/products/:productSlug/tasks/:taskId",
    //     exact: false,
    //     strict: false
    //   });

    return `/products/${productSlug}`;
    // }
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
      // console.log("Delete item error: ", err);
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

  const getCausedBy = () => {
    let status = TASK_TYPES[getProp(task, 'status')];

    switch (status) {
      case "Claimed":
        return "Proposed By";
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

  const showTaskEvents = () => {
    const assignee = getProp(task, 'assignedTo', null);
    const taskStatus = TASK_TYPES[getProp(task, 'status')];

    return (
      <Row className="text-sm">
        {assignee && taskStatus !== "Done" ? (
          <>
            {assignee.id === user.id
              ? (
                <div className="flex-column ml-auto">
                  <Button type="primary"
                          onClick={() => showLeaveTaskModal(true)}>Leave the task</Button>
                </div>
              )
              : null
            }
          </>
        ) : null}
        {taskStatus === "Available" && (
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
                    <a className="text-grey">{getProp(currentProduct, 'name', '')}</a>
                  </Link>
                  <span> / </span>
                  <Link href={`${getBasePath()}/tasks`}>
                    <a className="text-grey">Tasks</a>
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
                {(userRole === "Manager" || userRole === "Admin") ? (
                  <Col>
                    <Button
                      onClick={() => showDeleteModal(true)}
                    >
                      Delete
                    </Button>
                    <EditIcon
                      className="ml-10"
                      // onClick={() => setShowEditModal(true)}
                      onClick={() => {
                      }}
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
              <Col xs={24} md={14} className="pt-20">
                <DynamicHtml
                  text={getProp(task, 'description', '')}
                />
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
                            Status: {getCausedBy()}
                          </strong>
                          <div className='ml-5'>
                            {
                              getProp(task, 'createdBy', null) !== null
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
                          <Priorities task={task} submit={() => refetch()} />
                      </Row>
                  }
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
            {/*<TaskTable*/}
            {/*  title={'Dependant Tasks'}*/}
            {/*  tasks={getProp(task, 'dependOn', [])}*/}
            {/*  productSlug={getBasePath().replace("/products/", "")}*/}
            {/*  statusList={getProp(original, 'statusList', [])}*/}
            {/*/>*/}

            <Divider/>
            <CommentList taskId={publishedId} user={user}/>

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
                message="Are you really want to leave the task?"
                submitText="Yes, leave"
              />
            )}
            {/*{showEditModal && <AddTask*/}
            {/*    modal={showEditModal}*/}
            {/*    productSlug={getBasePath().replace("/products/", "")}*/}
            {/*    modalType={true}*/}
            {/*    closeModal={setShowEditModal}*/}
            {/*    task={task}*/}
            {/*    submit={fetchData}*/}
            {/*    tasks={tasks}*/}
            {/*/>*/}
            {/*}*/}
          </>
        )
      }
    </LeftPanelContainer>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole,
  currentProduct: state.work.currentProduct || {}
});

const mapDispatchToProps = () => ({});

const TaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);

export default TaskContainer;
