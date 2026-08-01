let gameState = JSON.parse(JSON.stringify(defaultConfig));
let activeTabMap1 = 'leaf';
let activeTabMap2 = 'pine_leaf';
let activeTabMap3 = 'broad_leaf'; 
let activeTabMap4 = 'sakura_leaf'; 
let activeRecycleTab = 'material'; 

let buyMultiplier = 1; // 目前的購買倍率 (1, 10, 100, 或 -1 代表 Max)

// ==================== 快捷鍵監聽器 ====================

window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    if (key === 'z') buyMultiplier = 10;
    if (key === 'x') buyMultiplier = 100;
    if (key === 'c') buyMultiplier = -1; // -1 代表 Max
    updateDynamicValues(); 
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (['z', 'x', 'c'].includes(key)) {
        buyMultiplier = 1;
        updateDynamicValues();
    }
});

// ==================== 0. 數字格式化 ====================

function formatNumber(num, keepDecimalsForSmall = false) {
    if (num === undefined || isNaN(num) || num === null) return '0';
    if (num < 1000) {
        if (keepDecimalsForSmall) {
            return num % 1 === 0 ? num.toString() : num.toFixed(1);
        }
        return Math.floor(num).toString();
    }

    let isAbbrev = (gameState.numberFormat !== 'scientific');

    if (isAbbrev) {
        let tier = Math.floor(Math.log10(num) / 3);
        let suffix = getSuffix(tier);
        let scale = Math.pow(10, tier * 3);
        let scaled = num / scale;
        return parseFloat(scaled.toFixed(2)) + suffix;
    } else {
        let exp = Math.floor(Math.log10(num));
        let base = num / Math.pow(10, exp);
        return parseFloat(base.toFixed(2)) + "e" + exp;
    }
}

function getSuffix(index) {
    const baseSuffixes = ['', 'K', 'M', 'B', 'T'];
    if (index < baseSuffixes.length) return baseSuffixes[index];
    let adjIndex = index - baseSuffixes.length;
    if (adjIndex >= 676) return 'e' + (index * 3);
    let firstChar = String.fromCharCode(97 + Math.floor(adjIndex / 26));
    let secondChar = String.fromCharCode(97 + (adjIndex % 26));
    return firstChar + secondChar;
}

function toggleNumberFormat(isChecked) {
    gameState.numberFormat = isChecked ? 'abbreviation' : 'scientific';
    saveGame();
    updateDynamicValues();
}

// ==================== 1. 核心邏輯 ====================

// 等比級數公式：計算購買 N 級的總代價 (強化防禦)
function getTotalCost(upg, amount) {
    if (!upg || amount <= 0) return 0;
    const L = upg.level || 0;
    const B = upg.baseCost || 0;
    const r = upg.multiplier || 1.0; 
    
    // 如果係數為 1 (例如解鎖項)，直接用簡易乘法
    if (r < 1.0001) return B * amount;

    // 公式: B * r^L * (r^n - 1) / (r - 1)
    let total = Math.floor(B * Math.pow(r, L) * (Math.pow(r, amount) - 1) / (r - 1));
    return (isNaN(total) || total < 0) ? Infinity : total; 
}

// 反推公式：現有資源最多能買幾級 (強化防禦)
function getMaxAffordable(upg, resAmount) {
    if (!upg || resAmount <= 0) return 0;
    const L = upg.level || 0;
    const B = upg.baseCost || 0;
    const r = upg.multiplier || 1.0;
    const R = resAmount || 0;
    
    // 先檢查是否連一等都買不起
    if (R < getUpgradeCost(upg)) return 0;

    let maxN = 0;
    // 嚴格判定倍率為 1 的情況 ( Nah BUG 修復核心 )
    if (r < 1.0001) {
        maxN = Math.floor(R / B);
    } else {
        // 公式: n = log_r( (R*(r-1)/(B*r^L)) + 1 )
        maxN = Math.floor(Math.log((R * (r - 1) / (B * Math.pow(r, L))) + 1) / Math.log(r));
    }
    
    // 限制在最大等級內
    if (upg.maxLevel !== null && upg.maxLevel !== undefined && upg.maxLevel !== Infinity) {
        maxN = Math.min(maxN, upg.maxLevel - L);
    }
    
    return (isNaN(maxN) || maxN < 0) ? 0 : maxN;
}

function addResource(resId, amount) {
    if (!gameState.resources[resId] || amount <= 0) return;
    gameState.resources[resId].amount += amount;
    if (gameState.resources[resId].lifetimeAmount !== undefined) {
        gameState.resources[resId].lifetimeAmount += amount;
    }
}

function getMaxOfflineTime() {
    return gameState.baseMaxOfflineSeconds || 86400;
}

function getUpgradeCost(upg) {
    if (!upg) return 0;
    const r = upg.multiplier || 1.0;
    return Math.floor(upg.baseCost * Math.pow(r, upg.level));
}

