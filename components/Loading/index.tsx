import React from "react";


const Loading: React.FunctionComponent = () => {
  return (
    <img style={{width: 300, height: 300, position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} src="/assets/loading.gif" alt="loading"/>
  )
}

export default Loading;