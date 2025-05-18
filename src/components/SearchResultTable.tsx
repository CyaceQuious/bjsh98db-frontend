// SearchResultTable.tsx
import { Table, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { SearchResultItem } from "../utils/types";
import { getResultTableItemName } from "../utils/lang";
import ResultEditForm from './ResultEditForm';
import ResultDelForm from './ResultDelForm';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PlayerModal from './player';
import { useState } from 'react';


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
    const allContestOfficial = useSelector((state: RootState) => state.auth.isContestOfficial);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState('');

    const handlePlayerClick = (name: string) => {
        setSelectedPlayer(name);
        setModalVisible(true);
    };

    // 生成动态列配置
    const baseColumns = ["name", "meet", "zubie", "projectname", "xingbie", "leixing","groupname", "result", "grade", "rank", "score"].map(name => ({
        title: getResultTableItemName(name as keyof SearchResultTableItem),
        dataIndex: name,
        key: name,
        ellipsis: true,
        // 在 SearchResultTable.tsx 中
        
        render: (value: any) => {
            if (name === 'name') {
            return (
                <div>
                {/* 原来的Link替换为点击事件 */}
                <span 
                    onClick={() => handlePlayerClick(value?.toString())}
                    style={{ 
                    color: token.colorPrimary,
                    cursor: 'pointer',
                    textDecoration: 'none'
                    }}
                >
                    {value?.toString() || '-'}
                </span>
                </div>
            );
            }
            return value?.toString() || '-';
        }
    }));

    let columns: TableColumnsType<any> = [...baseColumns];
    if (isSystemAdmin || allContestOfficial.length > 0) {
        // 添加管理列
        const managementColumn: TableColumnsType[number] = {
            title: getResultTableItemName('manage'),
            key: 'manage',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
                (isSystemAdmin || allContestOfficial.includes(record.mid)) && <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ResultEditForm defaultValues={record} isEditMode onSuccess={onContentReFresh} frozenItems={["meet", "projectname", "leixing", "zubie", "xingbie", "name", "groupname"]}/>
                    <ResultDelForm values={record} onSuccess={onContentReFresh} />
                </div>
            )
        };
        columns = [...columns, managementColumn]; 
    }

    // 处理数据源
    const dataSource = results.map((r, index) => ({
        ...r,
        key: index,
        // 确保所有字段都有值
        grade: r.grade ?? '-',
        rank: r.rank ?? '-'
    }));

    return (<>
        <PlayerModal 
            visible={modalVisible} 
            name={selectedPlayer} 
            onClose={() => setModalVisible(false)} 
        />
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
    </>);
}