import React, {useState} from 'react';
import {Row, message, Input, Button} from 'antd';
import {useMutation} from '@apollo/react-hooks';
import {useRouter} from 'next/router';
import {CREATE_PRODUCT} from '../../graphql/mutations';
import Loading from "../../components/Loading";
import RichTextEditor from "../../components/RichTextEditor";
import {getProp} from "../../utilities/filters";


const {TextArea} = Input;


interface IAddOrEditProductProps {
  isAdding?: boolean
  isEditing?: boolean
  productData?: any
}

const AddOrEditProduct: React.FunctionComponent<IAddOrEditProductProps> = (
  {isAdding = false, isEditing = false, productData}
) => {
  const router = useRouter();
  const [name, setName] = useState(isEditing ? getProp(productData, 'name', '') : '');
  const [shortDescription, setShortDescription] = useState(isEditing ? getProp(productData, 'shortDescription', '') : '');
  const [fullDescription, setFullDescription] = useState(isEditing ? getProp(productData, 'fullDescription', '') : '');
  const [website, setWebsite] = useState(isEditing ? getProp(productData, 'website', '') : '');
  const [videoUrl, setVideoUrl] = useState(isEditing ? getProp(productData, 'videoUrl', '') : '');

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted(res) {

      const status = getProp(res, 'createProduct.status', false);
      const messageText = getProp(res, 'createProduct.message', '');

      if (status) {
        router.push('/').then(() => {
          message.success(messageText).then();
        });
      } else {
        message.error(messageText).then();
        setIsShowLoading(false);
      }
    },
    onError() {
      message.error('Error with product creation').then();
      setIsShowLoading(false);
    }
  });
  const [isShowLoading, setIsShowLoading] = useState(false);

  const addNewProduct = () => {
    if (!name || !shortDescription || !website) {
      message.error("Please fill the form fields").then();
      return;
    }

    setIsShowLoading(true);

    createProduct({
      variables: {
        productInfo: {
          name,
          shortDescription,
          fullDescription,
          website,
          videoUrl
        }
      }
    }).then();
  }

  return (
    <>
      {
        isShowLoading ? <Loading/> :
          <>
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
            <Row>
              <label>Full description:</label>

              <RichTextEditor initialHTMLValue={fullDescription} onChangeHTML={setFullDescription}/>
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
            {
              isAdding &&
              <Row className='mt-15'>
                  <Button onClick={() => addNewProduct()} className='mr-15'>Add</Button>
                  <Button onClick={() => router.back()}>Back</Button>
              </Row>
            }
          </>
      }
    </>
  );
};

export default AddOrEditProduct;