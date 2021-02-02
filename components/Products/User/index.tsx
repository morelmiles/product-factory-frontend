
import React from 'react';
import { RouteComponentProps, matchPath } from 'react-router';
import { Divider } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCT_ROLES } from 'graphql/queries';
import { getProp } from 'utilities/filters';
import { randomKeys } from 'utilities/utils';
import { CustomAvatar, Spinner } from 'components';

type Params = {
  productSlug?: any
}

const User: React.SFC<RouteComponentProps<Params>> = ({ match }) => {
  const params: any = matchPath(match.url, {
    path: "/products/:productSlug/people",
    exact: false,
    strict: false
  });
  const { data, error, loading } = useQuery(GET_PRODUCT_ROLES, {
    variables: { productSlug: params.params.productSlug }
  });

  if(loading) return <Spinner/>

  return (
    <>
      {
        !error && (
          <>
            {
              getProp(data, 'productRoles', []).map((role: any, idx: number) => (
                <React.Fragment key={randomKeys()}>
                  {CustomAvatar(role.person, "fullName", 64, role)}
                  {
                    idx !== data.productRoles.length - 1 ? <Divider /> : null
                  }
                </React.Fragment>
              ))
            }
          </>
        )
      }
    </>
  );
};

export default User;