import FeedbackList from "./FeedbackList";
import { interfaceToString } from "../utils/types";
import { FeedbackItem } from "./FeedbackList";
import { request } from "../utils/network"
import { useEffect, useState } from "react";
import { FAILURE_PREFIX } from "../constants/string";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { ReloadOutlined } from "@ant-design/icons";

import { Button, Card, message } from "antd";

interface GetFeedbackReceivedRequest {
    session: string;
}

interface GetFeedbackReceivedResponse {
    feedback_requests: FeedbackItem[];
    code: number;
    info: string;
}

interface ReplyFeedbackRequest {
    session: string;
    id: number; 
    approval: string; 
    reject_reason: string;
}

interface ReplyFeedbackResponse {
    code: number;
    info: string;
}

interface FeedbackReceiverProps {
    style: React.CSSProperties;
}

export default function FeedbackReceiver({ style }: FeedbackReceiverProps) {
    const session = useSelector((state: RootState) => state.auth.session);
    const [results, setResults] = useState<FeedbackItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // initialize
    useEffect(() => {
        setPagination({
            current: 1,
            pageSize: 10,
            total: results.length,
        })
        fetchResults()
    }, [])

    // start to search
    const fetchResults = async () => {
        setIsLoading(true);
        setPagination({
            current: 1,
            pageSize: 10,
            total: 0,
        })
        const curQuery: GetFeedbackReceivedRequest = {
            session,
        }
        console.log('start to search'); 
        console.log(curQuery); 
        request(
            `/api/result_message/get_feedback_received?${interfaceToString(curQuery)}`,
            'GET',
            undefined,
        ).then((res: GetFeedbackReceivedResponse) => {
            console.log(res.info)
            console.log(res.feedback_requests)
            setResults(res.feedback_requests)
            console.log('set result over')
            setError(undefined)
        }).catch((err) => {
            alert(FAILURE_PREFIX + err);
            setResults([]);
            setError(`${err}`);
        }).finally(() => {
            setIsLoading(false);
            setPagination(prev => ({
                ...prev,
                total: results.length
            })
            )
        })
    }

    // 发送审批请求
    const replyFeedback = async (id: number, approval: string, rejectReason: string) => {
        const curQuery: ReplyFeedbackRequest = {
            session,
            id,
            approval,
            reject_reason: rejectReason
        }
        console.log('start to reply');
        console.log(curQuery);
        try {
            const data: ReplyFeedbackResponse = await request(
                `/api/result_message/reply_feedback`, 
                'POST', 
                curQuery, 
                false, 
                'json'
            );
            if (data.code !== 0) {
                alert(data.info || 'Failed to submit reply');
            }
            message.success("审核提交成功");
        } catch (err) {
            message.warning('操作失败，请重试: ' + err);
            console.log('API Error:', err);
        } finally {
            fetchResults();
        }
    }

    // 处理分页变化
    const handlePageChange = (page: number, pageSize: number) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    // 处理审批请求
    const handleReply = (id: number, approval: boolean, rejectReason: string) => {
        replyFeedback(id, approval ? 'True' : 'False', rejectReason)
    }

    // 计算实际显示内容，并注意不要超过数组长度
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const currentResults = results.slice(startIndex, endIndex);

    return (
        <div style={style}>
            <Card title={
                <div>
                    <>我收到的成绩反馈</>
                    <Button type="text" onClick={fetchResults} icon={<ReloadOutlined />} style={{ marginLeft: '10px' }}>刷新</Button>
                </div>
            } style={{ width: '100%' }}>
                {isLoading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {(!isLoading && !error) && <FeedbackList 
                    data={currentResults} 
                    pagination={pagination} 
                    onPageChange={handlePageChange} 
                    loading={isLoading}
                    mode={'receive'}
                    onReply={handleReply}
                />}
            </Card>
        </div>
    )
}