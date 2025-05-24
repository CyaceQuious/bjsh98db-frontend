import { AutoComplete, Space, Typography } from 'antd';
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
    const {history, addHistory, clearHistory} = useSearchHistory(name); 
    const actualList = name === 'xingbie' ? [{query: '男子'},{query: '女子'},{query: '混合'}] : history;
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
            <Text strong style={{
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                width: '100px'
            }}>
                {getQueryItemName(name)}:
            </Text>
            <AutoComplete
                allowClear
                options={actualList.map(item => ({
                    value: item.query,
                    label: (
                      <Space>
                        {name !== 'xingbie'&&<HistoryOutlined />}
                        <span>{item.query}</span>
                      </Space>
                    )
                  }))}
                value={query}
                style={{textAlign: "left"}}
                onChange={(e) => textChange(name, e)}
                placeholder={getSearchBoxPlaceHolder(name)}
            />
        </Space.Compact>
        ), 
        callFunc: ()=>{addHistory(query)}, 
        clearFunc: ()=>{clearHistory()}
    };
}