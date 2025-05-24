import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  theme,
  Button,
  Modal,
  message,
  Card,
  List,
  Tag,
  Space,
  Layout,
  Menu,
} from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  DownSquareOutlined,
  UpSquareOutlined
} from '@ant-design/icons';
const { Sider, Content } = Layout;

import PlayerModal from "../components/player";
import AuthStatus from '../components/AuthStatus';
import AuthRequests from '../components/AuthRequests';
import ProfileForm from '../components/ProfileForm';
import PasswordForm from '../components/PasswordForm';
import AuthApplicationForm from '../components/AuthApplicationForm';
import AuthReviewModal from '../components/AuthReviewModal';
import FeedbackSender from "../components/FeedbackSender";
import { AuthRequest } from '../utils/types';
import FeedbackReceiver from "../components/FeedbackReceiver";

const { useToken } = theme;
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
  const { token } = useToken();
  const router = useRouter();
  const session = useSelector((state: RootState) => state.auth.session);
  const isDepartmentOfficial = useSelector((state: RootState) => state.auth.isDepartmentOfficial);
  const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);
  const isContestOfficial = useSelector((state: RootState) => state.auth.isContestOfficial);
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authReviewModalVisible, setAuthReviewModalVisible] = useState(false);
  const [currentAuthRequest, setCurrentAuthRequest] = useState<AuthRequest | undefined>(undefined);
  const [unstarLoading, setUnstarLoading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [authRequests, setAuthRequests] = useState<AuthRequest[]>([]);
  const [receivedAuthRequests, setReceivedAuthRequests] = useState<AuthRequest[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const handlePlayerClick = (name: string) => {
    setSelectedAthlete(name);
    setModalVisible(true);
  };
  const [contestNameMap, setContestNameMap] = useState<Record<string, string>>({});

  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('profile');
  
  useEffect(() => {
    if (!session) {
      message.warning("请先登录");
      router.push("/login");
      return;
    }
    fetchUserProfile();
    fetchAuthRequests();
    if (isDepartmentOfficial || isSystemAdmin) {
      fetchReceivedAuthRequests();
    }
  }, [session, isDepartmentOfficial||isSystemAdmin]);
  useEffect(() => {
    if (!profile) return;
    if (profile?.Is_Contest_Official?.length > 0) {
      fetchContestNames(profile.Is_Contest_Official);
    }
  }, [profile?.Is_Contest_Official]);

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

  const fetchAuthRequests = async () => {
    try {
      const response = await fetch(`/api/message/get_auth_sent?session=${encodeURIComponent(session)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = await response.json();

      if (data.code === 0) {
        setAuthRequests(data.data.auth_requests || []);
      } else {
        message.error(data.info || '获取认证请求失败');
      }
    } catch (error) {
      console.error('获取认证请求错误:', error);
      message.error('获取认证请求失败');
    }
  };

  const fetchReceivedAuthRequests = async () => {
    try {
      const response = await fetch(`/api/message/get_auth_received?session=${encodeURIComponent(session)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = await response.json();
      console.log('API Response:', data); // 调试用

      if (data.code === 0) {
        const allRequests = data.data.auth_requests || [];
        console.log('所有请求:', allRequests); // 调试
        
        // 设置所有请求（包括已通过的）
        setReceivedAuthRequests(allRequests);
        
        // 调试：检查通过的请求
        const approvedRequests = allRequests.filter((req: AuthRequest) => req.status === 1);
        console.log('已通过的请求:', approvedRequests);
      }
    } catch (error) {
      console.error('获取收到的认证请求错误:', error);
      message.error('获取收到的认证请求失败');
    }
  };

  const handleEditSubmit = async (values: { email: string }) => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/users/modify_user_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          session,
          email: values.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.info || "请求失败");
      }

      if (data.code === 0) {
        message.success("资料更新成功");
        setEditModalVisible(false);
        fetchUserProfile();
      } else {
        message.error(data.info || "资料更新失败");
      }
    } catch (error) {
      console.error("资料更新错误:", error);
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
        message.error("两次输入的新密码不一致");
        return;
      }

      const response = await fetch("/api/users/modify_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          session,
          password: values.new_password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.info || "请求失败");
      }

      if (data.code === 0) {
        message.success("密码修改成功");
        setPasswordModalVisible(false);
      } else {
        message.error(data.info || "密码修改失败");
      }
    } catch (error) {
      console.error("密码修改错误:", error);
      message.error(`密码修改失败: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnstar = async (athleteName: string) => {
    Modal.confirm({
      title: '确认取消关注',
      content: `确定要取消关注 ${athleteName} 吗？`,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          setUnstarLoading((prev) => ({ ...prev, [athleteName]: true }));

          const response = await fetch("/api/users/delete_star", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              session,
              athlete_name: athleteName,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.info || "请求失败");
          }

          if (data.code === 0) {
            message.success(`已取消关注 ${athleteName}`);
            fetchUserProfile();
          } else {
            message.error(data.info || "取消关注失败");
          }
        } catch (error) {
          console.error("取消关注错误:", error);
          message.error(`取消关注失败: ${(error as Error).message}`);
        } finally {
          setUnstarLoading((prev) => ({ ...prev, [athleteName]: false }));
        }
      },
    });
  };

  const handleApplyAuth = async (values: { real_name: string; invited_reviewer: string }) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/message/apply_auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          session,
          real_name: values.real_name,
          invited_reviewer: values.invited_reviewer,
        }),
      });

      const data = await response.json();

      if (data.code === 0) {
        message.success('认证申请已提交');
        setAuthModalVisible(false);
        fetchAuthRequests();
      } else {
        message.error(data.info || '提交认证申请失败');
      }
    } catch (error) {
      console.error('提交认证申请错误:', error);
      message.error('提交认证申请失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewAuth = async (status: number, rejectReason?: string) => {
    if (!currentAuthRequest) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/message/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          session,
          message_id: currentAuthRequest.message_id.toString(),
          status: status.toString(),
          reject_reason: rejectReason || '',
        }),
      });

      const data = await response.json();

      if (data.code === 0) {
        message.success(status === 1 ? '已通过认证' : '已拒绝认证');
        setAuthReviewModalVisible(false);
        fetchReceivedAuthRequests();
      } else {
        message.error(data.info || '处理认证请求失败');
      }
    } catch (error) {
      console.error('处理认证请求错误:', error);
      message.error('处理认证请求失败');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchContestNames = async (ids: string[]) => {
    const newMap: Record<string, string> = {};
    await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`/api/query_meet_name?mid=${id}`);
          const data = await res.json();
          if (data.code === 0) {
            newMap[id] = `${id}：${data.name}`;
          } else {
            newMap[id] = `${id}：加载失败`;
          }
        } catch {
          newMap[id] = `${id}：加载失败`;
        }
      })
    );
    setContestNameMap(newMap);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">加载中...</div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        无法获取用户信息
      </div>
    );
  }
  
  const components = {
    profile: (
      <Card
        title="个人资料"
        extra={
          <Space>
              <Button type="primary" onClick={() => setEditModalVisible(true)}>
                编辑资料
              </Button>
            <Button onClick={() => setPasswordModalVisible(true)}>
              修改密码
            </Button>
          </Space>
        }
        style={{ width: "80%", margin: "10px auto" }}
      >
        <AuthStatus 
          authRequests={authRequests} 
          onApplyAuth={() => setAuthModalVisible(true)} 
        />
        
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
                <span className="font-medium">注册时间:</span>{" "}
                {new Date(profile.create_time).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">角色信息</h3>
            <div className="space-y-2 mt-2">
              <p>
                <span className="font-medium">体干:</span>{' '}
                {profile.Is_Department_Official ? (
                  <Tag color="green">是</Tag>
                ) : (
                  <Tag color="red">否</Tag>
                )}
              </p>
              <p>
                <span className="font-medium">系统管理员:</span>{" "}
                {profile.Is_System_Admin ? (
                  <Tag color="green">是</Tag>
                ) : (
                  <Tag color="red">否</Tag>
                )}
              </p>
              {profile.Is_Contest_Official.length > 0 && (
                <p>
                  <span className="font-medium">比赛官员:</span>
                  <div style={{ marginTop: 4 }}>
                    {profile.Is_Contest_Official.map((mid) => (
                      <div key={mid} style={{ marginBottom: '4px' }}>
                        <Tag
                          color="blue"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            router.push({ pathname: "/meet", query: { mid } })
                          }
                        >
                          {contestNameMap[mid] || `${mid}：加载中...`}
                        </Tag>
                      </div>
                    ))}
                  </div>
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
                    </Button>,
                  ]}
                >
                  <span
                    onClick={() => handlePlayerClick(item)}
                      style={{ 
                      color: token.colorText,
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = token.colorPrimary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = token.colorText)
                    }
                  >
                    {item}
                  </span>
                </List.Item>
              )}
              className="mt-2"
              bordered
            />
          ) : (
            <p className="mt-2 text-gray-500">暂无关注</p>
          )}

          <PlayerModal
            visible={modalVisible}
            name={selectedAthlete}
            onClose={() => setModalVisible(false)}
          />
        </div>
      </Card>
      ),
    feedBackSend: (<>
      {isDepartmentOfficial&&<FeedbackSender style={{ width: "80%", margin: "20px auto" }}/>}
    </>),
    feedBackReceive: (<>
      {(isContestOfficial.length > 0)&&<FeedbackReceiver style={{ width: "80%", margin: "20px auto" }}/>}
    </>),
    authAppl: (<div style={{ width: "80%", margin: "20px auto"}}>
      <AuthRequests
        authRequests={authRequests}
        isDepartmentOfficial={isDepartmentOfficial||isSystemAdmin}
        receivedAuthRequests={receivedAuthRequests}
        onReviewRequest={(request) => {
          setCurrentAuthRequest(request);
          setAuthReviewModalVisible(true);
        }}
      />
      </div>),
  }

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'authAppl',
      icon: <SafetyOutlined />,
      label: '运动员认证',
    },
    ...(isDepartmentOfficial ? [{
      key: 'feedBackSend',
      icon: <UpSquareOutlined />,
      label: '我发送的成绩反馈',
    }] : []),
    ...(isContestOfficial.length > 0 ? [{
      key: 'feedBackReceive',
      icon: <DownSquareOutlined />,
      label: '我收到的成绩反馈',
    }] : [])
  ];

  const renderContent = () => {
    switch(selectedMenu) {
      case 'profile': return components.profile;
      case 'authAppl': return components.authAppl;
      case 'feedBackSend': return components.feedBackSend;
      case 'feedBackReceive': return components.feedBackReceive;
      default: return components.profile;
    };
  };

  return (
    <div className="container">
      <Head>
        <title>{profile.username}的个人主页</title>
      </Head>

      <Layout hasSider style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={200}
          theme="light"
          style={{
            height: '100%',
            overflow: 'auto',
            position: 'fixed',
            left: 0,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={({ key }) => setSelectedMenu(key)}
            items={menuItems}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        <Layout style={{ 
          marginLeft: collapsed ? 80 : 200,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s',
        }}>
          <Content
            style={{
              flex: 1,
              padding: 24,
              overflow: 'hidden',
            }}
          >
            <div style={{ 
              height: '100%',
              // overflowY: 'auto',
              // paddingRight: 8 // 给滚动条留出空间
            }}>
              {renderContent()}
            </div>
          </Content>
        </Layout>

      </Layout>


      <ProfileForm
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        profile={profile}
        onSubmit={handleEditSubmit}
        submitting={submitting}
      />

      <PasswordForm
        visible={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onSubmit={handlePasswordSubmit}
        submitting={submitting}
      />

      <AuthApplicationForm
        visible={authModalVisible}
        onCancel={() => setAuthModalVisible(false)}
        onSubmit={handleApplyAuth}
        submitting={submitting}
      />

      <AuthReviewModal
        visible={authReviewModalVisible}
        request={currentAuthRequest}
        onCancel={() => setAuthReviewModalVisible(false)}
        onApprove={() => handleReviewAuth(1)}
        onReject={(reason) => handleReviewAuth(2, reason)}
        submitting={submitting}
      />
    </div>
  );
};

export default UserProfilePage;