function getRobotYield(robotId) {
    let yieldAmount = 1;
    let upgKey = '';
    let presUpgKey = '';

    const robotMapping = {
        sweeper: ['leaf_amount', 'pres_leaf_boost'],
        branchCollector: ['branch_amount', 'pres_branch_boost'],
        lumberjack: ['wood_amount', 'pres_wood_boost'],
        pineSweeper: ['pine_leaf_amount', 'pres_pine_leaf_boost'],
        pineBranchCollector: ['pine_branch_amount', 'pres_pine_branch_boost'],
        pineLumberjack: ['pine_wood_amount', 'pres_pine_wood_boost'],
        broadSweeper: ['broad_leaf_amount', 'pres_broad_leaf_boost'],
        broadBranchCollector: ['broad_branch_amount', 'pres_broad_branch_boost'],
        broadLumberjack: ['broad_wood_amount', 'pres_broad_wood_boost'],
        sakuraSweeper: ['sakura_leaf_amount', 'pres_sakura_leaf_boost'],
        sakuraBranchCollector: ['sakura_branch_amount', 'pres_sakura_branch_boost'],
        sakuraLumberjack: ['sakura_wood_amount', 'pres_sakura_wood_boost']
    };

    if (robotMapping[robotId]) {
        [upgKey, presUpgKey] = robotMapping[robotId];
        // 核心修改：直接採用等級作為基礎產量 (Lv 1 = 1倍)
        let level = gameState.upgrades[upgKey]?.level || 1;
        yieldAmount = level >= 500 ? 700 : level; 
        
        let presLevel = gameState.upgrades[presUpgKey]?.level || 1;
        yieldAmount *= presLevel;
    }
    return yieldAmount;
}

function getRobotInterval(robotId) {
    let base = gameState.robots[robotId].baseInterval;
    const speedUpgMapping = {
        sweeper: 'leaf_speed', branchCollector: 'branch_speed', lumberjack: 'wood_speed',
        pineSweeper: 'pine_leaf_speed', pineBranchCollector: 'pine_branch_speed', pineLumberjack: 'pine_wood_speed',
        broadSweeper: 'broad_leaf_speed', broadBranchCollector: 'broad_branch_speed', broadLumberjack: 'broad_wood_speed',
        sakuraSweeper: 'sakura_leaf_speed', sakuraBranchCollector: 'sakura_branch_speed', sakuraLumberjack: 'sakura_wood_speed'
    };
    let speedLevel = gameState.upgrades[speedUpgMapping[robotId]]?.level || 0;
    return Math.max(0.1, base - (speedLevel * 0.01));
}

function getRobotTotalCount(robotId) {
    // 核心修改：直接採用升級等級作為數量 (Lv 1 = 1台)
    const countUpgMapping = {
        sweeper: 'leaf_count', branchCollector: 'branch_count', lumberjack: 'wood_count',
        pineSweeper: 'pine_leaf_count', pineBranchCollector: 'pine_branch_count', pineLumberjack: 'pine_wood_count',
        broadSweeper: 'broad_leaf_count', broadBranchCollector: 'broad_branch_count', broadLumberjack: 'broad_wood_count',
        sakuraSweeper: 'sakura_leaf_count', sakuraBranchCollector: 'sakura_branch_count', sakuraLumberjack: 'sakura_wood_count'
    };
    if (countUpgMapping[robotId]) {
        return gameState.upgrades[countUpgMapping[robotId]]?.level || 0;
    }
    return gameState.robots[robotId].baseCount || 0;
}

function getRecycleInterval() {
    let base = 10.0;
    let speedLv = gameState.upgrades.recycle_speed?.level || 0;
    return Math.max(0.5, base - (speedLv * 0.1));
}

function calculatePrestigeCoinGain() {
    let r = gameState.resources;
    let rawCoins = (r.leaf.lifetimeAmount || 0) * 0.000002
                 + (r.branch.lifetimeAmount || 0) * 0.000006
                 + (r.wood.lifetimeAmount || 0) * 0.00001
                 + (r.pine_leaf.lifetimeAmount || 0) * 0.000004
                 + (r.pine_branch.lifetimeAmount || 0) * 0.000012
                 + (r.pine_wood.lifetimeAmount || 0) * 0.00002
                 + (r.broad_leaf.lifetimeAmount || 0) * 0.000008
                 + (r.broad_branch.lifetimeAmount || 0) * 0.000024
                 + (r.broad_wood.lifetimeAmount || 0) * 0.00004
                 + (r.sakura_leaf.lifetimeAmount || 0) * 0.000016
                 + (r.sakura_branch.lifetimeAmount || 0) * 0.000048
                 + (r.sakura_wood.lifetimeAmount || 0) * 0.00008
                 + (r.recycle_coin.lifetimeAmount || 0) * 0.0005;

    let bonusMultiplier = 1 + ((gameState.upgrades.pres_coin_boost?.level || 0) * 0.01);
    return Math.round(rawCoins * bonusMultiplier);
}

