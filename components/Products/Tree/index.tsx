import React from 'react';

const Tree: React.FunctionComponent = () => {
    return (
        <SortableTree
            treeData={treeData}
            // onChange={(treeData: TreeNode[]) => setTreeData(treeData)}
            onChange={(treeData: TreeNode[]) => console.log('window',window)}

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
                <Link href={`/products/${productSlug}/capabilities/${node.id}`}>
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
                            href={`/products/${productSlug}/tasks/${task.id}`}
                            className='ml-5'
                        >
                            {`#${task.id}`}
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
    )
}