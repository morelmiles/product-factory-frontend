
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Divider, message, Comment, List, Tooltip, Form, Input, Button } from 'antd';
import Link from "next/link";
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ReactPlayer from 'react-player'
import { GET_TASK_BY_ID, GET_TASKS_BY_PRODUCT } from '../../graphql/queries';
import { TASK_TYPES } from '../../graphql/types';
import { DELETE_TASK } from '../../graphql/mutations';
import { getProp } from '../../utilities/filters';
import { CustomAvatar, EditIcon, DynamicHtml, TaskTable, Spinner, ContainerFlex } from '../../components';
import HeaderMenu from '../../components/Header';
import AddTask from '../../components/Products/AddTask';
import { apiDomain } from "../../utilities/constants"
import DeleteModal from '../../components/Products/DeleteModal';
import ImageIcon from '../../public/assets/icons/image.svg';
import PDFIcon from '../../public/assets/icons/pdf.svg';
import DocIcon from '../../public/assets/icons/doc.svg';
import DownloadIcon from '../../public/assets/icons/download.svg';
import moment from 'moment';
import LeftPanelContainer from '../../components/HOC/withLeftPanel';
import { Layout } from 'antd';
const { Content } = Layout;

interface CommentListProps {
  user: any;
}

interface AddCommentFormProps {
  user: any
  onAdded: () => void
  replyToID?: number
}

const AddCommentForm = function({ taskId, user, replyToID = 0, onAdded }: AddCommentFormProps) {
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
    }).then(function(response) {
      if (response.status == 201) {
        setSubmittingComment(false)
        setComment('')
        onAdded()
      }
    })
  }
  return (
    <>
      <Form.Item className='mb-20'>
        <Input.TextArea rows={2} onChange={handleCommentChanged} value={comment} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submittingComment} onClick={submitComment} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  )
}

const CommentList = function({ taskId, user }: CommentListProps) {
  const [comments, setComments] = useState([]);
  const [shownSubCommentID, setShownSubCommentID] = useState(0)
  const fetchComments = function() {
    fetch(`${apiDomain}/comments/api/list/?content_type=work.task&object_pk=${taskId}`)
      .then((response) => response.json())
      .then((commentsResponse) => {
        setComments(commentsResponse)
      })
  }
  const handleReplyToClicked = function(comment: any) {
    setShownSubCommentID(comment.id)
  }
  const handleSubCommentAdded = function() {
    setShownSubCommentID(0)
    fetchComments()
  }
  const SubCommentForm = function({ comment }: any) {
    if (shownSubCommentID != comment.id) {
      return null
    }
    return (
      <Row>
        <Col span={22} style={{marginLeft: "48px"}}>
          <AddCommentForm taskId={taskId} user={user} onAdded={handleSubCommentAdded} replyToID={comment.id} />
        </Col>
      </Row>
    )
  }
  const RenderedComment = function({ comment }: any) {
    let renderedChildComments = []
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
              actions={[<span key="comment-nested-reply-to" onClick={() => handleReplyToClicked(comment)}>Reply to</span>]}
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
  }, [])
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
  productSlug?: any;
  taskId?: any;
  userRole?: string;
  user?: any;
  currentProduct: any;
};

const Icon = (fileType: any) => {
  switch(fileType) {
    case "doc":
      return <img src={DocIcon} alt="No doc" />
    case "pdf":
      return <img src={PDFIcon} alt="No pdf" />
    default:
      return <img src={ImageIcon} alt="No attachment" />
  }
}

