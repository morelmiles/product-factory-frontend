import {Modal} from 'antd';
import {productionMode} from "../../utilities/constants";

const showUnAuthModal = (router, actionName: string) => {

  const signInAction = () => {
    router.push(productionMode ? "/" : "/switch-test-user");
    modal.destroy();
  }

  const loginAction = () => {
    // router.push("/");
  }
  const modal = Modal.info({
    title: "Sign In or Register",
    closable: true,
    content: (
      <div>
        <p>In order to {actionName} you need to be signed in.</p>

        <p>Existing Users: <a href={null} onClick={() => signInAction()}>Sign in here</a></p>

        <p>New to OpenUnited? <a href={null} onClick={() => loginAction()}>Register here</a></p>
      </div>
    ),
    okButtonProps: { disabled: true, style: {display: "none"} },
  })
};

export default showUnAuthModal;