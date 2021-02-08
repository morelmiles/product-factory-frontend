import React from 'react';
import '../../styles/Profile.module.less';
import ProfileTop from "../../components/Profile/ProfileTop";
import Portfolio from "../../components/Profile/Portfolio";
import {Layout} from "antd";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";
import ContainerFlex from "../../components/ContainerFlex";

const {Content} = Layout;


const Profile: React.FunctionComponent = () => {
    return (
        <ContainerFlex>
            <Layout>
                <Header/>
                <Content className="container main-page">
                    <ProfileTop/>
                    <Portfolio/>
                </Content>

            </Layout>

        </ContainerFlex>
    )
}

export default Profile;