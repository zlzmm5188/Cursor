// 系统配置管理页面
const ConfigManager = {
    // 配置数据
    configData: {
        // VIP升级配置
        vip: {
            levels: [
                { level: 0, name: 'VIP0', min_invest: 0, interest_bonus: 0, referral_rate_1: 1, referral_rate_2: 0 },
                { level: 1, name: 'VIP1', min_invest: 30000, interest_bonus: 0.05, referral_rate_1: 2, referral_rate_2: 0 },
                { level: 2, name: 'VIP2', min_invest: 100000, interest_bonus: 0.08, referral_rate_1: 2.5, referral_rate_2: 0.5 },
                { level: 3, name: 'VIP3', min_invest: 300000, interest_bonus: 0.10, referral_rate_1: 3, referral_rate_2: 1 },
                { level: 4, name: 'VIP4', min_invest: 800000, interest_bonus: 0.13, referral_rate_1: 3.5, referral_rate_2: 1.5 },
                { level: 5, name: 'VIP5', min_invest: 2000000, interest_bonus: 0.15, referral_rate_1: 4, referral_rate_2: 2 },
                { level: 6, name: 'VIP6', min_invest: 5000000, interest_bonus: 0.18, referral_rate_1: 5, referral_rate_2: 3 },
                { level: 7, name: 'VIP7', min_invest: 8000000, interest_bonus: 0.20, referral_rate_1: 6, referral_rate_2: 4 },
                { level: 8, name: 'VIP8', min_invest: 13000000, interest_bonus: 0.25, referral_rate_1: 7, referral_rate_2: 5 }
            ]
        },

        // 团队管理奖配置
        team_rewards: [
            { level: 1, team_count: 3, total_invest: 80000, reward_points: 1800 },
            { level: 2, team_count: 5, total_invest: 200000, reward_points: 3600 },
            { level: 3, team_count: 10, total_invest: 500000, reward_points: 6000 },
            { level: 4, team_count: 20, total_invest: 1300000, reward_points: 12000 },
            { level: 5, team_count: 50, total_invest: 3800000, reward_points: 28000 },
            { level: 6, team_count: 100, total_invest: 10800000, reward_points: 58000 },
            { level: 7, team_count: 300, total_invest: 28000000, reward_points: 88000 },
            { level: 8, team_count: 500, total_invest: 58000000, reward_points: 128000 },
            { level: 9, team_count: 1000, total_invest: 98000000, reward_points: 180000 }
        ],

        // 签到配置
        checkin: {
            daily_points: 10,           // 每日签到积分
            continuous_7_bonus: 50,     // 连续7天额外奖励
            continuous_15_bonus: 150,   // 连续15天额外奖励
            continuous_30_bonus: 500,   // 连续30天额外奖励
            max_continuous: 30,         // 最大连续天数
            reset_on_miss: true         // 断签是否重置
        },

        // 汇率配置
        exchange: {
            usdt_to_cny: 7.25,         // USDT兑换CNY汇率
            cny_to_usdt: 7.35,         // CNY兑换USDT汇率
            points_to_cny: 0.1,        // 积分兑换CNY比例 (1积分=0.1元)
            min_exchange: 100,          // 最小兑换金额
            max_exchange: 1000000       // 最大兑换金额
        },

        // 充值配置
        recharge: {
            min_amount: 100,            // 最小充值金额
            max_amount: 5000000,        // 最大充值金额
            bank_fee: 0,                // 银行卡充值手续费(%)
            usdt_fee: 0,                // USDT充值手续费(%)
            auto_approve_limit: 0,     // 自动审核金额上限(0为全部人工)
            payment_methods: {
                bank: true,             // 银行卡支付
                alipay: false,          // 支付宝
                wechat: false,          // 微信
                usdt_trc20: true,       // USDT-TRC20
                usdt_erc20: false       // USDT-ERC20
            }
        },

        // 提现配置
        withdraw: {
            min_amount: 100,            // 最小提现金额
            max_amount: 500000,         // 最大提现金额
            daily_limit: 3,             // 每日提现次数限制
            fee_rate: 2,                // 提现手续费率(%)
            min_fee: 5,                 // 最小手续费
            process_time: '24小时内',   // 处理时间说明
            require_kyc: true,          // 是否需要实名认证
            require_bind_card: true     // 是否需要绑定银行卡
        },

        // 日利宝配置
        ribao: {
            enabled: true,              // 是否开启
            min_transfer: 100,          // 最小转入金额
            max_transfer: 10000000,     // 最大转入金额
            daily_rate: 0.08,           // 日利率(%)
            annual_rate: 29.2,          // 年化收益率(%)
            settlement_time: '00:00',   // 结算时间
            instant_withdraw: true,     // 是否支持随时转出
            compound_interest: true     // 是否复利计算
        },

        // 投资配置
        investment: {
            min_amount: 100,            // 最小投资金额
            max_amount: 10000000,       // 最大投资金额
            early_exit: false,          // 是否允许提前退出
            early_exit_fee: 5,          // 提前退出手续费(%)
            auto_reinvest: false,       // 到期自动复投
            show_progress: true,        // 显示项目进度
            require_kyc: false,         // 投资是否需要KYC
            require_bind: true          // 投资是否需要绑定收款方式
        },

        // 新人福利
        newbie: {
            register_points: 100,       // 注册赠送积分
            register_bonus: 0,          // 注册赠送余额
            trial_fund: 888,            // 体验金金额
            trial_days: 7,              // 体验金有效期(天)
            trial_project_id: 1,        // 体验金指定项目ID
            first_recharge_bonus: 5,    // 首充奖励(%)
            require_kyc_for_trial: true // 体验金需要实名
        },

        // 系统设置
        system: {
            maintenance: false,         // 维护模式
            maintenance_msg: '系统维护中，请稍后访问',
            register_enabled: true,     // 开放注册
            login_enabled: true,        // 开放登录
            sms_enabled: false,         // 短信功能
            email_enabled: false,       // 邮件功能
            google_auth: false,         // 谷歌验证
            ip_whitelist: [],          // IP白名单
            api_rate_limit: 100,       // API限流(次/分钟)
            session_timeout: 7200      // 会话超时(秒)
        },

        // 收款账户配置
        payment_accounts: {
            bank_cards: [
                {
                    id: 1,
                    bank_name: '中国工商银行',
                    account_name: '张三',
                    account_number: '6222021234567890123',
                    branch: '北京分行',
                    enabled: true,
                    qr_code: ''
                }
            ],
            usdt_addresses: [
                {
                    id: 1,
                    network: 'TRC20',
                    address: 'TXyZ1234567890abcdefghijk',
                    enabled: true,
                    qr_code: ''
                }
            ]
        }
    },

    // 渲染配置页面
    render() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="config-container">
                <!-- 配置标签页 -->
                <div class="config-tabs">
                    <button class="config-tab active" data-tab="vip">VIP配置</button>
                    <button class="config-tab" data-tab="team">团队奖励</button>
                    <button class="config-tab" data-tab="checkin">签到配置</button>
                    <button class="config-tab" data-tab="exchange">汇率设置</button>
                    <button class="config-tab" data-tab="recharge">充值配置</button>
                    <button class="config-tab" data-tab="withdraw">提现配置</button>
                    <button class="config-tab" data-tab="ribao">日利宝</button>
                    <button class="config-tab" data-tab="investment">投资设置</button>
                    <button class="config-tab" data-tab="newbie">新人福利</button>
                    <button class="config-tab" data-tab="payment">收款账户</button>
                    <button class="config-tab" data-tab="system">系统设置</button>
                </div>

                <!-- 配置内容区 -->
                <div class="config-content" id="config-content">
                    ${this.renderVipConfig()}
                </div>

                <!-- 保存按钮 -->
                <div class="config-actions">
                    <button class="btn btn-primary" onclick="ConfigManager.saveConfig()">保存配置</button>
                    <button class="btn btn-default" onclick="ConfigManager.resetConfig()">重置</button>
                    <button class="btn btn-success" onclick="ConfigManager.exportConfig()">导出配置</button>
                    <button class="btn btn-default" onclick="ConfigManager.importConfig()">导入配置</button>
                </div>
            </div>

            <style>
                .config-container { background: #fff; border-radius: 8px; padding: 24px; }
                .config-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e8e8e8; }
                .config-tab { padding: 10px 20px; background: none; border: none; cursor: pointer; color: #666; border-bottom: 2px solid transparent; }
                .config-tab.active { color: #1890ff; border-bottom-color: #1890ff; }
                .config-content { min-height: 400px; }
                .config-section { margin-bottom: 20px; }
                .config-section h3 { margin-bottom: 15px; color: #000; }
                .config-table { width: 100%; border-collapse: collapse; }
                .config-table th { background: #fafafa; padding: 10px; text-align: left; font-weight: 500; }
                .config-table td { padding: 10px; border-bottom: 1px solid #f0f0f0; }
                .config-table input { width: 100%; padding: 5px; border: 1px solid #d9d9d9; border-radius: 4px; }
                .config-table input[type="number"] { width: 120px; }
                .config-table input[type="checkbox"] { width: auto; }
                .config-form { display: grid; grid-template-columns: 200px 1fr; gap: 15px; align-items: center; }
                .config-form label { color: #666; }
                .config-form input, .config-form select, .config-form textarea { padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px; }
                .config-actions { margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end; }
                .add-row-btn { padding: 5px 10px; background: #52c41a; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
                .delete-btn { padding: 3px 8px; background: #ff4d4f; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
            </style>
        `;

        // 绑定标签页切换事件
        this.bindTabEvents();
    },

    // 绑定标签页事件
    bindTabEvents() {
        document.querySelectorAll('.config-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    },

    // 切换标签页
    switchTab(tabName) {
        const content = document.getElementById('config-content');
        switch(tabName) {
            case 'vip': content.innerHTML = this.renderVipConfig(); break;
            case 'team': content.innerHTML = this.renderTeamConfig(); break;
            case 'checkin': content.innerHTML = this.renderCheckinConfig(); break;
            case 'exchange': content.innerHTML = this.renderExchangeConfig(); break;
            case 'recharge': content.innerHTML = this.renderRechargeConfig(); break;
            case 'withdraw': content.innerHTML = this.renderWithdrawConfig(); break;
            case 'ribao': content.innerHTML = this.renderRibaoConfig(); break;
            case 'investment': content.innerHTML = this.renderInvestmentConfig(); break;
            case 'newbie': content.innerHTML = this.renderNewbieConfig(); break;
            case 'payment': content.innerHTML = this.renderPaymentConfig(); break;
            case 'system': content.innerHTML = this.renderSystemConfig(); break;
        }
    },

    // 渲染VIP配置
    renderVipConfig() {
        return `
            <div class="config-section">
                <h3>VIP等级配置</h3>
                <table class="config-table">
                    <thead>
                        <tr>
                            <th>等级</th>
                            <th>名称</th>
                            <th>累计投资要求(元)</th>
                            <th>利息加成(%)</th>
                            <th>一级返利(%)</th>
                            <th>二级返利(%)</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.configData.vip.levels.map((vip, index) => `
                            <tr>
                                <td>VIP${vip.level}</td>
                                <td><input type="text" value="${vip.name}" data-field="vip.levels.${index}.name"></td>
                                <td><input type="number" value="${vip.min_invest}" data-field="vip.levels.${index}.min_invest"></td>
                                <td><input type="number" step="0.01" value="${vip.interest_bonus}" data-field="vip.levels.${index}.interest_bonus"></td>
                                <td><input type="number" step="0.1" value="${vip.referral_rate_1}" data-field="vip.levels.${index}.referral_rate_1"></td>
                                <td><input type="number" step="0.1" value="${vip.referral_rate_2}" data-field="vip.levels.${index}.referral_rate_2"></td>
                                <td>${vip.level > 0 ? `<button class="delete-btn" onclick="ConfigManager.deleteVipLevel(${index})">删除</button>` : '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button class="add-row-btn" onclick="ConfigManager.addVipLevel()">+ 添加VIP等级</button>
            </div>
        `;
    },

    // 渲染团队配置
    renderTeamConfig() {
        return `
            <div class="config-section">
                <h3>团队管理奖配置</h3>
                <table class="config-table">
                    <thead>
                        <tr>
                            <th>等级</th>
                            <th>团队人数要求</th>
                            <th>累计投资要求(元)</th>
                            <th>奖励积分</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.configData.team_rewards.map((reward, index) => `
                            <tr>
                                <td>等级${reward.level}</td>
                                <td><input type="number" value="${reward.team_count}" data-field="team_rewards.${index}.team_count"></td>
                                <td><input type="number" value="${reward.total_invest}" data-field="team_rewards.${index}.total_invest"></td>
                                <td><input type="number" value="${reward.reward_points}" data-field="team_rewards.${index}.reward_points"></td>
                                <td><button class="delete-btn" onclick="ConfigManager.deleteTeamReward(${index})">删除</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button class="add-row-btn" onclick="ConfigManager.addTeamReward()">+ 添加奖励等级</button>
            </div>
        `;
    },

    // 渲染签到配置
    renderCheckinConfig() {
        return `
            <div class="config-section">
                <h3>签到奖励配置</h3>
                <div class="config-form">
                    <label>每日签到积分:</label>
                    <input type="number" value="${this.configData.checkin.daily_points}" data-field="checkin.daily_points">

                    <label>连续7天额外奖励:</label>
                    <input type="number" value="${this.configData.checkin.continuous_7_bonus}" data-field="checkin.continuous_7_bonus">

                    <label>连续15天额外奖励:</label>
                    <input type="number" value="${this.configData.checkin.continuous_15_bonus}" data-field="checkin.continuous_15_bonus">

                    <label>连续30天额外奖励:</label>
                    <input type="number" value="${this.configData.checkin.continuous_30_bonus}" data-field="checkin.continuous_30_bonus">

                    <label>最大连续天数:</label>
                    <input type="number" value="${this.configData.checkin.max_continuous}" data-field="checkin.max_continuous">

                    <label>断签重置连续天数:</label>
                    <input type="checkbox" ${this.configData.checkin.reset_on_miss ? 'checked' : ''} data-field="checkin.reset_on_miss">
                </div>
            </div>
        `;
    },

    // 渲染汇率配置
    renderExchangeConfig() {
        return `
            <div class="config-section">
                <h3>汇率设置</h3>
                <div class="config-form">
                    <label>USDT → CNY 汇率:</label>
                    <input type="number" step="0.01" value="${this.configData.exchange.usdt_to_cny}" data-field="exchange.usdt_to_cny">

                    <label>CNY → USDT 汇率:</label>
                    <input type="number" step="0.01" value="${this.configData.exchange.cny_to_usdt}" data-field="exchange.cny_to_usdt">

                    <label>积分兑换比例 (1积分=?元):</label>
                    <input type="number" step="0.01" value="${this.configData.exchange.points_to_cny}" data-field="exchange.points_to_cny">

                    <label>最小兑换金额:</label>
                    <input type="number" value="${this.configData.exchange.min_exchange}" data-field="exchange.min_exchange">

                    <label>最大兑换金额:</label>
                    <input type="number" value="${this.configData.exchange.max_exchange}" data-field="exchange.max_exchange">
                </div>
            </div>
        `;
    },

    // 渲染充值配置
    renderRechargeConfig() {
        return `
            <div class="config-section">
                <h3>充值设置</h3>
                <div class="config-form">
                    <label>最小充值金额:</label>
                    <input type="number" value="${this.configData.recharge.min_amount}" data-field="recharge.min_amount">

                    <label>最大充值金额:</label>
                    <input type="number" value="${this.configData.recharge.max_amount}" data-field="recharge.max_amount">

                    <label>银行卡手续费(%):</label>
                    <input type="number" step="0.1" value="${this.configData.recharge.bank_fee}" data-field="recharge.bank_fee">

                    <label>USDT手续费(%):</label>
                    <input type="number" step="0.1" value="${this.configData.recharge.usdt_fee}" data-field="recharge.usdt_fee">

                    <label>自动审核上限(0=全人工):</label>
                    <input type="number" value="${this.configData.recharge.auto_approve_limit}" data-field="recharge.auto_approve_limit">

                    <label style="align-self: start; padding-top: 10px;">支付方式:</label>
                    <div>
                        <label><input type="checkbox" ${this.configData.recharge.payment_methods.bank ? 'checked' : ''} data-field="recharge.payment_methods.bank"> 银行卡</label><br>
                        <label><input type="checkbox" ${this.configData.recharge.payment_methods.alipay ? 'checked' : ''} data-field="recharge.payment_methods.alipay"> 支付宝</label><br>
                        <label><input type="checkbox" ${this.configData.recharge.payment_methods.wechat ? 'checked' : ''} data-field="recharge.payment_methods.wechat"> 微信</label><br>
                        <label><input type="checkbox" ${this.configData.recharge.payment_methods.usdt_trc20 ? 'checked' : ''} data-field="recharge.payment_methods.usdt_trc20"> USDT-TRC20</label><br>
                        <label><input type="checkbox" ${this.configData.recharge.payment_methods.usdt_erc20 ? 'checked' : ''} data-field="recharge.payment_methods.usdt_erc20"> USDT-ERC20</label>
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染提现配置
    renderWithdrawConfig() {
        return `
            <div class="config-section">
                <h3>提现设置</h3>
                <div class="config-form">
                    <label>最小提现金额:</label>
                    <input type="number" value="${this.configData.withdraw.min_amount}" data-field="withdraw.min_amount">

                    <label>最大提现金额:</label>
                    <input type="number" value="${this.configData.withdraw.max_amount}" data-field="withdraw.max_amount">

                    <label>每日提现次数:</label>
                    <input type="number" value="${this.configData.withdraw.daily_limit}" data-field="withdraw.daily_limit">

                    <label>提现手续费率(%):</label>
                    <input type="number" step="0.1" value="${this.configData.withdraw.fee_rate}" data-field="withdraw.fee_rate">

                    <label>最小手续费:</label>
                    <input type="number" value="${this.configData.withdraw.min_fee}" data-field="withdraw.min_fee">

                    <label>处理时间说明:</label>
                    <input type="text" value="${this.configData.withdraw.process_time}" data-field="withdraw.process_time">

                    <label>需要实名认证:</label>
                    <input type="checkbox" ${this.configData.withdraw.require_kyc ? 'checked' : ''} data-field="withdraw.require_kyc">

                    <label>需要绑定银行卡:</label>
                    <input type="checkbox" ${this.configData.withdraw.require_bind_card ? 'checked' : ''} data-field="withdraw.require_bind_card">
                </div>
            </div>
        `;
    },

    // 渲染日利宝配置
    renderRibaoConfig() {
        return `
            <div class="config-section">
                <h3>日利宝设置</h3>
                <div class="config-form">
                    <label>启用日利宝:</label>
                    <input type="checkbox" ${this.configData.ribao.enabled ? 'checked' : ''} data-field="ribao.enabled">

                    <label>最小转入金额:</label>
                    <input type="number" value="${this.configData.ribao.min_transfer}" data-field="ribao.min_transfer">

                    <label>最大转入金额:</label>
                    <input type="number" value="${this.configData.ribao.max_transfer}" data-field="ribao.max_transfer">

                    <label>日利率(%):</label>
                    <input type="number" step="0.01" value="${this.configData.ribao.daily_rate}" data-field="ribao.daily_rate">

                    <label>年化收益率(%):</label>
                    <input type="number" step="0.1" value="${this.configData.ribao.annual_rate}" data-field="ribao.annual_rate">

                    <label>结算时间:</label>
                    <input type="text" value="${this.configData.ribao.settlement_time}" data-field="ribao.settlement_time">

                    <label>支持随时转出:</label>
                    <input type="checkbox" ${this.configData.ribao.instant_withdraw ? 'checked' : ''} data-field="ribao.instant_withdraw">

                    <label>复利计算:</label>
                    <input type="checkbox" ${this.configData.ribao.compound_interest ? 'checked' : ''} data-field="ribao.compound_interest">
                </div>
            </div>
        `;
    },

    // 渲染投资配置
    renderInvestmentConfig() {
        return `
            <div class="config-section">
                <h3>投资设置</h3>
                <div class="config-form">
                    <label>最小投资金额:</label>
                    <input type="number" value="${this.configData.investment.min_amount}" data-field="investment.min_amount">

                    <label>最大投资金额:</label>
                    <input type="number" value="${this.configData.investment.max_amount}" data-field="investment.max_amount">

                    <label>允许提前退出:</label>
                    <input type="checkbox" ${this.configData.investment.early_exit ? 'checked' : ''} data-field="investment.early_exit">

                    <label>提前退出手续费(%):</label>
                    <input type="number" step="0.1" value="${this.configData.investment.early_exit_fee}" data-field="investment.early_exit_fee">

                    <label>到期自动复投:</label>
                    <input type="checkbox" ${this.configData.investment.auto_reinvest ? 'checked' : ''} data-field="investment.auto_reinvest">

                    <label>显示项目进度:</label>
                    <input type="checkbox" ${this.configData.investment.show_progress ? 'checked' : ''} data-field="investment.show_progress">

                    <label>投资需要KYC:</label>
                    <input type="checkbox" ${this.configData.investment.require_kyc ? 'checked' : ''} data-field="investment.require_kyc">

                    <label>投资需要绑定收款:</label>
                    <input type="checkbox" ${this.configData.investment.require_bind ? 'checked' : ''} data-field="investment.require_bind">
                </div>
            </div>
        `;
    },

    // 渲染新人福利配置
    renderNewbieConfig() {
        return `
            <div class="config-section">
                <h3>新人福利设置</h3>
                <div class="config-form">
                    <label>注册赠送积分:</label>
                    <input type="number" value="${this.configData.newbie.register_points}" data-field="newbie.register_points">

                    <label>注册赠送余额:</label>
                    <input type="number" value="${this.configData.newbie.register_bonus}" data-field="newbie.register_bonus">

                    <label>体验金金额:</label>
                    <input type="number" value="${this.configData.newbie.trial_fund}" data-field="newbie.trial_fund">

                    <label>体验金有效期(天):</label>
                    <input type="number" value="${this.configData.newbie.trial_days}" data-field="newbie.trial_days">

                    <label>体验金指定项目ID:</label>
                    <input type="number" value="${this.configData.newbie.trial_project_id}" data-field="newbie.trial_project_id">

                    <label>首充奖励(%):</label>
                    <input type="number" step="0.1" value="${this.configData.newbie.first_recharge_bonus}" data-field="newbie.first_recharge_bonus">

                    <label>体验金需要实名:</label>
                    <input type="checkbox" ${this.configData.newbie.require_kyc_for_trial ? 'checked' : ''} data-field="newbie.require_kyc_for_trial">
                </div>
            </div>
        `;
    },

    // 渲染收款账户配置
    renderPaymentConfig() {
        return `
            <div class="config-section">
                <h3>收款银行卡</h3>
                <table class="config-table">
                    <thead>
                        <tr>
                            <th>银行</th>
                            <th>户名</th>
                            <th>卡号</th>
                            <th>支行</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.configData.payment_accounts.bank_cards.map((card, index) => `
                            <tr>
                                <td><input type="text" value="${card.bank_name}" data-field="payment_accounts.bank_cards.${index}.bank_name"></td>
                                <td><input type="text" value="${card.account_name}" data-field="payment_accounts.bank_cards.${index}.account_name"></td>
                                <td><input type="text" value="${card.account_number}" data-field="payment_accounts.bank_cards.${index}.account_number"></td>
                                <td><input type="text" value="${card.branch}" data-field="payment_accounts.bank_cards.${index}.branch"></td>
                                <td><input type="checkbox" ${card.enabled ? 'checked' : ''} data-field="payment_accounts.bank_cards.${index}.enabled"></td>
                                <td><button class="delete-btn" onclick="ConfigManager.deleteBankCard(${index})">删除</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button class="add-row-btn" onclick="ConfigManager.addBankCard()">+ 添加银行卡</button>

                <h3 style="margin-top: 30px;">USDT收款地址</h3>
                <table class="config-table">
                    <thead>
                        <tr>
                            <th>网络</th>
                            <th>地址</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.configData.payment_accounts.usdt_addresses.map((addr, index) => `
                            <tr>
                                <td>
                                    <select data-field="payment_accounts.usdt_addresses.${index}.network">
                                        <option value="TRC20" ${addr.network === 'TRC20' ? 'selected' : ''}>TRC20</option>
                                        <option value="ERC20" ${addr.network === 'ERC20' ? 'selected' : ''}>ERC20</option>
                                    </select>
                                </td>
                                <td><input type="text" value="${addr.address}" data-field="payment_accounts.usdt_addresses.${index}.address" style="width: 300px;"></td>
                                <td><input type="checkbox" ${addr.enabled ? 'checked' : ''} data-field="payment_accounts.usdt_addresses.${index}.enabled"></td>
                                <td><button class="delete-btn" onclick="ConfigManager.deleteUsdtAddress(${index})">删除</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button class="add-row-btn" onclick="ConfigManager.addUsdtAddress()">+ 添加USDT地址</button>
            </div>
        `;
    },

    // 渲染系统配置
    renderSystemConfig() {
        return `
            <div class="config-section">
                <h3>系统设置</h3>
                <div class="config-form">
                    <label>维护模式:</label>
                    <input type="checkbox" ${this.configData.system.maintenance ? 'checked' : ''} data-field="system.maintenance">

                    <label>维护提示:</label>
                    <input type="text" value="${this.configData.system.maintenance_msg}" data-field="system.maintenance_msg" style="width: 400px;">

                    <label>开放注册:</label>
                    <input type="checkbox" ${this.configData.system.register_enabled ? 'checked' : ''} data-field="system.register_enabled">

                    <label>开放登录:</label>
                    <input type="checkbox" ${this.configData.system.login_enabled ? 'checked' : ''} data-field="system.login_enabled">

                    <label>短信功能:</label>
                    <input type="checkbox" ${this.configData.system.sms_enabled ? 'checked' : ''} data-field="system.sms_enabled">

                    <label>邮件功能:</label>
                    <input type="checkbox" ${this.configData.system.email_enabled ? 'checked' : ''} data-field="system.email_enabled">

                    <label>谷歌验证:</label>
                    <input type="checkbox" ${this.configData.system.google_auth ? 'checked' : ''} data-field="system.google_auth">

                    <label>API限流(次/分钟):</label>
                    <input type="number" value="${this.configData.system.api_rate_limit}" data-field="system.api_rate_limit">

                    <label>会话超时(秒):</label>
                    <input type="number" value="${this.configData.system.session_timeout}" data-field="system.session_timeout">
                </div>
            </div>
        `;
    },

    // 保存配置
    async saveConfig() {
        // 收集所有输入框的值
        document.querySelectorAll('input[data-field]').forEach(input => {
            const field = input.dataset.field;
            const keys = field.split('.');
            let target = this.configData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (keys[i].match(/^\d+$/)) {
                    target = target[parseInt(keys[i])];
                } else {
                    target = target[keys[i]];
                }
            }

            const lastKey = keys[keys.length - 1];
            if (input.type === 'checkbox') {
                target[lastKey] = input.checked;
            } else if (input.type === 'number') {
                target[lastKey] = parseFloat(input.value) || 0;
            } else {
                target[lastKey] = input.value;
            }
        });

        // 发送到后端保存
        try {
            await AdminAPI.updateSystemConfig(this.configData);
            alert('配置保存成功！');
        } catch (error) {
            alert('保存失败：' + error.message);
        }
    },

    // 重置配置
    resetConfig() {
        if (confirm('确定要重置所有配置吗？')) {
            location.reload();
        }
    },

    // 导出配置
    exportConfig() {
        const dataStr = JSON.stringify(this.configData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `providence_config_${new Date().toISOString().slice(0,10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },

    // 导入配置
    importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    this.configData = JSON.parse(event.target.result);
                    this.render();
                    alert('配置导入成功！');
                } catch (error) {
                    alert('导入失败：文件格式错误');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    // 添加VIP等级
    addVipLevel() {
        const lastLevel = this.configData.vip.levels[this.configData.vip.levels.length - 1];
        this.configData.vip.levels.push({
            level: lastLevel.level + 1,
            name: `VIP${lastLevel.level + 1}`,
            min_invest: lastLevel.min_invest + 1000000,
            interest_bonus: lastLevel.interest_bonus + 0.02,
            referral_rate_1: lastLevel.referral_rate_1 + 0.5,
            referral_rate_2: lastLevel.referral_rate_2 + 0.5
        });
        this.switchTab('vip');
    },

    // 删除VIP等级
    deleteVipLevel(index) {
        if (confirm('确定删除此VIP等级？')) {
            this.configData.vip.levels.splice(index, 1);
            this.switchTab('vip');
        }
    },

    // 添加团队奖励
    addTeamReward() {
        const lastReward = this.configData.team_rewards[this.configData.team_rewards.length - 1];
        this.configData.team_rewards.push({
            level: lastReward.level + 1,
            team_count: lastReward.team_count * 2,
            total_invest: lastReward.total_invest * 2,
            reward_points: lastReward.reward_points + 20000
        });
        this.switchTab('team');
    },

    // 删除团队奖励
    deleteTeamReward(index) {
        if (confirm('确定删除此奖励等级？')) {
            this.configData.team_rewards.splice(index, 1);
            this.switchTab('team');
        }
    },

    // 添加银行卡
    addBankCard() {
        this.configData.payment_accounts.bank_cards.push({
            id: Date.now(),
            bank_name: '',
            account_name: '',
            account_number: '',
            branch: '',
            enabled: true,
            qr_code: ''
        });
        this.switchTab('payment');
    },

    // 删除银行卡
    deleteBankCard(index) {
        if (confirm('确定删除此银行卡？')) {
            this.configData.payment_accounts.bank_cards.splice(index, 1);
            this.switchTab('payment');
        }
    },

    // 添加USDT地址
    addUsdtAddress() {
        this.configData.payment_accounts.usdt_addresses.push({
            id: Date.now(),
            network: 'TRC20',
            address: '',
            enabled: true,
            qr_code: ''
        });
        this.switchTab('payment');
    },

    // 删除USDT地址
    deleteUsdtAddress(index) {
        if (confirm('确定删除此USDT地址？')) {
            this.configData.payment_accounts.usdt_addresses.splice(index, 1);
            this.switchTab('payment');
        }
    }
};

// 导出到全局
window.ConfigManager = ConfigManager;
