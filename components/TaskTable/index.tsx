import React, { useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { Row, Tag, Col, Empty, Pagination } from "antd";
import { getProp } from "../../utilities/filters";
import { TASK_CLAIM_TYPES } from "../../graphql/types";
import {
  CheckCircleFilled,
  ThunderboltFilled,
  PlaySquareOutlined,
} from "@ant-design/icons";
import Priorities from "../Priorities";
import CheckableTag from "antd/lib/tag/CheckableTag";
import CustomAvatar2 from "../CustomAvatar2";
import { getUserRole, hasManagerRoots } from "../../utilities/utils";

type Props = {
  tasks: any;
  productSlug?: string;
  statusList?: Array<string>;
  title?: string;
  hideTitle?: boolean;
  hideEmptyList?: boolean;
  showPendingTasks?: boolean;
  showInitiativeName?: boolean;
  showProductName?: boolean;
  submit: Function;
  content?: any;
  roles: any;
};

const TaskTable: React.FunctionComponent<Props> = ({
  tasks,
  statusList = TASK_CLAIM_TYPES,
  hideEmptyList = false,
}) => {
  const [current, setCurrent] = useState(1);
  const pagesize = 9;
  const curTasks = tasks.slice(
    current * pagesize - pagesize,
    current * pagesize
  );
  return (
    <>
      <Row gutter={20}>
        {curTasks && curTasks.length > 0 ? (
          <>
            {curTasks.map((task: any, index: number) => {
              const status = getProp(task, "status");
              let taskStatus = statusList[status];

              const hasActiveDepends = getProp(task, "hasActiveDepends", false);
              if (hasActiveDepends) {
                taskStatus = "Blocked";
              } else if (!hasActiveDepends && taskStatus === "Blocked") {
                taskStatus = "Available";
              }

              if (status === "Done") {
                const hasActiveDepends = getProp(
                  task,
                  "hasActiveDepends",
                  false
                );
                if (!hasActiveDepends) taskStatus = "Done";
              }

              const taskClaimSet = getProp(task, "taskClaimSet", null)
                ? getProp(task, "taskClaimSet", null)[0]
                : null;

              const productName = getProp(task, "product.name", "");
              const productSlug = getProp(task, "product.slug", "");
              const initiativeName = getProp(task, "initiative.name", "");
              const initiativeId = getProp(task, "initiative.id", "");
              // const assignee = getProp(task, "assignedTo", null);
              const owner = getProp(task, "product.owner", "");
              // const canEdit = hasManagerRoots(getUserRole(roles, productSlug));

              return (
                <Col key={index} md={8} className="task-box">
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
                    <span>
                      <b>Product</b>
                    </span>
                    <br />
                    <div className="task-box-video">
                      <PlaySquareOutlined />
                      <Link href={owner ? `/${owner}/${productSlug}` : ""}>
                        {productName}
                      </Link>
                    </div>
                    <span>
                      <b>Initiattive</b>
                    </span>
                    <br />
                    <div className="task-box-video">
                      <PlaySquareOutlined />
                      <Link
                        href={`/${owner}/${productSlug}/initiatives/${initiativeId}`}
                      >
                        {initiativeName}
                      </Link>
                    </div>
                    <div className="task-box-video">
                      <b className="mr-15">Priority</b>
                      <span
                        className={
                          task.priority ? task.priority.toLowerCase() : ""
                        }
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p>
                      <b className="mr-15">Status</b>
                      <span>{taskStatus}</span>
                      <b style={{ float: "right" }} className="point">
                        10 Points
                      </b>
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
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  roles: state.user.roles,
});

export default connect(mapStateToProps, null)(TaskTable);
