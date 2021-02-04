import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, message, Input, Button } from 'antd';
import RichTextEditor from 'react-rte';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { CREATE_PRODUCT } from '../../graphql/mutations';
import { Header } from '../../components';

import { ContainerFlex } from '../../components';
import process from 'process';

const { Content } = Layout;
const { TextArea } = Input;


const AddProduct: React.FunctionComponent = ({ }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mode, setMode] = useState(true);
  const [createProduct] = useMutation(CREATE_PRODUCT);

  console.log('process',process.browser);

  // useEffect(() => {
  //   if(process.browser) {
  //     setFullDescription(RichTextEditor.createEmptyValue())
  //   }
  // },[process.browser]);
  const addNewProduct = async() => {
    if (!name || !shortDescription || !website) {
      message.error("Please fill the forms");
    }
    try {
      const res = await createProduct({
        variables: {
          input: {
            name,
            shortDescription,
            fullDescription: fullDescription.toString('html'),
            website,
            addGit: mode,
            videoUrl
          }
        }
      });
      if (res.data && res.data.createProduct && res.data.createProduct.product) {
        message.success('Product is created successfully!');
        router.push("/");
      } else if (res.data.createProduct.error) {
        message.error(res.data.createProduct.error);
      }
    } catch (err) {
      message.error(err);
    }
  }

  return (
    <ContainerFlex>
      <Layout>
        <Header />
        <Content className="container product-page mt-42">
          <Row className='mb-15'>
            <label>Product name*:</label>
            <Input
              placeholder="product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Row>
          <Row className='mb-15'>
            <label>Short description*:</label>
            <TextArea
              placeholder="short description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              autoSize={{ minRows: 3 }}
            />
          </Row>
          <Row className="rich-editor mb-15">
            <label>Full description:</label>
            
            {/* {
              process.browser && (
              <RichTextEditor
                value={fullDescription}
                onChange={(value: any) => setFullDescription(value)}
              />
              )
            } */}
            
            
          </Row>
          <Row className='mb-15'>
            <label>Website url*:</label>
            <Input
              placeholder="website url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Row>
          <Row className='mb-15'>
            <label>Video url (optional):</label>
            <Input
              placeholder="video url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </Row>
          <Row className='mt-15'>
            <Button onClick={() => addNewProduct()} className='mr-15'>Add</Button>
            <Button onClick={() => router.goBack()}>Back</Button>
          </Row>
        </Content>
      </Layout>
    </ContainerFlex>
  );
};

export default AddProduct;