let lastTimeStamp = Date.now();

function gameLoop() {
    let now = Date.now();
    let deltaTime = (now - lastTimeStamp) / 1000;
    lastTimeStamp = now;

    processTick(deltaTime);
    processInterest(now);
    updateDynamicValues();

    requestAnimationFrame(gameLoop);
}

function processTick(deltaTime) {
    // 機器人產出
    Object.values(gameState.robots).forEach(bot => {
        if (!bot.unlocked) return;
        let isMapUnlocked = (bot.map === 'map1') 
            || (bot.map === 'map2' && gameState.unlockedMap2)
            || (bot.map === 'map3' && gameState.unlockedMap3)
            || (bot.map === 'map4' && gameState.unlockedMap4);
        if (!isMapUnlocked) return;

        let totalCount = getRobotTotalCount(bot.id);
        if (totalCount <= 0) return;

        let interval = getRobotInterval(bot.id);
        bot.currentTimer = (bot.currentTimer || 0) + deltaTime;

        if (bot.currentTimer >= interval) {
            let cycles = Math.floor(bot.currentTimer / interval);
            bot.currentTimer %= interval;
            addResource(bot.targetResource, getRobotYield(bot.id) * totalCount * cycles);
        }
    });

    // 回收廠邏輯 (已優化效能)
    if (gameState.unlockedRecycle) {
        let recInterval = getRecycleInterval();
        gameState.recycleTimer = (gameState.recycleTimer || 0) + deltaTime;

        if (gameState.recycleTimer >= recInterval) {
            let cycles = Math.floor(gameState.recycleTimer / recInterval);
            gameState.recycleTimer %= recInterval;
            
            let factoryTimes = (gameState.upgrades.recycle_factory?.level || 1);
            let totalCycles = cycles * factoryTimes;

            let effLv = (gameState.upgrades.recycle_efficiency?.level || 0) + (gameState.upgrades.pres_recycle_efficiency?.level || 0);
            let discountMultiplier = Math.max(0, 1 - (effLv * 0.01));
            
            Object.values(gameState.recycles).forEach(rec => {
                if (!rec.enabled) return;
                if (!gameState.resources[rec.gainRes]?.unlocked) return;
                
                let costPerCycle = Math.max(1, Math.round(rec.costAmt * discountMultiplier));
                let availableCycles = Math.floor(gameState.resources[rec.costRes].amount / costPerCycle);
                let actualExecutions = Math.min(totalCycles, availableCycles);

                if (actualExecutions > 0) {
                    gameState.resources[rec.costRes].amount -= costPerCycle * actualExecutions;
                    
                    let gainPerCycle = 0;
                    if (rec.isCoin) {
                        let baseLv = gameState.upgrades.recycle_amount?.level || 1;
                        let boostLv = gameState.upgrades.recycle_boost?.level || 1;
                        let presBoostLv = gameState.upgrades.pres_recycle_boost?.level || 1;
                        gainPerCycle = (rec.gainAmt + baseLv - 1) * boostLv * presBoostLv;
                    } else {
                        let baseLv = gameState.upgrades.recycle_material_amount?.level || 1;
                        let boostLv = gameState.upgrades.recycle_material_boost?.level || 1;
                        let presBoostLv = gameState.upgrades.pres_recycle_material_boost?.level || 1;
                        gainPerCycle = (rec.gainAmt + baseLv - 1) * boostLv * presBoostLv;
                    }
                    addResource(rec.gainRes, gainPerCycle * actualExecutions);
                }
            });
        }
    }
}

function processInterest(now) {
    let interestLevel = gameState.upgrades.pres_interest?.level || 0;
    if (interestLevel <= 0) return;
    if (!gameState.lastInterestTime) gameState.lastInterestTime = now;
    let elapsed = (now - gameState.lastInterestTime) / 1000;
    if (elapsed >= 60) {
        let minutes = Math.floor(elapsed / 60);
        gameState.lastInterestTime += minutes * 60 * 1000;
        let currentCoins = gameState.resources.prestige_coin.amount || 0;
        if (currentCoins > 0) {
            let interestEarned = Math.round(currentCoins * (0.001 * interestLevel * minutes));
            if (interestEarned > 0) addResource('prestige_coin', interestEarned);
        }
    }
}

// ==================== 2. 介面控制 ====================

