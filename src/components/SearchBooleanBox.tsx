// 组件：基本文本搜索框

import { SearchQuery } from "../utils/types";
import { getQueryItemName } from "../utils/lang";

import { Space, Switch, Typography } from 'antd';
const { Text } = Typography;

interface SearchBooleanBoxProps {
    name: keyof SearchQuery; // 搜索框名称
    query: boolean; // 搜索框中内容
    booleanChange: (name: keyof SearchQuery, value: boolean) => void;
}

export default function SearchBooleanBox({ name, query, booleanChange }: SearchBooleanBoxProps) {
    return (
        <Space style={{ margin: '3px' }}>
            <Text strong>{getQueryItemName(name)}:</Text>
            <Switch
                checked={query}
                onChange={(e) => booleanChange(name, e.valueOf())}
            />
        </Space>
    );
}
