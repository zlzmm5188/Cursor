#!/bin/bash

echo "正在推送到 GitHub..."
cd "/Users/lulu/Library/Mobile Documents/com~apple~CloudDocs/dabao/admin-panel"

# 推送代码
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码已推送到 GitHub！"
    echo ""
    echo "仓库地址："
    echo "https://github.com/zlzmm5188/providence-admin"
    echo ""
    echo "现在在 Railway 中操作："
    echo "1. 访问：https://railway.app/project/567d07c6-d2a1-4090-af18-93e018dd65d1"
    echo "2. 点击服务 'admin'"
    echo "3. Settings → Source → Deploy from GitHub repo"
    echo "4. 选择仓库：zlzmm5188/providence-admin"
    echo "5. 自动部署！"
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "需要你在浏览器中授权："
    echo "1. 访问：https://github.com/zlzmm5188/providence-admin"
    echo "2. 如果仓库不存在，先创建它"
    echo "3. 然后重新运行此脚本"
fi
