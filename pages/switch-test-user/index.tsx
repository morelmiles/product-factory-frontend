import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { GET_USERS } from '../../graphql/queries';
import { Row, Button, Select, message } from "antd";

// import { HeaderMenu } from 'navigation';
import { getProp } from '../../utilities/filters';
import { apiDomain } from '../../utilities/constants';
// import { userLogInAction } from '../../store/actions';
// import { UserState } from 'store/reducers/user.reducer';

const { Option } = Select;

type Props = {
  user: any;
  userLogInAction: any;
} & RouteComponentProps;

const TestUser: React.SFC<Props> = ({ history, location, match, userLogInAction, user }) => {
  const { data, error, loading } = useQuery(GET_USERS);
  const [userId, setUserId] = useState(0);

  const signIn = (userId: any) => {
    if (!userId || userId === 0) {
      message.warning("Please select user before clicking sign in button");
      return;
    }
    fetch(`${apiDomain}/github/detect_user/?user_id=${userId}`)
      .then(response => response.json())
      .then(res => {
        if (res.status) {
          message.success(`${res.user.fullName} is logged in successfully!`);
          userLogInAction({ isLoggedIn: res.status });
          localStorage.setItem("user_id", res.user.id);
          localStorage.setItem("fullName", res.user.fullName);
          history.push("/");
        } else {
          message.warning("User id is invalid!");
          userLogInAction({ isLoggedIn: false });
        }
      });
  }

  useEffect(() => {
    if (user && user.isLoggedIn && user.fullName) {
      message.success(`${user.fullName} is logged in!`);
    }
  }, []);

  return (
    <>
      {user && user.isLoggedIn && (
        <></>// <HeaderMenu history={history} location={location} match={match} />
      )}
      {(!user || !user.isLoggedIn) && !error && !loading && (
        <Row justify="center" className='mt-40'>
          <Select
            defaultValue={userId}
            style={{ minWidth: 120 }}
            onChange={(value: any) => setUserId(value)}
          >
            <Option value={0}>Select</Option>
            {getProp(data, 'people', []).map((person: any, idx: number) => person.id > 1 && (
              <Option key={idx} value={person.id}>{person.fullName}</Option>
            ))}
          </Select>
          <Button
            className='ml-15'
            onClick={() => signIn(userId)}
          >
            Sign in
          </Button>
        </Row>
      )}
    </>
  );
};

// const mapStateToProps = (state: any) => ({
//   user: state.user,
// });

// const mapDispatchToProps = (dispatch: any) => ({
//   userLogInAction: (data: UserState) => dispatch(userLogInAction(data))
// });

const TestUserContainer = connect(
  // mapStateToProps,
  // mapDispatchToProps
)(TestUser);

export default TestUserContainer;
