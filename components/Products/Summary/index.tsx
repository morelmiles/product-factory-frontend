
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Row, Col, Tag, Divider, Input, message, Button } from 'antd';
import ReactPlayer from 'react-player';
import SortableTree, { getVisibleNodeCount } from 'react-sortable-tree';
import parse from 'html-react-parser';
import { GET_PRODUCT_BY_ID } from 'graphql/queries';
import { UPDATE_CAPABILITY, DELETE_CAPABILITY } from 'graphql/mutations';
import { TagType } from 'graphql/types';
import AddCapability from 'pages/Products/AddCapability';
import { DynamicHtml, Spinner } from 'components';
import { getProp } from 'utilities/filters';
import { randomKeys } from 'utilities/utils';
import { DataNode, TreeNode } from 'utilities/constants';
import { apiDomain } from 'utilities/constants';
import { setWorkState } from 'store/actions';
import { WorkState } from 'store/reducers/work.reducer';

import 'react-sortable-tree/style.css';
import classnames from 'classnames';

var pluralize = require('pluralize');

const { Search } = Input;

type Params = {
  productSlug?: any;
  saveProductToStore: any;
} & RouteComponentProps

const Summary: React.SFC<Params> = ({ match, saveProductToStore }) => {
  const initialData: TreeNode[] = [];
  const [data, setData] = useState<any>({});
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState<any>(null);
  // modal attributes
  const [showEditModal, setShowEditModal] = useState(false);
  const [capabilityNode, setCapabilityNode] = useState<any>(null);
  const [isEdit, setModalType] = useState(false);
  const [hideParent, setHideParent] = useState(false);

  const params: any = matchPath(match.url, {
    path: "/products/:productSlug",
    exact: false,
    strict: false
  });

  const productSlug = params.params.productSlug;

  const { data: original, error, loading } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { slug: productSlug }
  });

  const [updateCapability, { error: updateError }] = useMutation(UPDATE_CAPABILITY, {
    onCompleted(data) {
      setTreeData(
        updatedTreeData(treeData, 0, [])
      );
    },
    onError(err) {
      console.log("update item error: ", err);
      message.error("Failed to update tree!");
    }
  });

  const onSearch = (value: string) => setSearchString(value);

  const getSubTitle = (item: any) => {
    let subtitle = item.available_tasks > 0
      ? `${item.available_tasks}/${item.tasks.length} ` + pluralize("Task", item.available_tasks) + " Available"
      : '';
    // subtitle += item.children.length > 0 ? pluralize("Capability", item.children.length, true) : '';
    return subtitle;
  }

  /* Functions for format api response and tree changes */
  const formatData = (data: DataNode[]): TreeNode[] => {
    return data.map((item: DataNode) => {
      if (item.children.length === 0) {
        return {
          id: item.id,
          title: item.name,
          description: item.description,
          parentId: item.parent,
          subtitle: getSubTitle(item),
          tasks: item.tasks,
          available_tasks: item.available_tasks,
          children: []
        }
      } else {
        if (item.children) {
          return {
            id: item.id,
            title: item.name,
            description: item.description,
            parentId: item.parent,
            subtitle: getSubTitle(item),
            tasks: item.tasks,
            available_tasks: item.available_tasks,
            children: formatData(item.children)
          }
        }

        return {
          id: item.id,
          title: item.name,
          description: item.description,
          parentId: item.parent,
          subtitle: getSubTitle(item),
          tasks: item.tasks,
          available_tasks: item.available_tasks,
          children: []
        }
      }
    });
  }

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
          const newchildren = updatedTreeData(node.children, index, children);
          return {
            ...node,
            subtitle: getSubTitle(node),
            children: newchildren
          }
        }

        return node;
      }
    });
  }

  const changeTree = (data: any) => {
    const { node, nextParentNode } = data;

    if (nextParentNode && node.id === nextParentNode.id) {
    } else {
      updateCapability({
        variables: {
          input: {
            id: node.id,
            name: node.title,
            description: node.description,
            parent: nextParentNode ? nextParentNode.id : -1,
            productSlug: productSlug
          },
          id: node.id
        }
      });
    }
  }

  const fetchData = () => {
    fetch(`${apiDomain}/api/${productSlug}/capabilities/`)
      .then(response => response.json())
      .then((res) => {
        if (res) {
          setTreeData(formatData(res));
        }
      })
  }

  useEffect(() => {
    if (original) {
      saveProductToStore({
        userRole: original.userRole,
        tags: original.product.tag,
        currentProduct: original.product,
        repositories: original.repositories,
        allTags: original.tags
      })
      setData(original);
      fetchData();
    }
  }, [original]);

  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
    onCompleted(data) {
      fetchData();
      message.success("Item is successfully deleted!");
    },
    onError(err) {
      console.log("Delete item error: ", err);
      message.error("Failed to delete item!");
    }
  });

  /* Events for tree */
  const removeNode = (node: any) => {
    deleteCapability({
      variables: {
        id: node.id
      }
    });
  }

  const customSearchMethod = (data: any) => {
    const { node, searchQuery } = data;
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
    const index: number =
      searchFocusIndex !== null
        ? (searchFocusIndex + 1) % searchFoundCount
        : 0;
    setSearchFocusIndex(index);
  }

  const onTreeSearch = (matches: any) => {
    setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
    setSearchFoundCount(matches.length);
  }

  const editNode = (type: boolean, node: any) => {
    setCapabilityNode({
      ...node,
      name: node.title
    });
    setModalType(type);
    setShowEditModal(true);
  }

  const count = getVisibleNodeCount({ treeData });
  const mapHeight = count * 62;

  if(loading) return <Spinner/>

  return (
    <>
      {
        !error && !updateError && (
          <div>
            <Row justify="end" className="right-panel-headline mb-15">
              <Col>
                <Button
                  onClick={
                    () => {
                      setModalType(false);
                      setHideParent(false);
                      setShowEditModal(true)
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
            <Divider />
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
                          <Link to={`/products/${productSlug}/capabilities/${capability.id}`}>
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
            <Divider />
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

                  <Search placeholder="Search text" className='mr-10' onSearch={onSearch} style={{ width: 200 }} />
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
                  <div>{ searchFoundCount > 0 && `${searchFoundCount} items found!`}</div>
                </Col>
              </Row>
              <div style={{ height: mapHeight }}>
                <SortableTree
                  treeData={treeData}
                  onChange={(treeData: TreeNode[]) => setTreeData(treeData)}
                  onMoveNode={changeTree}
                  canDrag={() => getProp(data, 'product.isAdmin', false)}
                  generateNodeProps={({ node, path }) => ({
                    buttons: getProp(data, 'product.isAdmin', false)
                      ? [
                          <>
                            <button
                              className='mr-10'
                              onClick={() => {
                                setHideParent(true);
                                editNode(false, node)
                              }}
                            >
                              Add
                            </button>
                            <button
                              className='mr-10'
                              onClick={() => {
                                setHideParent(true);
                                editNode(true, node);
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
                        <Link to={`/products/${productSlug}/capabilities/${node.id}`}>
                          {node.title}
                        </Link>
                        <div className='pl-25'>{node.subtitle}</div>
                      </Row>
                    ),
                    subtitle: (
                      <div className={classnames({ 'mt-5': getProp(node, 'tasks', []).length > 0 })}>
                        {
                          getProp(node, 'tasks', []).map((task: any) => {
                            return task.status === 0 && (
                              <span key={randomKeys()}>
                                <Link
                                  to={`/products/${productSlug}/tasks/${task.id}`}
                                  className='ml-5'
                                >
                                  #{task.id}
                                </Link>
                              </span>
                            )
                          })
                        }
                      </div>
                    )
                  })}
                  searchMethod={customSearchMethod}
                  searchQuery={searchString}
                  searchFocusOffset={searchFocusIndex}
                  searchFinishCallback={onTreeSearch}
                />
              </div>
              {
                showEditModal && <AddCapability
                  modal={showEditModal}
                  productSlug={productSlug}
                  modalType={isEdit}
                  capability={capabilityNode}
                  closeModal={setShowEditModal}
                  submit={fetchData}
                  hideParentOptions={hideParent}
                />
              }
            </div>
          </div>
        )
      }
    </>
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
