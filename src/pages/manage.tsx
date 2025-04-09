// 主页
// 包含欢迎语以及 SearchBox。


import styles from '../styles/container.module.css'
import { useRouter } from 'next/router';

import { useState } from 'react';

import { request } from '../utils/network';

import { FAILURE_PREFIX } from '../constants/string';

const ManagementPage = () => {
    const router = useRouter();
    if (!router.isReady) return <div>Loading...</div>;

    const [isLoading, setIsLoading] = useState(false);

    const handleSync = async () => {
        setIsLoading(true);
        request(
            `/api/update_new_result_from_online`,
            'PUT',
            undefined,
        ).then((res) => {
            alert(`请求成功 ${res}`)
        }).catch((err) => {
            alert(FAILURE_PREFIX + err);
        }).finally(() => {
            setIsLoading(false);
        })
    }
    return (
        <div className={styles.container}>
            <div>
                <h1>管理页面</h1>
            </div>
            <button onClick={handleSync} disabled={isLoading}>同步</button>
        </div>
    )
};

export default ManagementPage;
