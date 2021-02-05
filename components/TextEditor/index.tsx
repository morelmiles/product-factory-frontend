import React, { useState } from 'react';
import RichTextEditor from 'react-rte';


const TextEditorWrap: React.FunctionComponent = ({ setValue, initialValue }) => {
    const inputInitialValue = initialValue ? RichTextEditor.createValueFromString(initialValue, 'html') : RichTextEditor.createEmptyValue();
    const [content, setContent] = useState(inputInitialValue);
    const onChange = (value) => {
        setContent(value);
        setValue(value);
    } 
    return (
      <RichTextEditor
        value={content}
        onChange={onChange}
      />
    )
  }

export default TextEditorWrap;
