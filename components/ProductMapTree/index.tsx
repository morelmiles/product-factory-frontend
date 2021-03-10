import SortableTree, {getVisibleNodeCount} from "react-sortable-tree";
import {TreeNode} from "../../utilities/constants";
import {Button, Col, Input, message, Row, Typography} from "antd";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {DELETE_CAPABILITY, UPDATE_CAPABILITY_TREE} from "../../graphql/mutations";
import {getProp} from "../../utilities/filters";
import {GET_CAPABILITIES_BY_PRODUCT} from "../../graphql/queries";
import {useRouter} from "next/router";
import Loading from "../Loading";
import AddOrEditCapability from "../Products/AddOrEditCapability";


const {Search} = Input;


const ProductMapTree = () => {
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

  const formatData = (data: any) => {
    return data.map((node: any) => ({
      id: getProp(node, 'id'),
      title: getProp(node, 'data.name'),
      children: node.children ? formatData(getProp(node, 'children', [])) : []
    }))
  }

  const {
    data: capabilities,
    error: capabilitiesError,
    loading: capabilitiesLoading,
    refetch
  } = useQuery(GET_CAPABILITIES_BY_PRODUCT, {
    variables: {productSlug, userId: userId == null ? 0 : userId}
  });

  useEffect(() => {
    if (!capabilitiesError && !capabilitiesLoading) {
      convertDataAndSetTree(capabilities);
    }
  }, [capabilities]);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
    onCompleted() {
      message.success('Item is successfully deleted!').then();
      refetch().then();
    },
    onError() {
      message.error('Failed to delete item!').then();
    }
  });

  const [updateCapabilityTree] = useMutation(UPDATE_CAPABILITY_TREE, {
    onCompleted(res) {
      if (getProp(res, 'updateCapabilityTree.status', false)) {
        message.success('Product map was updated').then();
      } else {
        message.error('Failed to update product map').then();
      }
    },
    onError() {
      message.error('Failed to update product map').then();
    }
  });

  const treeChangeHandler = () => {
    updateCapabilityTree({
      variables: {
        productSlug,
        tree: JSON.stringify(treeData)
      }
    }).then()
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

  const onSearch = (value: string) => setSearchString(value);
  const isAdminOrManager = getProp(capabilities, 'isAdminOrManager', false);

  if (capabilitiesLoading) return <Loading/>

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

  const count = getVisibleNodeCount({treeData});
  const mapHeight = count * 62;
  console.log(treeData)
  return !capabilitiesError ? (
    <Row style={{width: '100%'}}>
      <Row justify="space-between" style={{width: '100%', marginBottom: 20}}>
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

      <Row style={{width: '100%'}}>
        <div style={{height: mapHeight, width: '100%'}}>
          <SortableTree
            treeData={treeData}
            onChange={(treeData: TreeNode[]) => setTreeData(treeData)}
            canDrag={isAdminOrManager}
            onMoveNode={treeChangeHandler}
            searchMethod={customSearchMethod}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={onTreeSearch}
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
          />
        </div>
      </Row>

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
    </Row>
  ) : <p>klgtrgutri</p>
}

export default ProductMapTree;