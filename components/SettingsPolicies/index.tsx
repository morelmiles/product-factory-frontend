import React, {useEffect, useState} from "react";
import {Button, message, Row, Space, Typography} from "antd";
import dynamic from 'next/dynamic';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GET_LICENSE} from "../../graphql/queries";
import {useRouter} from "next/router";
import {getProp} from "../../utilities/filters";
import {EditorValue} from "react-rte";
import {UPDATE_LICENSE} from "../../graphql/mutations";
import {connect} from "react-redux";


interface ISettingsPoliciesProps {
  user: any
}

const RichTextEditor = dynamic(
  () => import('../TextEditor'),
  {ssr: false}
)

const RichTextEditor2 = dynamic(
  () => import('../TextEditor'),
  {ssr: false}
)

const SettingsPolicies: React.FunctionComponent<ISettingsPoliciesProps> = ({user}) => {
  const router = useRouter();
  const {productSlug} = router.query;

  const [license, setLicense] = useState('');

  const {data: licenseOriginal, error: licenseError} = useQuery(GET_LICENSE, {
    variables: {productSlug}
  });
  const [updateLicense] = useMutation(UPDATE_LICENSE, {
    onCompleted(res) {
      if (getProp(res, 'updateLicense.status', false)) {
        message.success(getProp(res, 'updateLicense.message', 'Success')).then();
      } else {
        message.error(getProp(res, 'updateLicense.message', 'Error')).then();
      }
    },
    onError() {
      message.error('Error with license updating').then();
    }
  })

  useEffect(() => {
    if (!licenseError) {
      setLicense(getProp(licenseOriginal, 'license.agreementContent', ''));
    }
  }, [licenseOriginal]);

  const updateLicenseHandler = () => {
    updateLicense({
      variables: {productSlug, userId: user.id, content: license}
    }).then();
  }

  return (
    <>
      <Space direction="vertical" size={20}>
        <Typography.Text strong style={{fontSize: '1.8rem'}}>Contribution License Agreement</Typography.Text>
        <Typography.Text strong>
          You can set Contribution License Agreement here where the contributors need to agree with before start
          contributing to your product
        </Typography.Text>
        {
          license !== '' ?
            <RichTextEditor
              initialValue={license}
              setValue={(val: EditorValue) => {
                setLicense(val.toString('html'))
              }}
              editorStyle={{height: 400}}
            /> :
            <RichTextEditor2
              initialValue={''}
              setValue={(val: EditorValue) => {
                setLicense(val.toString('html'))
              }}
              editorStyle={{height: 400}}
            />
        }
        <Row justify="end" style={{marginBottom: 30}}>
          <Button type="primary" onClick={updateLicenseHandler}>Update license</Button>
        </Row>
      </Space>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  user: state.user
});

const mapDispatchToProps = () => ({});

const SettingsPoliciesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPolicies);

export default SettingsPoliciesContainer;