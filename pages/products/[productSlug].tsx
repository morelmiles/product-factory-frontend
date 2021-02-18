import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Link from 'next/link';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {Button, Col, Divider, Input, message, Row, Tag} from 'antd';
import ReactPlayer from 'react-player';
import SortableTree, {getVisibleNodeCount} from 'react-sortable-tree';
import {GET_CAPABILITIES_BY_PRODUCT, GET_PRODUCT_BY_ID} from '../../graphql/queries';
import {DELETE_CAPABILITY} from '../../graphql/mutations';
import {TagType} from '../../graphql/types';
import AddOrEditCapability from '../../components/Products/AddOrEditCapability';
import {DynamicHtml, Spinner} from '../../components';
import {getProp} from '../../utilities/filters';
import {TreeNode} from '../../utilities/constants';
import {setWorkState} from '../../lib/actions';
import {WorkState} from '../../lib/reducers/work.reducer';

import LeftPanelContainer from '../../components/HOC/withLeftPanel';
import {useRouter} from "next/router";

const pluralize = require('pluralize');
const {Search} = Input;


const Summary: React.FunctionComponent = () => {
  const router = useRouter();
  const {productSlug} = router.query;

  const [data, setData] = useState<any>({});
  const [treeData, setTreeData] = useState<any>([]);
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState<any>(null);

  const [showAddCapabilityModal, setShowAddOrEditModal] = useState(false);
  const [capabilityNode, setCapabilityNode] = useState<any>(null);
  const [modalType, setModalType] = useState<string>('');
  const [hideParent, setHideParent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, [])

  const {data: original, error, loading} = useQuery(GET_PRODUCT_BY_ID, {
    variables: {slug: productSlug, userId: userId == null ? 0 : userId}
  });

  // const [updateCapability, {error: updateError}] = useMutation(UPDATE_CAPABILITY, {
  //   onCompleted() {
  //     // setTreeData(
  //     //   updatedTreeData(treeData, 0, [])
  //     // );
  //   },
  //   onError() {
  //     message.error("Failed to update tree!").then();
  //   }
  // });

  const onSearch = (value: string) => setSearchString(value);

  const getSubTitle = (item: any) => {
    return item.available_tasks > 0
      ? `${item.available_tasks}/${item.tasks.length} ` + pluralize("Task", item.available_tasks) + " Available"
      : '';
  }

  const formatData = (data: any) => {
    return data.map((node: any) => ({
      id: getProp(node, 'id'),
      title: getProp(node, 'data.name'),
      children: node.children ? formatData(getProp(node, 'children', [])) : []
    }))
  };

  const updatedTreeData = (data: TreeNode[], index: number, children: TreeNode[]): TreeNode[] => {
    return data.map((node: TreeNode) => {
      if (node.id === index) {
        return {
          ...node,
          subtitle: getSubTitle(node),
          children
        }
      } else {
        if (node.children) {
          const newChildren = updatedTreeData(node.children, index, children);
          return {
            ...node,
            subtitle: getSubTitle(node),
            children: newChildren
          }
        }

        return node;
      }
    });
  }

  // const changeTree = (data: any) => {
  //   const {node, nextParentNode} = data;
  //
  //   if (nextParentNode && node.id === nextParentNode.id) {
  //   } else {
  //     updateCapability({
  //       variables: {
  //         input: {
  //           id: node.id,
  //           name: node.title,
  //           description: node.description,
  //           parent: nextParentNode ? nextParentNode.id : -1,
  //           productSlug
  //         },
  //         id: node.id
  //       }
  //     }).then();
  //   }
  // }

  const {
    data: capabilities,
    error: capabilitiesError,
    loading: capabilitiesLoading,
    refetch
  } = useQuery(GET_CAPABILITIES_BY_PRODUCT, {
    variables: {productSlug}
  });

  const convertDataAndSetTree = (capabilities: any) => {
    try {
      let capabilitiesStr: string = getProp(capabilities, 'capabilityNodes', '');
      capabilitiesStr = capabilitiesStr.replaceAll("'", '"');
      capabilitiesStr = capabilitiesStr.replaceAll(/\\\\"/g, "'");

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


  useEffect(() => {
    if (original) {
      setData(original);
    }
  }, [original]);

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
    setCapabilityNode({
      ...node,
      name: node.title
    });
    setModalType(type);
    setShowAddOrEditModal(true);
  }

  const count = getVisibleNodeCount({treeData});
  const mapHeight = count * 62;

  const isAdminOrManager = getProp(original, 'isAdminOrManager', false);

  if (loading) return <Spinner/>

  return (
    <LeftPanelContainer>
      {
        // !error && !updateError && (
        !error && (
          <div>
            <Row justify="end" className="right-panel-headline mb-15">
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
            </Row>
            <Row>
              {getProp(data, 'product.videoUrl', null) !== null && (
                <Col className="product-video">
                  <ReactPlayer
                    width="100%"
                    height="200px"
                    url={getProp(data, 'product.videoUrl')}
                  />
                </Col>
              )}
              <Col xs={24} md={10} className="product-info-panel">
                <div className="description">
                  <DynamicHtml
                    text={getProp(data, 'product.fullDescription', '')}
                  />
                </div>
                {
                  getProp(data, 'product.tag', []).map((tag: TagType, idx: number) => (
                    <Tag key={`tag-${idx}`}>{tag.name}</Tag>
                  ))
                }
              </Col>
            </Row>
            <Divider/>
            <div className='mt-15'>
              <Row justify="space-between" className='mb-10'>
                <Col>
                  <div className="section-title">Featured Available Work:</div>
                </Col>
                {/* <Col>See all available work</Col> */}
              </Row>
              <Row

                justify="space-between"
              >
                {
                  getProp(data, 'product.capabilitySet', []).map((capability: any, idx: number) => {
                    if (capability.availableTaskNum > 0) {
                      const direction = idx % 2 === 0 ? 'left' : 'right';
                      return (
                        <Col key={`cap-${idx}`} span={12} style={{textAlign: direction}}>
                          <Link href={`/products/${productSlug}/capabilities/${capability.id}`}>
                            {capability.name}
                          </Link>&nbsp;
                          {`(${capability.availableTaskNum}/${capability.taskSet.length} 
                            Available ${pluralize("Task", capability.availableTaskNum)})`}
                        </Col>
                      )
                    }
                    return null;
                  })
                }
              </Row>
            </div>
            <Divider/>
            <div className='mt-15'>
              <Row justify="space-between">
                <Col>
                  <div className="section-title mb-15">Product Map</div>
                </Col>
              </Row>
              <Row justify="space-between">
                <Col>
                  <div className="section-title">{getProp(data, "product.name", '')}</div>
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
              </Row>
              <div style={{height: mapHeight}}>
                <SortableTree
                  treeData={treeData}
                  onChange={(treeData: TreeNode[]) => setTreeData(treeData)}
                  // onMoveNode={changeTree}
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
                    // subtitle: (
                    //   <div className={classnames({'mt-5': getProp(node, 'tasks', []).length > 0})}>
                    //     {
                    //       getProp(node, 'tasks', []).map((task: any) => {
                    //         return task.status === 0 && (
                    //           <span key={randomKeys()}>
                    //             <Link
                    //               href={`/products/${productSlug}/tasks/${task.id}`}
                    //             >
                    //               <a className="ml-5">{`#${task.id}`}</a>
                    //             </Link>
                    //           </span>
                    //         )
                    //       })
                    //     }
                    //   </div>
                    // )
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
                    capability={capabilityNode}
                    closeModal={setShowAddOrEditModal}
                    submit={refetch}
                    hideParentOptions={hideParent}
                />
              }
            </div>
          </div>
        )
      }
    </LeftPanelContainer>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  work: state.work,
});

const mapDispatchToProps = (dispatch: any) => ({
  saveProductToStore: (data: WorkState) => dispatch(setWorkState(data))
});

const SummaryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);

export default SummaryContainer;