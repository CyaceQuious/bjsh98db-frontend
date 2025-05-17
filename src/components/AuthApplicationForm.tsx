import React from 'react';
import { Form, Input, Modal } from 'antd';

interface AuthApplicationFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { real_name: string; invited_reviewer: string }) => void;
  submitting: boolean;
}

const AuthApplicationForm: React.FC<AuthApplicationFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  submitting,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="申请实名认证"
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
          name="real_name"
          label="真实姓名"
          rules={[{ required: true, message: '请输入您的真实姓名' }]}
        >
          <Input placeholder="请输入您的真实姓名" />
        </Form.Item>
        
        <Form.Item
          name="invited_reviewer"
          label="邀请审核人"
          rules={[{ required: true, message: '请选择或输入审核人用户名' }]}
        >
          <Input placeholder="请输入审核人用户名" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuthApplicationForm;