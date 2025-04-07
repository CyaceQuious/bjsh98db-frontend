import RegisterForm from "../components/RegisterForm"
import { useRouter } from 'next/router';

export default function Register() {
    const router = useRouter();
    if (!router.isReady) return <div>Loading...</div>;
    return (
        <div>
            <RegisterForm />
        </div>
    )
}