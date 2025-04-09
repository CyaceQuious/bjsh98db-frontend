// 搜索页面

import { useRouter } from 'next/router';
import { SearchQuery } from '../utils/types';

import SearchContainer from "../components/SearchContainer";
import styles from '../styles/container.module.css'

export default function SearchPage() {
    const router = useRouter();
    
    // 获取搜索参数
    const parseSearchQuery = (): SearchQuery => {
        const { query } = router;

        return {
            name: query.name ? String(query.name) : "",
            projectname: query.projectname ? String(query.projectname) : "", 
            meet: query.meet ? String(query.meet) : "",
            groupname: query.groupname ? String(query.groupname) : "",
            ranked: query.ranked ? Boolean(query.ranked) : false,
            precise: query.precise ? Boolean(query.precise) : false,
            page: query.page ? Number(query.page): 1, 
            page_size: query.page_size ? Number(query.page_size): 10, 
        } as SearchQuery;
    };

    if (!router.isReady) return <div>Loading...</div>;

    const curQuery = parseSearchQuery();

    return (
        <div className={styles.container}>
            <SearchContainer oldQuery={curQuery}/>
        </div>
    )
}