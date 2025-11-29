// 数据分析与报表模块
const AnalyticsModule = {
    // 渲染统计分析页面
    render() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="analytics-container">
                <!-- 时间选择器 -->
                <div class="time-selector">
                    <button class="time-btn active" data-range="today">今日</button>
                    <button class="time-btn" data-range="yesterday">昨日</button>
                    <button class="time-btn" data-range="week">本周</button>
                    <button class="time-btn" data-range="month">本月</button>
                    <button class="time-btn" data-range="custom">自定义</button>
                    <div class="custom-range" style="display:none;">
                        <input type="date" id="start-date">
                        <span>至</span>
                        <input type="date" id="end-date">
                        <button class="btn btn-primary btn-sm" onclick="AnalyticsModule.loadCustomRange()">查询</button>
                    </div>
                </div>

                <!-- 关键指标卡片 -->
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">营业收入</span>
                            <span class="metric-icon">💰</span>
                        </div>
                        <div class="metric-value" id="total-revenue">¥0</div>
                        <div class="metric-change">
                            <span class="change-value up">+12.5%</span>
                            <span class="change-label">环比增长</span>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">活跃用户</span>
                            <span class="metric-icon">👥</span>
                        </div>
                        <div class="metric-value" id="active-users">0</div>
                        <div class="metric-change">
                            <span class="change-value up">+8.3%</span>
                            <span class="change-label">环比增长</span>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">新增用户</span>
                            <span class="metric-icon">🆕</span>
                        </div>
                        <div class="metric-value" id="new-users">0</div>
                        <div class="metric-change">
                            <span class="change-value down">-3.2%</span>
                            <span class="change-label">环比下降</span>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">转化率</span>
                            <span class="metric-icon">📈</span>
                        </div>
                        <div class="metric-value" id="conversion-rate">0%</div>
                        <div class="metric-change">
                            <span class="change-value">持平</span>
                            <span class="change-label">环比</span>
                        </div>
                    </div>
                </div>

                <!-- 图表区域 -->
                <div class="charts-grid">
                    <!-- 趋势图 -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">收入趋势</h3>
                            <select class="filter-select" id="trend-type">
                                <option value="revenue">收入</option>
                                <option value="users">用户</option>
                                <option value="orders">订单</option>
                            </select>
                        </div>
                        <div class="chart-container">
                            <canvas id="trend-chart" height="300"></canvas>
                        </div>
                    </div>

                    <!-- 饼图 -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">收入构成</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="pie-chart" height="300"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 排行榜 -->
                <div class="rankings-grid">
                    <!-- 用户排行 -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">用户投资排行TOP10</h3>
                        </div>
                        <div class="ranking-list" id="user-ranking">
                            <div class="loading">加载中...</div>
                        </div>
                    </div>

                    <!-- 项目排行 -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">热门项目TOP10</h3>
                        </div>
                        <div class="ranking-list" id="project-ranking">
                            <div class="loading">加载中...</div>
                        </div>
                    </div>

                    <!-- 团队排行 -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">团队业绩TOP10</h3>
                        </div>
                        <div class="ranking-list" id="team-ranking">
                            <div class="loading">加载中...</div>
                        </div>
                    </div>
                </div>

                <!-- 详细数据表 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">详细数据</h3>
                        <button class="btn btn-primary btn-sm" onclick="AnalyticsModule.exportData()">导出Excel</button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>日期</th>
                                    <th>新增用户</th>
                                    <th>活跃用户</th>
                                    <th>充值金额</th>
                                    <th>充值笔数</th>
                                    <th>提现金额</th>
                                    <th>提现笔数</th>
                                    <th>投资金额</th>
                                    <th>投资笔数</th>
                                    <th>收益发放</th>
                                    <th>净收入</th>
                                </tr>
                            </thead>
                            <tbody id="detail-data">
                                <tr><td colspan="11" style="text-align:center">加载中...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>
                .analytics-container { padding: 0; }
                .time-selector { background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; gap: 10px; align-items: center; }
                .time-btn { padding: 8px 16px; border: 1px solid #d9d9d9; background: #fff; border-radius: 4px; cursor: pointer; }
                .time-btn.active { background: #1890ff; color: #fff; border-color: #1890ff; }
                .custom-range { display: flex; gap: 10px; align-items: center; margin-left: auto; }

                .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
                .metric-card { background: #fff; border-radius: 8px; padding: 20px; }
                .metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .metric-title { color: #8c8c8c; font-size: 14px; }
                .metric-icon { font-size: 24px; }
                .metric-value { font-size: 32px; font-weight: 600; color: #000; margin-bottom: 10px; }
                .metric-change { display: flex; gap: 10px; align-items: center; }
                .change-value { font-size: 14px; font-weight: 500; }
                .change-value.up { color: #52c41a; }
                .change-value.down { color: #f5222d; }
                .change-label { color: #8c8c8c; font-size: 12px; }

                .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }
                .chart-container { padding: 20px; height: 300px; position: relative; }

                .rankings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
                .ranking-list { padding: 10px; }
                .ranking-item { display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #f0f0f0; }
                .ranking-number { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 10px; }
                .ranking-number.top1 { background: #ffd700; color: #fff; }
                .ranking-number.top2 { background: #c0c0c0; color: #fff; }
                .ranking-number.top3 { background: #cd7f32; color: #fff; }
                .ranking-info { flex: 1; }
                .ranking-name { font-weight: 500; }
                .ranking-value { color: #1890ff; font-weight: 600; }

                @media (max-width: 768px) {
                    .charts-grid { grid-template-columns: 1fr; }
                    .rankings-grid { grid-template-columns: 1fr; }
                }
            </style>
        `;

        // 绑定事件
        this.bindEvents();
        // 加载数据
        this.loadData('today');
    },

    // 绑定事件
    bindEvents() {
        // 时间选择器
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const range = e.target.dataset.range;

                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                if (range === 'custom') {
                    document.querySelector('.custom-range').style.display = 'flex';
                } else {
                    document.querySelector('.custom-range').style.display = 'none';
                    this.loadData(range);
                }
            });
        });

        // 趋势类型切换
        document.getElementById('trend-type').addEventListener('change', (e) => {
            this.updateTrendChart(e.target.value);
        });
    },

    // 加载数据
    async loadData(range) {
        try {
            // 获取统计数据
            const stats = await AdminAPI.getAnalyticsStats(range);

            // 更新关键指标
            document.getElementById('total-revenue').textContent = `¥${this.formatNumber(stats.total_revenue)}`;
            document.getElementById('active-users').textContent = this.formatNumber(stats.active_users);
            document.getElementById('new-users').textContent = this.formatNumber(stats.new_users);
            document.getElementById('conversion-rate').textContent = `${stats.conversion_rate}%`;

            // 更新图表
            this.renderTrendChart(stats.trend_data);
            this.renderPieChart(stats.revenue_composition);

            // 更新排行榜
            this.renderUserRanking(stats.user_ranking);
            this.renderProjectRanking(stats.project_ranking);
            this.renderTeamRanking(stats.team_ranking);

            // 更新详细数据
            this.renderDetailData(stats.detail_data);

        } catch (error) {
            console.error('加载数据失败:', error);
        }
    },

    // 渲染趋势图
    renderTrendChart(data) {
        const canvas = document.getElementById('trend-chart');
        const ctx = canvas.getContext('2d');

        // 简单的折线图绘制
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 300;

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#1890ff';
        ctx.lineWidth = 2;

        if (!data || data.length === 0) {
            ctx.fillText('暂无数据', width/2 - 30, height/2);
            return;
        }

        // 绘制坐标轴
        ctx.beginPath();
        ctx.moveTo(40, 20);
        ctx.lineTo(40, height - 40);
        ctx.lineTo(width - 20, height - 40);
        ctx.strokeStyle = '#e8e8e8';
        ctx.stroke();

        // 绘制数据线
        const maxValue = Math.max(...data.map(d => d.value));
        const xStep = (width - 60) / (data.length - 1);
        const yScale = (height - 80) / maxValue;

        ctx.beginPath();
        ctx.strokeStyle = '#1890ff';
        data.forEach((point, index) => {
            const x = 40 + index * xStep;
            const y = height - 40 - (point.value * yScale);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            // 绘制数据点
            ctx.fillStyle = '#1890ff';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.stroke();
    },

    // 渲染饼图
    renderPieChart(data) {
        const canvas = document.getElementById('pie-chart');
        const ctx = canvas.getContext('2d');

        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 300;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        ctx.clearRect(0, 0, width, height);

        if (!data || data.length === 0) {
            ctx.fillText('暂无数据', centerX - 30, centerY);
            return;
        }

        const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -Math.PI / 2;

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * Math.PI * 2;

            // 绘制扇形
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            // 绘制标签
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

            ctx.fillStyle = '#000';
            ctx.font = '12px sans-serif';
            ctx.fillText(`${item.name}: ${(item.value/total*100).toFixed(1)}%`, labelX - 30, labelY);

            currentAngle += sliceAngle;
        });
    },

    // 渲染用户排行
    renderUserRanking(data) {
        const container = document.getElementById('user-ranking');

        if (!data || data.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:#8c8c8c;">暂无数据</div>';
            return;
        }

        container.innerHTML = data.map((user, index) => `
            <div class="ranking-item">
                <div class="ranking-number ${index < 3 ? 'top' + (index + 1) : ''}">${index + 1}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${user.username}</div>
                    <div class="ranking-value">¥${this.formatNumber(user.total_invest)}</div>
                </div>
            </div>
        `).join('');
    },

    // 渲染项目排行
    renderProjectRanking(data) {
        const container = document.getElementById('project-ranking');

        if (!data || data.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:#8c8c8c;">暂无数据</div>';
            return;
        }

        container.innerHTML = data.map((project, index) => `
            <div class="ranking-item">
                <div class="ranking-number ${index < 3 ? 'top' + (index + 1) : ''}">${index + 1}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${project.name}</div>
                    <div class="ranking-value">¥${this.formatNumber(project.total_amount)}</div>
                </div>
            </div>
        `).join('');
    },

    // 渲染团队排行
    renderTeamRanking(data) {
        const container = document.getElementById('team-ranking');

        if (!data || data.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:#8c8c8c;">暂无数据</div>';
            return;
        }

        container.innerHTML = data.map((team, index) => `
            <div class="ranking-item">
                <div class="ranking-number ${index < 3 ? 'top' + (index + 1) : ''}">${index + 1}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${team.leader_name}</div>
                    <div class="ranking-value">团队${team.member_count}人 ¥${this.formatNumber(team.total_performance)}</div>
                </div>
            </div>
        `).join('');
    },

    // 渲染详细数据
    renderDetailData(data) {
        const tbody = document.getElementById('detail-data');

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="11" style="text-align:center">暂无数据</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(row => `
            <tr>
                <td>${row.date}</td>
                <td>${row.new_users}</td>
                <td>${row.active_users}</td>
                <td>¥${this.formatNumber(row.recharge_amount)}</td>
                <td>${row.recharge_count}</td>
                <td>¥${this.formatNumber(row.withdraw_amount)}</td>
                <td>${row.withdraw_count}</td>
                <td>¥${this.formatNumber(row.invest_amount)}</td>
                <td>${row.invest_count}</td>
                <td>¥${this.formatNumber(row.profit_amount)}</td>
                <td>¥${this.formatNumber(row.net_income)}</td>
            </tr>
        `).join('');
    },

    // 格式化数字
    formatNumber(num) {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // 导出数据
    async exportData() {
        try {
            // 获取当前筛选条件的数据
            const data = await AdminAPI.exportAnalyticsData();

            // 创建CSV内容
            let csv = '\uFEFF'; // UTF-8 BOM
            csv += '日期,新增用户,活跃用户,充值金额,充值笔数,提现金额,提现笔数,投资金额,投资笔数,收益发放,净收入\n';

            data.forEach(row => {
                csv += `${row.date},${row.new_users},${row.active_users},${row.recharge_amount},${row.recharge_count},`;
                csv += `${row.withdraw_amount},${row.withdraw_count},${row.invest_amount},${row.invest_count},`;
                csv += `${row.profit_amount},${row.net_income}\n`;
            });

            // 下载文件
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `数据分析报表_${new Date().toISOString().slice(0,10)}.csv`;
            link.click();

        } catch (error) {
            alert('导出失败：' + error.message);
        }
    }
};

// 导出到全局
window.AnalyticsModule = AnalyticsModule;
