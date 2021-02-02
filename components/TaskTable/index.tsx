import React from 'react';
import Link from 'next/link';
import { Row, Tag, Divider, Col } from 'antd';
import { CustomAvatar } from '../CustomAvatar';
import { getProp } from '../../utilities/filters';
import { TASK_CLAIM_TYPES } from '../../graphql/types';
import CheckCircle from "../../public/assets/icons/check-circle.svg";

type Props = {
  tasks: any;
  productSlug?: string;
  statusList?: Array<string>;
  title?: string;
  hideTitle?: boolean;
  showPendingTasks?: boolean;
};

const TaskTable: React.FunctionComponent<Props> = ({ tasks, productSlug, statusList = TASK_CLAIM_TYPES, title = 'Related Tasks', hideTitle = false, showPendingTasks = false }) => {

  return tasks && tasks.length > 0 ? (
    <>
      {!hideTitle && <div className="mt-30">{title}</div>}
      <Row className="task-tab">
      {
        tasks.map((task: any, idx: number) => {
          if (
            !showPendingTasks &&
            statusList[getProp(task, 'status', null)] === "Draft" ||
            statusList[getProp(task, 'status', null)] === "Pending"
          ) {
            return null;
          }

          const status = getProp(task, 'status');
          let taskStatus = statusList[status];
          if (status === "Done") {
            const dependents = getProp(task, 'dependOn', []);
            let count = 0;
            for (let i = 0; i < dependents.length; i += 1) {
              if (statusList[dependents[i].status] === "Done") {
                count += 1;
              }
            }
            
            if (count === dependents.length) {
              taskStatus = "Done";
            }
          }
          
          const taskclaimSet = getProp(task, 'taskclaimSet', null)
            ? getProp(task, 'taskclaimSet', null)[0]
            : null;

          return (
            <Col key={idx} span={24}>
              <Divider />
              <Row justify="space-between">
                <Col flex="1" className="flex-column" style={{minHeight: 50}}>
                  <Link
                    href={
                      productSlug
                        ? `/products/${productSlug}/tasks/${task.id}`
                        : `/tasks/${task.id}`
                    }
                    className={getProp(task, 'tag', []).length > 0 ? "" : "my-auto"}
                  >
                    <h4 className='mb-0'>{task.title}</h4>
                  </Link>
                  <div>
                    {getProp(task, 'tag', []).map((tag: any, taskIdx: number) => 
                      <Tag key={`${idx}-tag${taskIdx}`}>{tag.name}</Tag>
                    )}
                  </div>
                </Col>
                <Col
                  className="my-auto ml-auto"
                  style={{ textAlign: "right" }}
                >
                  {
                    (
                      statusList[getProp(task, 'status')] !== "Claimed"
                    ) ? (
                    <>
                      {statusList[getProp(task, 'status')] === "Available" && (
                        <img
                          src={CheckCircle}
                          className="check-circle-icon"
                          alt="status"
                        />
                      )}
                      <span>{statusList[getProp(task, 'status')]}</span>
                    </>
                  ) : taskclaimSet ? (
                    <>
                      <div>
                        {taskStatus}
                      </div>
                      <Row>
                        {CustomAvatar(taskclaimSet.person, "fullName")}
                        <div className="my-auto">
                          <Link
                            href={`/people/${getProp(taskclaimSet, 'person.slug', '')}`}
                            className="text-grey-9"
                          >
                            {getProp(taskclaimSet, 'person.fullName', '')}
                          </Link>
                        </div>
                      </Row>
                    </>
                  ) : (
                    <span>{statusList[getProp(task, 'status')]}</span>
                  )}
                </Col>
              </Row>
            </Col>
          )
        })
      }
      </Row>
    </>
  ) : null
};

export default TaskTable;
