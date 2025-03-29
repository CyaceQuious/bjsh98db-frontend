// 组件：搜索结果的表头

import { SearchResultItem, getSearchResultDisplayOrder } from "../utils/types";

interface SearchResultTableHeadProps {
}

export default function SearchResultTableHead({ }: SearchResultTableHeadProps) {
    const listname = getSearchResultDisplayOrder(); 
    const headContent = listname.map((name)=>(
        <th key={name}>
            {name}
        </th>
    ))
    return (
        <tr>
            {headContent}
        </tr>
    );
}