// 项目发布系统
const ProjectPublishSystem = {
    openPublishModal() {
        const modal = document.getElementById('publishModal');
        if (modal) {
            modal.style.display = 'block';
        } else {
            this.createModal();
        }
    },

    createModal() {
        const html = `
        <div class="modal" id="publishModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;">
            <div style="background:white;padding:30px;border-radius:10px;width:90%;max-width:600px;max-height:80vh;overflow-y:auto;">
                <h3 style="margin-bottom:20px;">发布新项目</h3>
                <form id="projectForm">
                    <div style="margin-bottom:15px;">
                        <label>项目名称 *</label>
                        <input type="text" id="projectName" required style="width:100%;padding:8px;margin-top:5px;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label>周期 (天) *</label>
                        <input type="number" id="projectDuration" required style="width:100%;padding:8px;margin-top:5px;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label>年利率 (%) *</label>
                        <input type="number" id="projectRate" step="0.01" required style="width:100%;padding:8px;margin-top:5px;">
                    </div>
                    
                    <fieldset style="margin-bottom:15px;padding:15px;border:1px solid #ddd;">
                        <legend>💰 人民币配置</legend>
                        <div style="margin-bottom:10px;">
                            <label><input type="checkbox" id="enableCNY" checked> 启用人民币购买</label>
                        </div>
                        <div id="cnyConfig">
                            <div style="margin-bottom:10px;">
                                <label>起投金额 (CNY)</label>
                                <input type="number" id="minCNY" value="1000" style="width:100%;padding:8px;margin-top:5px;">
                            </div>
                            <div style="margin-bottom:10px;">
                                <label>总额度 (CNY)</label>
                                <input type="number" id="totalCNY" value="1000000" style="width:100%;padding:8px;margin-top:5px;">
                            </div>
                            <div style="margin-bottom:10px;">
                                <label>返利率 (%)</label>
                                <input type="number" id="rebateCNY" step="0.01" value="2.5" style="width:100%;padding:8px;margin-top:5px;">
                            </div>
                        </div>
                    </fieldset>
                    
                    <fieldset style="margin-bottom:15px;padding:15px;border:1px solid #ddd;">
                        <legend>💵 USDT配置</legend>
                        <div style="margin-bottom:10px;">
                            <label><input type="checkbox" id="enableUSDT"> 启用USDT购买</label>
                        </div>
                        <div id="usdtConfig" style="display:none;">
                            <div style="margin-bottom:10px;">
                                <label>起投金额 (USDT)</label>
                                <input type="number" id="minUSDT" value="100" style="width:100%;padding:8px;margin-top:5px;">
                            </div>
                            <div style="margin-bottom:10px;">
                                <label>总额度 (USDT)</label>
                                <input type="number" id="totalUSDT" value="10000" style="width:100%;padding:8px;margin-top:5px;">
                            </div>
                            <div style="margin-bottom:10px;">
                                <label>返利率 (%)</label>
                                <input type="number" id="rebateUSDT" step="0.01" value="3.0" style="width:100%;padding:8px;margin-top:5px;">
                            </div>
                        </div>
                    </fieldset>
                    
                    <div style="text-align:center;margin-top:20px;">
                        <button type="button" onclick="ProjectPublishSystem.publishProject()" style="padding:10px 30px;background:#1890ff;color:white;border:none;border-radius:5px;cursor:pointer;margin-right:10px;">发布项目</button>
                        <button type="button" onclick="ProjectPublishSystem.closeModal()" style="padding:10px 30px;background:#ccc;border:none;border-radius:5px;cursor:pointer;">取消</button>
                    </div>
                </form>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', html);
        
        // 绑定USDT开关事件
        document.getElementById('enableUSDT').addEventListener('change', function() {
            document.getElementById('usdtConfig').style.display = this.checked ? 'block' : 'none';
        });
        document.getElementById('enableCNY').addEventListener('change', function() {
            document.getElementById('cnyConfig').style.display = this.checked ? 'block' : 'none';
        });
    },

    closeModal() {
        const modal = document.getElementById('publishModal');
        if (modal) modal.remove();
    },

    async publishProject() {
        const name = document.getElementById('projectName').value;
        const duration = document.getElementById('projectDuration').value;
        const rate = document.getElementById('projectRate').value;
        
        if (!name || !duration || !rate) {
            alert('请填写所有必填项');
            return;
        }

        const enableCNY = document.getElementById('enableCNY').checked;
        const enableUSDT = document.getElementById('enableUSDT').checked;

        if (!enableCNY && !enableUSDT) {
            alert('至少需要启用一种货币');
            return;
        }

        try {
            const data = {
                name: name,
                duration: parseInt(duration),
                annual_rate: parseFloat(rate),
                status: 1,
                currencies: (enableCNY ? 'CNY' : '') + (enableCNY && enableUSDT ? ',' : '') + (enableUSDT ? 'USDT' : '')
            };

            if (enableCNY) {
                data.min_investment_cny = parseFloat(document.getElementById('minCNY').value);
                data.total_amount_cny = parseFloat(document.getElementById('totalCNY').value);
                data.rebate_cny = parseFloat(document.getElementById('rebateCNY').value);
            }

            if (enableUSDT) {
                data.min_investment_usdt = parseFloat(document.getElementById('minUSDT').value);
                data.total_amount_usdt = parseFloat(document.getElementById('totalUSDT').value);
                data.rebate_usdt = parseFloat(document.getElementById('rebateUSDT').value);
            }

            const result = await AdminAPI.post('/providence/projects/create', data);
            
            if (result && result.id) {
                alert('✅ 项目发布成功！');
                this.closeModal();
                if (typeof AdminSystem !== 'undefined') {
                    AdminSystem.loadProjectsData();
                }
            } else {
                alert('发布成功');
                this.closeModal();
                location.reload();
            }
        } catch (error) {
            alert('❌ 发布失败：' + error.message);
        }
    }
};

console.log('project-rebate-system.js loaded');
