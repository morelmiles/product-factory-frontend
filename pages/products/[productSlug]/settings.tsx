import React from "react";
import LeftPanelContainer from "../../../components/HOC/withLeftPanel";
import {Tabs} from "antd";
import SettingsPolicies from "../../../components/SettingsPolicies";


const {TabPane} = Tabs;


const Settings: React.FunctionComponent = () => {
  return (
    <LeftPanelContainer>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Policies" key="1">
          <SettingsPolicies/>
        </TabPane>
        <TabPane tab="Contributions" key="2">
          It will be implemented in the future
        </TabPane>
        <TabPane tab="Tags" key="3">
          It will be implemented in the future
        </TabPane>
      </Tabs>
    </LeftPanelContainer>
  )
}

export default Settings;