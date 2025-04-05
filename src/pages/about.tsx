import { Typography, Alert, List, Layout, Spin, theme } from 'antd';
import { useRouter } from 'next/router';
import styles from '../styles/container.module.css';
import Link from 'next/link';
import Card from 'antd/es/card/Card';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useToken } = theme;

const About = () => {
    const router = useRouter();
    const { token } = useToken();

    if (!router.isReady) return (
        <div className={styles.container}>
            <Spin size="large" />
        </div>
    );

    const Developers = [
        { name: 'ryz', link: '/' },
        { name: 'czy', link: '/' },
        { name: 'fgf', link: '/' },
        { name: 'zjy', link: '/' },
        { name: 'mpc', link: '/' }
    ]

    return (
        <Content className={styles.container} style={{ padding: token.paddingLG }}>
            <div style={{ 
                maxWidth: 800, 
                margin: '0 auto',
                padding: token.paddingLG,
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadow
            }}>
                <Title
                    level={2}
                    style={{
                        textAlign: 'center',
                        marginBottom: token.marginLG,
                    }}
                >
                    关于数据平台
                </Title>
                
                <Card title="项目介绍" style={{marginBottom: token.marginLG}}>
                bjsh98.db（大体协数据库）是一个为北京市大学生体育协会（简称“大体协”）成绩查询页开发的数据检索平台，借助于信息化技术，尤其是软件技术和互联网技术，支持赛会组织方、运动员、观众等群体高效、安全地上传、修正、查询相关赛事成绩数据，优化落后的查询模式。
                </Card>

                <Card title="开发者"  style={{marginBottom: token.marginLG}} >
                    <List
                        grid={{ gutter: 16, column: 2 }}
                        dataSource={Developers}
                        renderItem={(item) => (
                            <List.Item style={{ margin: 0 }}>
                                <Link 
                                    href={item.link} 
                                    style={{
                                        color: token.colorPrimary,
                                        transition: 'color 0.3s',
                                    }}
                                >
                                    {item.name}
                                </Link>
                            </List.Item>
                        )}
                    />
                </Card>

                <Alert
                    message="数据声明"
                    description={
                        <Text style={{ color: token.colorTextSecondary }}>
                            原始数据来源：
                            <Link href="https://wx.bjsh98.com/client/index.html">
                                bjsh98官方平台
                            </Link>
                        </Text>
                    }
                    type="info"
                    showIcon
                />
            </div>
        </Content>
    );
};

export default About;