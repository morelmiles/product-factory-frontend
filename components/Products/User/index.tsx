import React from 'react';
import {Divider} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {GET_PRODUCT_PERSONS} from '../../../graphql/queries';
import {getProp} from '../../../utilities/filters';
import {randomKeys} from '../../../utilities/utils';
import {CustomAvatar} from '../../../components';
import Loading from "../../Loading";
import {useRouter} from "next/router";


const User: React.FunctionComponent = () => {
  const router = useRouter();
  const {productSlug} = router.query;

  const {data, error, loading} = useQuery(GET_PRODUCT_PERSONS, {
    variables: {productSlug}
  });

  if (loading) return <Loading/>

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
                    idx !== data.productRoles.length - 1 ? <Divider/> : null
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