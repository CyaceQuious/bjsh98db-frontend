// 搜索页面

import { useRouter } from 'next/router';
import { SearchQuery } from '../utils/types';

import SearchContainer from "../components/SeachContainer";
import styles from '../styles/container.module.css'

export default function SearchPage() {
    const router = useRouter();
    
    // 获取搜索参数
    const parseSearchQuery = (): SearchQuery => {
        const { query } = router;

        return {
            name: query.name ? String(query.name) : "",
            projectname: query.projectname ? String(query.projectname) : ""
        };
    };

    if (!router.isReady) return <div>Loading...</div>;

    const query = parseSearchQuery();

    return (
        <div className={styles.container}>
            <SearchContainer oldQuery={query}/>
        </div>
    )
}