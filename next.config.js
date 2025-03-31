/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    // swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            destination: process.env.NODE_ENV !== "production" ? "http://127.0.0.1:8000/:path*" : "https://backend-bjsh98db.app.spring25a.secoder.net/:path*",
        }];
    }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
