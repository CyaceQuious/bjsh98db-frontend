// SearchResultTable.tsx
import { Table, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { SearchResultItem } from "../utils/types";
import { getResultTableItemName } from "../utils/lang";
import ResultEditForm from './ResultEditForm';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const { useToken } = theme;
interface SearchResultTableProps {
    results: SearchResultItem[];
    currentPage: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number, pageSize: number) => void;
    onContentReFresh: () => void;
}

export interface SearchResultTableItem extends SearchResultItem {
    manage?: React.ReactNode; // 添加管理列类型
}

export default function SearchResultTable({
    results,
    currentPage, // 当前第几页
    pageSize,    // 每页多少条
    total,     // 总共多少条
    onPageChange, 
    onContentReFresh
}: SearchResultTableProps) {
    const { token } = useToken();

    const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);

    // 生成动态列配置
    const baseColumns = ["name", "meet", "projectname", "groupname", "result", "grade", "rank", "score"].map(name => ({
        title: getResultTableItemName(name as keyof SearchResultTableItem),
        dataIndex: name,
        key: name,
        ellipsis: true,
        render: (value: any) => value?.toString() || '-'
    }));

    // 添加管理列
    const managementColumn: TableColumnsType[number] = {
        title: getResultTableItemName('manage'),
        key: 'manage',
        fixed: 'right',
        width: 100,
        render: (_, record) => (
            isSystemAdmin && <ResultEditForm defaultValues={record} isEditMode onSuccess={onContentReFresh}/>
        )
    };

    const columns = [...baseColumns, managementColumn];

    // 处理数据源
    const dataSource = results.map((r, index) => ({
        ...r,
        key: index,
        // 确保所有字段都有值
        grade: r.grade ?? '-',
        rank: r.rank ?? '-'
    }));

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            rowClassName={() => 'hover-highlight'}
            onChange={(pagination) => {
                onPageChange(pagination.current ?? 1, pagination.pageSize ?? 10);
            }}
            style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadius,
            }}
            pagination={{
                current: currentPage,
                pageSize,
                total,
                pageSizeOptions: ['5', '10', '20', '50'],
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
            }}
        />
    );
}