function switchView(viewId) {
    let isLocked = false;
    if (viewId === 'map2' && !gameState.unlockedMap2) isLocked = true;
    if (viewId === 'map3' && !gameState.unlockedMap3) isLocked = true;
    if (viewId === 'map4' && !gameState.unlockedMap4) isLocked = true;
    if (viewId === 'recycle' && !gameState.unlockedRecycle) isLocked = true;
    if (viewId === 'prestige' && !gameState.unlockedPrestige) isLocked = true;

    if (isLocked) viewId = 'map1';
    if (['map1', 'map2', 'map3', 'map4'].includes(viewId)) gameState.lastMap = viewId;
    gameState.currentView = viewId;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));

    const btnEl = document.getElementById(`nav-${viewId}`);
    if (btnEl) btnEl.classList.add('active');
    const pageEl = document.getElementById(`page-${viewId}`);
    if (pageEl) pageEl.classList.add('active');

    renderUpgradeList();
    if (viewId === 'recycle') renderRecycleOptions();
}

function toggleRecycleView() {
    if (!gameState.unlockedRecycle) return;
    gameState.currentView === 'recycle' ? switchView(gameState.lastMap || 'map1') : switchView('recycle');
}

function togglePrestigeView() {
    if (!gameState.unlockedPrestige) return;
    gameState.currentView === 'prestige' ? switchView(gameState.lastMap || 'map1') : switchView('prestige');
}

function switchRecycleTab(tab, element) {
    activeRecycleTab = tab;
    document.querySelectorAll('#tab-container-recycle .tab-btn').forEach(b => b.classList.remove('active'));
    if (element) element.classList.add('active');
    renderRecycleOptions();
}

