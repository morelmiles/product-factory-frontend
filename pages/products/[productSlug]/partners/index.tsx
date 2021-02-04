
import React from 'react';
import { RouteComponentProps, matchPath } from 'react-router';
import { Row, Divider } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_PARTNERS } from '../../../../graphql/queries';
import { PARTNER_TYPES } from '../../../../graphql/types';
import { getProp } from '../../../../utilities/filters';
import { randomKeys } from '../../../../utilities/utils';
import CustomAvatar from '../../../../components/CustomAvatar';
import { Spinner } from '../../../../components';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';

type Params = {
  productSlug?: any
};

const Commercial: React.FunctionComponent<Params> = ({ productSlug }) => {
  const { data, error, loading } = useQuery(GET_PARTNERS, {
    variables: {
      productSlug
    }
  });

  if(loading) return <Spinner/>

  return (
    <LeftPanelContainer productSlug={productSlug}>
      {
        !error && (
          <>
            {
              getProp(data, 'partners', []).map((partner: any, idx: number) => (
                <React.Fragment key={randomKeys()}>
                  <Row>
                    <div className="my-auto mr-8">
                      { CustomAvatar(partner.company, "name", 64) }
                    </div>
                    <div className="contributor-item my-auto">
                      <div className="contributor-item__name font-bold">
                        {getProp(partner, 'company.name', '')}
                      </div>
                      <div>
                        {PARTNER_TYPES[getProp(partner, 'role', 0)]}
                      </div>
                    </div>
                  </Row>
                  {
                    idx !== data.partners.length - 1 ? <Divider /> : null
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

Commercial.getInitialProps = async ({ query }) => {
    const { productSlug } = query;
    return { productSlug }
}
export default Commercial;