import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Link from 'next/link';
import {useQuery} from '@apollo/react-hooks';
import {Col, Divider, Row, Tag, Typography} from 'antd';
import ReactPlayer from 'react-player';
import {GET_PRODUCT_BY_ID, GET_TASKS_BY_PRODUCT} from '../../graphql/queries';
import {TagType} from '../../graphql/types';
import {DynamicHtml} from '../../components';
import {getProp} from '../../utilities/filters';
import {setWorkState} from '../../lib/actions';
import {WorkState} from '../../lib/reducers/work.reducer';
import LeftPanelContainer from '../../components/HOC/withLeftPanel';
import {useRouter} from "next/router";
import Loading from "../../components/Loading";
import ProductMapTree from "../../components/ProductMapTree";


const Summary: React.FunctionComponent = () => {
  const router = useRouter();
  const {productSlug} = router.query;

  const [data, setData] = useState<any>({});

  const [userId, setUserId] = useState<string | null>(null);
  const [availableTasksAmount, setAvailableTasksAmount] = useState(0);


  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const {data: original, error, loading} = useQuery(GET_PRODUCT_BY_ID, {
    variables: {slug: productSlug, userId: userId == null ? 0 : userId}
  });

  let {data: tasks, error: tasksError, loading: tasksLoading} = useQuery(GET_TASKS_BY_PRODUCT, {
    variables: {
      productSlug,
      userId: userId == null ? 0 : userId,
      input: {statuses: [2]} // 2 - Available
    }
  });

  useEffect(() => {
    if (!tasksError) {
      setAvailableTasksAmount(getProp(tasks, 'tasksByProduct', 0).length)
    }
  }, [tasks]);


  const formatData = (data: any) => {
    return data.map((node: any) => ({
      id: getProp(node, 'id'),
      title: getProp(node, 'data.name'),
      children: node.children ? formatData(getProp(node, 'children', [])) : []
    }))
  }

  useEffect(() => {
    if (original) {
      setData(original);
    }
  }, [original]);

  if (loading || tasksLoading) return <Loading/>


  return (
    <LeftPanelContainer>
      {
        !error && (
          <div>
            <Row>
              <Typography.Text strong style={{
                fontSize: '1.5rem',
                marginBottom: 12
              }}>About {getProp(data, 'product.name', '')}</Typography.Text>
            </Row>
            <Row>
              <Col xs={24} md={13}>
                <div className="description" style={{paddingRight: 40}}>
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
              {
                getProp(data, 'product.videoUrl', null) !== null && (
                  <Col xs={24} md={11} span={11} className="product-video">
                    <ReactPlayer
                      width="100%"
                      height="200px"
                      url={getProp(data, 'product.videoUrl')}
                    />
                  </Col>
                )
              }
            </Row>
            <Divider/>
            <div className='mt-15'>
              <Row justify="space-between" className='mb-10'>
                <Col>
                  <Link href={`/products/${productSlug}/tasks#available`}>
                    <Typography.Link strong style={{fontSize: '1.1rem'}}>{availableTasksAmount} Available
                      Tasks</Typography.Link>
                  </Link>
                </Col>
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
                            Available Tasks ${capability.availableTaskNum})`}
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
              <Row>
                <ProductMapTree/>
              </Row>
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