const Task: React.FunctionComponent<Params> = ({ productSlug, taskId, userRole, user, currentProduct = {} }) => {
  const router = useRouter();
  const [deleteModal, showDeleteModal] = useState(false);
  const [task, setTask] = useState({});
  const [tasks, setTasks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: original, error, loading, refetch } = useQuery(GET_TASK_BY_ID, {
    variables: { id: taskId }
  });

  console.log('currentProduct',currentProduct)
  const getBasePath = () => {
      //TODO: fix it
    // if (match.url.includes("/products")) {
    //   const params: any = matchPath(match.url, {
    //     path: "/products/:productSlug/tasks/:taskId",
    //     exact: false,
    //     strict: false
    //   });

      return `/products/${productSlug}`;
    // }
    return "";
  }

  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: {
      id: taskId
    },
    onCompleted() {
      message.success("Item is successfully deleted!");
      router.push(getBasePath() === "" ? "/" : `${getBasePath()}/tasks` );
    },
    onError(err) {
      console.log("Delete item error: ", err);
      message.error("Failed to delete item!");
    }
  });

  const { data: tasksData } = useQuery(GET_TASKS_BY_PRODUCT, {
    variables: { productSlug: getBasePath().replace("/products/", "") }
  });

  // const taskclaimSet = getProp(data, 'task.taskclaimSet', null)
  //   ? getProp(data, 'task.taskclaimSet', null)[0]
  //   : null;

  const getCausedBy = () => {
    const status = TASK_TYPES[getProp(task, 'status')];
    switch(status) {
      case "Claimed":
        return "Proposed By";
      case "Done":
        return "Done By";
      default:
        return status;
    }
  }

  const fetchData = async () => {
    const data: any = await refetch({
      id: taskId
    })

    if (!data.errors) {
      setTask(data.data.task);
    }
  }

  useEffect(() => {
    if (original) {
      setTask(original.task);
    }
    if (tasksData) {
      setTasks(tasksData.tasks);
    }
  }, [original]);

  if(loading) return <Spinner/>

  return (
    <ContainerFlex>
    <Layout>
      <HeaderMenu/>
      <Content className="container main-page">
      {
        !error && (
          <>
            <div className="text-grey">
              {getBasePath() !== "" && (
                <>
                  <Link
                    href={getBasePath()}
                    className="text-grey"
                  >
                    {getProp(currentProduct, 'name', '')}
                  </Link>
                  <span> / </span>
                  <Link
                    href={`${getBasePath()}/tasks`}
                    className="text-grey"
                  >
                    Tasks
                  </Link>
                  <span> / </span>
                </>
              )}
              <span>{getProp(task, 'title', '')}</span>
            </div>
            <Row
              justify="space-between"
              className="right-panel-headline"
            >
              <div className="section-title">
                {getProp(task, 'title', '')}
              </div>
              {(userRole === "Manager" || userRole === "Admin") && (
                <Col>
                  <Button
                    onClick={() => showDeleteModal(true)}
                  >
                    Delete
                  </Button>
                  <EditIcon
                    className='ml-10'
                    onClick={() => setShowEditModal(true)}
                  />
                </Col>
              )}
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
              <Col xs={24} md={10}>
                <DynamicHtml
                  text={getProp(task, 'description', '')}
                />
                <Row
                  className="text-sm mt-22"
                  >
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
                    <Link
                      href={`/people/${getProp(task, 'createdBy.slug', '')}`}
                      className="text-grey-9"
                    >
                      {getProp(task, 'createdBy.fullName', '')}
                    </Link>
                  </div>
                </Row>
                <Row
                  className="text-sm mt-8"

                >
                  {(
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
                  )}
                </Row>
                {getProp(task, 'capability.id', null) && (
                  <Row
                    className="text-sm mt-8"
                  >
                    <strong className="my-auto">
                      Related Capability:
                    </strong>
                    <Link
                      href={`${getBasePath()}/capabilities/${getProp(task, 'capability.id')}`}
                      className='ml-5'
                    >
                      {getProp(task, 'capability.name', '')}
                    </Link>
                  </Row>
                )}
              </Col>
            </Row>
            <TaskTable
              title={'Dependant Tasks'}
              tasks={getProp(task, 'dependOn', [])}
              productSlug={getBasePath().replace("/products/", "")}
              statusList={getProp(original, 'statusList', [])}
            />
            <Divider />
            <CommentList user={user} />
            <Row>
              {/* <Col span={16}>
                <div className="attachment-item" style={{padding: '24px'}}>
                  <div className="section-title" style={{paddingBottom: '24px'}}>Attachments</div>
                  {
                    getProp(data, 'task.attachment', []).map((item: any) => (
                      <Row justify="space-between" style={{paddingBottom: '15px'}}>
                        <Col>
                          <Row>
                            <Col>{Icon(item.fileType)}</Col>
                            <Col className="attachment-item__text">{getProp(item, 'name', '')}</Col>
                          </Row>
                        </Col>
                        <Col>
                          <Row>
                            <Col className="attachment-item__text">{getProp(item, 'fileSize', '412kb')}</Col>
                            <Col>
                              <img src={DownloadIcon} alt="No download icon" />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ))
                  }
                </div>
              </Col> */}
            </Row>
            {deleteModal && (
              <DeleteModal
                modal={deleteModal}
                productSlug={""}
                closeModal={() => showDeleteModal(false)}
                submit={deleteTask}
                title="Delete task"
              />
            )}
            { showEditModal && <AddTask
                modal={showEditModal}
                productSlug={getBasePath().replace("/products/", "")}
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
    </Content>
    </Layout>
    </ContainerFlex>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole,
  currentProduct: state.work.currentProduct || {}
});

const mapDispatchToProps = (dispatch: any) => ({
});

const TaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);

TaskContainer.getInitialProps = async ({ query, ...rest }) => {
  const { taskId, productSlug } = query;
  return { taskId, productSlug };
}
export default TaskContainer;
