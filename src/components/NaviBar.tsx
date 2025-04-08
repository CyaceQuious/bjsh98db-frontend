import { useRouter } from 'next/router';
import { Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';

const { Header } = Layout;

export default function Navbar() {
    const router = useRouter();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

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
        </Header>
    );
}