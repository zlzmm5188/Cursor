// Providence后台管理系统 - API工具
(function () {
    'use strict';

    // API基础地址
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8082/api'
        : 'https://api.4kp3l0iq.top/api';

    // Token管理
    const TOKEN_KEY = 'admin_token';

    window.AdminAPI = {
        // Token管理
        getToken() {
            return localStorage.getItem(TOKEN_KEY) || '';
        },

        setToken(token) {
            localStorage.setItem(TOKEN_KEY, token);
        },

        clearToken() {
            localStorage.removeItem(TOKEN_KEY);
        },

        isLoggedIn() {
            return !!this.getToken();
        },

        // 统一请求方法
        async request(url, options = {}) {
            const token = this.getToken();
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            if (token) {
                headers['Authorization'] = token;
            }

            try {
                const response = await fetch(`${API_BASE}${url}`, {
                    ...options,
                    headers
                });

                // 处理非JSON响应
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return await response.text();
                }

                const data = await response.json();

                // Providence API: code=1成功，code=-1失败
                if (data.code === -1) {
                    // Token过期处理
                    if (data.msg && (data.msg.includes('未登录') || data.msg.includes('token'))) {
                        this.clearToken();
                        window.location.href = 'login.html';
                        return;
                    }
                    throw new Error(data.msg || '请求失败');
                }

                return data.data || data;
            } catch (error) {
                console.error('API请求失败:', error);
                throw error;
            }
        },

        // GET请求
        async get(url, params = {}) {
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = queryString ? `${url}?${queryString}` : url;
            return await this.request(fullUrl);
        },

        // POST请求
        async post(url, data = {}) {
            return await this.request(url, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        // PUT请求
        async put(url, data = {}) {
            return await this.request(url, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        // DELETE请求
        async delete(url) {
            return await this.request(url, {
                method: 'DELETE'
            });
        },

        // ==================== API接口 ====================

        // 管理员登录
        async login(username, password) {
            // 直接调用auth/login接口
            const result = await this.post('/auth/login', { username, password });

            if (result.accessToken || result.token) {
                const token = result.accessToken || result.token;
                this.setToken(token);
                return result;
            }
            throw new Error('登录失败');
        },

        // 获取管理员信息
        async getAdminInfo() {
            return await this.get('/admin/info');
        },

        // 仪表盘统计
        async getDashboardStats() {
            return await this.get('/providence/dashboard/stats');
        },

        // 获取最新用户
        async getRecentUsers(limit = 10) {
            const result = await this.get('/user/list', { page: 1, limit });
            return result.list || [];
        },

        // 获取待处理事项
        async getPendingItems() {
            // 获取待审核的充值和提现
            const recharges = await this.get('/recharge/list', { status: 0, limit: 5 });
            const withdraws = await this.get('/withdraw/list', { status: 0, limit: 5 });

            const items = [];

            // 处理充值
            if (recharges.list) {
                recharges.list.forEach(item => {
                    items.push({
                        id: item.id,
                        type: '充值',
                        description: `用户 ${item.username} 申请充值`,
                        amount: item.amount,
                        created_at: item.created_at
                    });
                });
            }

            // 处理提现
            if (withdraws.list) {
                withdraws.list.forEach(item => {
                    items.push({
                        id: item.id,
                        type: '提现',
                        description: `用户 ${item.username} 申请提现`,
                        amount: item.amount,
                        created_at: item.created_at
                    });
                });
            }

            return items;
        },

        // 用户管理
        async getUsers(page = 1, limit = 20) {
            return await this.get('/providence/users', { page, limit });
        },

        async getUserDetail(id) {
            return await this.get('/user/detail', { id });
        },

        async updateUser(id, data) {
            return await this.post('/user/update', { id, ...data });
        },

        async freezeUser(id) {
            return await this.post('/providence/users/freeze', { id });
        },

        async unfreezeUser(id) {
            return await this.post('/providence/users/unfreeze', { id });
        },

        // 充值管理
        async getRechargeOrders(page = 1, limit = 20) {
            return await this.get('/providence/recharge', { page, limit });
        },

        async approveRecharge(id) {
            return await this.post('/providence/recharge/approve', { id });
        },

        async rejectRecharge(id, reason) {
            return await this.post('/providence/recharge/reject', { id, reason });
        },

        // 提现管理
        async getWithdrawOrders(page = 1, limit = 20) {
            return await this.get('/providence/withdraw', { page, limit });
        },

        async approveWithdraw(id) {
            return await this.post('/providence/withdraw/approve', { id });
        },

        async rejectWithdraw(id, reason) {
            return await this.post('/providence/withdraw/reject', { id, reason });
        },

        // 项目管理
        async getProjects() {
            const result = await this.get('/providence/projects');
            return result || [];
        },

        async createProject(data) {
            return await this.post('/providence/projects/create', data);
        },

        async updateProject(id, data) {
            return await this.post('/providence/projects/update', { id, ...data });
        },

        async deleteProject(id) {
            return await this.post('/providence/projects/delete', { id });
        },

        // 投资订单
        async getInvestments(page = 1, limit = 20) {
            return await this.get('/invest/list', { page, limit });
        },

        // 日利宝管理
        async getRibaoData() {
            return await this.get('/ribao/stats');
        },

        async getRibaoRecords(page = 1, limit = 20) {
            return await this.get('/ribao/records', { page, limit });
        },

        // 团队管理
        async getTeams(page = 1, limit = 20) {
            return await this.get('/team/list', { page, limit });
        },

        // 系统配置
        async getSystemConfig() {
            return await this.get('/providence/config');
        },

        async updateSystemConfig(data) {
            return await this.post('/providence/config/update', data);
        },

        // KYC管理
        async getKycList(page = 1, limit = 20) {
            return await this.get('/kyc/list', { page, limit });
        },

        async approveKyc(id) {
            return await this.post('/kyc/approve', { id });
        },

        async rejectKyc(id, reason) {
            return await this.post('/kyc/reject', { id, reason });
        },

        // VIP管理
        async getVipList() {
            return await this.get('/vip/list');
        },

        async updateVipConfig(data) {
            return await this.post('/vip/config/update', data);
        },

        // 银行卡管理
        async getBankCards() {
            return await this.get('/bank/list');
        },

        async addBankCard(data) {
            return await this.post('/bank/add', data);
        },

        async updateBankCard(id, data) {
            return await this.post('/bank/update', { id, ...data });
        },

        async deleteBankCard(id) {
            return await this.post('/bank/delete', { id });
        },

        // 公告管理
        async getNotices(page = 1, limit = 20) {
            return await this.get('/notice/list', { page, limit });
        },

        async createNotice(data) {
            return await this.post('/notice/create', data);
        },

        async updateNotice(id, data) {
            return await this.post('/notice/update', { id, ...data });
        },

        async deleteNotice(id) {
            return await this.post('/notice/delete', { id });
        },

        // 统计分析
        async getAnalyticsStats(range = 'today') {
            return await this.get('/providence/analytics/stats', { range });
        },

        async exportAnalyticsData() {
            return await this.get('/providence/analytics/export');
        },

        // KYC管理
        async getKycStats() {
            return await this.get('/providence/kyc/stats');
        },

        async getKycList(page = 1, limit = 20) {
            return await this.get('/providence/kyc/list', { page, limit });
        },

        async getKycDetail(id) {
            return await this.get('/providence/kyc/detail', { id });
        },

        async approveKyc(id) {
            return await this.post('/providence/kyc/approve', { id });
        },

        async rejectKyc(id, reason) {
            return await this.post('/providence/kyc/reject', { id, reason });
        },

        // 操作日志
        async getLogs(page = 1, limit = 50) {
            return await this.get('/providence/logs', { page, limit });
        }
    };

    // 导出到全局
    window.API_BASE = API_BASE;
})();
