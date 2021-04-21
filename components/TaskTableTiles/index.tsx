import React, {useEffect, useState} from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { Row, Tag, Col, Empty, Pagination, Modal } from "antd";
import { getProp } from "../../utilities/filters";
import { TASK_CLAIM_TYPES } from "../../graphql/types";
import { PlaySquareOutlined } from "@ant-design/icons";
import Priorities from "../Priorities";
import ReactPlayer from 'react-player';
import { getUserRole, hasManagerRoots } from "../../utilities/utils";

type Props = {
  tasks: any;
  productSlug?: string;
  statusList?: Array<string>;
  title?: string;
  hideEmptyList?: boolean;
  showPendingTasks?: boolean;
  showInitiativeName?: boolean;
  showProductName?: boolean;
  submit: Function;
  content?: any;
  roles: any;
  gridSizeLg?: number;
  gridSizeMd?: number;
  gridSizeSm?: number;
  pagesize?: number;
};

const TaskTableTiles: React.FunctionComponent<Props> = ({
  tasks,
  statusList = TASK_CLAIM_TYPES,
  hideEmptyList = false,
  showInitiativeName = false,
  showProductName = true,
  roles,
  submit,
  pagesize = 48,
  gridSizeLg = 6,
  gridSizeMd = 8,
  gridSizeSm = 12,
}) => {
  const [current, setCurrent] = useState(1);
  const [modalVideoUrl, setModalVideoUrl] = useState("");
  const [showModalVideo, setShowModalVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const curTasks = tasks.slice(
    current * pagesize - pagesize,
    current * pagesize
  );

  const showVideoModal = (productVideoUrl) => {
    setModalVideoUrl(productVideoUrl);
    setShowModalVideo(true);
    setPlaying(true);
  };

  useEffect(() => {
      if (!playing) setShowModalVideo(false);
  }, [playing]);

  return (
    <>
      <Row gutter={20}>
        {curTasks && curTasks.length > 0 ? (
          <>
            {curTasks.map((task: any, index: number) => {
              const status = getProp(task, 'status');
              let taskStatus = statusList[status];
              const hasActiveDepends = getProp(task, 'hasActiveDepends', false);

              if (hasActiveDepends) {
                taskStatus = "Blocked";
              } else if (!hasActiveDepends && taskStatus === "Blocked") {
                taskStatus = "Available";
              }

              const inReview = getProp(task, 'inReview', false);

              if (status === "Done") {
                if (!hasActiveDepends) taskStatus = "Done";
              }

              if (inReview && taskStatus !== "Done") {
                taskStatus = "In Review";
              }

              const productName = getProp(task, "product.name", "");
              const productSlug = getProp(task, "product.slug", "");
              const productVideoUrl = getProp(task, "product.videoUrl", "");
              const initiativeName = getProp(task, "initiative.name", "");
              const initiativeId = getProp(task, "initiative.id", "");
              // const assignee = getProp(task, "assignedTo", null);
              const owner = getProp(task, "product.owner", "");
              const canEdit = hasManagerRoots(getUserRole(roles, productSlug));

              return (
                <Col key={index} md={gridSizeMd} lg={gridSizeLg} sm={gridSizeSm} className="task-box">
                  <div className="task-box-title">
                    <Link
                      href={`/${owner}/${productSlug}/tasks/${task.publishedId}`}
                    >
                      {task.title}
                    </Link>
                  </div>
                  <div className="task-box-body">
                    {task.shortdescription && (
                      <p className="omit">{task.shortdescription}</p>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <span>
                        <b className="mr-20">Required Skills</b>
                        {task.tags.map((tag: any) => (
                          <Tag key={tag} color="default">
                            {tag}
                          </Tag>
                        ))}
                        <br />
                      </span>
                    )}
                    {(productName && showProductName) && (
                      <>
                        <span>
                          <b>Product</b>
                        </span>
                        <br />
                        <div className="task-box-video">
                          {productVideoUrl !== "" && <PlaySquareOutlined className="pointer"
                                                                         onClick={() => showVideoModal(productVideoUrl)} />}
                          <Link href={owner ? `/${owner}/${productSlug}` : ""}>
                            {productName}
                          </Link>
                        </div>
                      </>
                    )}

                    {(initiativeName && showInitiativeName) && (
                      <>
                        <span>
                          <b>Initiative</b>
                        </span>
                        <br />
                        <div className="task-box-video">
                          {/*<PlaySquareOutlined />*/}
                          <Link
                            href={`/${owner}/${productSlug}/initiatives/${initiativeId}`}
                          >
                            {initiativeName}
                          </Link>
                        </div>
                      </>
                    )}

                    <div className="task-box-video">
                      <b className="mr-15">Priority</b>
                      <Priorities task={task}
                                  submit={() => submit()}
                                  canEdit={canEdit} />
                    </div>
                    <p>
                      <b className="mr-15">Status</b>
                      <span>{taskStatus}</span>
                      {/*<b style={{ float: "right" }} className="point">*/}
                      {/*  10 Points*/}
                      {/*</b>*/}
                    </p>
                  </div>
                </Col>
              );
            })}
          </>
        ) : (
          !hideEmptyList && (
            <Empty
              style={{ margin: "20px auto" }}
              description={"The task list is empty"}
            />
          )
        )}
      </Row>
      {tasks && tasks.length > pagesize && (
        <div className="center mb-30">
          <Pagination
            current={current}
            total={tasks.length}
            onChange={setCurrent}
            pageSize={pagesize}
            showSizeChanger={false}
          />
        </div>
      )}

      <Modal
        visible={showModalVideo}
        title={null}
        closeIcon={null}
        className="video-modal"
        onCancel={() => setPlaying(false)}
        footer={null}>
          <ReactPlayer url={modalVideoUrl}
                       playing={playing}
                       playsinline={true}
                       width="100%" />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  roles: state.user.roles,
});

export default connect(mapStateToProps, null)(TaskTableTiles);
