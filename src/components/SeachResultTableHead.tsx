// 组件：搜索结果的表头

import { SearchResultItem } from "../utils/types";

interface SearchResultTableHeadProps {
}

export default function SearchResultTableHead({ }: SearchResultTableHeadProps) {
    const listname: string[] = ["name", "meet", "projectname", "groupname", "result", "grade"]
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