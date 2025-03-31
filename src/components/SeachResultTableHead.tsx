// 组件：搜索结果的表头

import { getSearchResultDisplayOrder } from "../utils/types";

export default function SearchResultTableHead() {
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