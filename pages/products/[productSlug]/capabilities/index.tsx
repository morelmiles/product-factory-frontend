import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Row, Col, Button, Table} from 'antd';
import {PaperClipOutlined} from "@ant-design/icons";
import {useQuery} from '@apollo/react-hooks';
import {GET_CAPABILITIES_BY_PRODUCT_AS_LIST} from '../../../../graphql/queries';
import {getProp} from '../../../../utilities/filters';
import {randomKeys} from '../../../../utilities/utils';
import AddCapability from '../../../../components/Products/AddOrEditCapability';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import Loading from "../../../../components/Loading";


type Params = {
  userRole?: string;
};

const CapabilityList: React.FunctionComponent<Params> = ({userRole}) => {
  const router = useRouter();
  const {productSlug} = router.query;

  const {data, error, loading, refetch} = useQuery(GET_CAPABILITIES_BY_PRODUCT_AS_LIST, {
    variables: {productSlug}
  });
  const [dataSource, setDataSource] = useState<any>([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const getBasePath = () => {
    return `/products/${productSlug}`;
  }
  const columns = [
    {
      title: 'Capability',
      dataIndex: 'capability',
      key: 'capability',
      render: (capability: any) => (
        <Link href={capability.url}>{capability.name}</Link>
      )
    },
    {
      title: 'Tasks Todo',
      dataIndex: 'todo_tasks',
      key: 'todo_tasks',
      render: (todo_tasks: any) => (
        <>
          {todo_tasks
            ? todo_tasks.map((task: any) => (
              <Link
                key={randomKeys()}
                href={getBasePath() + `/tasks/${task.id}`}
              >
                <a className="mt-5">#{task.id}</a>
              </Link>
            ))
            : null
          }
        </>
      )
    },
    {
      title: 'Tasks Done',
      dataIndex: 'done_tasks',
      key: 'done_tasks',
      render: (done_tasks: any) => (
        <>
          {done_tasks
            ? done_tasks.map((task: any) => (
              <Link
                key={randomKeys()}
                href={getBasePath() + `/tasks/${task.id}`}
              >
                <a className="mr-5">#{task.id}</a>
              </Link>
            ))
            : null
          }
        </>
      )
    },
    {
      title: 'Capability attachments',
      dataIndex: 'attachments',
      key: 'attachments',
      render: (attachments: number) => (
        <>
          {
            attachments > 0
              ? (
                <span>
                    <PaperClipOutlined />
                  {attachments}
                  </span>
              )
              : null
          }
        </>
      )
    },
    {
      title: 'Test Coverage',
      dataIndex: 'test_coverage',
      key: 'test_coverage',
    }
  ];

  const fetchData = (capabilities: any) => {
    const source: any[] = getProp(capabilities, 'capabilitiesAsList', []).map((item: any, idx: number) => {
      const done_tasks: any[] = [];
      const todo_tasks: any[] = [];

      getProp(item, 'taskSet', []).forEach((child: any) => {
        switch (child.status) {
          case 0:
            todo_tasks.push(child);
            break;
          case 3:
            done_tasks.push(child);
            break;
          default:
            break;
        }
      });

      return {
        key: idx,
        capability: {
          name: item.name,
          url: `/products/${productSlug}/capabilities/${item.id}`
        },
        done_tasks: done_tasks,
        todo_tasks: todo_tasks,
        attachments: item.attachment ? item.attachment.length : 0,
        test_coverage: 0
      };
    });
    setDataSource(source);
  }

  useEffect(() => {
    if (!error)  {
      fetchData(data);
    }
  }, [data]);

  if (loading) return <Loading/>

  return (
    <LeftPanelContainer>
      {
        !error && (
          <>
            <Row justify="space-between">
              <Col>
                <div className="page-title text-center mb-15">
                  Explore capabilities {getProp(data, 'capabilitiesAsList.length', 0)}
                </div>
              </Col>
              {(userRole === "Manager" || userRole === "Admin") && (
                <Col>
                  <Button onClick={() => setShowEditModal(true)}>
                    Add new capability
                  </Button>
                </Col>
              )}
            </Row>
            {
              showEditModal &&
              <AddCapability
                  modal={showEditModal}
                  modalType={'add-root'}
                  closeModal={setShowEditModal}
                  submit={fetchData}
              />
            }
            <Table dataSource={dataSource} columns={columns}/>
          </>
        )
      }
    </LeftPanelContainer>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole
});

const mapDispatchToProps = () => ({});

const CapabilityListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CapabilityList);

export default CapabilityListContainer;