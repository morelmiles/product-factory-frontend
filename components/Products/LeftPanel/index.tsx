import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Avatar, Menu, Row} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {GET_PRODUCT_INFO_BY_ID} from '../../../graphql/queries';
import {getProp} from '../../../utilities/filters';
import {getInitialName} from '../../../utilities/utils';
import {WorkState} from '../../../lib/reducers/work.reducer';
import {setWorkState} from '../../../lib/actions';
import {Spinner} from '../../Spinner';

type Props = {
  productSlug: any;
  saveProductToStore?: any;
};

type LinkType = {
  type: string;
  name: string;
  url: string;
}

const links: LinkType[] = [
  {url: '/', type: 'summary', name: 'Summary'},
  {url: '/initiatives', type: 'initiatives', name: 'Initiatives'},
  {url: '/tasks', type: 'tasks', name: 'Tasks'},
  {url: '/capabilities', type: 'capabilities', name: 'Capabilities'},
  {url: '/people', type: 'people', name: 'People'},
  {url: '/partners', type: 'partners', name: 'Commercial Partners'}
]

const LeftPanel: React.FunctionComponent<Props> = ({productSlug}): any => {
  const router = useRouter();
  const {data, error, loading} = useQuery(GET_PRODUCT_INFO_BY_ID, {
    variables: {slug: productSlug}
  });
  const selectedIndex: number = links.findIndex((item: any) => {
    return router.asPath.includes(item.type);
  });
  const selectedLink = selectedIndex === -1
    ? links[0].type : links[selectedIndex].type;

  const goToDetail = (type: string) => {
    router.push(`/products/${productSlug}${type}`).then();
  }

  // useEffect(() => {
  //   if (data) {
  //     saveProductToStore({
  //       userRole: data.userRole,
  //       tags: data.product.tag,
  //       currentProduct: data.product,
  //       repositories: data.repositories,
  //       allTags: data.tags
  //     })
  //   }
  // }, [data]);
  console.log(data, error, loading)

  if (loading) return <Spinner/>

  return (
    <>
      {
        !error && (
          <div className="left-panel">
            <Row className="profile">
              <div className="my-auto">
                <Avatar style={{marginRight: 15}}>
                  {getInitialName(getProp(data, 'product.name', ''))}
                </Avatar>
              </div>
              <div>
                <div className="page-title">{getProp(data, 'product.name', '')}</div>
                <div>
                  <Link href="">
                    <a className="custom-link">{getProp(data, 'product.website', '')}</a>
                  </Link>
                </div>
              </div>
            </Row>
            <Menu mode="inline" selectedKeys={[selectedLink]}>
              {links.map((link: any, index: number) => (
                <Menu.Item
                  key={index}
                  onClick={() => goToDetail(link.url)}
                >
                  {link.name}
                </Menu.Item>
              ))}
            </Menu>
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

const LeftPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPanel);

export default LeftPanelContainer;