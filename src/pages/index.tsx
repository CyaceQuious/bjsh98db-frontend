// 主页
// 包含欢迎语以及 SearchBox。


import AboutCard from '../components/AboutCard';
import SearchContainer from '../components/SearchContainer';
import styles from '../styles/container.module.css'
import { useRouter } from 'next/router';

const WelcomeSearch = () => {
    const router = useRouter();
    if (!router.isReady) return <div>Loading...</div>;
    return (
        <div className={styles.container}>
            <div style={{width: '80%'}}>
            <SearchContainer hiddenResult={true} onContentRefresh={() => {}} searchJump={true} initOpenAdvanced={false}/>
            <AboutCard mode='simple'/>
            </div>
        </div>
    )
};

export default WelcomeSearch;
