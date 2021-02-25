import React, {useState} from 'react';
import {Col, Divider, Radio, Row, Space, Typography} from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCT_PERSONS } from '../../../../graphql/queries';
import { getProp } from '../../../../utilities/filters';
import { randomKeys } from '../../../../utilities/utils';
import {CustomAvatar, Spinner} from '../../../../components';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import {RadioChangeEvent} from "antd/es";
import {Social} from "../../../../components/Profile/ProfileTop";
import Link from "next/link";

type Params = {
  productSlug?: any
}

const PeopleList: React.FunctionComponent<Params> = ({ productSlug }) => {
  const [mode, setMode] = useState('contributors');
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
      <div className="mb-15">
        <Radio.Group
          onChange={(e: RadioChangeEvent) => setMode(e.target.value)}
          value={mode}
          style={{marginBottom: 20}}
        >
          <Radio.Button value="leaderships"
                        style={{borderRadius: '5px 0 0 5px'}}>Products</Radio.Button>
          <Radio.Button value="contributors"
                        style={{borderRadius: '0 5px 5px 0'}}>Contributors</Radio.Button>
        </Radio.Group>
      </div>
      {mode === "contributors" ? (
        <div>
          {data?.productPersons.length > 0 ? (
            <>
              {data.productPersons.map((item: any, index: number) => {
                const socials = getProp(item.person, 'personsocialSet', []);
                return (
                  <div key={`person-${index}`} className="product-list-item">
                    <Row>
                      <Col xs={24} lg={18}>
                        <Row>
                          <Row>
                            <Col>
                              {CustomAvatar(item.person, 'fullName', 64)}
                            </Col>
                            <Col>
                              <Row>
                                <Typography.Text
                                  strong
                                  className="black-color"
                                  style={{fontSize: 14}}
                                >
                                  <Link href={`/people/${getProp(item, 'person.slug', '')}`}>
                                    {getProp(item, 'person.fullName', '')}
                                  </Link>
                                  </Typography.Text>
                              </Row>
                              <Row>
                                <Typography.Text
                                  style={{fontSize: 14, padding: "2px 0"}}
                                >{getProp(item, 'person.headline', '')}</Typography.Text>
                              </Row>
                              <Row style={{fontSize: 16, color: '#8C8C8C'}}>
                                <Space size={8}>
                                    {
                                        socials.map((social: any, index: number) => (
                                            <a key={index} style={{color: '#999'}} href={social.url}>
                                                <Social name={social.name}/>
                                            </a>
                                        ))
                                    }
                                </Space>
                              </Row>
                            </Col>
                          </Row>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )
              })}
            </>
          ) : "The contributors list is empty"}
        </div>
      ) : null}
    </LeftPanelContainer>
  );
};

PeopleList.getInitialProps = async ({ query }) => {
    const { productSlug } = query;
    return { productSlug }
}

export default PeopleList;