import React from 'react';
import { Form, Input, Modal } from 'antd';
import { UserProfile } from '../utils/types';

interface ProfileFormProps {
  visible: boolean;
  onCancel: () => void;
  profile?: UserProfile;
  onSubmit: (values: { email: string }) => void;
  submitting: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  visible,
  onCancel,
  profile,
  onSubmit,
  submitting,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && profile) {
      form.setFieldsValue({
        email: profile.email,
      });
    }
  }, [visible, profile, form]);

  return (
    <Modal
      title="编辑资料"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入您的邮箱" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileForm;