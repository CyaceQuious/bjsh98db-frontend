/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    // swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            // TODO Start: [Student] Change to standard backend URL
            destination: process.env.NODE_ENV !== "production" ? "http://127.0.0.1:8000/:path*" : process.env.BACKEND_URL,
            // TODO End
        }];
    }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