function renderRecycleOptions() {
    const recList = document.getElementById('recycle-options-list');
    if (!recList) return;
    recList.innerHTML = '';
    
    Object.values(gameState.recycles).forEach(rec => {
        const isMatch = (activeRecycleTab === 'coin') ? rec.isCoin : !rec.isCoin;
        if (!isMatch) return;

        recList.innerHTML += `
            <div class="recycle-item">
                <div>
                    <strong id="rec-title-${rec.id}"></strong>
                    <div style="font-size:0.85rem; color:#8d99ae; margin-top:3px;" id="rec-desc-${rec.id}"></div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="rec-toggle-${rec.id}" ${rec.enabled ? 'checked' : ''} onchange="toggleRecycle('${rec.id}', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    });
    updateDynamicValues();
}

function initUI() {
    const hasMapSystem = gameState.unlockedMap2;
    const hasRecycleSystem = gameState.unlockedRecycle;
    const hasPrestigeSystem = gameState.unlockedPrestige;

    const navTabs = document.getElementById('main-nav-tabs');
    if (navTabs) {
        navTabs.style.display = (hasMapSystem || hasRecycleSystem || hasPrestigeSystem) ? 'flex' : 'none';
        document.getElementById('nav-group-maps').style.display = hasMapSystem ? 'flex' : 'none';
        document.getElementById('nav-group-features').style.display = hasRecycleSystem ? 'flex' : 'none';
        document.getElementById('nav-group-prestige').style.display = hasPrestigeSystem ? 'flex' : 'none';
    }

    document.getElementById('nav-map2').style.display = gameState.unlockedMap2 ? 'inline-block' : 'none';
    document.getElementById('nav-map3').style.display = (gameState.unlockedMap3) ? 'inline-block' : 'none';
    document.getElementById('nav-map4').style.display = (gameState.unlockedMap4) ? 'inline-block' : 'none';

    document.getElementById('number-format-toggle').checked = (gameState.numberFormat !== 'scientific');

    const resContainer = document.getElementById('resource-container');
    resContainer.innerHTML = '';
    Object.values(gameState.resources).forEach(res => {
        if (!res.unlocked) return;
        resContainer.innerHTML += `
            <div class="resource-card">
                <div class="resource-label">
                    <img src="${res.icon}" class="res-icon" alt="${res.name}">
                    <h3>${res.name}</h3>
                </div>
                <div class="amount" id="res-val-${res.id}">0</div>
            </div>`;
    });

    ['map1', 'map2', 'map3', 'map4'].forEach(mapKey => {
        const list = document.getElementById(`robot-list-${mapKey}`);
        if (!list) return;
        list.innerHTML = '';
        Object.values(gameState.robots).filter(r => r.map === mapKey).forEach(bot => {
            if (!bot.unlocked) return;
            list.innerHTML += `
                <div class="robot-card">
                    <div class="robot-header">
                        <span class="robot-name">${bot.name}</span>
                        <span class="robot-count" id="bot-count-${bot.id}">0 台</span>
                    </div>
                    <div class="robot-stats">
                        <span id="bot-yield-${bot.id}">單次: 0</span>
                        <span id="bot-interval-${bot.id}">週期: 0s</span>
                        <span id="bot-sps-${bot.id}">秒產: 0/s</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="bot-bar-${bot.id}"></div>
                    </div>
                </div>`;
        });
    });

    const createTabs = (containerId, resKeys, mapId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        resKeys.forEach(k => {
            if (!gameState.resources[k]?.unlocked) return;
            let res = gameState.resources[k];
            let isActive = false;
            if (mapId === 'map1') isActive = (activeTabMap1 === k);
            if (mapId === 'map2') isActive = (activeTabMap2 === k);
            if (mapId === 'map3') isActive = (activeTabMap3 === k);
            if (mapId === 'map4') isActive = (activeTabMap4 === k);

            container.innerHTML += `<button class="tab-btn ${isActive ? 'active' : ''}" onclick="switchCategoryTab('${mapId}', '${k}', this)"><img src="${res.icon}" class="inline-res-icon"> ${res.name}</button>`;
        });
    };

    createTabs('tab-container-map1', ['leaf', 'branch', 'wood'], 'map1');
    createTabs('tab-container-map2', ['pine_leaf', 'pine_branch', 'pine_wood'], 'map2');
    createTabs('tab-container-map3', ['broad_leaf', 'broad_branch', 'broad_wood'], 'map3');
    createTabs('tab-container-map4', ['sakura_leaf', 'sakura_branch', 'sakura_wood'], 'map4');

    renderRecycleOptions();
    switchView(gameState.currentView || 'map1');
}

function switchCategoryTab(map, category, element) {
    if (map === 'map1') activeTabMap1 = category;
    if (map === 'map2') activeTabMap2 = category;
    if (map === 'map3') activeTabMap3 = category;
    if (map === 'map4') activeTabMap4 = category;
    document.querySelectorAll(`#tab-container-${map} .tab-btn`).forEach(b => b.classList.remove('active'));
    if (element) element.classList.add('active');
    renderUpgradeList();
}

function renderUpgradeList() {
    let activeCategory = 'leaf';
    if (gameState.currentView === 'map1') activeCategory = activeTabMap1;
    else if (gameState.currentView === 'map2') activeCategory = activeTabMap2;
    else if (gameState.currentView === 'map3') activeCategory = activeTabMap3;
    else if (gameState.currentView === 'map4') activeCategory = activeTabMap4;
    else if (gameState.currentView === 'recycle') activeCategory = 'recycle';
    else if (gameState.currentView === 'prestige') activeCategory = 'prestige';

    const listContainer = document.getElementById(`upgrade-list-${gameState.currentView}`);
    if (!listContainer) return;
    listContainer.innerHTML = '';

    Object.values(gameState.upgrades).filter(u => u.category === activeCategory).forEach(upg => {
        let isMax = (upg.maxLevel !== null && upg.maxLevel !== Infinity) ? upg.level >= upg.maxLevel : false;
        let cost = getUpgradeCost(upg);
        let costRes = gameState.resources[upg.costResource];
        let levelText = (upg.maxLevel === Infinity) ? `(Lv. ${upg.level})` : `(Lv. ${upg.level} / ${upg.maxLevel})`;
        let costHtml = isMax ? '<span style="color:#8d99ae">已達最大等級</span>' : `消耗: ${formatNumber(cost)} <img src="${costRes.icon}" class="inline-res-icon"> ${costRes.name}`;

        listContainer.innerHTML += `
            <div class="upgrade-item">
                <div class="upgrade-info">
                    <div class="upgrade-title">${upg.name} <span style="color:#57cc99">${levelText}</span></div>
                    <div class="upgrade-desc">${upg.desc}</div>
                    <div class="upgrade-cost">${costHtml}</div>
                </div>
                <button class="buy-btn" id="buy-btn-${upg.id}" onclick="buyUpgrade('${upg.id}')">${isMax ? '滿級' : '升級'}</button>
            </div>`;
    });
}

function toggleRecycle(id, enabled) {
    gameState.recycles[id].enabled = enabled;
}

function buyUpgrade(upgradeId) {
    let upg = gameState.upgrades[upgradeId];
    if (!upg) return;

    let costRes = gameState.resources[upg.costResource];
    let isMax = (upg.maxLevel !== null && upg.maxLevel !== Infinity) ? upg.level >= upg.maxLevel : false;
    if (isMax) return;

    // 確定購買數量
    let amountToBuy = buyMultiplier;
    if (buyMultiplier === -1) {
        amountToBuy = getMaxAffordable(upg, costRes.amount);
    } else {
        if (upg.maxLevel !== Infinity) {
            amountToBuy = Math.min(buyMultiplier, upg.maxLevel - upg.level);
        }
    }

    if (amountToBuy <= 0) return;

    let totalCost = getTotalCost(upg, amountToBuy);

    if (costRes.amount >= totalCost) {
        costRes.amount -= totalCost;
        upg.level += amountToBuy;
        if (upg.onPurchase) upg.onPurchase();
        renderUpgradeList();
        updateDynamicValues();
    }
}

function updateDynamicValues() {
    // 資源更新
    Object.values(gameState.resources).forEach(res => {
        if (!res.unlocked) return;
        const el = document.getElementById(`res-val-${res.id}`);
        if (el) el.innerText = formatNumber(res.amount);
    });

    // 機器人 UI 更新
    Object.values(gameState.robots).forEach(bot => {
        if (!bot.unlocked) return;
        let totalCount = getRobotTotalCount(bot.id);
        let interval = getRobotInterval(bot.id);
        let yieldPerBot = getRobotYield(bot.id);
        const barEl = document.getElementById(`bot-bar-${bot.id}`);
        if (barEl) {
            barEl.style.width = `${Math.min(100, (bot.currentTimer / interval) * 100)}%`;
            document.getElementById(`bot-count-${bot.id}`).innerText = `${totalCount} 台`;
            document.getElementById(`bot-yield-${bot.id}`).innerText = `單次: ${formatNumber(yieldPerBot)}`;
            document.getElementById(`bot-interval-${bot.id}`).innerText = `週期: ${interval.toFixed(2)}s`;
            document.getElementById(`bot-sps-${bot.id}`).innerText = `秒產: ${formatNumber(((yieldPerBot * totalCount) / interval), true)}/s`;
        }
    });

    // 回收廠 UI 更新
    if (gameState.unlockedRecycle) {
        let recInterval = getRecycleInterval();
        const timerEl = document.getElementById('recycle-timer-desc');
        if (timerEl) timerEl.innerText = recInterval.toFixed(2);
        const barEl = document.getElementById('recycle-bar');
        if (barEl) barEl.style.width = `${Math.min(100, (gameState.recycleTimer / recInterval) * 100)}%`;

        let effLv = (gameState.upgrades.recycle_efficiency?.level || 0) + (gameState.upgrades.pres_recycle_efficiency?.level || 0);
        let discountMultiplier = Math.max(0, 1 - (effLv * 0.01));
        let factoryTimes = (gameState.upgrades.recycle_factory?.level || 1);

        Object.values(gameState.recycles).forEach(rec => {
            const titleEl = document.getElementById(`rec-title-${rec.id}`);
            if (!titleEl) return;
            let actualCost = Math.max(1, Math.round(rec.costAmt * discountMultiplier)) * factoryTimes;
            
            let actualGain = 0;
            if (rec.isCoin) {
                let baseLv = gameState.upgrades.recycle_amount?.level || 1;
                let boostLv = gameState.upgrades.recycle_boost?.level || 1;
                let presBoostLv = gameState.upgrades.pres_recycle_boost?.level || 1;
                actualGain = (rec.gainAmt + baseLv - 1) * boostLv * presBoostLv * factoryTimes;
            } else {
                let baseLv = gameState.upgrades.recycle_material_amount?.level || 1;
                let boostLv = gameState.upgrades.recycle_material_boost?.level || 1;
                let presBoostLv = gameState.upgrades.pres_recycle_material_boost?.level || 1;
                actualGain = (rec.gainAmt + baseLv - 1) * boostLv * presBoostLv * factoryTimes;
            }

            let costRes = gameState.resources[rec.costRes];
            titleEl.innerText = `${costRes.name} ➔ ${gameState.resources[rec.gainRes].name}`;
            document.getElementById(`rec-desc-${rec.id}`).innerHTML = `消耗: <b>${formatNumber(actualCost)}</b> <img src="${costRes.icon}" class="inline-res-icon"> | 獲得: <b>${formatNumber(actualGain)}</b> <img src="${gameState.resources[rec.gainRes].icon}" class="inline-res-icon">`;
        });
    }

    // 升級按鈕狀態與文字更新
    let activeCategory = 'leaf';
    if (gameState.currentView === 'map1') activeCategory = activeTabMap1;
    else if (gameState.currentView === 'map2') activeCategory = activeTabMap2;
    else if (gameState.currentView === 'map3') activeCategory = activeTabMap3;
    else if (gameState.currentView === 'map4') activeCategory = activeTabMap4;
    else if (gameState.currentView === 'recycle') activeCategory = 'recycle';
    else if (gameState.currentView === 'prestige') activeCategory = 'prestige';

    Object.values(gameState.upgrades).filter(u => u.category === activeCategory).forEach(upg => {
        const btn = document.getElementById(`buy-btn-${upg.id}`);
        if (btn) {
            let costRes = gameState.resources[upg.costResource];
            let isMax = (upg.maxLevel !== null && upg.maxLevel !== Infinity) ? upg.level >= upg.maxLevel : false;

            if (isMax) {
                btn.innerText = "滿級";
                btn.disabled = true;
            } else {
                let amount = buyMultiplier;
                if (buyMultiplier === -1) amount = getMaxAffordable(upg, costRes.amount);
                if (isNaN(amount) || amount <= 0) amount = 0; 
                
                if (buyMultiplier !== -1 && upg.maxLevel !== Infinity) {
                    amount = Math.min(amount, upg.maxLevel - upg.level);
                }

                let displayAmount = (buyMultiplier === -1) ? amount : buyMultiplier;
                if (upg.maxLevel !== Infinity) displayAmount = Math.min(displayAmount, upg.maxLevel - upg.level);
                
                btn.innerText = buyMultiplier === -1 ? `買最大 (${amount})` : `升級 x${displayAmount}`;
                
                let checkAmount = (buyMultiplier === -1) ? 1 : buyMultiplier; 
                if (upg.maxLevel !== Infinity) checkAmount = Math.min(checkAmount, upg.maxLevel - upg.level);
                let totalCost = getTotalCost(upg, checkAmount);
                btn.disabled = costRes.amount < totalCost || (buyMultiplier === -1 && amount <= 0) || (buyMultiplier !== -1 && checkAmount <= 0);
            }
        }
    });

    if (gameState.unlockedPrestige) {
        const previewEl = document.getElementById('prestige-gain-preview');
        if (previewEl) previewEl.innerText = formatNumber(calculatePrestigeCoinGain());
        const prestigeBtn = document.getElementById('prestige-btn'); 
        if (prestigeBtn) {
            const isPrestigeTechUnlocked = (gameState.upgrades.unlock_prestige?.level || 0) > 0;
            prestigeBtn.disabled = !isPrestigeTechUnlocked;
            prestigeBtn.innerText = isPrestigeTechUnlocked ? '進行初級轉生' : '🔒 未解鎖（需在松木頁籤購買【初級轉生】）';
        }
    }
}

// ==================== 3. 系統功能 ====================

const SAVE_KEY_V2 = 'LEAF_REVOLUTION_IDLE_SAVE_V2';

function executePrestige() {
    if ((gameState.upgrades.unlock_prestige?.level || 0) <= 0) return;
    let gainedCoins = calculatePrestigeCoinGain();
    if (!confirm(`確定要轉生嗎？可獲得 ${formatNumber(gainedCoins)} 個初級轉生硬幣！`)) return;

    const overlay = document.getElementById('prestige-overlay');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';

    setTimeout(() => {
        addResource('prestige_coin', gainedCoins);
        Object.keys(gameState.resources).forEach(k => {
            if (k === 'prestige_coin') return;
            gameState.resources[k].amount = 0;
            gameState.resources[k].lifetimeAmount = 0;
            gameState.resources[k].unlocked = (k === 'leaf');
        });
        Object.keys(gameState.robots).forEach(k => {
            gameState.robots[k].unlocked = (k === 'sweeper');
            gameState.robots[k].baseCount = 0;
            gameState.robots[k].currentTimer = 0;
        });
        Object.keys(gameState.upgrades).forEach(k => {
            if (!k.startsWith('pres_')) {
                // 重置邏輯：產量、數量、回收基礎與倍率回歸 1，其餘回歸 0
                if (k.endsWith('_amount') || k.endsWith('_count') || k === 'recycle_amount' || k === 'recycle_boost' || k === 'recycle_material_amount' || k === 'recycle_material_boost') {
                    gameState.upgrades[k].level = 1;
                } else {
                    gameState.upgrades[k].level = 0;
                }
            } else if (k === 'pres_recycle_efficiency') {
                gameState.upgrades[k].level = 0;
            }
        });
        gameState.unlockedRecycle = false;
        gameState.unlockedMap2 = false;
        gameState.unlockedMap3 = false;
        gameState.unlockedMap4 = false;
        gameState.recycleTimer = 0;
        Object.keys(gameState.recycles).forEach(k => gameState.recycles[k].enabled = false);

        initUI();
        switchView('map1');
        setTimeout(() => { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }, 500);
    }, 1000);
}

function mergeSaveData(saved, template) {
    let merged = JSON.parse(JSON.stringify(template));
    Object.assign(merged, {
        lastSaveTime: saved.lastSaveTime, lastInterestTime: saved.lastInterestTime,
        unlockedRecycle: saved.unlockedRecycle, unlockedMap2: saved.unlockedMap2,
        unlockedMap3: saved.unlockedMap3, unlockedMap4: saved.unlockedMap4,
        unlockedPrestige: saved.unlockedPrestige, currentView: saved.currentView,
        lastMap: saved.lastMap, numberFormat: saved.numberFormat
    });
    if (saved.resources) Object.keys(saved.resources).forEach(k => { if (merged.resources[k]) Object.assign(merged.resources[k], { amount: saved.resources[k].amount || 0, lifetimeAmount: saved.resources[k].lifetimeAmount || 0, unlocked: saved.resources[k].unlocked || false }); });
    if (saved.robots) Object.keys(saved.robots).forEach(k => { if (merged.robots[k]) Object.assign(merged.robots[k], { unlocked: saved.robots[k].unlocked || false, baseCount: saved.robots[k].baseCount ?? 0 }); });
    if (saved.upgrades) Object.keys(saved.upgrades).forEach(k => { if (merged.upgrades[k]) merged.upgrades[k].level = saved.upgrades[k].level ?? 0; });
    if (saved.recycles) Object.keys(saved.recycles).forEach(k => { if (merged.recycles[k]) merged.recycles[k].enabled = saved.recycles[k].enabled ?? false; });
    return merged;
}

function restoreUnlocksFromUpgrades() {
    const u = gameState.upgrades;
    if (u.unlock_branch_robot?.level > 0) { gameState.resources.branch.unlocked = true; gameState.robots.branchCollector.unlocked = true; }
    if (u.unlock_wood_robot?.level > 0) { gameState.resources.wood.unlocked = true; gameState.robots.lumberjack.unlocked = true; }
    if (u.unlock_recycle_branch?.level > 0) { gameState.unlockedRecycle = true; gameState.resources.recycle_coin.unlocked = true; }
    if (u.unlock_pine_robot?.level > 0) { gameState.resources.pine_leaf.unlocked = true; gameState.robots.pineSweeper.unlocked = true; }
    if (u.unlock_map2?.level > 0) gameState.unlockedMap2 = true;
    if (u.unlock_pine_branch_robot?.level > 0) { gameState.resources.pine_branch.unlocked = true; gameState.robots.pineBranchCollector.unlocked = true; }
    if (u.unlock_pine_wood_robot?.level > 0) { gameState.resources.pine_wood.unlocked = true; gameState.robots.pineLumberjack.unlocked = true; }
    if (u.unlock_prestige?.level > 0) { gameState.unlockedPrestige = true; gameState.resources.prestige_coin.unlocked = true; }
    if (u.unlock_broad_robot?.level > 0) { gameState.resources.broad_leaf.unlocked = true; gameState.robots.broadSweeper.unlocked = true; }
    if (u.unlock_broad_branch_robot?.level > 0) { gameState.resources.broad_branch.unlocked = true; gameState.robots.broadBranchCollector.unlocked = true; }
    if (u.unlock_broad_wood_robot?.level > 0) { gameState.resources.broad_wood.unlocked = true; gameState.robots.broadLumberjack.unlocked = true; }
    if (u.unlock_sakura_robot?.level > 0) { gameState.resources.sakura_leaf.unlocked = true; gameState.robots.sakuraSweeper.unlocked = true; }
    if (u.unlock_sakura_branch_robot?.level > 0) { gameState.resources.sakura_branch.unlocked = true; gameState.robots.sakuraBranchCollector.unlocked = true; }
    if (u.unlock_sakura_wood_robot?.level > 0) { gameState.resources.sakura_wood.unlocked = true; gameState.robots.sakuraLumberjack.unlocked = true; }
    if (u.unlock_map3?.level > 0) gameState.unlockedMap3 = true;
    if (u.unlock_map4?.level > 0) gameState.unlockedMap4 = true;
}

function bindHooks() {
    Object.keys(defaultConfig.upgrades).forEach(k => { if (defaultConfig.upgrades[k].onPurchase) gameState.upgrades[k].onPurchase = defaultConfig.upgrades[k].onPurchase; });
}

function saveGame() { gameState.lastSaveTime = Date.now(); localStorage.setItem(SAVE_KEY_V2, JSON.stringify(gameState)); }
function exportSave() { saveGame(); const encoded = btoa(encodeURIComponent(JSON.stringify(gameState))); navigator.clipboard.writeText(encoded).then(() => alert('存檔代碼已複製！')); }
function importSave() { const code = prompt('貼上存檔代碼：'); if (!code) return; try { const parsed = JSON.parse(decodeURIComponent(atob(code.trim()))); if (parsed) { gameState = mergeSaveData(parsed, defaultConfig); bindHooks(); restoreUnlocksFromUpgrades(); saveGame(); initUI(); alert('匯入成功！'); } } catch (e) { alert('無效代碼！'); } }
function loadGame() { let saved = localStorage.getItem(SAVE_KEY_V2); if (saved) { try { gameState = mergeSaveData(JSON.parse(saved), defaultConfig); bindHooks(); restoreUnlocksFromUpgrades(); let offline = (Date.now() - (gameState.lastSaveTime || Date.now())) / 1000; if (offline > 3) processTick(Math.min(offline, getMaxOfflineTime())); } catch (e) { gameState = JSON.parse(JSON.stringify(defaultConfig)); bindHooks(); } } }
function resetGame() { if (confirm('確定要重置嗎？')) { localStorage.removeItem(SAVE_KEY_V2); location.reload(); } }

setInterval(saveGame, 5000);
loadGame();
initUI();
requestAnimationFrame(gameLoop);
