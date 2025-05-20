import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Modal, notification, Badge } from 'antd';
import type { MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { resetData, setHasUnreadAuth } from '../redux/auth';
import { AuthRequest } from '../utils/types';
import Link from 'next/link';

const { Header } = Layout;

export default function Navbar() {
    const router = useRouter();
    const isDepartmentOfficial = useSelector((state: RootState) => state.auth.isDepartmentOfficial);
    const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);
    const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [api, contextHolder] = notification.useNotification();
    const dispatch = useDispatch();
    const session = useSelector((state: RootState) => state.auth.session);

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
          // 仅当有status=0的请求时才显示小红点
          const hasPending = allRequests.some((req: AuthRequest) => req.status === 0);
          dispatch(setHasUnreadAuth(hasPending));
        }
      } catch (error) {
        console.error('获取收到的认证请求错误:', error);
      }
    };

    useEffect(() => {
      if (isDepartmentOfficial || isSystemAdmin) {
        fetchReceivedAuthRequests();
      }
    }, [session, isDepartmentOfficial || isSystemAdmin]);

    
    // 从Redux获取状态
    const {
        userName,
        isSystemAdmin: isAdmin,
        hasUnreadAuth
    } = useSelector((state: RootState) => state.auth);

    // 处理登出确认
    const handleLogoutConfirm = () => {
        setIsLogoutConfirmVisible(false);
        api.open({
            message: `用户${userName}成功登出`,
            duration: 3,
        });
        dispatch(resetData());
        dispatch(setHasUnreadAuth(false)); // 登出时重置未读状态
    };

    // 根据当前路径自动选中菜单项
    const selectedKeys = [
        router.pathname === '/' ? 'home' :
        router.pathname.startsWith('/search') ? 'home' : 
        router.pathname.startsWith('/contests') ? 'contests' :
        router.pathname.startsWith('/meet') ? 'contests' :
        router.pathname.startsWith('/manage') ? 'manage' :
        router.pathname.startsWith('/admin/users') ? 'admin-users' :
        router.pathname === '/about' ? 'about' : ''
    ].filter(Boolean);

    // 基础菜单项配置
    const baseItems: MenuProps['items'] = [
        {
            key: 'logo',
            label: (
                <span style={{
                    display: 'inline-flex',  
                    height: '100%',
                    verticalAlign: 'middle'
                }}>
                    <img 
                        src="/logo.png" 
                        alt="logo" 
                        style={{ 
                            objectFit: 'contain',  // 保持图片比例
                            verticalAlign: 'top',  // 消除底部间隙
                        }}
                    />
                </span>
            ),
            onClick: () => router.push('/'),
            className: 'logo-menu-item',
        },
        {
            key: 'home',
            label: '搜索',
            onClick: () => router.push('/'),
        },
        {
            key: 'contests',
            label: '比赛',
            onClick: () => router.push('/contests'),
        },
        {
            key: 'about',
            label: '关于我们',
            onClick: () => router.push('/about'),
        },
    ];

    // 如果是管理员，添加管理菜单项
    const items: MenuProps['items'] = [
        ...baseItems,
        ...(isAdmin ? [{
            key: 'admin-users',
            label: '用户管理',
            onClick: () => router.push('/manage'),
        }] : [])
    ];

    const hideRightItems = ['/login', '/register', '/logout'];
    
    // 右侧菜单项配置
    const rightItems: MenuProps['items'] = hideRightItems.includes(router.asPath)
    ? [] : userName !== ""
        ? [
            {
                key: 'username',
                label: (
                    <span style={{ cursor: 'pointer', color: 'inherit' }}>
                        <Link href="/profile" passHref>
                            <Badge 
                                dot={hasUnreadAuth} 
                                offset={[5, 5]}
                                style={{ 
                                    marginRight: 8,
                                    transform: 'translateY(-2px)'
                                }}
                            >
                                <span className="username-text">
                                    {userName}
                                </span>
                            </Badge>
                        </Link>
                    </span>
                ),
            },
            {
                key: 'logout',
                label: '登出',
                onClick: () => setIsLogoutConfirmVisible(true),
            },
          ]
        : [
            {
                key: 'login',
                label: '登录',
                onClick: () => router.push('/login'),
            },
            {
                key: 'register',
                label: '注册',
                onClick: () => router.push('/register'),
            },
          ];

    return (
        <Header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                background: colorBgContainer,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
            }}
        >
            {/* <style jsx global>{`
                .logo-menu-item:hover {
                    background: transparent !important;
                }
                .logo-menu-item::after {
                    display: none !important;
                }
            `}</style> */}
            {contextHolder}
            <Modal
                title="确认登出"
                open={isLogoutConfirmVisible}
                onOk={handleLogoutConfirm}
                onCancel={() => setIsLogoutConfirmVisible(false)}
                okText="确认"
                cancelText="取消"
            >
                <p>确定要退出登录吗？</p>
            </Modal>
            
            <div className="demo-logo" />
            
            <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={selectedKeys}
                items={items}
                style={{
                    flex: 1,
                    minWidth: 0,
                    justifyContent: 'flex-start',
                    borderBottom: 'none'
                }}
            />
            
            {/* 右侧菜单 */}
            <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={[]}
                items={rightItems}
                disabledOverflow={true}
                style={{
                    marginLeft: 'auto',
                    whiteSpace: 'nowrap',
                    background: 'transparent',
                    lineHeight: '64px',
                    borderBottom: 'none'
                }}
            />
        </Header>
    );
}