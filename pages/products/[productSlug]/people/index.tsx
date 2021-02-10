
import React from 'react';
import { Divider } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCT_PERSONS } from '../../../../graphql/queries';
import { getProp } from '../../../../utilities/filters';
import { randomKeys } from '../../../../utilities/utils';
import { CustomAvatar, Spinner } from '../../../../components';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';

type Params = {
  productSlug?: any
}

const PeopleList: React.FunctionComponent<Params> = ({ productSlug }) => {
//   const params: any = matchPath(match.url, {
//     path: "/products/:productSlug/people",
//     exact: false,
//     strict: false
//   });
  const { data, error, loading } = useQuery(GET_PRODUCT_PERSONS, {
    variables: { productSlug }
  });

  if(loading) return <Spinner/>

  return (
    <LeftPanelContainer productSlug={productSlug}>
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
    </LeftPanelContainer>
  );
};

PeopleList.getInitialProps = async ({ query }) => {
    const { productSlug } = query;
    return { productSlug }
}

export default PeopleList;