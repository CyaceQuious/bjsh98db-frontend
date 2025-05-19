/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    // swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            destination: process.env.NODE_ENV !== "production" ? "https://dev-backend-bjsh98db.app.spring25a.secoder.net/:path*" : process.env.BACKEND_URL,
        }];
    }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
