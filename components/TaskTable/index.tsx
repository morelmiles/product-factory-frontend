import React from 'react';
import Link from 'next/link';
import {Row, Tag, Divider, Col, Typography, Empty} from 'antd';
import {CustomAvatar} from '../CustomAvatar';
import {getProp} from '../../utilities/filters';
import {TASK_CLAIM_TYPES} from '../../graphql/types';
import {CheckCircleFilled, ThunderboltFilled} from '@ant-design/icons';
import Priorities from "../Priorities";
import CheckableTag from "antd/lib/tag/CheckableTag";


type Props = {
  tasks: any;
  productSlug?: string;
  statusList?: Array<string>;
  title?: string;
  hideTitle?: boolean;
  showPendingTasks?: boolean;
  showInitiativeName?: boolean;
  showProductName?: boolean;
  submit: Function;
};

const TaskTable: React.FunctionComponent<Props> = (
  {
    tasks,
    statusList = TASK_CLAIM_TYPES,
    title = 'Related Tasks',
    hideTitle = false,
    showPendingTasks = false,
    showInitiativeName = false,
    showProductName = false,
    submit
  }
) => {
  return tasks && tasks.length > 0 ? (
    <>
      {!hideTitle && <div className="mt-30">{title}</div>}
      <Row className="task-tab">
        {
          tasks.map((task: any, index: number) => {
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

            const taskClaimSet = getProp(task, 'taskClaimSet', null)
              ? getProp(task, 'taskClaimSet', null)[0]
              : null;

            const productName = getProp(task, 'product.name', '');
            const productSlug = getProp(task, 'product.slug', '');
            const initiativeName = getProp(task, 'initiative.name', '');
            const initiativeId = getProp(task, 'initiative.id', '');
            const assignee = getProp(task, 'assignedTo', null);

            return (
              <Col key={index} span={24}>
                <Divider/>
                <Row justify="space-between">
                  <Col span={14}>
                    <Row>
                      {
                        showProductName && (
                          <>
                            <Link href={`/products/${productSlug}`}>
                                <a className="text-grey-9">{productName}</a>
                            </Link>&nbsp;/&nbsp;
                          </>
                        )

                      }
                      <Link
                        href={`/products/${productSlug}/tasks/${task.publishedId}`}
                      >
                        <strong>
                          <a className="text-grey-9">
                            <Row align="middle">
                              {task.title}
                            </Row>
                          </a>
                        </strong>

                      </Link>
                    </Row>
                    <Row>
                      <Typography.Text type="secondary" style={{marginBottom: 5}}>{task.shortDescription}</Typography.Text>
                    </Row>
                    <Row align="middle">
                      {getProp(task, 'stack', []).map((tag: any, taskIndex: number) =>
                        <CheckableTag key={`${index}-stack${taskIndex}`} checked={true}>{tag.name}</CheckableTag>
                      )}
                      {getProp(task, 'tag', []).map((tag: any, taskIndex: number) =>
                        <Tag key={`${index}-tag${taskIndex}`}>{tag.name}</Tag>
                      )}

                      {
                        showInitiativeName &&

                        <Link href={`/products/${productSlug}/initiatives/${initiativeId}`}>
                          <span className="text-grey-9 pointer link">
                            <ThunderboltFilled
                                style={{color: '#999', marginRight: 4, fontSize: 16}}
                            />
                            {initiativeName}
                          </span>
                        </Link>
                      }
                    </Row>
                  </Col>

                  <Col span={4} className="ml-auto" style={{textAlign: "center"}}>
                    <Priorities task={task} submit={() => submit()}/>
                  </Col>

                  <Col span={6}
                       className="ml-auto"
                       style={{textAlign: "right"}}
                  >
                    {
                      (
                        taskStatus !== "Claimed"
                      ) ? (
                        <>
                          {taskStatus === "Done" && (
                            <CheckCircleFilled style={{color: '#389E0D', marginRight: 8}}/>
                          )}
                          <span>{taskStatus}</span>
                        </>
                      ) : taskClaimSet ? (
                        <>
                          <div>{taskStatus}</div>
                          <Row>
                            {CustomAvatar(taskClaimSet.person, "fullName")}
                            <div className="my-auto">
                              <Link
                                href={`/people/${getProp(taskClaimSet, 'person.slug', '')}`}

                              >
                                <a className="text-grey-9">{getProp(taskClaimSet, 'person.fullName', '')}</a>
                              </Link>
                            </div>
                          </Row>
                        </>
                      ) : (
                        <span>{taskStatus}</span>
                      )}
                      {assignee ? (
                        <div className="mt-10">
                          <div className="d-flex-end" style={{fontSize: 13}}>

                            <Link href={`/people/${getProp(assignee, 'slug', '')}`}>
                              <>
                                {CustomAvatar(
                                  assignee,
                                  "fullName",
                                  28,
                                  null,
                                  {margin: 'auto 8px auto 0', fontSize: 13}
                                  )
                                }
                                <a className="text-grey-9">{getProp(assignee, 'fullName', '')}</a>
                              </>
                            </Link>
                          </div>
                        </div>
                      ) : null}
                  </Col>
                </Row>
              </Col>
            )
          })
        }
      </Row>
    </>
  ) : <Empty description={"The task list is empty"} />
};

export default TaskTable;
