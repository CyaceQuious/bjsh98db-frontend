import store from "../redux/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { request } from "../utils/network";
import { useRouter } from 'next/router';
import { setUserName, setCreateTime, setEmail, setRealName, setIsContestOfficial, setIsDepartmentOfficial, setIsSystemAdmin, setOrg, resetData } from "../redux/auth";
import { message } from "antd";
import { useEffect } from "react";

const UserRefresh = () => {
    const dispatch = useDispatch();
    const router = useRouter();
	const session = useSelector((state: RootState) => state.auth.session);

    const refresh = async () => {
		if (session === "") return;
		try {
			const res = await request(
				`/api/users/get_user_profile?session=${session}`, 
				"GET"
			);
			dispatch(setUserName(res.data.username));
			dispatch(setEmail(res.data.email));
			dispatch(setCreateTime(res.data.create_time));
			dispatch(setRealName(res.data.real_name));
			dispatch(setOrg(res.data.org));
			dispatch(setIsDepartmentOfficial(res.data.Is_Department_Official));
			dispatch(setIsContestOfficial(res.data.Is_Contest_Official));
			dispatch(setIsSystemAdmin(res.data.Is_System_Admin));
		} catch(err) {
			console.log(err);
			dispatch(resetData());
			message.warning("登录状态异常，请重新登录")
		}
	}
	useEffect(() => {
	    refresh();
	}, [router]);
	return (<></>)
}

export default UserRefresh;