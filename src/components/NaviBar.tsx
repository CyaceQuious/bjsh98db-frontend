import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    return (
        <nav style={{
            width: "100%",
            height: "20px"
        }}>
            <button
                key={0}
                onClick={() => handleNavigate('/')}
                style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                }}
            >
                主页
            </button>
            <button
                key={1}
                onClick={() => handleNavigate('/search?')}
                style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                }}
            >
                搜索
            </button>
        </nav>
    );
}