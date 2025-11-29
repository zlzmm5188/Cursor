#!/bin/bash

cd "/Users/lulu/Library/Mobile Documents/com~apple~CloudDocs/dabao/admin-panel"

echo "准备推送到 GitHub..."
echo ""

# 设置远程仓库
git remote remove origin 2>/dev/null
git remote add origin https://github.com/zlzmm5188/Cursor.git

echo "仓库地址: https://github.com/zlzmm5188/Cursor"
echo ""
echo "正在推送..."
echo ""

# 推送代码
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "  ✅ 代码已推送到 GitHub！"
    echo "========================================="
    echo ""
    echo "仓库地址: https://github.com/zlzmm5188/Cursor"
    echo ""
    echo "【下一步】在 Railway 部署："
    echo ""
    echo "1. 访问: https://railway.app/project/567d07c6-d2a1-4090-af18-93e018dd65d1"
    echo ""
    echo "2. 点击服务 'admin'"
    echo ""
    echo "3. Settings → Source → Deploy from GitHub repo"
    echo ""
    echo "4. 选择仓库: zlzmm5188/Cursor"
    echo ""
    echo "5. 自动部署！"
    echo ""
    echo "========================================="
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "需要 GitHub 认证。请运行："
    echo ""
    echo "  gh auth login"
    echo ""
    echo "或手动推送："
    echo "  git push -u origin main"
    echo ""
fi
