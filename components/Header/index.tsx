import React, { useEffect } from 'react';
import Image from 'next/image'
import { connect } from 'react-redux';
import Link from 'next/link'
import { Layout, Menu, Input, Button, message } from 'antd';
import { userLogInAction, setUserRole } from '../../lib/actions';
import { UserState } from '../../lib/reducers/user.reducer';
import { WorkState } from '../../lib/reducers/work.reducer';
import { apiDomain } from '../../utilities/constants';
import Logo from '../../public/assets/logo.svg';
import { useRouter } from 'next/router'

const { Header } = Layout;
const { Search } = Input;

type Props = {
  user?: any;
  userLogInAction?: any;
  setUserRole?: any;
};

const HeaderMenuContainer: React.FunctionComponent = ({ user, userLogInAction, setUserRole
}) => {
  const router = useRouter();

  const onSearch = (e: any) => {
    console.log("search submitted: ", e);
  }
  const getSelectedItem = () => {
    switch(router.asPath) {
      case "/product/add":
        return "2";
      case "/profiles":
        return "3";
      default:
        return "1";
    }
  }

  useEffect(() => {
    if(localStorage.getItem("user_id")) {
      userLogInAction({ isLoggedIn: true });
    }
  },[]);
  const logout = () => {
    fetch(`${apiDomain}/github/logout`)
      .then(response => response.json())
      .then(res => {
        if (res.status) {
          message.success(`You are logged out !`);
          userLogInAction({ isLoggedIn: false });
          setUserRole({ userRole: "Watcher" });
          window.localStorage.removeItem("user_id");
          router.push("/switch-test-user");
        }
      });
  }

  const selectedItem = getSelectedItem();

  return (
    <Header className="global-header">
      <div className="inner-navbar">
        <Menu className="header-menu" mode="horizontal" defaultSelectedKeys={[selectedItem]}>
          <Menu.Item key="1">
            <Link
              href="/"
              className={ selectedItem === "1" ? "active" : ""}
            >
              {'Work on Open Products'}
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link
              href="/product/add"
              className={ selectedItem === "2" ? "active" : ""}
            >
              {'Add Product'}
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link
              href=""
              className={ selectedItem === "3" ? "active" : ""}
            >
              {'Find Talent'}
            </Link>
          </Menu.Item>
        </Menu>
        <div className="logo-section">
          <Link href="/">
            <img src={Logo} alt="logo" />
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
  setUserRole: (data: WorkState) => dispatch(setUserRole(data))
});

const HeaderMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMenuContainer);

export default HeaderMenu;
