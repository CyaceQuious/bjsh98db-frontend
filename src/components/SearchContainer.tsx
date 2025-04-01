// 组件：完整搜索框
// 包含 SearchBox 以及 SearchResultTable
// 进行搜索网络请求，并自动更新搜索结果

import { SearchQuery, SearchResultItem, SearchResult, getEmptyQuery, searchQueryToString } from "../utils/types";
import SearchBox from "./SearchBox"
import SearchResultTable from "./SearchResultTable";
import { request } from "../utils/network"
import { useEffect, useState } from "react";
import { FAILURE_PREFIX, SEARCH_ERROR } from "../constants/string";

import { useRouter } from 'next/router';

interface SearchContainerProps {
    oldQuery?: SearchQuery;
    hiddenResult?: boolean;
}

export default function SearchContainer({ oldQuery, hiddenResult }: SearchContainerProps) {
    const router = useRouter();

    const [query, setQuery] = useState<SearchQuery>(oldQuery ?? getEmptyQuery());
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    // initialize
    useEffect(() => {
        console.log(query);
        if (searchQueryToString(query) !== "") {
            fetchResults();
        }
    }, [])

    // start to search
    const fetchResults = async () => {
        setIsLoading(true);
        request(
            `/api/query?${searchQueryToString(query)}`,
            'GET',
            undefined,
        ).then((res: SearchResult) => {
            console.log(res.info)
            console.log(res.results)
            setResults(res.results)
            console.log('set result over')
            setError(undefined)
        }).catch((err) => {
            alert(FAILURE_PREFIX + err);
            setError(SEARCH_ERROR + err);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    // change text query
    const changeTextQuery = (name: keyof SearchQuery, value: string) => {
        setQuery(prev => {
            if (typeof prev[name] === "string") {
                return { ...prev, [name]: value }
            }
            console.warn("Invalid field type:", name)
            return prev
        })
    }

    // change boolean query
    const changeBooleanQuery = (name: keyof SearchQuery, value: boolean) => {
        setQuery(prev => {
            if (typeof prev[name] === "boolean") {
                return { ...prev, [name]: value }
            }
            console.warn("Invalid field type:", name)
            return prev
        })
    }

    // 处理按下搜索按钮后的行为
    const handleSearch = () => {
        router.push(`/search?${searchQueryToString(query)}`);
        fetchResults();
    }

    return (
        <div style={{ width: "80%", marginTop: "25px" }}>
            <SearchBox
                query={query}
                queryTextChange={changeTextQuery}
                queryBooleanChange={changeBooleanQuery}
                doSearch={handleSearch}
                searchItems={[
                    { key: "name", type: "text" },
                    { key: "projectname", type: "text" },
                    { key: "groupname", type: "text" },
                    { key: "meet", type: "text", isFullLine: true },
                    { key: "ranked", type: "boolean" },
                    { key: "precise", type: "boolean" },
                ]}
            />
            <div style={{ marginTop: "20px" }}>
                {hiddenResult ? <br /> :
                    isLoading ? <p>Loading...</p> :
                        error === undefined ? <SearchResultTable results={results} /> : error}
            </div>
        </div>
    )
}