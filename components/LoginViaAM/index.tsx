import React, {useEffect, useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_AM_LOGIN_URL } from '../../graphql/queries';
import {Button, Select, message} from "antd";

type Props = {
  buttonTitle?: string,
  fullWidth?: boolean
};

const LoginViaAM: React.FunctionComponent<Props> = ({ buttonTitle = "Sign In",
                                                      fullWidth =  false }) => {
  const [authMachineLoginUrl, setAuthMachineLoginUrl] = useState("");

  const {data: authMachineData} = useQuery(GET_AM_LOGIN_URL);

  useEffect(() => {
    if (authMachineData && authMachineData.getAuthmachineLoginUrl)
      setAuthMachineLoginUrl(authMachineData.getAuthmachineLoginUrl)
  }, [authMachineData])

  const loginViaAM = () => {
    if (authMachineLoginUrl === "") {
      message.warning("Can't login in the system with AuthMachine, please connect with administrator").then();
      return;
    }

    window.location.replace(authMachineLoginUrl);
  }

  return (
    <Button className="ml-auto"
            style={{width: fullWidth ? "100%" : "auto"}}
            onClick={() => loginViaAM()}>{buttonTitle}</Button>
  );
};
export default LoginViaAM;
