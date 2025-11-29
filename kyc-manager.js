// KYC认证管理模块
const KycManager = {
    // 渲染KYC管理页面
    render() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="kyc-container">
                <!-- 统计卡片 -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">待审核</div>
                        <div class="stat-value" id="kyc-pending">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">已通过</div>
                        <div class="stat-value" id="kyc-approved">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">已拒绝</div>
                        <div class="stat-value" id="kyc-rejected">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">通过率</div>
                        <div class="stat-value" id="kyc-rate">0%</div>
                    </div>
                </div>

                <!-- 筛选栏 -->
                <div class="card">
                    <div class="search-bar">
                        <input type="text" class="search-input" placeholder="搜索用户名、姓名、身份证..." id="kyc-search">
                        <select class="filter-select" id="kyc-status-filter">
                            <option value="">全部状态</option>
                            <option value="0">待审核</option>
                            <option value="1">已通过</option>
                            <option value="2">已拒绝</option>
                        </select>
                        <input type="date" class="search-input" id="kyc-date" style="width:150px">
                        <button class="btn btn-primary" onclick="KycManager.search()">搜索</button>
                    </div>
                </div>

                <!-- KYC列表 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">KYC认证列表</h3>
                        <button class="btn btn-success btn-sm" onclick="KycManager.batchApprove()">批量通过</button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="kyc-select-all"></th>
                                    <th>ID</th>
                                    <th>用户名</th>
                                    <th>真实姓名</th>
                                    <th>身份证号</th>
                                    <th>身份证正面</th>
                                    <th>身份证背面</th>
                                    <th>人脸照片</th>
                                    <th>提交时间</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="kyc-tbody">
                                <tr><td colspan="11" style="text-align:center">加载中...</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination" id="kyc-pagination"></div>
                </div>
            </div>

            <!-- 图片预览模态框 -->
            <div id="image-modal" class="modal" style="display:none;">
                <div class="modal-content">
                    <span class="close" onclick="KycManager.closeModal()">&times;</span>
                    <img id="modal-image" src="" alt="预览图片">
                    <div class="modal-footer">
                        <button class="btn btn-default" onclick="KycManager.rotateImage(-90)">↺ 左旋</button>
                        <button class="btn btn-default" onclick="KycManager.rotateImage(90)">↻ 右旋</button>
                        <button class="btn btn-primary" onclick="KycManager.zoomIn()">放大</button>
                        <button class="btn btn-primary" onclick="KycManager.zoomOut()">缩小</button>
                    </div>
                </div>
            </div>

            <style>
                .kyc-container { }
                .modal { position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); }
                .modal-content { position: relative; margin: 50px auto; padding: 20px; width: 80%; max-width: 900px; background: #fff; border-radius: 8px; }
                .close { position: absolute; right: 20px; top: 10px; font-size: 30px; cursor: pointer; color: #999; }
                .close:hover { color: #000; }
                #modal-image { width: 100%; max-height: 600px; object-fit: contain; }
                .modal-footer { margin-top: 20px; text-align: center; }
                .image-thumb { width: 60px; height: 60px; object-fit: cover; cursor: pointer; border: 1px solid #d9d9d9; border-radius: 4px; }
                .image-thumb:hover { border-color: #1890ff; }
                .id-card-info { font-size: 12px; color: #666; margin-top: 5px; }
                .batch-select { margin-right: 10px; }
            </style>
        `;

        // 加载数据
        this.loadData();
        this.bindEvents();
    },

    // 绑定事件
    bindEvents() {
        // 全选
        document.getElementById('kyc-select-all').addEventListener('change', (e) => {
            document.querySelectorAll('.kyc-checkbox').forEach(cb => {
                cb.checked = e.target.checked;
            });
        });
    },

    // 加载数据
    async loadData(page = 1) {
        try {
            // 获取统计数据
            const stats = await AdminAPI.getKycStats();
            document.getElementById('kyc-pending').textContent = stats.pending || 0;
            document.getElementById('kyc-approved').textContent = stats.approved || 0;
            document.getElementById('kyc-rejected').textContent = stats.rejected || 0;
            document.getElementById('kyc-rate').textContent = stats.rate || '0%';

            // 获取列表数据
            const result = await AdminAPI.getKycList(page);
            const tbody = document.getElementById('kyc-tbody');

            if (!result.list || result.list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="11" style="text-align:center">暂无数据</td></tr>';
                return;
            }

            tbody.innerHTML = result.list.map(kyc => `
                <tr>
                    <td><input type="checkbox" class="kyc-checkbox" value="${kyc.id}"></td>
                    <td>${kyc.id}</td>
                    <td>${kyc.username}</td>
                    <td>${kyc.real_name}</td>
                    <td>
                        ${kyc.id_card.substr(0, 6)}****${kyc.id_card.substr(-4)}
                        <div class="id-card-info">
                            ${this.parseIdCard(kyc.id_card)}
                        </div>
                    </td>
                    <td>
                        ${kyc.id_card_front ?
                            `<img src="${kyc.id_card_front}" class="image-thumb" onclick="KycManager.previewImage('${kyc.id_card_front}')">` :
                            '-'}
                    </td>
                    <td>
                        ${kyc.id_card_back ?
                            `<img src="${kyc.id_card_back}" class="image-thumb" onclick="KycManager.previewImage('${kyc.id_card_back}')">` :
                            '-'}
                    </td>
                    <td>
                        ${kyc.face_photo ?
                            `<img src="${kyc.face_photo}" class="image-thumb" onclick="KycManager.previewImage('${kyc.face_photo}')">` :
                            '-'}
                    </td>
                    <td>${kyc.created_at}</td>
                    <td>
                        ${kyc.status == 0 ? '<span class="status-badge status-pending">待审核</span>' : ''}
                        ${kyc.status == 1 ? '<span class="status-badge status-active">已通过</span>' : ''}
                        ${kyc.status == 2 ? '<span class="status-badge status-inactive">已拒绝</span>' : ''}
                    </td>
                    <td>
                        ${kyc.status == 0 ? `
                            <button class="btn btn-success btn-sm" onclick="KycManager.approve(${kyc.id})">通过</button>
                            <button class="btn btn-danger btn-sm" onclick="KycManager.reject(${kyc.id})">拒绝</button>
                            <button class="btn btn-primary btn-sm" onclick="KycManager.viewDetail(${kyc.id})">详情</button>
                        ` : `
                            <button class="btn btn-default btn-sm" onclick="KycManager.viewDetail(${kyc.id})">查看</button>
                        `}
                    </td>
                </tr>
            `).join('');

            // 生成分页
            this.generatePagination(result.total, page);

        } catch (error) {
            console.error('加载KYC数据失败:', error);
        }
    },

    // 解析身份证信息
    parseIdCard(idCard) {
        if (!idCard || idCard.length !== 18) return '';

        // 提取出生日期
        const year = idCard.substr(6, 4);
        const month = idCard.substr(10, 2);
        const day = idCard.substr(12, 2);

        // 计算年龄
        const birthDate = new Date(`${year}-${month}-${day}`);
        const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

        // 性别（第17位，奇数男，偶数女）
        const gender = parseInt(idCard.substr(16, 1)) % 2 === 1 ? '男' : '女';

        return `${year}-${month}-${day} | ${age}岁 | ${gender}`;
    },

    // 审核通过
    async approve(id) {
        if (!confirm('确认通过此KYC认证？')) return;

        try {
            await AdminAPI.approveKyc(id);
            alert('审核通过');
            this.loadData();
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    },

    // 审核拒绝
    async reject(id) {
        const reason = prompt('请输入拒绝原因：');
        if (!reason) return;

        try {
            await AdminAPI.rejectKyc(id, reason);
            alert('已拒绝');
            this.loadData();
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    },

    // 批量通过
    async batchApprove() {
        const checkboxes = document.querySelectorAll('.kyc-checkbox:checked');
        if (checkboxes.length === 0) {
            alert('请先选择要审核的记录');
            return;
        }

        if (!confirm(`确认批量通过 ${checkboxes.length} 条记录？`)) return;

        const ids = Array.from(checkboxes).map(cb => cb.value);

        try {
            for (const id of ids) {
                await AdminAPI.approveKyc(id);
            }
            alert('批量审核完成');
            this.loadData();
        } catch (error) {
            alert('操作失败：' + error.message);
        }
    },

    // 查看详情
    async viewDetail(id) {
        try {
            const detail = await AdminAPI.getKycDetail(id);

            // 显示详情弹窗
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 600px;">
                    <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                    <h3>KYC认证详情</h3>
                    <div style="padding: 20px;">
                        <div style="margin-bottom: 15px;">
                            <label style="width: 100px; display: inline-block;">用户名：</label>
                            <span>${detail.username}</span>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="width: 100px; display: inline-block;">真实姓名：</label>
                            <span>${detail.real_name}</span>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="width: 100px; display: inline-block;">身份证号：</label>
                            <span>${detail.id_card}</span>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="width: 100px; display: inline-block;">手机号：</label>
                            <span>${detail.phone || '-'}</span>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="width: 100px; display: inline-block;">提交时间：</label>
                            <span>${detail.created_at}</span>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="width: 100px; display: inline-block;">审核时间：</label>
                            <span>${detail.verified_at || '-'}</span>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="width: 100px; display: inline-block;">状态：</label>
                            <span>${detail.status == 0 ? '待审核' : detail.status == 1 ? '已通过' : '已拒绝'}</span>
                        </div>
                        ${detail.reject_reason ? `
                            <div style="margin-bottom: 15px;">
                                <label style="width: 100px; display: inline-block;">拒绝原因：</label>
                                <span>${detail.reject_reason}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

        } catch (error) {
            alert('获取详情失败：' + error.message);
        }
    },

    // 预览图片
    previewImage(url) {
        document.getElementById('modal-image').src = url;
        document.getElementById('image-modal').style.display = 'block';
        this.currentRotation = 0;
        this.currentZoom = 1;
    },

    // 关闭模态框
    closeModal() {
        document.getElementById('image-modal').style.display = 'none';
    },

    // 旋转图片
    rotateImage(degrees) {
        this.currentRotation = (this.currentRotation || 0) + degrees;
        const img = document.getElementById('modal-image');
        img.style.transform = `rotate(${this.currentRotation}deg) scale(${this.currentZoom || 1})`;
    },

    // 放大
    zoomIn() {
        this.currentZoom = (this.currentZoom || 1) * 1.2;
        const img = document.getElementById('modal-image');
        img.style.transform = `rotate(${this.currentRotation || 0}deg) scale(${this.currentZoom})`;
    },

    // 缩小
    zoomOut() {
        this.currentZoom = (this.currentZoom || 1) / 1.2;
        const img = document.getElementById('modal-image');
        img.style.transform = `rotate(${this.currentRotation || 0}deg) scale(${this.currentZoom})`;
    },

    // 搜索
    async search() {
        const search = document.getElementById('kyc-search').value;
        const status = document.getElementById('kyc-status-filter').value;
        const date = document.getElementById('kyc-date').value;

        // 实现搜索逻辑
        this.loadData(1);
    },

    // 生成分页
    generatePagination(total, currentPage) {
        const container = document.getElementById('kyc-pagination');
        const pageSize = 20;
        const totalPages = Math.ceil(total / pageSize);

        let html = '';

        if (currentPage > 1) {
            html += `<button class="page-btn" onclick="KycManager.loadData(${currentPage - 1})">上一页</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i == currentPage) {
                html += `<button class="page-btn active">${i}</button>`;
            } else if (i == 1 || i == totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="page-btn" onclick="KycManager.loadData(${i})">${i}</button>`;
            }
        }

        if (currentPage < totalPages) {
            html += `<button class="page-btn" onclick="KycManager.loadData(${currentPage + 1})">下一页</button>`;
        }

        container.innerHTML = html;
    }
};

// 导出到全局
window.KycManager = KycManager;
