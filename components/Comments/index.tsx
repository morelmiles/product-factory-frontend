import React, {useEffect, useState} from "react";
import {Button, Comment, Form, Mentions, message, Modal} from "antd";
import {GET_COMMENTS, GET_USERS} from "../../graphql/queries";
import {getProp} from "../../utilities/filters";
import CustomAvatar2 from "../CustomAvatar2";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {CREATE_COMMENT} from "../../graphql/mutations";
import Link from "next/link";


const {Option} = Mentions;


interface IUser {
  slug: string
}

interface ICommentContainerProps {
  comments: IComment[]
  submit: Function
  allUsers: IUser[]
}

interface ICommentsProps {
  taskId: number
}

interface IAddCommentProps {
  taskId: number
  submit: Function
  allUsers: IUser[]
}

interface IComment {
  id: number
  data: {
    person: {
      fullname: string
      slug: string
    }
    text: string
  }
  children: IComment[]
}


const CommentContainer: React.FunctionComponent<ICommentContainerProps> = ({comments, submit, allUsers}) => {
  const [createComment] = useMutation(CREATE_COMMENT, {
      onCompleted(res) {
        if (getProp(res, 'createComment.status', false)) {
          submit();
          setIsModalVisible(false);
          setCommentText('');
          message.success('Comment was sent').then();
        } else {
          message.error("Failed to send comment").then();
        }
      },
      onError() {
        message.error("Failed to send comment").then();
      }
    }
  );

  const addComment = () => {
    createComment({
      variables: {
        personId: localStorage.getItem('userId'), text: commentText, parentId: currentCommentId
      }
    }).then();
  }

  const closeModal = () => {
    setIsModalVisible(false);
    setCommentText('');
  }

  const [commentText, setCommentText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentCommentId, setCurrentCommentId] = useState<number>(0);

  const openSendSubCommentModal = (commentId: number) => {
    setIsModalVisible(true);
    setCurrentCommentId(commentId);
  }

  return (
    <>
      {
        comments.map((comment: IComment) => (
          <Comment
            actions={[<span key="comment-nested-reply-to" onClick={() => {
              openSendSubCommentModal(comment.id)
            }}>Reply to</span>]}
            author={<Link href={`/people/${comment.data.person.slug}`}>{comment.data.person.fullname}</Link>}
            avatar={
              <CustomAvatar2 person={comment.data.person}/>
            }
            content={
              <p>{comment.data.text}</p>
            }
          >
            <CommentContainer comments={getProp(comment, 'children', [])} submit={submit} allUsers={allUsers}/>
          </Comment>
        ))
      }

      <Modal title="Reply to comment" visible={isModalVisible} onOk={addComment} onCancel={closeModal}>
        <Mentions rows={2} onChange={val => setCommentText(val)} value={commentText}>
          {
            allUsers.map(user => (
              <Option value={user.slug}>{user.slug}</Option>
            ))
          }
        </Mentions>
      </Modal>
    </>
  )
};

const AddComment: React.FunctionComponent<IAddCommentProps> = ({taskId, submit, allUsers}) => {
  const [createComment] = useMutation(CREATE_COMMENT, {
      onCompleted(res) {
        if (getProp(res, 'createComment.status', false)) {
          submit();
          setCommentText('');
          message.success('Comment was sent').then();
        } else {
          message.error("Failed to send comment").then();
        }
      },
      onError() {
        message.error("Failed to send comment").then();
      }
    }
  );
  const [commentText, setCommentText] = useState('');

  const addComment = () => {
    createComment({
      variables: {
        personId: localStorage.getItem('userId'), text: commentText, taskId
      }
    }).then();
  }

  return (
    <>
      <Form.Item>
        <Mentions rows={2} onChange={val => setCommentText(val)} value={commentText}>
          {
            allUsers.map(user => (
              <Option value={user.slug}>{user.slug}</Option>
            ))
          }
        </Mentions>
      </Form.Item>
      <Form.Item>
        <Button onClick={addComment} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  )
}

const Comments: React.FunctionComponent<ICommentsProps> = ({taskId}) => {
  const {data, error, loading, refetch} = useQuery(GET_COMMENTS, {
    variables: {taskId}
  });
  const {data: users} = useQuery(GET_USERS);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!error && !loading) {
      let fetchComments = getProp(data, 'comments', '[]');
      fetchComments = JSON.parse(fetchComments);
      setComments(fetchComments)
      console.log(fetchComments)
    }

  }, [data]);

  const allUsers = getProp(users, 'people', []);

  return (
    <>
      <CommentContainer comments={comments} submit={refetch} allUsers={allUsers}/>
      <AddComment taskId={taskId} submit={refetch} allUsers={allUsers}/>
    </>
  )
};

export default Comments;