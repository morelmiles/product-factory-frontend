import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Layout, Menu, Input, Button, message} from 'antd';
import {userLogInAction} from '../../lib/actions';
import {UserState} from '../../lib/reducers/user.reducer';
import {apiDomain} from '../../utilities/constants';
// @ts-ignore
import Logo from '../../public/assets/logo.svg';
import {useRouter} from 'next/router'
import Link from 'antd/lib/typography/Link';
import {useQuery} from "@apollo/react-hooks";
import {GET_PERSON} from "../../graphql/queries";
import {USER_ROLES} from "../../graphql/types";

const {Header} = Layout;
const {Search} = Input;

type Props = {
  user?: any;
  userLogInAction?: any;
};

const HeaderMenuContainer: React.FunctionComponent<Props> = ({user, userLogInAction}) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const onSearch = (e: any) => {
    // console.log("search submitted: ", e);
  }
  const getSelectedItem = () => {
    switch (router.asPath) {
      case "/product/add":
        return "2";
      case "/profiles":
        return "3";
      default:
        return "1";
    }
  }

  const {data: personData} = useQuery(GET_PERSON, {variables: {id: userId}})

  useEffect(() => {
    let userId = localStorage.getItem("userId")
    if (localStorage.getItem("userId")) {
      userLogInAction({isLoggedIn: true, id: userId});
      setUserId(userId)
    }
  }, []);

  useEffect(() => {
    if (personData && personData.person) {
      const {person} = personData;
      console.log('sfsdf', person);
      userLogInAction({
        isLoggedIn: true,
        fullName: person.fullName,
        slug: person.slug,
        id: person.id,
        roles: person.productpersonSet.map((role: any) => {
          return {
            product: role.product.slug,
            role: USER_ROLES[role.right]
          }
        })
      })
    }
  }, [personData])

  const logout = () => {
    fetch(`${apiDomain}/github/logout`)
      .then(response => response.json())
      .then(res => {
        if (res.status) {
          message.success(`You are logged out !`).then();
          userLogInAction({isLoggedIn: false});
          localStorage.removeItem('userId');
          localStorage.removeItem('fullName');
          router.push("/switch-test-user").then();
        }
      });
  }

  const selectedItem = getSelectedItem();

  return (
    <Header className="global-header">
      <div className="inner-navbar">
        <Menu className="header-menu" mode="horizontal" defaultSelectedKeys={[selectedItem]}>
          <Menu.Item key="1">
            <Link href="/" className={selectedItem === "1" ? "active" : ""}>
              {'Work on Open Products'}
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/product/add" className={selectedItem === "2" ? "active" : ""}>
              {'Add Product'}
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="" className={selectedItem === "3" ? "active" : ""}>
              {'Find Talent'}
            </Link>
          </Menu.Item>
        </Menu>
        <div className="logo-section">
          <Link href="/">
            <img src={Logo} alt="logo"/>
          </Link>
        </div>
        <div className='login-container'>
          <Search
            placeholder="Search for open source product or initiative"
            onSearch={onSearch}
            className="nav-search"
          />
          {
            user && user.isLoggedIn ? (
              <Button
                className="signIn-btn"
                onClick={() => logout()}
              >
                Sign out
              </Button>
            ) : (
              <Button
                className="signIn-btn"
                onClick={() => router.push("/switch-test-user")}
              >
                Sign in
              </Button>
            )
          }
        </div>
      </div>
    </Header>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  userLogInAction: (data: UserState) => dispatch(userLogInAction(data)),
});

const HeaderMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMenuContainer);

export default HeaderMenu;
