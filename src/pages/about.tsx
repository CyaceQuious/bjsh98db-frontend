import { Spin} from 'antd';
import { useRouter } from 'next/router';
import styles from '../styles/container.module.css';
import AboutCard from '../components/AboutCard';

const About = () => {
    const router = useRouter();

    if (!router.isReady) return (
        <div className={styles.container}>
            <Spin size="large" />
        </div>
    );

    return (
        <div className={styles.container}>
        <div style={{width: '90%', display: 'flex', justifyContent: 'center'}}>
        <AboutCard mode='full'/>
        </div>
        </div>
    )
};

export default About;