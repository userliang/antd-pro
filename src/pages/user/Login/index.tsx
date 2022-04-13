import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
// import { login } from '@/services/ant-design-pro/api';
import { accountLogin } from '@/services/login';
import styles from './index.less';
import { Encrypt } from '@/utils/passwordEncryption';
import logo from '@/../public/logo.png';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<string>('');
  const [type] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  useEffect(() => {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('luma-auth-token');
  }, []);
  const fetchUserInfo = async () => {
    const resultData: any = await initialState?.fetchUserInfo?.();
    if (resultData) {
      await setInitialState((s) => ({ ...s, currentUser: resultData }));
      sessionStorage.setItem('userRole', resultData.userRole);
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      setUserLoginState('');
      const payload = {
        userCode: values.userCode,
        password: Encrypt(values.password as string),
        verificationCode: '',
      };
      // 登录
      const msg = await accountLogin(payload);
      console.log(msg);
      if (msg.success) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        return;
      }

      console.log(msg); // 如果失败去设置用户错误信息

      setUserLoginState(msg.errorMsg || '登录失败，请重试！');
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={logo} />}
          title="后台管理平台"
          subTitle={false}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {type === 'account' && (
            <div style={{ marginTop: 30 }}>
              {userLoginState && <LoginMessage content={userLoginState} />}
              <ProFormText
                style={{ marginTop: 20 }}
                name="userCode"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </div>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
