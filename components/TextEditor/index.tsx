import React, {useState} from 'react';
import RichTextEditor, {EditorValue} from 'react-rte';


interface ITextEditorWrapProps {
  setValue: Function
  initialValue: string
  editorStyle?: any
}

const TextEditorWrap: React.FunctionComponent<ITextEditorWrapProps> = ({setValue, initialValue, editorStyle}) => {
  const inputInitialValue = initialValue ? RichTextEditor.createValueFromString(initialValue, 'html') : RichTextEditor.createEmptyValue();
  const [content, setContent] = useState(inputInitialValue);
  const onChange = (value: EditorValue) => {
    setContent(value);
    setValue(value);
  }

  return (
    <RichTextEditor
      editorStyle={editorStyle}
      value={content}
      onChange={(val: EditorValue) => onChange(val)}
    />
  )
}

export default TextEditorWrap;