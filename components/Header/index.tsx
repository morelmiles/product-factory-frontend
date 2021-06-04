import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Button, message, Row, Col, Drawer, Menu, Dropdown} from "antd";
import {setLoginURL, userLogInAction} from "../../lib/actions";
import {UserState} from "../../lib/reducers/user.reducer";
import {productionMode} from "../../utilities/constants";
// @ts-ignore
import Logo from "../../public/assets/logo.svg";
// @ts-ignore
import SmallLogo from "../../public/assets/no-title-logo.png";
import {useRouter} from "next/router";
import Link from "antd/lib/typography/Link";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GET_AM_LOGIN_URL, GET_PERSON} from "../../graphql/queries";
import {USER_ROLES} from "../../graphql/types";
import LoginViaAM from "../LoginViaAM";
import RegisterViaAM from "../RegisterViaAM";
import {LOGOUT} from "../../graphql/mutations";
import {MenuOutlined, DownOutlined, LogoutOutlined, UserOutlined, BookOutlined} from "@ant-design/icons";

const redirectToLocalName = "redirectTo";

type Props = {
    user?: any;
    userLogInAction?: any;
    setLoginURL: (loginUrl: string) => void
};

const HeaderMenuContainer: React.FunctionComponent<Props> = ({user, userLogInAction, setLoginURL}) => {
    const router = useRouter();
    const {data: authMachineData} = useQuery(GET_AM_LOGIN_URL);
    const menu = (
        <Menu style={{minWidth: 150}}>
            <Menu.Item key="0" className="signIn-btn">
                <Link href={`/${user?.username}`} className="text-grey-9">
                    <UserOutlined/> Your profile
                </Link>
            </Menu.Item>
            {user?.claimedTask ?
                <Menu.Item key="1">
                    <Link href={user.claimedTask.link} className="text-grey-9">
                        <BookOutlined/>
                        <a className="text-grey-9">
                            <strong>Claimed task:</strong><br/>
                            <div className="truncate" style={{width: 200}}>{user.claimedTask.title}</div>
                        </a>
                    </Link>
                </Menu.Item> : null}

            <Menu.Item key="2" onClick={() => logout()} className="signIn-btn">
                <LogoutOutlined/> Sign out
            </Menu.Item>
        </Menu>
    );

    const menuMobile = (
        <Menu theme={"light"}>
            <Menu.Item key="0">
                 <LoginViaAM fullWidth={true}/>

            </Menu.Item>
            <Menu.Item key="1">
                <a href={"/"}>Open Products</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href={"/about"}>About</a>
            </Menu.Item>
        </Menu>
    )

    const {data: personData} = useQuery(GET_PERSON, {fetchPolicy: "no-cache"});

    useEffect(() => {
        if (authMachineData && authMachineData?.getAuthmachineLoginUrl) setLoginURL(authMachineData.getAuthmachineLoginUrl);
    }, [authMachineData]);

    useEffect(() => {
        if (personData && personData.person) {
            const {fullName, slug, id, username, productpersonSet, claimedTask} = personData.person;
            userLogInAction({
                isLoggedIn: true,
                loading: false,
                fullName,
                slug,
                id,
                claimedTask,
                username: username,
                roles: productpersonSet.map((role: any) => {
                    return {
                        product: role.product.slug,
                        role: USER_ROLES[role.right]
                    }
                })
            });
        } else if (personData && personData.person === null) {
            userLogInAction({
                isLoggedIn: false,
                loading: false,
                fullName: "",
                slug: "",
                username: "",
                id: null,
                claimedTask: null,
                roles: []
            });
        }
    }, [personData]);

    useEffect(() => {
        if (window.location.pathname !== "/switch-test-user") {
            let redirectTo = localStorage.getItem(redirectToLocalName);
            if (redirectTo) {
                router.push(redirectTo).then();
                localStorage.removeItem(redirectToLocalName);
            }
        }
    }, []);

    const [logout] = useMutation(LOGOUT, {
        onCompleted(data) {
            const {success, message: responseMessage, url} = data.logout;
            if (success) {
                localStorage.removeItem("userId");
                localStorage.removeItem("fullName");
                localStorage.removeItem(redirectToLocalName);
                userLogInAction({
                    isLoggedIn: false,
                    loading: false,
                    fullName: "",
                    slug: "",
                    username: "",
                    id: null,
                    claimedTask: null,
                    roles: []
                });
                if (url) {
                    window.location.replace(url);
                } else {
                    router.push("/switch-test-user").then();
                }
            } else {
                message.error(responseMessage);
            }

        },
        onError(err) {
            message.error("Failed to logout from the system").then();
        }
    });

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
                style={{height: 56, padding: "0 30px", borderBottom: "1px solid #d9d9d9"}}
            >
                <Col>
                    <Link href="/">
                        <img style={{width: 35, height: 35}} src={SmallLogo} alt="logo"/>
                    </Link>
                </Col>
                <Col>
                    <RegisterViaAM margin={"0 15px 0 0"}/>
                    <Dropdown overlay={menuMobile}>
                        <Button style={{border: "none"}} className={"ant-dropdown-link"} icon={<MenuOutlined/>}
                                size="large"/>
                    </Dropdown>
                </Col>

                {/*<Drawer*/}
                {/*  title="Open United"*/}
                {/*  placement="left"*/}
                {/*  closable={false}*/}
                {/*  onClose={onClose}*/}
                {/*  visible={visible}*/}
                {/*>*/}
                {/*  <Search*/}
                {/*    placeholder="Search for open source product or initiative"*/}
                {/*    onSearch={onSearch}*/}
                {/*  />*/}
                {/*  <Menu style={{borderRight: 0}}>*/}
                {/*    <Menu.Item key="0">*/}
                {/*      <Link href="/">*/}
                {/*        <a className="text-grey-9">Work on Open Products</a>*/}
                {/*      </Link>*/}
                {/*    </Menu.Item>*/}
                {/*    {(user && user.isLoggedIn) && (*/}
                {/*      <Menu.Item key="1">*/}
                {/*        <Link href="/product/add">*/}
                {/*          <a className="text-grey-9">Add Product</a>*/}
                {/*        </Link>*/}
                {/*      </Menu.Item>*/}
                {/*    )}*/}
                {/*    <Menu.Item key="2">*/}
                {/*      <Link href="/about">*/}
                {/*        <a className="text-grey-9">About</a>*/}
                {/*      </Link>*/}
                {/*    </Menu.Item>*/}
                {/*    {user?.claimedTask ?*/}
                {/*      <Menu.Item key="3">*/}
                {/*        <Link href={user.claimedTask.link}>*/}
                {/*          <a className="text-grey-9 truncate">*/}
                {/*            <strong>Claimed task: </strong> {user.claimedTask.title}*/}
                {/*          </a>*/}
                {/*        </Link>*/}
                {/*    </Menu.Item> : null}*/}
                {/*    {*/}
                {/*      user && user.isLoggedIn ? (*/}
                {/*        <Menu.Item key="4" onClick={() => logout()} className="signIn-btn">*/}
                {/*          Sign out*/}
                {/*        </Menu.Item>*/}
                {/*      ) : (*/}
                {/*        <>*/}
                {/*          {*/}
                {/*            productionMode*/}
                {/*              ? <LoginViaAM fullWidth={true} />*/}
                {/*              : (*/}
                {/*                <Menu.Item key="4">*/}
                {/*                  <Link href="/switch-test-user">*/}
                {/*                    <a className="text-grey-9">Sign in</a>*/}
                {/*                  </Link>*/}
                {/*                </Menu.Item>*/}
                {/*              )*/}
                {/*          }*/}
                {/*        </>*/}
                {/*      )*/}
                {/*    }*/}
                {/*  </Menu>*/}
                {/*</Drawer>*/}
            </Row>


            <Row align="middle" justify="center" style={{height: 56, borderBottom: "1px solid #d9d9d9"}}
                 className="header-desktop">
                <Col xl={20} lg={22}>
                    <Row className="container">
                        <Col span={10}>
                            <Row justify="start" align="middle">
                                <Col style={{marginRight: 20}}>
                                    <Link className="gray-link" href="/">Work on Open Products</Link>
                                </Col>
                                {(user && user.isLoggedIn) && (
                                    <Col style={{marginRight: 20}}>
                                        <Link className="gray-link" href="/product/add">Add Product</Link>
                                    </Col>
                                )}
                                <Col style={{marginRight: 20}}>
                                    <Link className="gray-link" href="/about">About</Link>
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
                            <Row align="middle" justify="end">
                                {/*<Col style={{marginRight: 10}}>*/}
                                {/*  <Search*/}
                                {/*    placeholder="Search for open source product or initiative"*/}
                                {/*    onSearch={onSearch}*/}
                                {/*  />*/}
                                {/*</Col>*/}
                                <Col>
                                    {
                                        user && user.isLoggedIn ? (
                                            <Dropdown overlay={menu} placement="bottomRight" className="ml-15">
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <strong className="text-grey-9">{user.username}</strong>
                                                    <DownOutlined className="text-grey-9 ml-5"/>
                                                </a>
                                            </Dropdown>
                                        ) : (
                                            <>{
                                                productionMode
                                                    ? <LoginViaAM/>
                                                    : (
                                                        <Button
                                                            className="signIn-btn"
                                                            onClick={() => router.push("/switch-test-user")}
                                                        >
                                                            Sign in
                                                        </Button>
                                                    )
                                            }
                                                <RegisterViaAM margin={"0 0 0 15px"}/>
                                            </>
                                        )
                                    }
                                </Col>
                            </Row>
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
    setLoginURL: (loginUrl: string) => dispatch(setLoginURL(loginUrl)),
});

const HeaderMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(HeaderMenuContainer);

export default HeaderMenu;
