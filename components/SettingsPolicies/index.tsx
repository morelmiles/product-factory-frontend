import React, {useState} from "react";
import {Space, Typography} from "antd";
import dynamic from 'next/dynamic';


const RichTextEditor = dynamic(
  () => import('../TextEditor'),
  {ssr: false}
)

const SettingsPolicies: React.FunctionComponent = () => {
  const [license, setLicense] = useState('');

  const onLicenseChange = (val: any) => {

  }

  return (
    <>
      <Space direction="vertical" size={20}>
        <Typography.Text strong style={{fontSize: '1.8rem'}}>Contribution License Agreement</Typography.Text>
        <Typography.Text strong>You can set Contribution License Agreement here where the contributors need to agree
          with
          before start contributing to your product</Typography.Text>

        <RichTextEditor
          initialValue={license}
          setValue={onLicenseChange}
          editorStyle={{height: 500}}
        />
      </Space>
    </>
  )
}

export default SettingsPolicies;