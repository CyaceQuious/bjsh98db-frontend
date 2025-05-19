import FeedbackList from "./FeedbackList";
import { interfaceToString } from "../utils/types";
import { FeedbackItem } from "./FeedbackList";
import { request } from "../utils/network"
import { useEffect, useState } from "react";
import { FAILURE_PREFIX } from "../constants/string";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { ReloadOutlined } from "@ant-design/icons";

import { Button, Card } from "antd";

interface GetFeedbackSentRequest {
    session: string;
}

interface GetFeedbackSentResponse {
    feedback_requests: FeedbackItem[];
    code: number;
    info: string;
}

interface FeedbackSenderProps {
    style: React.CSSProperties;
}

export default function FeedbackSender({ style }: FeedbackSenderProps) {
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
        const curQuery: GetFeedbackSentRequest = {
            session,
        }
        if (session !== undefined && session !== "") {
            curQuery.session = session;
        }
        console.log('start to search'); 
        console.log(curQuery); 
        request(
            `/api/result_message/get_feedback_sent?${interfaceToString(curQuery)}`,
            'GET',
            undefined,
        ).then((res: GetFeedbackSentResponse) => {
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

    // 处理分页变化
    const handlePageChange = (page: number, pageSize: number) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    // 计算实际显示内容，并注意不要超过数组长度
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const currentResults = results.slice(startIndex, endIndex);

    return (
        <div style={style}>
            <Card title={
                <div>
                    <>我提出的成绩反馈</>
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
                    mode={'send'}
                />}
            </Card>
        </div>
    )
}