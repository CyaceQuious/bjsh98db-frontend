import { useState, useEffect } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, Form, Input, Modal, message, Card, List, Tag } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface UserProfile {
  username: string;
  email: string;
  create_time: string;
  Is_Department_Official: boolean;
  Is_Contest_Official: string[];
  Is_System_Admin: boolean;
  star_list: string[];
}

const UserProfilePage = () => {
  const router = useRouter();
  const session = useSelector((state: RootState) => state.auth.session);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const formRef = React.createRef<FormInstance>();
  const passwordFormRef = React.createRef<FormInstance>();

  useEffect(() => {
    if (!session) {
      message.warning('请先登录');
      router.push('/login');
      return;
    }

    fetchUserProfile();
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/get_user_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          session,
        }),
      });

      const data = await response.json();

      if (data.code === 0) {
        setProfile(data.data);
      } else {
        message.error(data.info || '获取用户信息失败');
      }
    } catch (error) {
      message.error('获取用户信息失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      formRef.current?.setFieldsValue({
        email: profile.email,
        star_list: profile.star_list.join(','),
      });
    }
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    try {
      // 这里调用更新用户信息的API
      // 假设API路径是 /api/users/update_profile
      const response = await fetch('/api/users/update_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          session,
          email: values.email,
          star_list: values.star_list,
        }),
      });

      const data = await response.json();

      if (data.code === 0) {
        message.success('更新成功');
        setEditModalVisible(false);
        fetchUserProfile(); // 刷新数据
      } else {
        message.error(data.info || '更新失败');
      }
    } catch (error) {
      message.error('更新失败');
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (values: any) => {
    try {
      // 这里调用修改密码的API
      // 假设API路径是 /api/users/change_password
      const response = await fetch('/api/users/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          session,
          old_password: values.old_password,
          new_password: values.new_password,
        }),
      });

      const data = await response.json();

      if (data.code === 0) {
        message.success('密码修改成功');
        setPasswordModalVisible(false);
      } else {
        message.error(data.info || '密码修改失败');
      }
    } catch (error) {
      message.error('密码修改失败');
      console.error(error);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!profile) {
    return <div>无法获取用户信息</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{profile.username}的个人主页</title>
      </Head>

      <Card
        title="个人资料"
        extra={
          <div className="space-x-2">
            <Button type="primary" onClick={handleEditProfile}>
              编辑资料
            </Button>
            <Button onClick={() => setPasswordModalVisible(true)}>
              修改密码
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold">基本信息</h3>
            <div className="space-y-2 mt-2">
              <p>
                <span className="font-medium">用户名:</span> {profile.username}
              </p>
              <p>
                <span className="font-medium">邮箱:</span> {profile.email}
              </p>
              <p>
                <span className="font-medium">注册时间:</span>{' '}
                {new Date(profile.create_time).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">角色信息</h3>
            <div className="space-y-2 mt-2">
              <p>
                <span className="font-medium">部门官方:</span>{' '}
                {profile.Is_Department_Official ? (
                  <Tag color="green">是</Tag>
                ) : (
                  <Tag color="red">否</Tag>
                )}
              </p>
              <p>
                <span className="font-medium">系统管理员:</span>{' '}
                {profile.Is_System_Admin ? (
                  <Tag color="green">是</Tag>
                ) : (
                  <Tag color="red">否</Tag>
                )}
              </p>
              {profile.Is_Contest_Official.length > 0 && (
                <p>
                  <span className="font-medium">比赛官方:</span>{' '}
                  {profile.Is_Contest_Official.map((contest) => (
                    <Tag key={contest} color="blue">
                      {contest}
                    </Tag>
                  ))}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">关注列表</h3>
          {profile.star_list.length > 0 ? (
            <List
              dataSource={profile.star_list}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              className="mt-2"
            />
          ) : (
            <p className="mt-2 text-gray-500">暂无关注</p>
          )}
        </div>
      </Card>

      {/* 编辑资料模态框 */}
      <Modal
        title="编辑资料"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => formRef.current?.submit()}
      >
        <Form ref={formRef} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="star_list"
            label="关注列表（用逗号分隔）"
            rules={[{ required: true, message: '请输入关注列表' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        visible={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onOk={() => passwordFormRef.current?.submit()}
      >
        <Form ref={passwordFormRef} onFinish={handlePasswordSubmit} layout="vertical">
          <Form.Item
            name="old_password"
            label="旧密码"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password />
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
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfilePage;