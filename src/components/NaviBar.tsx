import { useRouter } from 'next/router';
import { Layout, Menu, theme, Modal, notification } from 'antd';
import type { MenuProps } from 'antd';

import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { resetData } from '../redux/auth';

const { Header } = Layout;

export default function Navbar() {
    const router = useRouter();
    const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [api, contextHolder] = notification.useNotification();

    const dispatch = useDispatch();
    const userName = useSelector((state: RootState) => state.auth.userName);

    // 处理登出确认
    const handleLogoutConfirm = () => {
        setIsLogoutConfirmVisible(false);
        // router.push('/logout');
        api.open({
            message: `用户${userName}成功登出`,
            duration: 3,
          });
        dispatch(resetData()); 
    };

    // 根据当前路径自动选中菜单项
    const selectedKeys = [
        router.pathname === '/' ? 'home' :
        router.pathname.startsWith('/search') ? 'search' : 
        router.pathname.startsWith('/contests') ? 'contests' :
        router.pathname.startsWith('/manage') ? 'manage' :
        router.pathname === '/about' ? 'about' : ''
    ].filter(Boolean);

    // 菜单项配置
    const items: MenuProps['items'] = [
        {
            key: 'home',
            label: '主页',
            onClick: () => router.push('/'),
        },
        {
            key: 'search',
            label: '搜索',
            onClick: () => router.push('/search'),
        },
        {
            key: 'contests',
            label: '比赛',
            onClick: () => router.push('/contests'),
        },
        {
            key: 'manage',
            label: '管理',
            onClick: () => router.push('/manage'),
        },
        {
            key: 'about',
            label: '关于我们',
            onClick: () => router.push('/about'),
        },
    ];

    const hideRightItems = ['/login', '/register', '/logout']
  // 右侧菜单项配置
  const rightItems: MenuProps['items'] = hideRightItems.includes(router.asPath)
  ? [] : userName !== ""
    ? [
        {
          key: 'username',
          label: (
            <span style={{ cursor: 'default', color: 'inherit' }}>
              {userName}
            </span>
          ),
        },
        {
          key: 'logout',
          label: '登出',
          onClick: () => {
            setIsLogoutConfirmVisible(true);
          },
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
          }}
        >
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
              justifyContent: 'flex-start'
            }}
          />
          
          {/* 右侧菜单 */}
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[]}
            items={rightItems}
            style={{
              background: 'transparent',
              lineHeight: '64px', // 保持与Header高度一致
              borderBottom: 'none'
            }}
          />
        </Header>
      );
}