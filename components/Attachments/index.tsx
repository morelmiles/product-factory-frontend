import * as React from "react";
import {List, Typography} from "antd";


const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const Attachments: React.FunctionComponent = () => {
  return (
    <>
      <List
        header={<div>Attachments</div>}
        bordered
        dataSource={data}
        renderItem={(item: React.ReactChild) => (
          <List.Item>
            <Typography.Text>{item}</Typography.Text>
          </List.Item>
        )}
      >

      </List>
    </>
  );
};

export default Attachments;