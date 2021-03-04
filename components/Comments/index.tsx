import React, {useState} from "react";
import {Avatar, Button, Comment, Form, Input} from "antd";
import {apiDomain} from "../../utilities/constants";
import {useQuery} from "@apollo/react-hooks";
import {GET_COMMENTS} from "../../graphql/queries";


interface IComment {
  children?: any
}

interface ICommentsProps {
  taskId: number
}

const ExampleComment: React.FunctionComponent<IComment> = ({children}) => (
  <Comment
    actions={[<span key="comment-nested-reply-to" onClick={() => {}}>Reply to</span>]}
    author={<a>John Smith</a>}
    avatar={
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="John Smith"
      />
    }
    content={
      <p>
        Test
      </p>
    }
  >
    {children}
  </Comment>
);

const AddComment: React.FunctionComponent = () => {
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // function handleCommentChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
  //   setComment(event.target.value)
  // }

  // function submitComment() {
  //   setSubmittingComment(true);
  //   fetch(`${apiDomain}/comments/api/create/`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       content_type: 'work.task',
  //       object_pk: taskId,
  //       text: comment,
  //       reply_to: replyToID
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(function (response) {
  //     if (response.status == 201) {
  //       setSubmittingComment(false)
  //       setComment('')
  //       onAdded();
  //     }
  //   })
  // }

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
  const {data: comments, error: commentsError, loading: commentsLoading} = useQuery(GET_COMMENTS, {
    variables: {taskId}
  });

  console.log('comments', comments);

  return (
    <>
      <ExampleComment>
        <ExampleComment>
          <ExampleComment/>
          <ExampleComment/>
        </ExampleComment>
      </ExampleComment>

      <AddComment/>
    </>
  )
};

export default Comments;