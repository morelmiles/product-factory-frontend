import React from 'react';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import {Avatar, Menu, Row} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {GET_PRODUCT_INFO_BY_ID} from '../../../graphql/queries';
import {getProp} from '../../../utilities/filters';
import {getInitialName, getUserRole, hasAdminRoots} from '../../../utilities/utils';
import {WorkState} from '../../../lib/reducers/work.reducer';
import {setWorkState} from '../../../lib/actions';


interface ILeftPanelProps {
  user: any
  saveProductToStore?: any
}

interface ILink {
  type: string
  name: string
  url: string
}

const LeftPanel: React.FunctionComponent<ILeftPanelProps> = ({user}): any => {
  const router = useRouter()
  const {productSlug} = router.query

  let links: ILink[] = [
    {url: '/', type: 'summary', name: 'Summary'},
    {url: '/initiatives', type: 'initiatives', name: 'Initiatives'},
    {url: '/tasks', type: 'tasks', name: 'Tasks'},
    {url: '/capabilities', type: 'capabilities', name: 'Product Map'},
    {url: '/people', type: 'people', name: 'People'},
    {url: '/partners', type: 'partners', name: 'Commercial Partners'}
  ];

  const userHasAdminRoots = hasAdminRoots((getUserRole(user.roles, productSlug)));

  if (userHasAdminRoots) {
    links.push(
      {url: '/settings', type: 'settings', name: 'Settings'}
    );
  }

  const {data: product, error: productError, loading} = useQuery(GET_PRODUCT_INFO_BY_ID, {
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

  if (loading) return null;

  return (
    <>
      {
        !productError && (
          <div className="left-panel">
            <Row className="profile">
              <div className="my-auto">
                <Avatar style={{marginRight: 15}}>
                  {getInitialName(getProp(product, 'product.name', ''))}
                </Avatar>
              </div>
              <div>
                <div className="page-title">{getProp(product, 'product.name', '')}</div>
                <div>
                  <a className="custom-link"
                     href={getProp(product, 'product.website', '')}
                  >
                    {getProp(product, 'product.website', '')}
                  </a>
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