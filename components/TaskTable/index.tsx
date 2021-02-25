import React from 'react';
import Link from 'next/link';
import {Row, Tag, Divider, Col, Typography} from 'antd';
import {CustomAvatar} from '../CustomAvatar';
import {getProp} from '../../utilities/filters';
import {TASK_CLAIM_TYPES} from '../../graphql/types';
import {CheckCircleFilled, ThunderboltFilled} from '@ant-design/icons';
import Priorities from "../Priorities";


type Props = {
  tasks: any;
  productSlug?: string;
  statusList?: Array<string>;
  title?: string;
  hideTitle?: boolean;
  showPendingTasks?: boolean;
  showInitiativeName?: boolean;
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

            const productSlug = getProp(task, 'product.slug', '');
            const initiativeName = getProp(task, 'initiative.name', '');
            const initiativeId = getProp(task, 'initiative.id', '');

            return (
              <Col key={index} span={24}>
                <Divider/>
                <Row justify="space-between">
                  <Col span={16}>
                    <Row>
                      <Link
                        href={`/products/${productSlug}/tasks/${task.id}`}
                      >
                        <a className="text-grey-9">
                          <Row align="middle">
                            {task.title}
                          </Row>
                        </a>
                      </Link>
                    </Row>
                    <Row>
                      <Typography.Text type="secondary" style={{marginBottom: 5}}>{task.description}</Typography.Text>
                    </Row>
                    <Row align="middle">
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

                  <Col span={4} className="my-auto ml-auto" style={{textAlign: "center"}}>
                    <Priorities task={task} submit={() => submit()}/>
                  </Col>

                  <Col span={4}
                       className="my-auto ml-auto"
                       style={{textAlign: "right"}}
                  >
                    {
                      (
                        statusList[getProp(task, 'status')] !== "Claimed"
                      ) ? (
                        <>
                          {statusList[getProp(task, 'status')] === "Done" && (
                            <CheckCircleFilled style={{color: '#389E0D', marginRight: 8}}/>
                          )}
                          <span>{statusList[getProp(task, 'status')]}</span>
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
