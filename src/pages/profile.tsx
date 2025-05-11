import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, Form, Input, Modal, message, Card, List, Tag, Space } from 'antd';
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
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [unstarLoading, setUnstarLoading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = React.createRef<FormInstance>();
  const passwordFormRef = React.createRef<FormInstance>();
  const { confirm } = Modal;

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
    const response = await fetch(`/api/users/get_user_profile?session=${encodeURIComponent(session)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();

    if (data.code === 0) {
      setProfile(data.data);
    } else {
      message.error(data.info || '获取用户信息失败');
    }
  } catch (error) {
    console.error('获取用户信息错误:', error);
    if (error instanceof Error) {
      message.error(`获取用户信息失败: ${error.message}`);
    } else {
      message.error('获取用户信息失败: 未知错误');
    }
  } finally {
    setLoading(false);
  }
};

  const handleEditProfile = () => {
    if (profile) {
      formRef.current?.setFieldsValue({
        email: profile.email,
      });
    }
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: { email: string }) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/users/modify_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          session,
          email: values.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.info || '请求失败');
      }

      if (data.code === 0) {
        message.success('资料更新成功');
        setEditModalVisible(false);
        fetchUserProfile();
      } else {
        message.error(data.info || '资料更新失败');
      }
    } catch (error) {
      console.error('资料更新错误:', error);
      message.error(`资料更新失败: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    try {
      setSubmitting(true);
      if (values.new_password !== values.confirm_password) {
        message.error('两次输入的新密码不一致');
        return;
      }

      const response = await fetch('/api/users/modify_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          session,
          password: values.new_password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.info || '请求失败');
      }

      if (data.code === 0) {
        message.success('密码修改成功');
        setPasswordModalVisible(false);
      } else {
        message.error(data.info || '密码修改失败');
      }
    } catch (error) {
      console.error('密码修改错误:', error);
      message.error(`密码修改失败: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnstar = async (athleteName: string) => {
    confirm({
      title: '确认取消关注',
      content: `确定要取消关注 ${athleteName} 吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setUnstarLoading(prev => ({ ...prev, [athleteName]: true }));
          
          const response = await fetch('/api/users/delete_star', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              session,
              athlete_name: athleteName,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.info || '请求失败');
          }

          if (data.code === 0) {
            message.success(`已取消关注 ${athleteName}`);
            fetchUserProfile();
          } else {
            message.error(data.info || '取消关注失败');
          }
        } catch (error) {
          console.error('取消关注错误:', error);
          message.error(`取消关注失败: ${(error as Error).message}`);
        } finally {
          setUnstarLoading(prev => ({ ...prev, [athleteName]: false }));
        }
      },
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">无法获取用户信息</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{profile.username}的个人主页</title>
      </Head>

      <Card
        title="个人资料"
        extra={
          <Space>
            <Button type="primary" onClick={handleEditProfile}>
              编辑资料
            </Button>
            <Button onClick={() => setPasswordModalVisible(true)}>
              修改密码
            </Button>
          </Space>
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
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      danger 
                      onClick={() => handleUnstar(item)}
                      loading={unstarLoading[item]}
                      key="unstar"
                    >
                      取消关注
                    </Button>
                  ]}
                >
                  <span className="text-base">{item}</span>
                </List.Item>
              )}
              className="mt-2"
              bordered
            />
          ) : (
            <p className="mt-2 text-gray-500">暂无关注</p>
          )}
        </div>
      </Card>

      {/* 编辑资料模态框 */}
      <Modal
        title="编辑资料"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => formRef.current?.submit()}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form 
          ref={formRef} 
          onFinish={handleEditSubmit} 
          layout="vertical"
          initialValues={{ email: profile.email }}
        >
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

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onOk={() => passwordFormRef.current?.submit()}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form
          ref={passwordFormRef}
          onFinish={handlePasswordSubmit}
          layout="vertical"
        >
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
    </div>
  );
};

export default UserProfilePage;