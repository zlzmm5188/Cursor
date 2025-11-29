#!/bin/bash

echo "========================================="
echo "  Providence 后台 - Railway 部署"
echo "  项目 ID: 108ed0f8-b96d-418a-b105-108a59100fef"
echo "========================================="
echo ""

PROJECT_DIR="/Users/lulu/Library/Mobile Documents/com~apple~CloudDocs/dabao/admin-panel"
cd "$PROJECT_DIR"

echo "📍 当前目录: $(pwd)"
echo ""

# 步骤 1: Railway 登录
echo "【步骤 1】Railway 登录"
echo ""
echo "执行以下命令（会打开浏览器）："
echo ""
echo "  railway login"
echo ""
read -p "按回车键继续..."
railway login

if [ $? -ne 0 ]; then
    echo "❌ 登录失败，请重试"
    exit 1
fi

echo "✅ 登录成功！"
echo ""

# 步骤 2: 链接项目
echo "【步骤 2】链接到项目"
echo ""
railway link --project 108ed0f8-b96d-418a-b105-108a59100fef

if [ $? -ne 0 ]; then
    echo "❌ 链接失败"
    exit 1
fi

echo "✅ 项目链接成功！"
echo ""

# 步骤 3: 部署
echo "【步骤 3】开始部署（3-5分钟）"
echo ""
railway up

if [ $? -ne 0 ]; then
    echo "❌ 部署失败"
    exit 1
fi

echo ""
echo "========================================="
echo "  ✅ 部署完成！"
echo "========================================="
echo ""
echo "获取域名："
railway domain
echo ""
echo "现在去配置 Cloudflare DNS 和自定义域名吧！"
echo ""

