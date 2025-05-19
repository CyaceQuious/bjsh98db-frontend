import React from 'react';
import { Form, Input, Modal } from 'antd';

interface PasswordFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) => void;
  submitting: boolean;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  submitting,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="修改密码"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="old_password"
          label="旧密码"
          rules={[{ required: true, message: '请输入旧密码' }]}
        >
          <Input.Password placeholder="请输入当前密码" />
        </Form.Item>
        
        <Form.Item
          name="new_password"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少6位' },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
        
        <Form.Item
          name="confirm_password"
          label="确认新密码"
          dependencies={['new_password']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordForm;