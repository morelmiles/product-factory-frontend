import {Modal} from 'antd';

const showUnAuthModal = (actionName: string, loginUrl="/", registerUrl="/") => {

  const signInAction = () => {
    saveRedirectPath();
    modal.destroy();
    window.location.replace(loginUrl);
  }

  const saveRedirectPath = () => {
    localStorage.setItem("redirectTo", window.location.pathname);
  };

  const registerAction = () => {
    saveRedirectPath();
    modal.destroy();
    window.location.replace(registerUrl);
  }

  const modal = Modal.info({
    title: "Sign In or Register",
    closable: true,
    content: (
      <div>
        <p>In order to {actionName.toLowerCase()} you need to be signed in.</p>

        <p>Existing Users: <a href={undefined} onClick={() => signInAction()}>Sign in here</a></p>

        <p>New to OpenUnited? <a href={undefined} onClick={() => registerAction()}>Register here</a></p>
      </div>
    ),
    okButtonProps: { disabled: true, style: {display: "none"} },
  })
};

export default showUnAuthModal;