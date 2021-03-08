import React, {useState, useEffect} from 'react';
import {Layout, Row, message, Input, Button, Select, Col} from 'antd';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {useRouter} from 'next/router';
import {CREATE_PRODUCT} from '../../graphql/mutations';
import {Header} from '../../components';

import {ContainerFlex} from '../../components';
import dynamic from 'next/dynamic';
import Loading from "../../components/Loading";
import {GET_USERS} from "../../graphql/queries";
import {getProp} from "../../utilities/filters";


const RichTextEditor = dynamic(
  () => import('../../components/TextEditor'),
  {ssr: false}
)

const {Content} = Layout;
const {TextArea} = Input;

const AddProduct: React.FunctionComponent = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mode] = useState(true);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([])

  const {data: users} = useQuery(GET_USERS);

  useEffect(() => {
    setAllUsers(getProp(users, 'people', []));
  }, [users]);

  const addNewProduct = async () => {
    if (!name || !shortDescription || !website) {
      message.error("Please fill the form fields");
      return
    }

    try {
      setIsShowLoading(true);
      const userId = localStorage.getItem('userId');

      const res = await createProduct({
        variables: {
          productInfo: {
            name,
            shortDescription,
            // @ts-ignore
            fullDescription: fullDescription.toString('html'),
            website,
            addGit: mode,
            videoUrl
          },
          userId: userId == null ? 0 : userId
        }
      });

      if (res.data && res.data.createProduct && res.data.createProduct.status) {
        await router.push("/");
        message.success('Product is created successfully!');
      } else if (!res.data.createProduct.status) {
        setIsShowLoading(false);
        message.error(res.data.createProduct.error);
      }
    } catch (err) {
      setIsShowLoading(false);
      message.error(err);
    }
  }

  return (
    <>
      {
        isShowLoading ? <Loading/> :
          <ContainerFlex>
            <Layout>
              <Header/>
              <Content className="container product-page mt-42">
                <Row className='mb-15'>
                  <label>Product name*:</label>
                  <Input
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Row>
                <Row className='mb-15'>
                  <label>Short description*:</label>
                  <TextArea
                    placeholder="Short description"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    autoSize={{minRows: 3}}
                  />
                </Row>
                <Row className="rich-editor mb-15">
                  <label>Full description:</label>

                  <RichTextEditor setValue={setFullDescription}/>


                </Row>
                <Row className='mb-15'>
                  <label>Website url *:</label>
                  <Input
                    placeholder="Website url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </Row>
                <Row className='mb-15'>
                  <label>Video url (optional):</label>
                  <Input
                    placeholder="Video url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </Row>
                <Row className='mt-15'>
                  <Button onClick={() => addNewProduct()} className='mr-15'>Add</Button>
                  <Button onClick={() => router.back()}>Back</Button>
                </Row>
              </Content>
            </Layout>
          </ContainerFlex>
      }
    </>
  );
};

export default AddProduct;