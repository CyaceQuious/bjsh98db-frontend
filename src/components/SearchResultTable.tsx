// SearchResultTable.tsx
import { Table, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { SearchResultItem, getSearchResultDisplayOrder } from "../utils/types";
import { getResultItemName } from "../utils/lang";

const { useToken } = theme;

interface SearchResultTableProps {
    results: SearchResultItem[];
    currentPage: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number, pageSize: number) => void;
}

export default function SearchResultTable({
    results,
    currentPage, // 当前第几页
    pageSize,    // 每页多少条
    total,     // 总共多少条
    onPageChange 
}: SearchResultTableProps) {
    const { token } = useToken();

    // 生成动态列配置
    const columns: TableColumnsType<SearchResultItem> = getSearchResultDisplayOrder().map(name => ({
        title: getResultItemName(name as keyof SearchResultItem),
        dataIndex: name,
        key: name,
        ellipsis: true,
        sorter: (a, b) => {
            const valA = a[name as keyof SearchResultItem];
            const valB = b[name as keyof SearchResultItem];
            return typeof valA === 'string' && typeof valB === 'string'
                ? valA.localeCompare(valB)
                : 0;
        },
        render: (value: any) => {
            // TODO: 加入判断逻辑，跳转到比赛主页
            if (typeof value === 'boolean') {
                return value ? '✅' : '❌';
            }
            return value?.toString() || '-';
        }
    }));

    return (
        <Table
            columns={columns}
            dataSource={results.map((r, index) => ({ ...r, key: index }))}
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            rowClassName={() => 'hover-highlight'}
            onChange={(pagination) => {
                if (onPageChange) {
                    onPageChange(pagination.current ?? 1, pagination.pageSize ?? 10);
                }
            }}
            style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadius,
            }}
            pagination={{
                current: currentPage,
                pageSize,
                total,
                pageSizeOptions: ['10', '20', '50'],
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
            }}
        />
    );
}