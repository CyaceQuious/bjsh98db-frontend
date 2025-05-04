import os

dockerfile_path = "Dockerfile"
branch = os.getenv("CI_COMMIT_REF_SLUG", "dev")

# 定义每个分支对应的后端地址
backend_url_map = {
    "main": "https://backend-bjsh98db.app.spring25a.secoder.net/:path*",
    "dev": "https://dev-backend-bjsh98db.app.spring25a.secoder.net/:path*",
}

# 获取替换用的URL，如果未知分支默认使用dev的地址
new_url = backend_url_map.get(branch, backend_url_map["dev"])

# 替换Dockerfile中的BACKEND_URL
with open(dockerfile_path, "r") as f:
    lines = f.readlines()

with open(dockerfile_path, "w") as f:
    for line in lines:
        if line.startswith("ENV BACKEND_URL"):
            f.write(f'ENV BACKEND_URL {new_url}\n')
        else:
            f.write(line)
