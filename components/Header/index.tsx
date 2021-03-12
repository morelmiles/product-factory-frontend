import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Input, Button, message, Row, Col, Space, Drawer} from 'antd';
import {userLogInAction} from '../../lib/actions';
import {UserState} from '../../lib/reducers/user.reducer';
import {apiDomain, productionMode} from '../../utilities/constants';
// @ts-ignore
import Logo from '../../public/assets/logo.svg';
import {useRouter} from 'next/router'
import Link from 'antd/lib/typography/Link';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GET_PERSON} from "../../graphql/queries";
import {USER_ROLES} from "../../graphql/types";
import LoginViaAM from "../LoginViaAM";
import {LOGOUT} from "../../graphql/mutations";
import { MenuOutlined } from '@ant-design/icons';

const {Search} = Input;


type Props = {
  user?: any;
  userLogInAction?: any;
};

const HeaderMenuContainer: React.FunctionComponent<Props> = ({user, userLogInAction}) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const onSearch = () => {
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

  const {data: personData} = useQuery(GET_PERSON)
  //
  // useEffect(() => {
  //   let userId = localStorage.getItem("userId")
  //   if (localStorage.getItem("userId")) {
  //     userLogInAction({isLoggedIn: true, id: userId});
  //     setUserId(userId)
  //   }
  // }, []);

  useEffect(() => {
    if (personData && personData.person) {
      const {person} = personData;
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

  const [logout] = useMutation(LOGOUT, {
    onCompleted(data) {
      const {success, message: responseMessage, url} = data.logout;
      if (success) {
        localStorage.removeItem('userId');
        localStorage.removeItem('fullName');
        window.location.replace(url);
        // localStorage.removeItem('userId');
        // localStorage.removeItem('fullName');
        // router.push("/switch-test-user").then();
      } else {
        message.error(responseMessage)
      }
    },
    onError(err) {
      message.error("Failed to logout form the system").then();
    }
  });

  // const selectedItem = getSelectedItem();

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Row
        className="header-mobile"
        align="middle" justify="space-between"
        style={{height: 56, padding: '0 30px', borderBottom: '1px solid #d9d9d9'}}
      >
        <Col>
          <Link href="/">
            <img src={Logo} alt="logo"/>
          </Link>
        </Col>
        <Col>
          <Button onClick={showDrawer} icon={<MenuOutlined/>} size="large"/>
        </Col>

        <Drawer
          title="Open United"
          placement="left"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <Space direction="vertical">
            {
              user && user.isLoggedIn ? (
                <Button
                  style={{width: '100%'}}
                  onClick={() => logout()}
                >
                  Sign out
                </Button>
              ) : (
                <Button
                  style={{width: '100%'}}
                  onClick={() => router.push("/switch-test-user")}
                >
                  Sign in
                </Button>
              )
            }

            <Search
              placeholder="Search for open source product or initiative"
              onSearch={onSearch}
            />
          </Space>

          <Space direction="vertical" style={{marginTop: 20}}>
            <Link href="/">
              <a style={{color: '#262626'}}>Work on Open Products</a>
            </Link>
            <Link href="/product/add">
              <a style={{color: '#262626'}}>Add Product</a>
            </Link>
            <Link href="">
              <a style={{color: '#262626'}}>Find Talent</a>
            </Link>
          </Space>

          {/*<Button*/}
          {/*  style={{position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: '80%'}}*/}
          {/*  onClick={onClose}*/}
          {/*>Close</Button>*/}
        </Drawer>
      </Row>


      <Row align="middle" style={{height: 56, borderBottom: '1px solid #d9d9d9'}} className="header-desktop">
        <Col span={10}>
          <Row justify="center">
            <Col style={{marginRight: 20}}>
              <Link href="/">
                <a style={{color: '#262626'}}>Work on Open Products</a>
              </Link>
            </Col>
            <Col style={{marginRight: 20}}>
              <Link href="/product/add">
                <a style={{color: '#262626'}}>Add Product</a>
              </Link>
            </Col>
            <Col style={{marginRight: 20}}>
              <Link href="">
                <a style={{color: '#262626'}}>Find Talent</a>
              </Link>
            </Col>
          </Row>
        </Col>

        <Col span={4}>
          <Row justify="center">
            <Link href="/">
              <img src={Logo} alt="logo"/>
            </Link>
          </Row>
        </Col>

        <Col span={10}>
          <Row align="middle" justify="center">
            <Col style={{marginRight: 10}}>
              <Search
                placeholder="Search for open source product or initiative"
                onSearch={onSearch}
              />
            </Col>
            <Col>
              {
                user && user.isLoggedIn ? (
                  <Button
                    className="signIn-btn"
                    onClick={() => logout()}
                  >
                    Sign out
                  </Button>
                ) : (
                  <>{
                    productionMode
                      ? <LoginViaAM />
                      : (
                        <Button
                          className="signIn-btn"
                          onClick={() => router.push("/switch-test-user")}
                        >
                          Sign in
                        </Button>
                      )
                  }</>
                )
              }
            </Col>
          </Row>
        </Col>
      </Row>
    </>
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
