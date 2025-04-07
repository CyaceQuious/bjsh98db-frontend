import LoginForm from "../components/LoginForm";
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter();
    if (!router.isReady) return <div>Loading...</div>;
    return (
        <div>
            <LoginForm />
        </div>
    )
}