import React, {useEffect, useState} from 'react';
import '../../../../styles/Profile.module.less';
import {Col, Layout, Row, Spin, Table, Typography} from "antd";
import Header from "../../../../components/Header";
import ContainerFlex from "../../../../components/ContainerFlex";
import {getProp} from "../../../../utilities/filters";
import {formatDate} from "../../../../utilities/utils";
import Link from 'next/link';
import {useQuery} from "@apollo/react-hooks";
import {GET_PERSON_PROFILE, GET_REVIEW_BY_ID, GET_TASKS_BY_PRODUCT} from "../../../../graphql/queries";
import {useRouter} from "next/router";
import {CustomAvatar, StarScore} from "../../../../components";
import ReactPlayer from "react-player";
import ProfileTop from "../../../../components/Profile/ProfileTop";

const {Content} = Layout;


const ProfileItem: React.FunctionComponent = () => {
    const router = useRouter()
    const {personSlug, profileItemId} = router.query

    const [mode, setMode] = useState("given");
    const [dataSource, setDataSource] = useState<any>([]);
    // const {data, error, loading} = useQuery(GET_PERSON_PROFILE, {
    //     variables: {personSlug}
    // });

    const {
        data: review,
        error: reviewError,
        loading: reviewLoading
    } = useQuery(GET_REVIEW_BY_ID, {
        variables: {
            reviewId: parseInt(profileItemId as string),
            personSlug
        }
    });

    console.log(review);
    // const {refetch} = useQuery(GET_TASKS_BY_PRODUCT, {
    //     variables: {productId: null, status: 3}
    // });

    const filterReviews = (type: string) => {
        const newReviews = getProp(review, 'review.productReviews', []);
        return type === "given"
            ? newReviews.filter(
                (item: any) => item.createdBy.slug === profileItemId
            )
            : newReviews.filter(
                (item: any) => item.createdBy.slug !== profileItemId
            )
    }

    // const fetchData = async (review: any) => {
    //     const {data} = await refetch({
    //         productId: review.review.review.product.id,
    //         status: 3
    //     });
    //
    //     const source: any = getProp(data, 'tasks', []).map((task: any, index: number) => {
    //         return {
    //             key: `task-${index}`,
    //             task: task,
    //             description: task.description
    //         }
    //     });
    //
    //     setDataSource(source);
    // }
    //
    // useEffect(() => {
    //     if (review) {
    //         (async () => {
    //             await fetchData(review);
    //         })();
    //     }
    // }, [review]);

    const columns = [
        {
            title: 'Tasks',
            dataIndex: 'task',
            key: 'task',
            render: (task: any) => (
                <div style={{width: 200}}>
                    <div>
                        <Link href={`/products/${getProp(review, 'review.review.product.id', '')}/tasks/${task.id}`}>
                            {task.title}
                        </Link>
                    </div>
                    <div className="text-grey">{formatDate(task.createdAt)}</div>
                    {
                        task.detailUrl ? (
                            <a href={task.detailUrl} target="_blank">
                                Link to the work on GitHub
                            </a>
                        ) : null
                    }
                </div>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => (
                <>
                    <span>{description}</span>
                </>
            )
        }
    ];

    const productReviews = filterReviews(mode);
    const initiatives = getProp(review, 'review.review.product.initiatives', []);
    const initiative = initiatives.length > 0 ? initiatives[0] : null;
    const attachment = getProp(review, 'review.review.product.attachment', []);

    return (
        <ContainerFlex>
            <Layout>
                <Header/>
                <Content className="container main-page">
                    <ProfileTop/>
                    <>
                        <div className="profile-section">
                            <h3 className="section-title">Portfolio item</h3>
                            <div className="mb-15">
                                <Row>
                                    <Col span={18}>
                                        <p style={{marginBottom: 5}}>
                                            <Typography.Text strong>Product: </Typography.Text>
                                            <Link
                                                href={`/products/${getProp(review, 'review.review.product.id', '')}/summary`}
                                                // className="text-black"
                                            >
                                                <span>{getProp(review, 'review.review.product.name', '')}</span>
                                            </Link>
                                        </p>
                                        {initiative && (
                                            <p className="text-sm" style={{marginBottom: 5}}>
                                                <Typography.Text strong>Initiative: </Typography.Text>
                                                <Link
                                                    href={`/products/${getProp(review, 'review.review.product.id', '')}/initiatives/${initiative.id}`}
                                                    // className="text-black"
                                                >
                                                    <span>{initiative.name}</span>
                                                </Link>
                                            </p>
                                        )}
                                        <p className="text-sm" style={{marginBottom: 5}}>
                                            <Typography.Text strong>Summary: </Typography.Text>
                                            <span className="text-grey">
                                                {getProp(review, 'review.review.product.shortDescription', '')}
                                            </span>
                                        </p>
                                        {attachment && attachment.length > 0 && (
                                            <div>
                                                <strong>Attachments: </strong>
                                                {/*<span></span>*/}
                                            </div>
                                        )}
                                    </Col>
                                    <Col span={6}>
                                        <ReactPlayer
                                            width={"100%"}
                                            height="160px"
                                            url={getProp(review, 'product.videoUrl', '')}
                                        />
                                    </Col>
                                </Row>
                            </div>

                            <h3 className="text-md font-bold">Reviews: </h3>
                            <div className="mb-15">
                                {/*<div>*/}
                                {/*    <Radio.Group*/}
                                {/*        onChange={(e: RadioChangeEvent) => setMode(e.target.value)}*/}
                                {/*        value={mode}*/}
                                {/*    >*/}
                                {/*        <Radio.Button value="received">Received</Radio.Button>*/}
                                {/*        <Radio.Button value="given">Given</Radio.Button>*/}
                                {/*    </Radio.Group>*/}
                                {/*</div>*/}
                                {reviewLoading ? (
                                    <Spin size="large"/>
                                ) : !reviewError && (
                                    <div style={{marginTop: 15}}>
                                        {productReviews.map((item: any, index: number) => (
                                            <div key={`received-${index}`} style={{marginBottom: 15}}>
                                                <Row>
                                                    <Col xs={24} lg={18}>
                                                        <Row>
                                                            <Row>
                                                                {CustomAvatar(
                                                                    item.createdBy,
                                                                    "fullName",
                                                                    "default",
                                                                    getProp(item, 'createdBy.role', [{}])[0],
                                                                    {margin: 'auto 6px auto 0'}
                                                                )}
                                                            </Row>
                                                            <StarScore
                                                                score={getProp(item, 'score', 0)}
                                                                className="review-star"
                                                            />
                                                        </Row>
                                                        <p
                                                            className="text-sm"
                                                            style={{marginTop: 10}}
                                                        >
                                                            <strong>Review: </strong>
                                                            <span className="text-grey font-sm">
                                                                {getProp(item, 'text', '')}
                                                            </span>
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/*<div className="completed-task-section">*/}
                            {/*    <h3 className="text-md font-bold">*/}
                            {/*        Tasks completed by {getProp(data, 'personProfile.person.fullName', '')}*/}
                            {/*    </h3>*/}
                            {/*    <Table*/}
                            {/*        dataSource={dataSource}*/}
                            {/*        columns={columns}*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </div>
                    </>
                </Content>
            </Layout>
        </ContainerFlex>
    )
}

export default ProfileItem;