// 主页
// 包含欢迎语以及 SearchBox。


import SearchBox from "../components/SeachBox";
import styles from '../styles/container.module.css'
import { getEmptyQuery, SearchQuery, searchQueryToString } from "../utils/types";

import { useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router';

const WelcomeSearch = () => {
    const router = useRouter();

    const [query, setQuery] = useState<SearchQuery>(getEmptyQuery());

    // start to search
    // jump to '/search'
    const handleSearch = () => {
        router.push(`/search?${searchQueryToString(query)}`)
    }

    // change query
    const changeQuery = (name: string, value: string) => {
        let new_query = { ...query }
        new_query[name as keyof SearchQuery] = value
        setQuery(new_query)
    }

    return (
        <div className={styles.container}>
            <div>
            <h1>欢迎使用 BJSH98.DB</h1>
            </div>
            <div style={{width: "80%"}}>
                <SearchBox
                    query={query}
                    queryChange={changeQuery}
                    doSearch={handleSearch}
                />
            </div>
        </div>
    )
};

export default WelcomeSearch;
