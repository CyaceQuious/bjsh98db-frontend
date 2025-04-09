import { Typography, Alert, List, Layout, Spin, theme } from 'antd';
import { useRouter } from 'next/router';
import styles from '../styles/container.module.css';
import AboutCard from '../components/AboutCard';
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

    return (
        <AboutCard mode='full'/>
    )
};

export default About;