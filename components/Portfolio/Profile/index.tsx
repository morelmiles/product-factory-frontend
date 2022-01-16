import React, {useEffect} from "react";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar, Button, Col, Divider, Row, Typography} from "antd";
import {ProfileProps} from "../interfaces";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import {apiDomain} from "../../../utilities/constants";

function ExpertiseSkills({skill}) {
    if(typeof(skill) === 'string'){
        return <Col className="expertises">{skill}</Col> 
    }
    else {
        return <Col className="expertises">({skill.map((expertise, index) => index < (skill.length - 1) ? expertise + ', ' : expertise)})</Col> 
    }
}

//This method return only the unique categories and expertises, and put together a categorie string with their respective expertises
const getUniqCategoryExpertise = (profileSkills) => {

    let uniq_category_expertise = [] 
    const arrayForSort = [...profileSkills]
    profileSkills = arrayForSort.sort((a:any, b:any) => a.category[0].localeCompare(b.category[0]));
    
    profileSkills.map((skill) => {
        let expertises = []
        skill.category.map((category, index) => {
            const findCategory = uniq_category_expertise.filter((el) => el === category)
            if(findCategory.length == 0 && index < (skill.category.length - 1)) {
                uniq_category_expertise.push(category)
            }
        })
        skill.expertise && skill.expertise.map((expertise) => {
            expertises.push(expertise)
        })
        if(expertises.length > 0){
            uniq_category_expertise.push(skill.category[skill.category.length -1 ] + ' (' + expertises.join(', ') + ') ')
        }
    })

    return uniq_category_expertise;
}

const Profile = ({profile, user, refetchProfile}: ProfileProps) => {
    const router = useRouter();
    const {personSlug} = router.query;
    const isCurrentUser = (id: string) => {
        return user.id === id;
    }

    useEffect(() => {
        refetchProfile({personSlug});
    }, []);

    let uniqCategoryExpertise = getUniqCategoryExpertise(profile.skills)

    return (
        <div className="portfolio-profile" >
            <Row style={{position: 'relative'}}>
                <Col style={{width: '100%'}}>
                    <Row justify="center">
                        <Avatar size={100} icon={<UserOutlined/>} src={apiDomain + profile.avatar}/>
                    </Row>
                </Col>
                <Col style={{position: 'absolute', right: 0}}>
                    <Row justify={"end"}>
                        {
                            isCurrentUser(profile.id) &&
                            <Button style={{border: "none"}}
                                    size={"large"}
                                    shape="circle"
                                    onClick={() => router.push(`/${personSlug}/edit`)}
                                    icon={<EditOutlined/>}
                            />
                        }
                    </Row>
                </Col>
            </Row>
            <div style={{padding: 14}}>
                <Row>
                    <Typography.Text strong style={{
                        color: "#262626",
                        fontSize: 20,
                        fontFamily: "Roboto"
                    }}>{profile.firstName}</Typography.Text>
                </Row>
                <Row>
                    <Typography.Text style={{
                        color: "#595959",
                        fontSize: 12,
                        fontFamily: "Roboto"
                    }}>@{profile.slug}</Typography.Text>
                </Row>
                <Row>
                    <Typography.Text style={{
                        maxWidth: 232,
                        color: "#595959"
                    }}
                    >{profile.bio}</Typography.Text>
                </Row>
                <Row><Divider/></Row>
                {uniqCategoryExpertise.length > 0 && (<Row justify={"start"}>
                    <Col>
                        <Row>
                            <Typography.Text strong
                                            style={{
                                                fontSize: 14,
                                                fontFamily: "Roboto",
                                                color: "#262626"
                                            }}>Skills</Typography.Text>
                        </Row>
                        <Row>
                            {uniqCategoryExpertise && uniqCategoryExpertise.map((skill) =>
                                <ExpertiseSkills skill={skill}/>
                            )}
                        </Row>
                    </Col>
                </Row>)}
            </div>
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    user: state.user
});

export default connect(mapStateToProps, null)(Profile);
