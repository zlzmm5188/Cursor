// Providence 后台管理系统
const AdminSystem = {
    currentPage: 'dashboard',

    // 初始化
    init() {
        this.bindEvents();
        this.loadDashboard();
        this.checkAuth();
    },

    // 绑定事件
    bindEvents() {
        // 菜单点击事件
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.switchPage(page);
            });
        });
    },

    // 检查认证
    checkAuth() {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // 获取管理员信息
        AdminAPI.getAdminInfo().then(data => {
            document.getElementById('admin-name').textContent = data.username || 'Admin';
        }).catch(err => {
            console.error('获取管理员信息失败:', err);
        });
    },

    // 切换页面
    switchPage(page) {
        // 更新菜单状态
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // 更新页面标题
        const titles = {
            dashboard: '数据概览',
            analytics: '统计分析',
            users: '用户列表',
            kyc: 'KYC认证',
            vip: 'VIP管理',
            recharge: '充值管理',
            withdraw: '提现管理',
            transactions: '交易记录',
            ribao: '日利宝管理',
            projects: '项目列表',
            investments: '投资订单',
            earnings: '收益结算',
            teams: '团队列表',
            referrals: '推荐奖励',
            config: '系统配置',
            banks: '银行卡管理',
            notices: '公告管理',
            logs: '操作日志'
        };

        document.getElementById('page-title').textContent = titles[page] || page;
        this.currentPage = page;

        // 加载页面内容
        this[`load${page.charAt(0).toUpperCase() + page.slice(1)}`]();
    },

    // 加载数据概览
    async loadDashboard() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">总用户数</div>
                    <div class="stat-value" id="total-users">-</div>
                    <div class="stat-change up">↑ 12.5% 较昨日</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">今日充值</div>
                    <div class="stat-value" id="today-recharge">-</div>
                    <div class="stat-change up">↑ 8.3% 较昨日</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">今日提现</div>
                    <div class="stat-value" id="today-withdraw">-</div>
                    <div class="stat-change down">↓ 3.2% 较昨日</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">活跃项目</div>
                    <div class="stat-value" id="active-projects">-</div>
                    <div class="stat-change">持平</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">最新用户</h3>
                    <button class="btn btn-primary btn-sm" onclick="AdminSystem.loadUsers()">查看全部</button>
                </div>
                <div class="table-container">
                    <table id="recent-users">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>用户名</th>
                                <th>手机号</th>
                                <th>余额</th>
                                <th>VIP等级</th>
                                <th>注册时间</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="7" style="text-align:center">加载中...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">待处理事项</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>类型</th>
                                <th>描述</th>
                                <th>金额</th>
                                <th>时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="pending-items">
                            <tr><td colspan="5" style="text-align:center">加载中...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 加载统计数据
        this.loadDashboardStats();
    },

    // 加载统计数据
    async loadDashboardStats() {
        try {
            const stats = await AdminAPI.getDashboardStats();
            document.getElementById('total-users').textContent = stats.total_users || 0;
            document.getElementById('today-recharge').textContent = `¥${stats.today_recharge || 0}`;
            document.getElementById('today-withdraw').textContent = `¥${stats.today_withdraw || 0}`;
            document.getElementById('active-projects').textContent = stats.active_projects || 0;

            // 加载最新用户
            const users = await AdminAPI.getRecentUsers();
            const tbody = document.querySelector('#recent-users tbody');
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.phone || '-'}</td>
                    <td>¥${user.balance_cny || 0}</td>
                    <td><span class="status-badge status-active">VIP${user.vip_level || 0}</span></td>
                    <td>${user.created_at}</td>
                    <td><span class="status-badge status-active">正常</span></td>
                </tr>
            `).join('');

            // 加载待处理事项
            const pending = await AdminAPI.getPendingItems();
            const pendingTbody = document.getElementById('pending-items');
            pendingTbody.innerHTML = pending.map(item => `
                <tr>
                    <td><span class="status-badge status-pending">${item.type}</span></td>
                    <td>${item.description}</td>
                    <td>¥${item.amount || 0}</td>
                    <td>${item.created_at}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="AdminSystem.approve('${item.id}')">通过</button>
                        <button class="btn btn-danger btn-sm" onclick="AdminSystem.reject('${item.id}')">拒绝</button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" style="text-align:center">暂无待处理事项</td></tr>';

        } catch (error) {
            console.error('加载统计数据失败:', error);
        }
    },

    // 加载用户列表
    async loadUsers() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">用户管理</h3>
                    <button class="btn btn-primary" onclick="AdminSystem.showAddUserModal()">添加用户</button>
                </div>

                <div class="search-bar">
                    <input type="text" class="search-input" placeholder="搜索用户名、手机号..." id="user-search">
                    <select class="filter-select" id="user-status-filter">
                        <option value="">全部状态</option>
                        <option value="1">正常</option>
                        <option value="0">冻结</option>
                    </select>
                    <select class="filter-select" id="user-vip-filter">
                        <option value="">全部VIP</option>
                        <option value="0">VIP0</option>
                        <option value="1">VIP1</option>
                        <option value="2">VIP2</option>
                        <option value="3">VIP3</option>
                        <option value="4">VIP4</option>
                        <option value="5">VIP5</option>
                        <option value="6">VIP6</option>
                        <option value="7">VIP7</option>
                        <option value="8">VIP8</option>
                    </select>
                    <button class="btn btn-primary" onclick="AdminSystem.searchUsers()">搜索</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>用户名</th>
                                <th>手机号</th>
                                <th>邮箱</th>
                                <th>CNY余额</th>
                                <th>USDT余额</th>
                                <th>VIP等级</th>
                                <th>邀请人</th>
                                <th>团队人数</th>
                                <th>累计充值</th>
                                <th>累计提现</th>
                                <th>注册时间</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody">
                            <tr><td colspan="14" style="text-align:center">加载中...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination" id="users-pagination"></div>
            </div>
        `;

        this.loadUsersData();
    },

    // 加载用户数据
    async loadUsersData(page = 1) {
        try {
            const result = await AdminAPI.getUsers(page);
            const tbody = document.getElementById('users-tbody');

            tbody.innerHTML = result.list.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.phone || '-'}</td>
                    <td>${user.email || '-'}</td>
                    <td>¥${user.balance_cny || 0}</td>
                    <td>$${user.balance_usdt || 0}</td>
                    <td><span class="status-badge status-active">VIP${user.vip_level || 0}</span></td>
                    <td>${user.inviter || '-'}</td>
                    <td>${user.team_count || 0}</td>
                    <td>¥${user.total_recharge || 0}</td>
                    <td>¥${user.total_withdraw || 0}</td>
                    <td>${user.created_at}</td>
                    <td>
                        ${user.status == 1 ?
                    '<span class="status-badge status-active">正常</span>' :
                    '<span class="status-badge status-inactive">冻结</span>'}
                    </td>
                    <td>
                        <button class="btn btn-default btn-sm" onclick="AdminSystem.viewUser(${user.id})">查看</button>
                        <button class="btn btn-primary btn-sm" onclick="AdminSystem.editUser(${user.id})">编辑</button>
                        ${user.status == 1 ?
                    `<button class="btn btn-danger btn-sm" onclick="AdminSystem.freezeUser(${user.id})">冻结</button>` :
                    `<button class="btn btn-success btn-sm" onclick="AdminSystem.unfreezeUser(${user.id})">解冻</button>`
                }
                    </td>
                </tr>
            `).join('');

            // 生成分页
            this.generatePagination('users-pagination', result.total, page, (p) => this.loadUsersData(p));

        } catch (error) {
            console.error('加载用户数据失败:', error);
        }
    },

    // 加载充值管理
    async loadRecharge() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">充值订单管理</h3>
                </div>

                <div class="search-bar">
                    <input type="text" class="search-input" placeholder="订单号、用户名..." id="recharge-search">
                    <select class="filter-select" id="recharge-status-filter">
                        <option value="">全部状态</option>
                        <option value="0">待支付</option>
                        <option value="1">已完成</option>
                        <option value="2">已取消</option>
                    </select>
                    <select class="filter-select" id="recharge-type-filter">
                        <option value="">全部类型</option>
                        <option value="bank">银行卡</option>
                        <option value="usdt">USDT</option>
                    </select>
                    <input type="date" class="search-input" id="recharge-date" style="width:150px">
                    <button class="btn btn-primary" onclick="AdminSystem.searchRecharge()">搜索</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>订单号</th>
                                <th>用户</th>
                                <th>充值金额</th>
                                <th>充值方式</th>
                                <th>支付凭证</th>
                                <th>申请时间</th>
                                <th>处理时间</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="recharge-tbody">
                            <tr><td colspan="9" style="text-align:center">加载中...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination" id="recharge-pagination"></div>
            </div>
        `;

        this.loadRechargeData();
    },

    // 加载充值数据
    async loadRechargeData(page = 1) {
        try {
            const result = await AdminAPI.getRechargeOrders(page);
            const tbody = document.getElementById('recharge-tbody');

            tbody.innerHTML = result.list.map(order => `
                <tr>
                    <td>${order.order_no}</td>
                    <td>${order.username}</td>
                    <td>¥${order.amount}</td>
                    <td>${order.pay_type == 'bank' ? '银行卡' : 'USDT'}</td>
                    <td>
                        ${order.voucher ?
                    `<a href="${order.voucher}" target="_blank">查看凭证</a>` :
                    '-'}
                    </td>
                    <td>${order.created_at}</td>
                    <td>${order.updated_at || '-'}</td>
                    <td>
                        ${order.status == 0 ? '<span class="status-badge status-pending">待审核</span>' : ''}
                        ${order.status == 1 ? '<span class="status-badge status-active">已完成</span>' : ''}
                        ${order.status == 2 ? '<span class="status-badge status-inactive">已拒绝</span>' : ''}
                    </td>
                    <td>
                        ${order.status == 0 ? `
                            <button class="btn btn-success btn-sm" onclick="AdminSystem.approveRecharge('${order.id}')">通过</button>
                            <button class="btn btn-danger btn-sm" onclick="AdminSystem.rejectRecharge('${order.id}')">拒绝</button>
                        ` : '-'}
                    </td>
                </tr>
            `).join('');

            this.generatePagination('recharge-pagination', result.total, page, (p) => this.loadRechargeData(p));

        } catch (error) {
            console.error('加载充值数据失败:', error);
        }
    },

    // 加载提现管理
    async loadWithdraw() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">提现订单管理</h3>
                </div>

                <div class="search-bar">
                    <input type="text" class="search-input" placeholder="订单号、用户名..." id="withdraw-search">
                    <select class="filter-select" id="withdraw-status-filter">
                        <option value="">全部状态</option>
                        <option value="0">待处理</option>
                        <option value="1">已完成</option>
                        <option value="2">已拒绝</option>
                    </select>
                    <button class="btn btn-primary" onclick="AdminSystem.searchWithdraw()">搜索</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>订单号</th>
                                <th>用户</th>
                                <th>提现金额</th>
                                <th>手续费</th>
                                <th>实际到账</th>
                                <th>提现方式</th>
                                <th>收款账号</th>
                                <th>申请时间</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="withdraw-tbody">
                            <tr><td colspan="10" style="text-align:center">加载中...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination" id="withdraw-pagination"></div>
            </div>
        `;

        this.loadWithdrawData();
    },

    // 加载提现数据
    async loadWithdrawData(page = 1) {
        try {
            const result = await AdminAPI.getWithdrawOrders(page);
            const tbody = document.getElementById('withdraw-tbody');

            tbody.innerHTML = result.list.map(order => `
                <tr>
                    <td>${order.order_no}</td>
                    <td>${order.username}</td>
                    <td>¥${order.amount}</td>
                    <td>¥${order.fee || 0}</td>
                    <td>¥${order.real_amount || order.amount}</td>
                    <td>${order.type == 'bank' ? '银行卡' : 'USDT'}</td>
                    <td>${order.account || '-'}</td>
                    <td>${order.created_at}</td>
                    <td>
                        ${order.status == 0 ? '<span class="status-badge status-pending">待处理</span>' : ''}
                        ${order.status == 1 ? '<span class="status-badge status-active">已完成</span>' : ''}
                        ${order.status == 2 ? '<span class="status-badge status-inactive">已拒绝</span>' : ''}
                    </td>
                    <td>
                        ${order.status == 0 ? `
                            <button class="btn btn-success btn-sm" onclick="AdminSystem.approveWithdraw('${order.id}')">通过</button>
                            <button class="btn btn-danger btn-sm" onclick="AdminSystem.rejectWithdraw('${order.id}')">拒绝</button>
                        ` : '-'}
                    </td>
                </tr>
            `).join('');

            this.generatePagination('withdraw-pagination', result.total, page, (p) => this.loadWithdrawData(p));

        } catch (error) {
            console.error('加载提现数据失败:', error);
        }
    },

    // 加载项目管理
    async loadProjects() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">项目管理</h3>
                    <button class="btn btn-primary" onclick="ProjectPublishSystem.openPublishModal()">添加项目</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>项目名称</th>
                                <th>类型</th>
                                <th>周期</th>
                                <th>日利率</th>
                                <th>总利率</th>
                                <th>起投金额</th>
                                <th>总额度</th>
                                <th>已售</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="projects-tbody">
                            <tr><td colspan="11" style="text-align:center">加载中...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.loadProjectsData();
    },

    // 加载项目数据
    async loadProjectsData() {
        try {
            const result = await AdminAPI.getProjects();
            const tbody = document.getElementById('projects-tbody');

            tbody.innerHTML = result.map(project => {
                // 计算日利率和总利率
                const annualRate = parseFloat(project.annual_rate || 0);
                const duration = parseInt(project.duration || 0);
                const dailyRate = (annualRate / 365).toFixed(2);
                const totalRate = (annualRate * duration / 365).toFixed(2);
                
                // 计算已售百分比
                const totalAmount = parseFloat(project.total_amount || 0);
                const soldAmount = parseFloat(project.sold_amount || 0);
                const soldPercent = totalAmount > 0 ? (soldAmount / totalAmount * 100).toFixed(1) : 0;
                
                return `
                <tr>
                    <td>${project.id}</td>
                    <td>${project.name}</td>
                    <td>${project.currency || 'CNY'}</td>
                    <td>${duration}天</td>
                    <td>${dailyRate}%</td>
                    <td>${totalRate}%</td>
                    <td>¥${parseFloat(project.min_investment || 0).toFixed(2)}</td>
                    <td>¥${totalAmount.toFixed(2)}</td>
                    <td>${soldPercent}%</td>
                    <td>
                        ${project.status == 1 ?
                    '<span class="status-badge status-active">进行中</span>' :
                    '<span class="status-badge status-inactive">已结束</span>'}
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="AdminSystem.editProject(${project.id})">编辑</button>
                        <button class="btn btn-danger btn-sm" onclick="AdminSystem.deleteProject(${project.id})">删除</button>
                    </td>
                </tr>
            `}).join('');

        } catch (error) {
            console.error('加载项目数据失败:', error);
        }
    },

    // 生成分页
    generatePagination(containerId, total, currentPage, callback) {
        const container = document.getElementById(containerId);
        const pageSize = 20;
        const totalPages = Math.ceil(total / pageSize);

        let html = '';

        // 上一页
        if (currentPage > 1) {
            html += `<button class="page-btn" onclick="(${callback})(${currentPage - 1})">上一页</button>`;
        }

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (i == currentPage) {
                html += `<button class="page-btn active">${i}</button>`;
            } else if (i == 1 || i == totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="page-btn" onclick="(${callback})(${i})">${i}</button>`;
            } else if (i == currentPage - 3 || i == currentPage + 3) {
                html += `<span>...</span>`;
            }
        }

        // 下一页
        if (currentPage < totalPages) {
            html += `<button class="page-btn" onclick="(${callback})(${currentPage + 1})">下一页</button>`;
        }

        container.innerHTML = html;
    },

    // 编辑项目
    async editProject(id) {
        try {
            const projects = await AdminAPI.getProjects();
            const project = projects.find(p => p.id == id);
            
            if (!project) {
                alert('项目不存在');
                return;
            }
            
            const newName = prompt('项目名称:', project.name);
            if (newName === null) return;
            
            const newRate = prompt('年利率 (%):', project.annual_rate);
            if (newRate === null) return;
            
            const newDuration = prompt('周期 (天):', project.duration);
            if (newDuration === null) return;
            
            const newMinInvestment = prompt('最小投资金额:', project.min_investment);
            if (newMinInvestment === null) return;
            
            await AdminAPI.updateProject(id, {
                name: newName,
                annual_rate: parseFloat(newRate),
                duration: parseInt(newDuration),
                min_investment: parseFloat(newMinInvestment)
            });
            
            alert('✅ 项目已更新');
            this.loadProjectsData();
        } catch (error) {
            alert('❌ 编辑失败：' + error.message);
        }
    },
    
    // 删除项目
    async deleteProject(id) {
        if (!confirm('⚠️ 确认删除此项目？此操作不可逆！')) return;
        
        try {
            await AdminAPI.deleteProject(id);
            alert('✅ 项目已删除');
            this.loadProjectsData();
        } catch (error) {
            alert('❌ 删除失败：' + error.message);
        }
    },

    // 审核操作
    async approveRecharge(id) {
        if (!confirm('确认通过此充值申请？')) return;

        try {
            await AdminAPI.approveRecharge(id);
            alert('操作成功');
            this.loadRechargeData();
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    },

    async rejectRecharge(id) {
        const reason = prompt('请输入拒绝原因：');
        if (!reason) return;

        try {
            await AdminAPI.rejectRecharge(id, reason);
            alert('操作成功');
            this.loadRechargeData();
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    },

    async approveWithdraw(id) {
        if (!confirm('确认通过此提现申请？')) return;

        try {
            await AdminAPI.approveWithdraw(id);
            alert('操作成功');
            this.loadWithdrawData();
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    },

    async rejectWithdraw(id) {
        const reason = prompt('请输入拒绝原因：');
        if (!reason) return;

        try {
            await AdminAPI.rejectWithdraw(id, reason);
            alert('操作成功');
            this.loadWithdrawData();
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    },

    // 加载统计分析
    loadAnalytics() {
        if (typeof AnalyticsModule !== 'undefined') {
            AnalyticsModule.render();
        } else {
            const script = document.createElement('script');
            script.src = 'analytics.js';
            script.onload = () => AnalyticsModule.render();
            document.head.appendChild(script);
        }
    },

    // 加载KYC管理
    loadKyc() {
        if (typeof KycManager !== 'undefined') {
            KycManager.render();
        } else {
            const script = document.createElement('script');
            script.src = 'kyc-manager.js';
            script.onload = () => KycManager.render();
            document.head.appendChild(script);
        }
    },
    loadVip() { this.showComingSoon('VIP管理'); },
    loadTransactions() { this.showComingSoon('交易记录'); },
    loadRibao() { this.showComingSoon('日利宝管理'); },
    loadInvestments() { this.showComingSoon('投资订单'); },
    loadEarnings() { this.showComingSoon('收益结算'); },
    loadTeams() { this.showComingSoon('团队列表'); },
    loadReferrals() { this.showComingSoon('推荐奖励'); },
    loadConfig() {
        // 加载配置管理页面
        if (typeof ConfigManager !== 'undefined') {
            ConfigManager.render();
        } else {
            // 动态加载配置管理脚本
            const script = document.createElement('script');
            script.src = 'config-page.js';
            script.onload = () => ConfigManager.render();
            document.head.appendChild(script);
        }
    },
    loadBanks() { this.showComingSoon('银行卡管理'); },
    loadNotices() { this.showComingSoon('公告管理'); },
    loadLogs() { this.showComingSoon('操作日志'); },

    showComingSoon(title) {
        document.getElementById('content').innerHTML = `
            <div class="card">
                <div style="text-align:center; padding:100px 0;">
                    <h2>${title}</h2>
                    <p style="color:#8c8c8c; margin-top:20px;">功能开发中，敬请期待...</p>
                </div>
            </div>
        `;
    }
};

// 退出登录
function logout() {
    if (confirm('确认退出登录？')) {
        localStorage.removeItem('admin_token');
        window.location.href = 'login.html';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    AdminSystem.init();
});
