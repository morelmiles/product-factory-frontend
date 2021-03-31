import React, {useState} from 'react';
import {Col, Radio, Row, Typography, Button} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {GET_PRODUCT_IDEAS, GET_PRODUCT_BAGS} from '../../../../graphql/queries';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import {RadioChangeEvent} from "antd/es";
import Link from "next/link";
import Loading from "../../../../components/Loading";
import {useRouter} from "next/router";
import CustomAvatar2 from "../../../../components/CustomAvatar2";

type Props = {
  user: { isLoggedIn: boolean, id: string },
};

const ItemList = (items: any, itemType: string, personSlug: string, productSlug: string) => {
  return (
    <>
      {items.length > 0 ? items.map((item: any, index: number) => {
        const {person, relatedCapability} = item;
        const assignPersonSlug = person.slug;
        return (
          <div key={`person-${index}`} className="product-list-item">
            <Row>
              <Col xs={24}>
                <Row wrap={false}>
                  <Col span={16}>
                    <div style={{paddingLeft: 10}}>
                      <Row>
                        <Link
                          href={`/${personSlug}/${productSlug}/${itemType}/${item.id}`}
                        >
                          <a className="text-grey-9">
                            <strong>
                              <Row align="middle">
                                {item.headline}
                              </Row>
                            </strong>
                          </a>
                        </Link>
                      </Row>
                      <Row style={{marginBottom: 10}}>
                        <Col>
                          <Typography.Text
                            type="secondary"
                            style={{marginBottom: 5}}
                          >{item.description}</Typography.Text>
                        </Col>
                      </Row>
                      {relatedCapability && (
                        <Row align="middle">

                          <Link href={`/${personSlug}/${productSlug}/capabilities/${relatedCapability.id}`}>
                            <span className="text-grey-9 pointer link">
                              {relatedCapability.name}
                            </span>
                          </Link>
                        </Row>
                      )}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="mt-10">
                      <div className="d-flex-end" style={{fontSize: 13}}>
                        <Link href={`/${assignPersonSlug}`}>
                          <CustomAvatar2 person={{fullname: person.fullName, slug: assignPersonSlug}} size={35}/>
                        </Link>
                        <Link href={`/${assignPersonSlug}`}>
                          {person.fullName}
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )
      }) : `The ${itemType} list is empty`}
    </>
  )
}


const IdeasAndBugs: React.FunctionComponent<Props> = (props: Props) => {
  const router = useRouter();
  const {productSlug, personSlug} = router.query;
  const {user} = props;
  const [mode, setMode] = useState('ideas');
  const [showIdeaAddModal, setIdeaShowAddModal] = useState(false);
  const [showBugAddModal, setBugShowAddModal] = useState(false);
  const {data: ideas, loading: ideasLoading} = useQuery(GET_PRODUCT_IDEAS, {
    variables: {productSlug},
    fetchPolicy: "no-cache"
  });

  const {data: bugs, loading: bugsLoading} = useQuery(GET_PRODUCT_BAGS, {
    variables: {productSlug},
    fetchPolicy: "no-cache"
  });

  const ideaMode = mode === "ideas";

  if (ideasLoading || bugsLoading) return <Loading/>;

  return (
    <LeftPanelContainer>
      <div className="mb-15 d-flex-justify">
        <Radio.Group
          onChange={(e: RadioChangeEvent) => setMode(e.target.value)}
          value={mode}
          style={{marginBottom: 20}}
        >
          <Radio.Button value="ideas"
                        style={{borderRadius: '5px 0 0 5px'}}>Ideas</Radio.Button>
          <Radio.Button value="bugs"
                        style={{borderRadius: '0 5px 5px 0'}}>Bugs</Radio.Button>
        </Radio.Group>
        {user.isLoggedIn && (
          <Button
            className="text-right add-task-btn"
            style={{marginLeft: "auto"}}
            onClick={() => ideaMode ? setIdeaShowAddModal(true) : setBugShowAddModal(true)}
          >
            Add {ideaMode ? "Idea" : "Bug"}
          </Button>
        )}
      </div>
      <>
        {ideaMode
          ? ItemList(ideas?.ideas || [], "ideas", personSlug, productSlug)
          : ItemList(bugs?.bugs || [], "bugs", personSlug, productSlug)
        }
      </>
    </LeftPanelContainer>
  );
}

const mapStateToProps = (state: any) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(IdeasAndBugs)
