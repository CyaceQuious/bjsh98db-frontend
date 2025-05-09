// SearchResultTable.tsx
import { Table, theme, Button, Modal, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { SearchResultItem } from "../utils/types";
import { getResultTableItemName } from "../utils/lang";
import ResultEditForm from './ResultEditForm';

import { request } from "../utils/network";

import { DeleteOutlined } from '@ant-design/icons';

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

interface DeleteRequest {
    session: string;
    mid: number;
    name: string;
    projectname: string;
    leixing: string; 
    zubie: string;
    xingbie: string;
    groupname: string;
}

interface DeleteResponse {
    code: number;
    info: string;
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

    const session = useSelector((state: RootState) => state.auth.session);
    const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);
    const allContestOfficial = useSelector((state: RootState) => state.auth.isContestOfficial);

    // 删除比赛相关函数
    const handleDeleteClick = (values: DeleteRequest) => {
        Modal.confirm({
        title: `确认删除该条成绩？`,
        content: '此操作不可撤销，请谨慎操作！',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            console.log(`删除成绩记录: ${values}`);
            deleteMeetRequest(values); 
            message.success(`删除操作已提交`);
        },
        onCancel() {
            message.info('已取消删除');
        },
        });
    };
    const deleteMeetRequest = async (values: DeleteRequest) => {
        try {
            const data: DeleteResponse = await request(
                `/api/manage_result`, 
                'DELETE', 
                {
                    ...values, 
                    session, 
                } as DeleteRequest, 
                false, 
                'json'
            ); 
            if (data.code !== 0) {
                message.warning(data.info || 'Failed to delete');
            }
        } catch (err) {
            message.warning('An error occurred while deleting' + err); 
            console.log('Put error:', err);
        } finally {
            onContentReFresh();
        }
    }

    // 生成动态列配置
    const baseColumns = ["name", "meet", "zubie", "projectname", "xingbie", "leixing","groupname", "result", "grade", "rank", "score"].map(name => ({
        title: getResultTableItemName(name as keyof SearchResultTableItem),
        dataIndex: name,
        key: name,
        ellipsis: true,
        render: (value: any) => value?.toString() || '-'
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
                    <Button
                        type="link"
                        onClick={() => handleDeleteClick({...record} as DeleteRequest)}
                        style={{ padding: 0 }}
                        icon={<DeleteOutlined />}
                    >
                        删除
                    </Button>
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