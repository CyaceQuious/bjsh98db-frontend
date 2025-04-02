// 比赛页面

import { useRouter } from 'next/router';
import { SearchQuery } from '../utils/types';

import SearchContainer from "../components/SearchContainer";
import styles from '../styles/container.module.css'

export default function ContestsPage() {
    const router = useRouter();
    if (!router.isReady) return <div>Loading...</div>;
    return (
        <div className={styles.container}>
            <h1>Contests</h1>
        </div>
    )
}