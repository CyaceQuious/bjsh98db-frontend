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
            xingbie: query.xingbie ? String(query.xingbie) : "",
            zubie: query.zubie ? String(query.zubie) : "",
            leixing: query.leixing ? String(query.leixing) : "",
            meet: query.meet ? String(query.meet) : "",
            groupname: query.groupname ? String(query.groupname) : "",
            ranked: query.ranked ? Boolean(query.ranked) : false,
            precise: query.precise ? Boolean(query.precise) : false,
            page: query.page ? Number(query.page): 1, 
            page_size: query.page_size ? Number(query.page_size): 10, 
            star: query.star ? Boolean(query.star): false,
        } as SearchQuery;
    };

    if (!router.isReady) return <div>Loading...</div>;

    const curQuery = parseSearchQuery();

    return (
        <div className={styles.container}>
            <div style={{width: '80%'}}>
            <SearchContainer oldQuery={curQuery} hiddenResult={false} onContentRefresh={() => {}} searchJump={true}/>
            </div>
        </div>
    )
}