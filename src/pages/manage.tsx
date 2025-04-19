import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Card, Form, Input, Button, Switch, message, Typography } from 'antd';

const { Title } = Typography;

interface ModifyUserParams {
  session: string;
  user_to_modify: string;
  Is_Department_Official: boolean;
  Is_System_Admin: boolean;
}

export default function UserManagement() {
  const router = useRouter();
  const session = useSelector((state: RootState) => state.auth.session);
  const isAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 检查权限
  if (!isAdmin) {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <Title level={3} style={{ marginBottom: '24px' }}>用户权限不足</Title>
        </div>
    );
  }

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const params: ModifyUserParams = {
        session,
        user_to_modify: values.username,
        Is_Department_Official: values.Is_Department_Official || false,
        Is_System_Admin: values.Is_System_Admin || false,
      };

      // 调用API接口
      const response = await fetch('/api/ModifyUserStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (result.code === 0) {
        message.success('用户权限更新成功');
        form.resetFields();
      } else {
        message.error(`更新失败: ${result.info}`);
      }
    } catch (error) {
      message.error('请求失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Card>
        <Title level={3} style={{ marginBottom: '24px' }}>用户权限管理</Title>
        
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="输入要修改权限的用户名" />
          </Form.Item>

          <Form.Item
            label="设为部门管理员"
            name="Is_Department_Official"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="设为系统管理员"
            name="Is_System_Admin"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="Is_Contest_Official" hidden initialValue={[]}>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              修改权限
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}