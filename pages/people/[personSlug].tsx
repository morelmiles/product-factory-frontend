
import React from 'react'
import '../../styles/Profile.module.less'
import ProfileTop from "../../components/Profile/ProfileTop"
import Portfolio from "../../components/Profile/Portfolio"


const Profile: React.FunctionComponent = () => {
  return (
    <>
      <ProfileTop />
      <Portfolio/>
    </>
  )
}

export default Profile