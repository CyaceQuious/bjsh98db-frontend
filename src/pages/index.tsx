// 主页
// 包含欢迎语以及 SearchBox。


import AboutCard from '../components/AboutCard';
import styles from '../styles/container.module.css'
import { useRouter } from 'next/router';

const WelcomeSearch = () => {
    const router = useRouter();
    if (!router.isReady) return <div>Loading...</div>;
    return (
        <div className={styles.container}>
            <div>
            <h1>--== 欢迎使用 BJSH98.DB ==--</h1>
            </div>
            <AboutCard mode='simple'/>
        </div>
    )
};

export default WelcomeSearch;
