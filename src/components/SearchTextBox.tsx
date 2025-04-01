import { Input, Space, Typography } from 'antd';
import type { SearchProps } from 'antd/es/input';
import { SearchQuery } from "../utils/types";
import { getQueryItemName, getSearchBoxPlaceHolder } from "../utils/lang";

const { Text } = Typography;

interface SearchTextBoxProps {
    name: keyof SearchQuery;
    query: string;
    textChange: (name: keyof SearchQuery, value: string) => void;
}

export default function SearchTextBox({ name, query, textChange }: SearchTextBoxProps) {
    return (
        <Space.Compact
            direction="horizontal"
            style={{ width: '100%', margin: '4px 0' }}
        >
            <Text strong style={{
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                width: '100px'
            }}>
                {getQueryItemName(name)}:
            </Text>
            <Input
                allowClear
                value={query}
                onChange={(e) => textChange(name, e.target.value)}
                placeholder={getSearchBoxPlaceHolder()}
            />
        </Space.Compact>
    );
}