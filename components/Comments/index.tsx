import React, {useEffect, useState} from "react";
import {Avatar, Button, Comment, Form, Input} from "antd";
import {apiDomain} from "../../utilities/constants";
import {useQuery} from "@apollo/react-hooks";
import {GET_COMMENTS} from "../../graphql/queries";
import {getProp} from "../../utilities/filters";


interface ICommentContainerProps {
  children?: any,
  personId: number,
  text: string
}

interface ICommentsProps {
  taskId: number
}

const CommentContainer: React.FunctionComponent<ICommentContainerProps> = ({children, personId, text}) => (
  <Comment
    actions={[<span key="comment-nested-reply-to" onClick={() => {}}>Reply to</span>]}
    author={<a>John Smith {personId}</a>}
    avatar={
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="John Smith"
      />
    }
    content={
      <p>{text}</p>
    }
  >
    {children}
  </Comment>
);

const AddComment: React.FunctionComponent = () => {
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  return (
    <>
      <Form.Item className='mb-20'>
        {/*<Input.TextArea rows={2} onChange={handleCommentChanged} value={comment}/>*/}
        <Input.TextArea rows={2} value={comment}/>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submittingComment} onClick={() => {
        }} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  )
}

const Comments: React.FunctionComponent<ICommentsProps> = ({taskId}) => {
  const {data, error} = useQuery(GET_COMMENTS, {
    variables: {taskId}
  });

  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!error) {
      // setComments(JSON.parse(getProp(data, 'comments', {})))
      let fetchComments = getProp(data, 'comments', '[]');
      fetchComments = JSON.parse(fetchComments);
      fetchComments = getProp(fetchComments[0], 'children', [])
      setComments(fetchComments)
    }
  }, data);

  console.log('comm', comments);

  return (
    <>
      {/*{*/}
      {/*  comments.map((comment: any) => (*/}
      {/*    <>*/}
      {/*      <p>{comment.data.text}</p>*/}
      {/*    </>*/}
      {/*  ))*/}
      {/*}*/}

      {/*<CommentContainer>*/}
      {/*  <CommentContainer>*/}
      {/*    <CommentContainer/>*/}
      {/*    <CommentContainer/>*/}
      {/*  </CommentContainer>*/}
      {/*</CommentContainer>*/}

      <AddComment/>
    </>
  )
};

export default Comments;