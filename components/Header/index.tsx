import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Button, message, Row, Col, Menu, Dropdown} from "antd";
import {setLoginURL, setRegisterURL, userLogInAction} from "../../lib/actions";
import {UserState} from "../../lib/reducers/user.reducer";
// @ts-ignore
import Logo from "../../public/assets/logo.svg";
import Link from "next/link";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GET_AM_LOGIN_URL, GET_AM_REGISTER_URL, GET_PERSON} from "../../graphql/queries";
import {USER_ROLES} from "../../graphql/types";
import LoginViaAM from "../LoginViaAM";
import RegisterViaAM from "../RegisterViaAM";
import {LOGOUT} from "../../graphql/mutations";
import {MenuOutlined, DownOutlined, LogoutOutlined, UserOutlined, BookOutlined} from "@ant-design/icons";

const redirectToLocalName = "redirectTo";

type Props = {
    user?: any;
    userLogInAction?: any;
    setLoginURL: (loginUrl: string) => void;
    setRegisterURL: (registerUrl: string) => void;
};

const HeaderMenuContainer: React.FunctionComponent<Props> = ({user, userLogInAction, setLoginURL, setRegisterURL}) => {
    const {data: authMachineLoginData} = useQuery(GET_AM_LOGIN_URL);
    const {data: authMachineRegisterData} = useQuery(GET_AM_REGISTER_URL);
    const menu = (
        <Menu style={{minWidth: 150}}>
            <Menu.Item key="0" className="signIn-btn">
                <Link href={`/${user?.username}`}>
                    <a className="text-grey-9">
                        <UserOutlined/> Your profile
                    </a>
                </Link>
            </Menu.Item>
            {user?.claimedTask ?
                <Menu.Item key="1">
                    <Link href={user.claimedTask.link}>
                        <a className="text-grey-9">
                            <BookOutlined/>
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
            {(user && user.isLoggedIn) ? null :
                (<>
                    <Menu.Item key="0">
                        <RegisterViaAM margin={''}/>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <LoginViaAM fullWidth={true}/>
                    </Menu.Item>
                </>)}
            <Menu.Item key="2">
                <Link href={"/"}>
                    <a style={{color: '#000000 !important'}}>Open Products</a>
                </Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link href={"/about"}>
                    <a style={{color: '#000000 !important'}}>About</a>
                </Link>
            </Menu.Item>
            {(user && user.isLoggedIn) ? (<>
                <Menu.Item key="4" className="signIn-btn">
                    <Link href={`/${user?.username}`}>
                        <a style={{color: '#000000 !important'}} className="text-grey-9">
                            Your profile
                        </a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="5" onClick={() => logout()} className="signIn-btn">
                    Sign out
                </Menu.Item>
            </>) : null}
        </Menu>);

    const {data: personData} = useQuery(GET_PERSON, {fetchPolicy: "no-cache"});

    useEffect(() => {
        if (authMachineLoginData && authMachineLoginData?.getAuthmachineLoginUrl) setLoginURL(authMachineLoginData.getAuthmachineLoginUrl);
    }, [authMachineLoginData]);

    useEffect(() => {
        if (authMachineRegisterData && authMachineRegisterData?.getAuthmachineRegisterUrl) setRegisterURL(authMachineRegisterData.getAuthmachineRegisterUrl);
    }, [authMachineRegisterData])

    useEffect(() => {
        if (personData && personData.person) {
            const {firstName, slug, id, username, productpersonSet, claimedTask} = personData.person;
            userLogInAction({
                isLoggedIn: true,
                loading: false,
                firstName,
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
                firstName: "",
                slug: "",
                username: "",
                id: null,
                claimedTask: null,
                roles: []
            });
        }
    }, [personData]);

    const [logout] = useMutation(LOGOUT, {
        onCompleted(data) {
            const {success, message: responseMessage, url} = data.logout;
            if (success) {
                localStorage.removeItem("userId");
                localStorage.removeItem("firstName");
                localStorage.removeItem(redirectToLocalName);
                userLogInAction({
                    isLoggedIn: false,
                    loading: false,
                    firstName: "",
                    slug: "",
                    username: "",
                    id: null,
                    claimedTask: null,
                    roles: []
                });
                if (url) {
                    window.location.replace(url);
                }
            } else {
                message.error(responseMessage);
            }

        },
        onError(err) {
            message.error("Failed to logout from the system").then();
        }
    });

    return (
        <>
            <Row
                className="header-mobile"
                align="middle" justify="space-between"
                style={{height: 56, padding: "0 30px", borderBottom: "1px solid #d9d9d9"}}
            >
                <Col>
                    <Link href="/">
                        <a>
                            <img src={Logo} alt="logo"/>
                        </a>
                    </Link>
                </Col>
                <Col>
                    <Dropdown trigger={["click", "hover"]} overlay={menuMobile}>
                        <Button style={{border: "none"}} className={"ant-dropdown-link"} icon={<MenuOutlined/>}
                                size="large"/>
                    </Dropdown>
                </Col>
            </Row>


            <Row align="middle" justify="center" style={{height: 56, borderBottom: "1px solid #d9d9d9"}}
                 className="header-desktop">
                <Col xl={20} lg={22}>
                    <Row className="container">
                        <Col span={10}>
                            <Row justify="start" align="middle">
                                <Col style={{marginRight: 20}}>
                                    <Link href="/">
                                        <a className="gray-link">
                                            Work on Open Products
                                        </a>
                                    </Link>
                                </Col>
                                {(user && user.isLoggedIn) && (
                                    <Col style={{marginRight: 20}}>
                                        <Link href="/product/add">
                                            <a className="gray-link">
                                                Add Product
                                            </a>
                                        </Link>
                                    </Col>
                                )}
                                <Col style={{marginRight: 20}}>
                                    <Link href="/about">
                                        <a className="gray-link">
                                            About
                                        </a>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>

                        <Col span={4}>
                            <Row justify="center">
                                <Link href="/">
                                    <a>
                                        <img src={Logo} alt="logo"/>
                                    </a>
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
                                            <>
                                                <LoginViaAM/>
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
}

const mapStateToProps = (state: any) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
    userLogInAction: (data: UserState) => dispatch(userLogInAction(data)),
    setLoginURL: (loginUrl: string) => dispatch(setLoginURL(loginUrl)),
    setRegisterURL: (registerUrl: string) => dispatch(setRegisterURL(registerUrl))
});

const HeaderMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(HeaderMenuContainer);

export default HeaderMenu;
