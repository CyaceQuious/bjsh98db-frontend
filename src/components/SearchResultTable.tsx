// SearchResultTable.tsx
import { Table, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { SearchResultItem } from "../utils/types";
import { getResultTableItemName } from "../utils/lang";
import ResultEditForm from './ResultEditForm';
import ResultDelForm from './ResultDelForm';
import FeedbackApplicationForm from './FeedbackApplicationForm';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PlayerModal from './player';
import { useState } from 'react';
import { useRouter } from 'next/router';


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
    mid: number;
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
    const isDepartmentOfficial = useSelector((state: RootState) => state.auth.isDepartmentOfficial);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const router = useRouter();

    const handlePlayerClick = (name: string) => {
        setSelectedPlayer(name);
        setModalVisible(true);
    };

    // 生成动态列配置
    const baseColumns = ["name", "meet", "projectname", "groupname", "result", "grade", "rank", "score"].map(name => ({
        title: getResultTableItemName(name as keyof SearchResultTableItem),
        dataIndex: name,
        key: name,
        ellipsis: true,
        // 在 SearchResultTable.tsx 中
        
        render: (value: any, record: SearchResultTableItem) => {
            if (name === 'name') {
              return (
                <div>
                {/* 原来的Link替换为点击事件 */}
                <span 
                  onClick={() => handlePlayerClick(value?.toString())}
                  style={{ 
                    color: token.colorText,
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = token.colorPrimary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = token.colorText)
                  }
                >
                  {value?.toString() || '-'}
                </span>
                </div>
              );
            }
            if (name === 'meet') {                    // 点击“运动会”跳转
                const onSearchPage = router.pathname.startsWith('/search');
                if (onSearchPage) {
                  return (
                    <span
                      onClick={() => router.push(`/meet?mid=${record.mid}`)}
                      style={{ 
                        color: token.colorText,
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = token.colorPrimary)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = token.colorText)
                      }
                    >
                      {value?.toString() || '-'}
                    </span>
                  );
                } else {
                  return value?.toString() || '-';
                }
            }
            if (name === 'projectname') {
              return record.xingbie?.toString() + record.zubie?.toString() + record.projectname?.toString()  + record.leixing?.toString();
            }
            return value?.toString() || '-';
        }
    }));

    let columns: TableColumnsType<any> = [...baseColumns];
    if (isSystemAdmin || allContestOfficial.length > 0 || isDepartmentOfficial) {
        // 添加管理列
        const managementColumn: TableColumnsType[number] = {
            title: getResultTableItemName('manage'),
            key: 'manage',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {isDepartmentOfficial &&
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <FeedbackApplicationForm
                        defaultValues={{
                            entryString: `${record.meet}-${record.xingbie}${record.zubie}${record.projectname}${record.leixing}-${record.groupname}${record.name}-${record.result}`,
                            applyreason: "",
                        }}
                        infoIds={{result_id: record.resultid}}
                        frozenItems={["entryString"]}
                        onSuccess={(_: any)=>{}}
                    />
                </div>}
                {(isSystemAdmin || allContestOfficial.includes(record.mid)) ?
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <ResultEditForm 
                        defaultValues={record} 
                        infoIds={record}
                        isEditMode 
                        onSuccess={onContentReFresh} 
                        frozenItems={["meet", "projectname", "leixing", "zubie", "xingbie"]}
                    />
                    <ResultDelForm values={record} onSuccess={onContentReFresh} />
                </div> : ""}
                </div>
            )
        };
        columns = [...columns, managementColumn]; 
    } else {
      /* ★ 关键：给没有管理列的表再塞一个“占位”固定列 ★ */
      columns.push({
        title: '',                // 头部留空
        key: '__spacer__',
        fixed: 'right',           // 仍然固定在右侧
        width: 1,                 // 1 px 足够触发布局，又几乎看不见
        render: () => undefined,       // 不渲染任何内容
        className: 'spacer-col',  // 可选：加个类名方便调样式
      });
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