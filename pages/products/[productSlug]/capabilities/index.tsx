import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Row, Col, message, Input, Button, Typography} from 'antd';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {GET_CAPABILITIES_BY_PRODUCT} from '../../../../graphql/queries';
import {getProp} from '../../../../utilities/filters';
import AddCapability from '../../../../components/Products/AddOrEditCapability';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import Loading from "../../../../components/Loading";
import {DELETE_CAPABILITY} from "../../../../graphql/mutations";
import SortableTree, {getVisibleNodeCount} from "react-sortable-tree";
import {TreeNode} from "../../../../utilities/constants";
import AddOrEditCapability from "../../../../components/Products/AddOrEditCapability";


const {Search} = Input;

const Capabilities: React.FunctionComponent = () => {
  const router = useRouter();
  const {productSlug} = router.query;

  const [treeData, setTreeData] = useState<any>([]);
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState<any>(null);

  const [showAddCapabilityModal, setShowAddOrEditModal] = useState(false);
  const [capability, setCapability] = useState<any>(null);
  const [modalType, setModalType] = useState<string>('');
  const [hideParent, setHideParent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const {
    data: capabilities,
    error: capabilitiesError,
    loading: capabilitiesLoading,
    refetch
  } = useQuery(GET_CAPABILITIES_BY_PRODUCT, {
    variables: {productSlug, userId: userId == null ? 0 : userId}
  });

  const convertDataAndSetTree = (capabilities: any) => {
    try {
      let capabilitiesStr: string = getProp(capabilities, 'capabilities', '');
      capabilitiesStr = capabilitiesStr.replaceAll("'", '"');
      capabilitiesStr = capabilitiesStr.replaceAll('\\\\"', "'");

      if (capabilitiesStr.length > 0) {
        let capabilitiesData = JSON.parse(capabilitiesStr);
        setTreeData(formatData(capabilitiesData[0].children));
      }
    } catch {
    }
  }

  useEffect(() => {
    if (!capabilitiesError && !capabilitiesLoading) {
      convertDataAndSetTree(capabilities);
    }
  }, [capabilities]);


  const formatData = (data: any) => {
    return data.map((node: any) => ({
      id: getProp(node, 'id'),
      title: getProp(node, 'data.name'),
      children: node.children ? formatData(getProp(node, 'children', [])) : []
    }))
  }

  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
    onCompleted() {
      message.success('Item is successfully deleted!').then();
      refetch().then();
    },
    onError() {
      message.error('Failed to delete item!').then();
    }
  });

  const removeNode = (node: any) => {
    try {
      deleteCapability({
        variables: {
          nodeId: node.id
        }
      }).then();
    } catch {
    }
  }

  const customSearchMethod = (data: any) => {
    const {node, searchQuery} = data;
    return searchQuery &&
      node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
  }

  const selectPrevMatch = (): void => {
    const index: number =
      searchFocusIndex !== null
        ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
        : searchFoundCount - 1;
    setSearchFocusIndex(index);
  }

  const selectNextMatch = (): void => {
    const index: number = searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0;
    setSearchFocusIndex(index);
  }

  const onTreeSearch = (matches: any) => {
    setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
    setSearchFoundCount(matches.length);
  }

  const editNode = (type: string, node: any) => {
    setCapability({
      ...node,
      name: node.title
    });
    setModalType(type);
    setShowAddOrEditModal(true);
  }

  const onSearch = (value: string) => setSearchString(value);

  const count = getVisibleNodeCount({treeData});
  const mapHeight = count * 62;

  const isAdminOrManager = getProp(capabilities, 'isAdminOrManager', false);

  if (capabilitiesLoading) return <Loading/>

  return (
    <LeftPanelContainer>
      {
        !capabilitiesError && (
          <>
            <Row justify="space-between" className="right-panel-headline mb-15" style={{marginBottom: 40}}>
              <Col>
                <Typography.Text strong style={{fontSize: '1.4rem'}}>Product Map</Typography.Text>
              </Col>
              <Col>
                <div>
                  <Search placeholder="Search text" className='mr-10' onSearch={onSearch} style={{width: 200}}/>
                  {
                    searchFoundCount > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => selectPrevMatch()}
                        >
                          &lt;
                        </button>
                        <button
                          type="submit"
                          onClick={() => selectNextMatch()}
                        >
                          &gt;
                        </button>
                      </>
                    )
                  }
                </div>
                <div>{searchFoundCount > 0 && `${searchFoundCount} items found!`}</div>
              </Col>

              {
                isAdminOrManager &&
                <Col>
                    <Button
                        onClick={
                          () => {
                            setModalType('add-root');
                            setHideParent(false);
                            setShowAddOrEditModal(true)
                          }
                        }
                    >
                        Add new capability
                    </Button>
                </Col>
              }
            </Row>


            <div style={{height: mapHeight}}>
              <SortableTree
                treeData={treeData}
                onChange={(treeData: TreeNode[]) => setTreeData(treeData)}
                canDrag={false}
                generateNodeProps={({node}) => ({
                  buttons: isAdminOrManager
                    ? [
                      <>
                        <button
                          className="mr-10"
                          onClick={() => {
                            setHideParent(true);
                            editNode('add-child', node)
                          }}
                        >
                          Add
                        </button>
                        <button
                          className="mr-10"
                          onClick={() => {
                            setHideParent(true);
                            editNode('edit', node);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeNode(node)}
                        >
                          Remove
                        </button>
                      </>
                    ]
                    : [],
                  title: (
                    <Row

                      justify="space-between"
                      style={{minWidth: 200}}
                    >
                      <Link href={`/products/${productSlug}/capabilities/${node.id}`}>
                        {node.title}
                      </Link>
                      <div className='pl-25'>{node.subtitle}</div>
                    </Row>
                  ),
                })}
                searchMethod={customSearchMethod}
                searchQuery={searchString}
                searchFocusOffset={searchFocusIndex}
                searchFinishCallback={onTreeSearch}
              />
            </div>

            {
              showAddCapabilityModal &&
              <AddOrEditCapability
                  modal={showAddCapabilityModal}
                  modalType={modalType}
                  capability={capability}
                  closeModal={setShowAddOrEditModal}
                  submit={refetch}
                  hideParentOptions={hideParent}
              />
            }
          </>
        )
      }
    </LeftPanelContainer>
  );
};


export default Capabilities;