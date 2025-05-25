// 组件：完整搜索框
// 包含 SearchBox 以及 SearchResultTable
// 进行搜索网络请求，并自动更新搜索结果

import { SearchQuery, SearchResultItem, SearchResult, getEmptyQuery, interfaceToString } from "../utils/types";
import SearchBox from "./SearchBox"
import SearchResultTable from "./SearchResultTable";
import { request } from "../utils/network"
import { useEffect, useState } from "react";
import { FAILURE_PREFIX, SEARCH_ERROR } from "../constants/string";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { useRouter } from 'next/router';

interface SearchContainerProps {
    oldQuery?: SearchQuery; // 提供的初始查询参数。默认为空。
    hiddenResult?: boolean; // 是否隐藏搜索结果的表格。目前只在index启用以满足页面布局要求。默认为false
    initOpenAdvanced: boolean; // 是否显示高级搜索按钮
    searchJump: boolean; // 点击搜索后是否跳转，即是否更新当前页面的url（应该在index和search页面启用，其他作为页面内嵌组件的情况下禁用）
    onContentRefresh: () => void; // 当比赛项目被修改之后，会被调用的函数（比如可以用于通知其他组件刷新内容）
    frozeNames?: string[]; // 冻结的参数名，这些参数不会允许用户改动，也不会对用户显示。默认不冻结。
    briefButton?: boolean; // 是则删去清空搜索历史的按钮，用于精简页面。默认为false
}

export default function SearchContainer({ oldQuery, hiddenResult, initOpenAdvanced, searchJump, onContentRefresh, frozeNames, briefButton }: SearchContainerProps) {
    const router = useRouter();

    const session = useSelector((state: RootState) => state.auth.session);
    const [query, setQuery] = useState<SearchQuery>(oldQuery ?? getEmptyQuery());
    const [lastQuery, setLastQuery] = useState<SearchQuery>(oldQuery ?? getEmptyQuery());
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [showAdvanced, setShowAdvanced] = useState(briefButton === true ? true : initOpenAdvanced);

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
        if (session !== undefined && session !== "") {
            curQuery.session = session;
        }
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
            alert(FAILURE_PREFIX + `${err}`);
            setError(SEARCH_ERROR + `${err}`);
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
            return { ...prev, [name]: value }
        })
    }

    // change boolean query
    const changeBooleanQuery = (name: keyof SearchQuery, value: boolean) => {
        console.log(name, value)
        setQuery(prev => {
            return { ...prev, [name]: value }
        })
    }

    // 处理按下搜索按钮后的行为
    const handleSearch = () => {
        const newQuery = {...query, page: 1, page_size: lastQuery.page_size}; 
        setQuery(newQuery); 
        setLastQuery(newQuery)
        if (searchJump) {
            router.push(`/search?${interfaceToString({...newQuery, showAdvanced})}`);
        }
        else if (hiddenResult === false) {
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
            router.push(`/search?${interfaceToString({...newQuery, showAdvanced})}`);
        }
        fetchResults(newQuery); 
    };

    const allSearchItems = [
        // width = [xs, sm, md, lg] of 24
        { key: "name", type: "text", width: [24, 24, 12, 6] },
        { key: "groupname", type: "text", width: [24, 24, 12, 6] },
        { key: "meet", type: "text", width: [24, 24, 24, 12] },
    ]
    const advanceSearchItems = [
        // width = [xs, sm, md, lg] of 24
        { key: "projectname", type: "text", width: [24, 24, 12, 6] },
        { key: "xingbie", type: "text", width: [24, 24, 12, 6] },
        { key: "zubie", type: "text", width: [24, 24, 12, 6] },
        { key: "leixing", type: "text", width: [24, 24, 12, 6] },
        { key: "ranked", type: "boolean", width: [8, 8, 4, 4] },
        { key: "precise", type: "boolean", width: [8, 8, 4, 4] },
        { key: "star", type: "boolean", width: [8, 8, 4, 4] },
    ]
    const searchItems = allSearchItems.filter(item => {
        if (frozeNames !== undefined) {
            // console.log(`in check frozekey: ${item.key}`); 
            return !frozeNames.includes(item.key);
        } else {
            return true;
        }
    }).map(item => {return{...item, key: item.key as keyof SearchQuery}});

    const advanceItems = advanceSearchItems.filter(item => {
        if (frozeNames !== undefined) {
            // console.log(`in check frozekey: ${item.key}`); 
            return !frozeNames.includes(item.key);
        } else {
            return true;
        }
    }).map(item => {return{...item, key: item.key as keyof SearchQuery}});

    return (
        <div style={{ width: "100%", marginTop: "25px", marginBottom: "25px"}}>
            <SearchBox
                query={query}
                queryTextChange={changeTextQuery}
                queryBooleanChange={changeBooleanQuery}
                showAdvancedChange={(value: boolean) => setShowAdvanced(value)}
                doSearch={handleSearch}
                searchItems={searchItems}
                advanceItems={advanceItems}
                briefButton={briefButton === true}
                showAdvanced={showAdvanced}
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