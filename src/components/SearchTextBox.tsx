import { AutoComplete, Button, Space, Typography } from 'antd';
import { SearchQuery } from "../utils/types";
import { getQueryItemName, getSearchBoxPlaceHolder } from "../utils/lang";
import { HistoryOutlined } from '@ant-design/icons';

import useSearchHistory from '../hook/useSearchHistory';

const { Text } = Typography;

interface SearchTextBoxProps {
    name: keyof SearchQuery;
    query: string;
    textChange: (name: keyof SearchQuery, value: string) => void;
}

export default function SearchTextBox({ name, query, textChange }: SearchTextBoxProps) {
    let {history, addHistory, clearHistory} = useSearchHistory(name); 
    return {
        item: (
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
            <AutoComplete
                allowClear
                options={history.map(item => ({
                    value: item.query,
                    label: (
                      <Space>
                        <HistoryOutlined />
                        <span>{item.query}</span>
                        {/* <span className="timestamp">
                          {new Date(item.timestamp).toLocaleString()}
                        </span> */}
                      </Space>
                    )
                  }))}
                value={query}
                style={{textAlign: "left"}}
                onChange={(e) => textChange(name, e.valueOf())}
                placeholder={getSearchBoxPlaceHolder()}
            />
        </Space.Compact>
        ), 
        callFunc: ()=>{addHistory(query)}, 
        clearFunc: ()=>{clearHistory()}
    };
}