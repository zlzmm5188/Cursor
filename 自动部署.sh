#!/bin/bash

# Providence 后台 - Railway 自动部署
# 这个脚本会引导你完成整个部署过程

clear
echo "========================================="
echo "  🚀 Providence 后台 - Railway 部署"
echo "========================================="
echo ""

PROJECT_DIR="/Users/lulu/Library/Mobile Documents/com~apple~CloudDocs/dabao/admin-panel"
cd "$PROJECT_DIR"

echo "📍 当前目录: $PROJECT_DIR"
echo ""
echo "准备开始部署..."
echo ""

# 步骤 1: 登录
echo "========================================="
echo "  步骤 1: 登录 Railway"
echo "========================================="
echo ""
echo "即将打开浏览器，请用 GitHub 账号登录 Railway"
echo ""
read -p "按回车键继续..."

railway login

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 登录失败，请重试"
    exit 1
fi

echo ""
echo "✅ 登录成功！"
echo ""
sleep 2

# 步骤 2: 初始化项目
echo "========================================="
echo "  步骤 2: 创建 Railway 项目"
echo "========================================="
echo ""
echo "选择: Create new project"
echo "项目名: providence-admin"
echo ""
read -p "按回车键继续..."

railway init

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 初始化失败"
    exit 1
fi

echo ""
echo "✅ 项目创建成功！"
echo ""
sleep 2

# 步骤 3: 部署
echo "========================================="
echo "  步骤 3: 部署到 Railway"
echo "========================================="
echo ""
echo "正在部署，这需要 3-5 分钟..."
echo ""

railway up

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 部署失败"
    exit 1
fi

echo ""
echo "✅ 部署成功！"
echo ""
sleep 2

# 步骤 4: 获取域名
echo "========================================="
echo "  步骤 4: 获取访问域名"
echo "========================================="
echo ""

DOMAIN=$(railway domain 2>/dev/null)

echo "Railway 域名: $DOMAIN"
echo ""

# 最终说明
echo "========================================="
echo "  🎉 部署完成！"
echo "========================================="
echo ""
echo "📋 接下来的操作："
echo ""
echo "1️⃣  配置 Cloudflare DNS"
echo "   - 登录 Cloudflare"
echo "   - 域名: 4kp3l0iq.top"
echo "   - 添加 CNAME 记录:"
echo "     类型: CNAME"
echo "     名称: admin"
echo "     目标: $DOMAIN"
echo "     代理: 已代理（橙色云朵）"
echo ""
echo "2️⃣  在 Railway 绑定自定义域名"
echo "   - 访问 Railway 项目设置"
echo "   - Settings → Networking → Custom Domain"
echo "   - 输入: admin.4kp3l0iq.top"
echo ""
echo "3️⃣  等待 2-5 分钟后访问"
echo "   https://admin.4kp3l0iq.top"
echo ""
echo "========================================="
echo ""
echo "✅ 所有步骤完成！"
echo ""
