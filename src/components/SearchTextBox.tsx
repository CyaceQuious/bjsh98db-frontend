import { AutoComplete, Space, Typography, Select } from 'antd';
import { SearchQuery } from "../utils/types";
import { getQueryItemName, getSearchBoxPlaceHolder } from "../utils/lang";
import { HistoryOutlined } from '@ant-design/icons';
import useSearchHistory from '../hook/useSearchHistory';

const { Text } = Typography;

interface SearchTextBoxProps {
    name: keyof SearchQuery;
    query: string;
    textChange: (name: keyof SearchQuery, value: string | undefined) => void;
}

export default function SearchTextBox({ name, query, textChange }: SearchTextBoxProps) {
    const { history, addHistory, clearHistory } = useSearchHistory(name);
    const genderOptions = ['男子', '女子', '混合'];

    const isGender = name === 'xingbie';

    const inputNode = isGender ? (
        <Select
            allowClear
            value={query || undefined}
            onChange={(value) => textChange(name, value)}
            placeholder={getSearchBoxPlaceHolder(name)}
            style={{ width: '100%' }}
            options={genderOptions.map(opt => ({ value: opt, label: opt }))}
        />
    ) : (
        <AutoComplete
            allowClear
            options={history.map(item => ({
                value: item.query,
                label: (
                    <Space>
                        <HistoryOutlined />
                        <span>{item.query}</span>
                    </Space>
                )
            }))}
            value={query}
            style={{ width: '100%' }}
            onChange={(e) => textChange(name, e)}
            placeholder={getSearchBoxPlaceHolder(name)}
        />
    );

    return {
        item: (
            <Space.Compact
                direction="horizontal"
                style={{
                    width: '100%',
                    margin: '4px 0',
                    alignItems: 'center'
                }}
            >
                <Text
                    strong
                    style={{
                        padding: '0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100px'
                    }}
                >
                    {getQueryItemName(name)}:
                </Text>
                {inputNode}
            </Space.Compact>
        ),
        callFunc: () => { addHistory(query); },
        clearFunc: () => { clearHistory(); }
    };
}
