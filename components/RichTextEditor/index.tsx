import React, {useEffect, useState} from "react";
import {getProp} from "../../utilities/filters";
import {message} from "antd";
import {useMutation} from "@apollo/react-hooks";
import {UPLOAD_IMAGE} from "../../graphql/mutations";
import draftToHtml from "draftjs-to-html";
import {ContentState, convertFromHTML, convertToRaw, EditorState} from "draft-js";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import dynamic from "next/dynamic";


const Editor = dynamic(
  // @ts-ignore
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  {ssr: false}
);


interface IRichTextEditorProps {
  initialHTMLValue: string
  onChangeHTML: Function
  needClear?: boolean
}

const RichTextEditor: React.FunctionComponent<IRichTextEditorProps> = ({initialHTMLValue, onChangeHTML, needClear= false}) => {
  const [editorStateValue, setEditorStateValue] = useState(EditorState.createEmpty());

  const updateEditorValueByHTML = (HTMLValue: string) => {
    const blocksFromHTML = convertFromHTML(HTMLValue);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );
    setEditorStateValue(EditorState.createWithContent(state));
  }

  useEffect(() => {
    updateEditorValueByHTML(initialHTMLValue);
  }, []);

  // useEffect(() => {
  //   if (needClear) {
  //     updateEditorValueByHTML('');
  //   }
  // }, [needClear]);

  const [uploadImage] = useMutation(UPLOAD_IMAGE, {
    onError() {
      message.error('Error with image loading').then();
    }
  });

  const uploadCallback = (file: any) => {
    return new Promise(
      (resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
          const res = await uploadImage({
            variables: {
              file: reader.result
            }
          });

          const status = getProp(res, 'data.uploadImage.status', false);
          const messageText = getProp(res, 'data.uploadImage.message', false);
          const url = getProp(res, 'data.uploadImage.url', '');

          if (status) {
            message.success(messageText).then();
          } else {
            message.error(messageText).then();
          }

          resolve({data: {link: url}});
        }
      }
    );
  };

  const editorStateHandler = (val: any) => {
    onChangeHTML(draftToHtml(convertToRaw(val.getCurrentContent())));
    setEditorStateValue(val);
  }

  return (
    <Editor
      // @ts-ignore
      editorState={editorStateValue}
      editorStyle={{
        minHeight: 150,
        border: '1px solid #F1F1F1',
        padding: '0 15px'
      }}
      onEditorStateChange={editorStateHandler}
      toolbar={{
        inline: {inDropdown: true},
        list: {inDropdown: true},
        textAlign: {inDropdown: true},
        link: {inDropdown: true},
        history: {inDropdown: true},
        image: {
          urlEnabled: true,
          uploadEnabled: true,
          uploadCallback,
          previewImage: true,
          inputAccept: 'image/*',
          alt: {present: false, mandatory: false},
          defaultSize: {width: '100%'}
        }
      }}
    />
  )
}

export default RichTextEditor;