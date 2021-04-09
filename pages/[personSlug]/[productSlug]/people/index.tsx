import React, {useEffect, useState} from 'react';
import {Col, Divider, Radio, Row, Space, Typography} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {GET_PRODUCT_PERSONS} from '../../../../graphql/queries';
import {getProp} from '../../../../utilities/filters';
import {randomKeys} from '../../../../utilities/utils';
import {CustomAvatar} from '../../../../components';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import {RadioChangeEvent} from "antd/es";
import {Social} from "../../../../components/Profile/ProfileTop";
import Link from "next/link";
import Loading from "../../../../components/Loading";
import {useRouter} from "next/router";


const peopleData = (data: any) => {
  return data.length > 0 ? data.map((item: any, index: number) => {
    const socials = getProp(item.person, 'personsocialSet', []);
    return (
      <div key={`person-${index}`} className="product-list-item">
        <Row>
          <Col xs={24}>
            <Row wrap={false}>
              {CustomAvatar(item.person, 'fullName', 64)}
              <div style={{paddingLeft: 10}}>
                <Row>
                  <Typography.Text
                    strong
                    className="black-color"
                    style={{fontSize: 14}}
                  >
                    <Link href={`/${getProp(item, 'person.slug', '')}`}>
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
              </div>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }) : "The list is empty"
}


const PeopleList: React.FunctionComponent = () => {
  const router = useRouter();
  const {productSlug} = router.query;
  const [contributors, setContributors] = useState([]);
  const [productTeam, setProductTeam] = useState([]);

  const {data, error, loading} = useQuery(GET_PRODUCT_PERSONS, {
    variables: {productSlug}
  });

  useEffect(() => {
    if (data?.productPersons) {
      const {contributors, productTeam} = data.productPersons;
      setContributors(contributors);
      setProductTeam(productTeam);
    }
  }, [data])

  if (loading) return <Loading/>;

  console.log("productTeam", productTeam)

  return (
    <LeftPanelContainer>
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
      <div>
        <div className="mb-20 mt-10">
          <Typography.Title level={4}>Product Team</Typography.Title>
          {peopleData(productTeam)}
        </div>

        <div className="mb-10">
          <Typography.Title level={4}>Contributors</Typography.Title>
          {peopleData(contributors)}
        </div>
      </div>
    </LeftPanelContainer>
  );
}

export default PeopleList;