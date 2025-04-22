// 组件：完整搜索框
// 包含 SearchBox 以及 SearchResultTable
// 进行搜索网络请求，并自动更新搜索结果

import { SearchQuery, SearchResultItem, SearchResult, getEmptyQuery, interfaceToString } from "../utils/types";
import SearchBox from "./SearchBox"
import SearchResultTable from "./SearchResultTable";
import { request } from "../utils/network"
import { useEffect, useState } from "react";
import { FAILURE_PREFIX, SEARCH_ERROR } from "../constants/string";

import { useRouter } from 'next/router';

interface SearchContainerProps {
    oldQuery?: SearchQuery;
    hiddenResult?: boolean;
    searchJump: boolean; // 点击搜索后是否跳转
    onContentRefresh: () => void;
    frozeNames?: string[]; // 冻结的参数名，这些参数不会出现在搜索框中
    briefButton?: boolean; // 是则删去清空搜索历史的按钮
}

export default function SearchContainer({ oldQuery, hiddenResult, searchJump, onContentRefresh, frozeNames, briefButton }: SearchContainerProps) {
    const router = useRouter();

    const [query, setQuery] = useState<SearchQuery>(oldQuery ?? getEmptyQuery());
    const [lastQuery, setLastQuery] = useState<SearchQuery>(oldQuery ?? getEmptyQuery());
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const [total, setTotal] = useState(0);

    // initialize
    useEffect(() => {
        console.log(oldQuery); 
        if (oldQuery !== undefined) {
            setQuery(oldQuery);
            console.log('initializing'); 
            console.log(query);
            setLastQuery(oldQuery);
            if (interfaceToString(oldQuery, ["page", "page_size"]) !== "") {
                fetchResults(oldQuery);
            }
        }
    }, [oldQuery])

    // start to search
    const fetchResults = async (curQuery: SearchQuery) => {
        setIsLoading(true);
        console.log('start to search'); 
        console.log(curQuery); 
        request(
            `/api/query?${interfaceToString(curQuery)}`,
            'GET',
            undefined,
        ).then((res: SearchResult) => {
            console.log(res.info)
            console.log(res.results)
            setResults(res.results)
            setTotal(res.count)
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
    const changeTextQuery = (name: keyof SearchQuery, value: string | undefined) => {
        setQuery(prev => {
            if (value === undefined) {
                value = ''; 
            }
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
        const newQuery = {...query, page: 1, page_size: lastQuery.page_size}; 
        setQuery(newQuery); 
        setLastQuery(newQuery)
        if (searchJump) {
            router.push(`/search?${interfaceToString(newQuery)}`);
        }
        if (hiddenResult === false) {
            fetchResults(newQuery);
        }
    }

    // 处理分页变化
    const handlePageChange = (page: number, newPageSize: number) => {
        if (page * (newPageSize-1) >= total) {
            page = Math.floor((total-1)/newPageSize)+1;
        }
        if (page <= 0) {
            return; 
        }
        const newQuery: SearchQuery = { ...lastQuery, page, page_size: newPageSize }
        setLastQuery(newQuery);
        if (searchJump) {
            router.push(`/search?${interfaceToString(newQuery)}`);
        }
        fetchResults(newQuery); 
    };

    const allSearchItems = [
        { key: "name", type: "text" },
        { key: "groupname", type: "text" },
        { key: "projectname", type: "text" },
        { key: "meet", type: "text", isFullLine: true },
        { key: "ranked", type: "boolean" },
        { key: "precise", type: "boolean" },
    ]
    const searchItems = allSearchItems.filter(item => {
        if (frozeNames !== undefined) {
            // console.log(`in check frozekey: ${item.key}`); 
            return !frozeNames.includes(item.key);
        } else {
            return true;
        }
    }).map(item => {return{...item, key: item.key as keyof SearchQuery}});

    return (
        <div style={{ width: "80%", marginTop: "25px" }}>
            <SearchBox
                query={query}
                queryTextChange={changeTextQuery}
                queryBooleanChange={changeBooleanQuery}
                doSearch={handleSearch}
                searchItems={searchItems}
                briefButton={briefButton === true}
            />
            <div style={{ marginTop: "20px" }}>
                {hiddenResult ? "" :
                    isLoading ? <p>Loading...</p> :
                        error === undefined ? <SearchResultTable
                        results={results}
                        currentPage={lastQuery.page}
                        pageSize={lastQuery.page_size}
                        total={total}
                        onPageChange={handlePageChange}
                        onContentReFresh={()=>{
                            fetchResults(lastQuery);
                            onContentRefresh();
                        }}
                    /> : error}
            </div>
        </div>
    )
}