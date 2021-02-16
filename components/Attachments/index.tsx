import * as React from "react";
import {Col, List, Row, Typography} from "antd";
import {LinkOutlined, VideoCameraOutlined, FileOutlined, DownloadOutlined} from "@ant-design/icons";
import ReactPlayer from "react-player";


interface IAttachment {
  fileType: string,
  id: number,
  name: string,
  path: string,
}

interface IProps {
  data: IAttachment[]
}

const Attachments: React.FunctionComponent<IProps> = ({data}) => {
  return (
    <>
      <List
        header={<Typography.Text strong>Attachments</Typography.Text>}
        bordered
        dataSource={data}
        renderItem={(attachment: IAttachment) => (
          <List.Item>
            {
              attachment.fileType == 'link' &&
              <Row>
                  <Col>
                      <LinkOutlined style={{marginRight: 10}}/>
                      <a href={attachment.path} target="_blank">{attachment.name}</a>
                  </Col>
              </Row>
            }
            {
              attachment.fileType == 'video' &&
              <>
                  <Row>
                      <Col>
                          <VideoCameraOutlined style={{marginRight: 10}}/>
                          <Typography.Text>{attachment.name}</Typography.Text>
                      </Col>
                  </Row>
                  <Row>
                      <ReactPlayer
                          width="100%"
                          height="160px"
                          url={attachment.path}
                      />
                  </Row>
              </>
            }
            {
              attachment.fileType == 'file' &&
              <Row style={{width: '100%'}} justify="space-between">
                  <Col>
                      <FileOutlined style={{marginRight: 10}}/>
                      <Typography.Text>{attachment.name}</Typography.Text>
                  </Col>
                  <Col>
                      <a href={attachment.path} download={attachment.name} target="_blank">
                          <DownloadOutlined />
                      </a>
                  </Col>
              </Row>
            }
          </List.Item>
        )}
      >
      </List>
    </>
  );
};

export default Attachments;