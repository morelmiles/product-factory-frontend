import React, {useEffect, useState} from "react";
// @ts-ignore
import footer from "../../../public/assets/edit_bottom.png";
import {useQuery} from "@apollo/react-hooks";
import {GET_PERSON_INFO} from "../../../graphql/queries";
import {useRouter} from "next/router";
import {ProfileType} from "../../../components/Portfolio/interfaces";
import EditProfile from "../../../components/Portfolio/EditProfile";
import {Layout} from "antd";
import Header from "../../../components/Header";
import ContainerFlex from "../../../components/ContainerFlex";
import {connect} from "react-redux";
import Forbidden403 from "../../../components/403";


const {Content} = Layout;

interface User {
    id: string
}


const EditPerson = (user: User) => {
    const router = useRouter();
    const {personSlug} = router.query;
    const [profile, setProfile] = useState<ProfileType>({
        id: '',
        firstName: '',
        bio: '',
        avatar: '',
        skills: [],
        websites: [],
        websiteTypes: []
    });
    const [redirect, setRedirect] = useState<boolean>(false);
    const {data: profileData} = useQuery(GET_PERSON_INFO, {variables: {personSlug}});

    useEffect(() => {
        if (profileData?.personInfo) {
            setProfile(profileData.personInfo);
        }
    }, [profileData]);

    const isCurrentUser = () => {
        console.log(user.id);
        console.log(profile.id);
        if (user.id !== profile.id && !redirect) {
            setRedirect(true);
        }
        return user.id === profile.id;
    }
    useEffect(() => {
        if (redirect) {
            router.push('/');
        }
    }, [redirect]);


    return (
        <ContainerFlex>
            <Layout>
                <Header/>
                {profile.id !== '' ? isCurrentUser() ?
                    (<Content className="main-page">
                        <EditProfile profile={profile}/>
                        <img style={{width: "100%"}} src={footer} alt=""/>
                    </Content>) : (<Forbidden403 personSlug={personSlug}/>) : null}
            </Layout>
        </ContainerFlex>
    );
}

const mapStateToProps = (state: any) => ({
    user: state.user
})

export default connect(mapStateToProps, null)(EditPerson);
