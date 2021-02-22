import {Dropdown, Menu} from "antd";
import React, {useEffect, useState} from "react";
import {getProp} from "../../utilities/filters";
import {DownOutlined} from "@ant-design/icons";


interface IProps {
  isAdminOrManager: boolean,
  task: any
}

const Priorities: React.FunctionComponent<IProps> = ({isAdminOrManager = false, task}) => {
  const currentPriority = getProp(task, 'priority', '');
  const otherPriorities = ['High', 'Medium', 'Low'].filter(priority => priority != currentPriority);

  const getColor = (priorityName: string) => {
    switch (priorityName) {
      case 'High':
        return '#FF8C00';
      case 'Medium':
        return '#00D358';
      case 'Low':
        return '#00A2F7';
    }
  }

  return (
    <Dropdown overlay={
      isAdminOrManager ?
        <Menu>
          {
            otherPriorities.map((priority: any, index: number) => (
              <Menu.Item key={index} style={{
                color: getColor(priority),
                textAlign: 'center'
              }}>{priority}</Menu.Item>
            ))
          }
        </Menu> : <></>
    } trigger={['click']}>
      <a style={{color: getColor(currentPriority)}}>
        {currentPriority} {isAdminOrManager && <DownOutlined/>}
      </a>
    </Dropdown>

  )
}

export default Priorities;