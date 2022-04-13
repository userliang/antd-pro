import React, { Component } from 'react';
import { Modal, Input, Form, message } from 'antd';
import { Encrypt } from '@/utils/passwordEncryption';
import type { FormInstance } from 'antd/es/form/Form';
import { changeMyPwd } from '@/services/tenantAdminFacade';
import { history } from 'umi';

export interface IAppProps {
  changePwdVisible: boolean;
  handleCancelChangePwd: any;
}
export interface IAppState {
  loading: boolean;
}

class ChangePwd extends Component<IAppProps, IAppState> {
  refFrom = React.createRef<FormInstance>();
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {}

  handleOk = () => {
    this.refFrom.current
      ?.validateFields()
      .then((values: any) => {
        this.setState({ loading: true });
        const payload = { oldPwd: Encrypt(values.oldPassWord), newPwd: Encrypt(values.password) };
        changeMyPwd(payload)
          .then((res: any) => {
            this.setState({ loading: false });
            const { success, errorMsg } = res;
            if (success) {
              message.success('修改密码成功，请重新登录');
              this.props.handleCancelChangePwd();
              history.push('/user/login');
            } else {
              message.error(errorMsg || '修改密码失败');
            }
          })
          .catch((err) => {
            this.setState({ loading: false });
            console.log(err);
            message.error('修改密码失败');
          });
      })
      .catch(() => message.warning('请正确填写信息'));
  };

  render() {
    const { changePwdVisible, handleCancelChangePwd } = this.props;
    const { loading } = this.state;
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const validateAccount = (rule: any, value: any) => {
      if (!/^[0-9a-zA-Z]+$/.test(value)) {
        return Promise.reject('支持数字及数字和字母的组合');
      }
      return Promise.resolve();
    };
    const validateComfirmPass = (rule: any, value: any) => {
      if (this.refFrom.current?.getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject('两次输入密码不一致');
    };
    return (
      <Modal
        title="修改密码"
        visible={changePwdVisible}
        onOk={this.handleOk}
        onCancel={handleCancelChangePwd}
        width="600px"
        confirmLoading={loading}
      >
        <Form {...layout} ref={this.refFrom}>
          <Form.Item
            name="oldPassWord"
            label="请输入原密码"
            rules={[
              { required: true, whitespace: true, message: '请输入原密码' },
              { min: 6, max: 12, message: '请输入6-12位登录密码' },
              { validator: validateAccount },
            ]}
            validateFirst
          >
            <Input placeholder="请输入6-12位密码" type="password" />
          </Form.Item>
          <Form.Item
            name="password"
            label="请输入新密码"
            rules={[
              { required: true, whitespace: true, message: '请输入新密码' },
              { min: 6, max: 12, message: '请输入6-12位登录密码' },
              { validator: validateAccount },
            ]}
            validateFirst
          >
            <Input placeholder="请输入6-12位密码" type="password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="再次输入新密码"
            rules={[
              { required: true, whitespace: true, message: '再次输入新密码' },
              { min: 6, max: 12, message: '请输入6-12位登录密码' },
              { validator: validateAccount },
              { validator: validateComfirmPass },
            ]}
            validateFirst
          >
            <Input placeholder="请输入6-12位密码" type="password" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ChangePwd;
