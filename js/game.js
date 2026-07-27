let gameState = JSON.parse(JSON.stringify(defaultConfig));
let activeTabMap1 = 'leaf';
let activeTabMap2 = 'pine_leaf';
let activeTabMap3 = 'broad_leaf';
let activeTabMap4 = 'sakura_leaf';

// ==================== 0. 數字格式化與進位引擎 ====================

function formatNumber(num, keepDecimalsForSmall = false) {
    if (num === undefined || isNaN(num)) return '0';
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
        let formatted = parseFloat(scaled.toFixed(2));
        return formatted + suffix;
    } else {
        let exp = Math.floor(Math.log10(num));
        let base = num / Math.pow(10, exp);
        let formattedBase = parseFloat(base.toFixed(2));
        return `${formattedBase}e${exp}`;
    }
}

function getSuffix(index) {
    const baseSuffixes = ['', 'K', 'M', 'B', 'T'];
    if (index < baseSuffixes.length) return baseSuffixes[index];
    let adjIndex = index - baseSuffixes.length;
    
    // 如果大於 aa-zz (10^2040) 的極限值，則直接回退科學記號
    if (adjIndex >= 676) return 'e' + (index * 3);

    let firstChar = String.fromCharCode(97 + Math.floor(adjIndex / 26)); // 97 代表小寫 'a'
    let secondChar = String.fromCharCode(97 + (adjIndex % 26));
    return firstChar + secondChar;
}

function toggleNumberFormat(isChecked) {
    gameState.numberFormat = isChecked ? 'abbreviation' : 'scientific';
    saveGame();
    updateDynamicValues();
}

// ==================== 1. 核心邏輯 ====================

function addResource(resId, amount) {
    if (!gameState.resources[resId] || amount <= 0) return;
    gameState.resources[resId].amount += amount;
    if (gameState.resources[resId].lifetimeAmount !== undefined) {
        gameState.resources[resId].lifetimeAmount += amount;
    }
}

function getMaxOfflineTime() {
    let baseTime = gameState.baseMaxOfflineSeconds || 86400;
    return baseTime;
}

function getUpgradeCost(upg) {
    return Math.floor(upg.baseCost * Math.pow(upg.multiplier, upg.level));
}

function getRobotYield(robotId) {
    let yieldAmount = 1;
    let upgKey = '';
    let presUpgKey = '';

    // Map 1
    if (robotId === 'sweeper') { upgKey = 'leaf_amount'; presUpgKey = 'pres_leaf_boost'; }
    if (robotId === 'branchCollector') { upgKey = 'branch_amount'; presUpgKey = 'pres_branch_boost'; }
    if (robotId === 'lumberjack') { upgKey = 'wood_amount'; presUpgKey = 'pres_wood_boost'; }
    // Map 2
    if (robotId === 'pineSweeper') { upgKey = 'pine_leaf_amount'; presUpgKey = 'pres_pine_leaf_boost'; }
    if (robotId === 'pineBranchCollector') { upgKey = 'pine_branch_amount'; presUpgKey = 'pres_pine_branch_boost'; }
    if (robotId === 'pineLumberjack') { upgKey = 'pine_wood_amount'; presUpgKey = 'pres_pine_wood_boost'; }
    // Map 3
    if (robotId === 'broadSweeper') { upgKey = 'broad_leaf_amount'; presUpgKey = 'pres_broad_leaf_boost'; }
    if (robotId === 'broadBranchCollector') { upgKey = 'broad_branch_amount'; presUpgKey = 'pres_broad_branch_boost'; }
    if (robotId === 'broadLumberjack') { upgKey = 'broad_wood_amount'; presUpgKey = 'pres_broad_wood_boost'; }
    // Map 4
    if (robotId === 'sakuraSweeper') { upgKey = 'sakura_leaf_amount'; presUpgKey = 'pres_sakura_leaf_boost'; }
    if (robotId === 'sakuraBranchCollector') { upgKey = 'sakura_branch_amount'; presUpgKey = 'pres_sakura_branch_boost'; }
    if (robotId === 'sakuraLumberjack') { upgKey = 'sakura_wood_amount'; presUpgKey = 'pres_sakura_wood_boost'; }

    if (upgKey) {
        let level = gameState.upgrades[upgKey]?.level || 0;
        if (level >= 500) {
            yieldAmount = 700;
        } else {
            yieldAmount += level;
        }
    }

    if (presUpgKey) {
        let presLevel = gameState.upgrades[presUpgKey]?.level || 1;
        yieldAmount *= presLevel;
    }

    return yieldAmount;
}

function getRobotInterval(robotId) {
    let base = gameState.robots[robotId].baseInterval;
    let speedLevel = 0;
    // Map 1
    if (robotId === 'sweeper') speedLevel = gameState.upgrades.leaf_speed?.level || 0;
    if (robotId === 'branchCollector') speedLevel = gameState.upgrades.branch_speed?.level || 0;
    if (robotId === 'lumberjack') speedLevel = gameState.upgrades.wood_speed?.level || 0;
    // Map 2
    if (robotId === 'pineSweeper') speedLevel = gameState.upgrades.pine_leaf_speed?.level || 0;
    if (robotId === 'pineBranchCollector') speedLevel = gameState.upgrades.pine_branch_speed?.level || 0;
    if (robotId === 'pineLumberjack') speedLevel = gameState.upgrades.pine_wood_speed?.level || 0;
    // Map 3
    if (robotId === 'broadSweeper') speedLevel = gameState.upgrades.broad_leaf_speed?.level || 0;
    if (robotId === 'broadBranchCollector') speedLevel = gameState.upgrades.broad_branch_speed?.level || 0;
    if (robotId === 'broadLumberjack') speedLevel = gameState.upgrades.broad_wood_speed?.level || 0;
    // Map 4
    if (robotId === 'sakuraSweeper') speedLevel = gameState.upgrades.sakura_leaf_speed?.level || 0;
    if (robotId === 'sakuraBranchCollector') speedLevel = gameState.upgrades.sakura_branch_speed?.level || 0;
    if (robotId === 'sakuraLumberjack') speedLevel = gameState.upgrades.sakura_wood_speed?.level || 0;

    return Math.max(0.1, base - (speedLevel * 0.01));
}

function getRobotTotalCount(robotId) {
    let count = gameState.robots[robotId].baseCount || 0;
    // Map 1
    if (robotId === 'sweeper') count += (gameState.upgrades.leaf_count?.level || 0);
    if (robotId === 'branchCollector') count += (gameState.upgrades.branch_count?.level || 0);
    if (robotId === 'lumberjack') count += (gameState.upgrades.wood_count?.level || 0);
    // Map 2
    if (robotId === 'pineSweeper') count += (gameState.upgrades.pine_leaf_count?.level || 0);
    if (robotId === 'pineBranchCollector') count += (gameState.upgrades.pine_branch_count?.level || 0);
    if (robotId === 'pineLumberjack') count += (gameState.upgrades.pine_wood_count?.level || 0);
    // Map 3
    if (robotId === 'broadSweeper') count += (gameState.upgrades.broad_leaf_count?.level || 0);
    if (robotId === 'broadBranchCollector') count += (gameState.upgrades.broad_branch_count?.level || 0);
    if (robotId === 'broadLumberjack') count += (gameState.upgrades.broad_wood_count?.level || 0);
    // Map 4
    if (robotId === 'sakuraSweeper') count += (gameState.upgrades.sakura_leaf_count?.level || 0);
    if (robotId === 'sakuraBranchCollector') count += (gameState.upgrades.sakura_branch_count?.level || 0);
    if (robotId === 'sakuraLumberjack') count += (gameState.upgrades.sakura_wood_count?.level || 0);
    return count;
}

function getRecycleInterval() {
    let base = 10.0;
    let speedLv = gameState.upgrades.recycle_speed?.level || 0;
    return Math.max(0.5, base - (speedLv * 0.02));
}

function calculatePrestigeCoinGain() {
    let r = gameState.resources;
    let rawCoins = (r.leaf.lifetimeAmount || 0) * 0.000001
                 + (r.branch.lifetimeAmount || 0) * 0.000005
                 + (r.wood.lifetimeAmount || 0) * 0.00001
                 + (r.pine_leaf.lifetimeAmount || 0) * 0.000002
                 + (r.pine_branch.lifetimeAmount || 0) * 0.00001
                 + (r.pine_wood.lifetimeAmount || 0) * 0.00002
                 // 已補齊以下六行：新增闊木林與櫻花林所有素材至轉生幣獲取公式中
                 + (r.broad_leaf.lifetimeAmount || 0) * 0.000004 // 闊葉
                 + (r.broad_branch.lifetimeAmount || 0) * 0.00002 // 闊枝
                 + (r.broad_wood.lifetimeAmount || 0) * 0.00004 // 闊木
                 + (r.sakura_leaf.lifetimeAmount || 0) * 0.000008 // 櫻花
                 + (r.sakura_branch.lifetimeAmount || 0) * 0.00004 // 櫻枝
                 + (r.sakura_wood.lifetimeAmount || 0) * 0.00008 // 櫻木
                 + (r.recycle_coin.lifetimeAmount || 0) * 0.0015;

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
    Object.values(gameState.robots).forEach(bot => {
        if (!bot.unlocked) return;

        let isMapUnlocked = (bot.map === 'map1') 
            || (bot.map === 'map2' && gameState.unlockedMap2)
            || (bot.map === 'map3' && gameState.unlockedMap2 && gameState.unlockedMap3)
            || (bot.map === 'map4' && gameState.unlockedMap2 && gameState.unlockedMap4);
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

    if (gameState.unlockedRecycle) {
        let recInterval = getRecycleInterval();
        gameState.recycleTimer = (gameState.recycleTimer || 0) + deltaTime;

        if (gameState.recycleTimer >= recInterval) {
            let cycles = Math.floor(gameState.recycleTimer / recInterval);
            gameState.recycleTimer %= recInterval;
            let factoryTimes = 1 + (gameState.upgrades.recycle_factory?.level || 0);

            for (let i = 0; i < cycles * factoryTimes; i++) {
                runRecycleCycle();
            }
        }
    }
}

function runRecycleCycle() {
    let effLv = (gameState.upgrades.recycle_efficiency?.level || 0) + (gameState.upgrades.pres_recycle_efficiency?.level || 0);
    let discountMultiplier = Math.max(0, 1 - (effLv * 0.01));
    let coinMultiplier = gameState.upgrades.recycle_amount?.level || 1;
    let presRecycleBoost = gameState.upgrades.pres_recycle_boost?.level || 1;

    Object.values(gameState.recycles).forEach(rec => {
        if (!rec.enabled) return;
        if (!gameState.resources[rec.gainRes]?.unlocked) return;

        let actualCost = Math.max(1, Math.round(rec.costAmt * discountMultiplier));

        if (gameState.resources[rec.costRes] && gameState.resources[rec.costRes].amount >= actualCost) {
            gameState.resources[rec.costRes].amount -= actualCost;
            let gain = rec.isCoin ? (rec.gainAmt * coinMultiplier) : (rec.gainAmt * presRecycleBoost);
            addResource(rec.gainRes, gain);
        }
    });
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

function executePrestige() {
	if (!gameState.resources.pine_wood?.unlocked) {
        return;
    }
    let gainedCoins = calculatePrestigeCoinGain();
    if (gainedCoins <= 0) {
        if (!confirm('你目前轉生無法獲得任何初級硬幣，確定要轉生嗎？')) return;
    } else {
        if (!confirm(`確定要進行初級轉生嗎？你將獲得 ${formatNumber(gainedCoins)} 個初級轉生硬幣！`)) return;
    }

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
            gameState.robots[k].baseCount = (k === 'sweeper') ? 1 : 0;
            gameState.robots[k].currentTimer = 0;
        });

		Object.keys(gameState.upgrades).forEach(k => {
            if (k.startsWith('pres_')) {
                if (k === 'pres_coin_boost') {
                    // 第 9 項：不重置
                } else if (k === 'pres_recycle_efficiency') {
                    gameState.upgrades[k].level = 0;
                } else {
                    gameState.upgrades[k].level = 1;
                }
            } else {
                // 非 pres_ 開頭的普通科技與地圖解鎖 (unlock_map3, unlock_map4 均會被歸零，每次需要重新買門檻)
                gameState.upgrades[k].level = (k === 'recycle_amount') ? 1 : 0;
            }
        });

        gameState.unlockedRecycle = false;
        gameState.unlockedMap2 = false;
        gameState.unlockedMap3 = false; // 重置
        gameState.unlockedMap4 = false; // 重置
        gameState.recycleTimer = 0;
        Object.keys(gameState.recycles).forEach(k => {
            gameState.recycles[k].enabled = false;
        });

        initUI();
        switchView('map1');

        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }, 500);
    }, 1000);
}

// ==================== 2. 介面與頁面切換 ====================

function toggleRecycleView() {
    if (!gameState.unlockedRecycle) return;

    if (gameState.currentView === 'recycle') {
        switchView(gameState.lastMap || 'map1');
    } else {
        switchView('recycle');
    }
}

function togglePrestigeView() {
    if (!gameState.unlockedPrestige) {
        if (typeof showToast === 'function') {
            showToast('轉生系統尚未解鎖！');
        }
        return;
    }

    if (gameState.currentView === 'prestige') {
        switchView(gameState.lastMap || 'map1');
    } else {
        switchView('prestige');
    }
}

function switchView(viewId) {
    if (viewId === 'map2' && !gameState.unlockedMap2) return;
    if (viewId === 'map3' && (!gameState.unlockedMap2 || !gameState.unlockedMap3)) return;
    if (viewId === 'map4' && (!gameState.unlockedMap2 || !gameState.unlockedMap4)) return;
    if (viewId === 'recycle' && !gameState.unlockedRecycle) return;
    if (viewId === 'prestige' && !gameState.unlockedPrestige) return;

    if (viewId === 'map1' || viewId === 'map2' || viewId === 'map3' || viewId === 'map4') {
        gameState.lastMap = viewId;
    }

    gameState.currentView = viewId;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));

    const btnEl = document.getElementById(`nav-${viewId}`);
    if (btnEl) btnEl.classList.add('active');

    const pageEl = document.getElementById(`page-${viewId}`);
    if (pageEl) pageEl.classList.add('active');

    renderUpgradeList();
}

function initUI() {
    const hasMapSystem = gameState.unlockedMap2;
    const hasRecycleSystem = gameState.unlockedRecycle;
    const hasPrestigeSystem = gameState.unlockedPrestige;

    const navTabs = document.getElementById('main-nav-tabs');
    const navMapsGroup = document.getElementById('nav-group-maps');
    const navDivider1 = document.getElementById('nav-divider-1');
    const navFeaturesGroup = document.getElementById('nav-group-features');
    const navDivider2 = document.getElementById('nav-divider-2');
    const navPrestigeGroup = document.getElementById('nav-group-prestige');

    if (hasMapSystem || hasRecycleSystem || hasPrestigeSystem) {
        navTabs.style.display = 'flex';
        navMapsGroup.style.display = hasMapSystem ? 'flex' : 'none';
        navFeaturesGroup.style.display = hasRecycleSystem ? 'flex' : 'none';
        navPrestigeGroup.style.display = hasPrestigeSystem ? 'flex' : 'none';
        navDivider1.style.display = (hasMapSystem && hasRecycleSystem) ? 'block' : 'none';
        navDivider2.style.display = ((hasMapSystem || hasRecycleSystem) && hasPrestigeSystem) ? 'block' : 'none';
    } else {
        navTabs.style.display = 'none';
    }

    // 控制頂部選單按鈕的顯隱 (地圖 3 與地圖 4 需同時滿足解鎖了 Map 2 才能顯示)
    const navMap2Btn = document.getElementById('nav-map2');
    if (navMap2Btn) navMap2Btn.style.display = gameState.unlockedMap2 ? 'inline-block' : 'none';
    const navMap3Btn = document.getElementById('nav-map3');
    if (navMap3Btn) navMap3Btn.style.display = (gameState.unlockedMap2 && gameState.unlockedMap3) ? 'inline-block' : 'none';
    const navMap4Btn = document.getElementById('nav-map4');
    if (navMap4Btn) navMap4Btn.style.display = (gameState.unlockedMap2 && gameState.unlockedMap4) ? 'inline-block' : 'none';

    // 初始化格式切換器開關狀態
    const toggleEl = document.getElementById('number-format-toggle');
    if (toggleEl) {
        toggleEl.checked = (gameState.numberFormat !== 'scientific');
    }

    const resContainer = document.getElementById('resource-container');
    resContainer.innerHTML = '';
    Object.values(gameState.resources).forEach(res => {
        if (!res.unlocked) return;
        resContainer.innerHTML += `
            <div class="resource-card">
                <h3>${res.name}</h3>
                <div class="amount" id="res-val-${res.id}">0</div>
            </div>
        `;
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
                </div>
            `;
        });
    });

    const tab1 = document.getElementById('tab-container-map1');
    if (tab1) {
        tab1.innerHTML = '';
        ['leaf', 'branch', 'wood'].forEach(resKey => {
            if (!gameState.resources[resKey]?.unlocked) return;
            tab1.innerHTML += `<button class="tab-btn ${activeTabMap1 === resKey ? 'active' : ''}" onclick="switchCategoryTab('map1', '${resKey}', this)">${gameState.resources[resKey].name}</button>`;
        });
    }

    const tab2 = document.getElementById('tab-container-map2');
    if (tab2) {
        tab2.innerHTML = '';
        ['pine_leaf', 'pine_branch', 'pine_wood'].forEach(resKey => {
            if (!gameState.resources[resKey]?.unlocked) return;
            tab2.innerHTML += `<button class="tab-btn ${activeTabMap2 === resKey ? 'active' : ''}" onclick="switchCategoryTab('map2', '${resKey}', this)">${gameState.resources[resKey].name}</button>`;
        });
    }

    const tab3 = document.getElementById('tab-container-map3');
    if (tab3) {
        tab3.innerHTML = '';
        ['broad_leaf', 'broad_branch', 'broad_wood'].forEach(resKey => {
            if (!gameState.resources[resKey]?.unlocked) return;
            tab3.innerHTML += `<button class="tab-btn ${activeTabMap3 === resKey ? 'active' : ''}" onclick="switchCategoryTab('map3', '${resKey}', this)">${gameState.resources[resKey].name}</button>`;
        });
    }

    const tab4 = document.getElementById('tab-container-map4');
    if (tab4) {
        tab4.innerHTML = '';
        ['sakura_leaf', 'sakura_branch', 'sakura_wood'].forEach(resKey => {
            if (!gameState.resources[resKey]?.unlocked) return;
            tab4.innerHTML += `<button class="tab-btn ${activeTabMap4 === resKey ? 'active' : ''}" onclick="switchCategoryTab('map4', '${resKey}', this)">${gameState.resources[resKey].name}</button>`;
        });
    }

    const recList = document.getElementById('recycle-options-list');
    recList.innerHTML = '';
    Object.values(gameState.recycles).forEach(rec => {
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

    switchView(gameState.currentView || 'map1');
}

function switchCategoryTab(map, category, element) {
    if (map === 'map1') activeTabMap1 = category;
    if (map === 'map2') activeTabMap2 = category;
    if (map === 'map3') activeTabMap3 = category;
    if (map === 'map4') activeTabMap4 = category;
    
    document.querySelectorAll(`#tab-container-${map} .tab-btn`).forEach(b => b.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else if (event) {
        event.target.classList.add('active');
    }

    renderUpgradeList();
}

function renderUpgradeList() {
    let activeCategory = 'leaf';
    if (gameState.currentView === 'map1') activeCategory = activeTabMap1;
    else if (gameState.currentView === 'map2') activeCategory = activeTabMap2;
    else if (gameState.currentView === 'map3') activeCategory = activeTabMap3;
    else if (gameState.currentView === 'map4') activeCategory = activeTabMap4;
    if (gameState.currentView === 'recycle') activeCategory = 'recycle';
    if (gameState.currentView === 'prestige') activeCategory = 'prestige';

    const targetContainerId = `upgrade-list-${gameState.currentView}`;
    
    const listContainer = document.getElementById(targetContainerId);
    if (!listContainer) return;

    listContainer.innerHTML = '';

    const categoryUpgrades = Object.values(gameState.upgrades).filter(u => u.category === activeCategory);

    categoryUpgrades.forEach(upg => {
        let isMax = (upg.maxLevel !== null && upg.maxLevel !== undefined && upg.maxLevel !== Infinity) 
            ? upg.level >= upg.maxLevel 
            : false;
        let cost = getUpgradeCost(upg);
        let costRes = gameState.resources[upg.costResource];
        let levelText = (upg.maxLevel === Infinity) ? `(Lv. ${upg.level})` : `(Lv. ${upg.level} / ${upg.maxLevel})`;

        listContainer.innerHTML += `
            <div class="upgrade-item">
                <div class="upgrade-info">
                    <div class="upgrade-title">${upg.name} <span style="color:#57cc99">${levelText}</span></div>
                    <div class="upgrade-desc">${upg.desc}</div>
                    <div class="upgrade-cost">
                        ${isMax ? '<span style="color:#8d99ae">已達最大等級</span>' : `消耗: ${formatNumber(cost)} ${costRes.name}`}
                    </div>
                </div>
                <button class="buy-btn" id="buy-btn-${upg.id}" onclick="buyUpgrade('${upg.id}')">
                    ${isMax ? '滿級' : '升級'}
                </button>
            </div>
        `;
    });
}

function toggleRecycle(id, enabled) {
    gameState.recycles[id].enabled = enabled;
}

function buyUpgrade(upgradeId) {
    let upg = gameState.upgrades[upgradeId];
    if (!upg || upg.level >= upg.maxLevel) return;

    let cost = getUpgradeCost(upg);
    let costRes = gameState.resources[upg.costResource];

    if (costRes && costRes.amount >= cost) {
        costRes.amount -= cost;
        upg.level += 1;
        if (upg.onPurchase) upg.onPurchase();
        renderUpgradeList();
    }
}

function updateDynamicValues() {
    Object.values(gameState.resources).forEach(res => {
        if (!res.unlocked) return;
        const el = document.getElementById(`res-val-${res.id}`);
        if (el) el.innerText = formatNumber(res.amount);
    });

    Object.values(gameState.robots).forEach(bot => {
        if (!bot.unlocked) return;
        let totalCount = getRobotTotalCount(bot.id);
        let interval = getRobotInterval(bot.id);
        let yieldPerBot = getRobotYield(bot.id);
        
        let progress = Math.min(100, (bot.currentTimer / interval) * 100);

        const countEl = document.getElementById(`bot-count-${bot.id}`);
        const yieldEl = document.getElementById(`bot-yield-${bot.id}`);
        const intervalEl = document.getElementById(`bot-interval-${bot.id}`);
        const spsEl = document.getElementById(`bot-sps-${bot.id}`);
        const barEl = document.getElementById(`bot-bar-${bot.id}`);

        if (countEl) countEl.innerText = `${totalCount} 台`;
        if (yieldEl) yieldEl.innerText = `單次: ${formatNumber(yieldPerBot)}`;
        if (intervalEl) intervalEl.innerText = `週期: ${interval.toFixed(2)}s`;
        if (spsEl) spsEl.innerText = `秒產: ${formatNumber(((yieldPerBot * totalCount) / interval), true)}/s`;
        if (barEl) barEl.style.width = `${progress}%`;
    });

    let activeCategory = 'leaf';
    if (gameState.currentView === 'map1') activeCategory = activeTabMap1;
    else if (gameState.currentView === 'map2') activeCategory = activeTabMap2;
    else if (gameState.currentView === 'map3') activeCategory = activeTabMap3;
    else if (gameState.currentView === 'map4') activeCategory = activeTabMap4;
    if (gameState.currentView === 'recycle') activeCategory = 'recycle';
    if (gameState.currentView === 'prestige') activeCategory = 'prestige';

    Object.values(gameState.upgrades).filter(u => u.category === activeCategory).forEach(upg => {
        let isMax = (upg.maxLevel !== null && upg.maxLevel !== undefined && upg.maxLevel !== Infinity) 
            ? upg.level >= upg.maxLevel 
            : false;
        let cost = getUpgradeCost(upg);
        let canAfford = gameState.resources[upg.costResource] && (gameState.resources[upg.costResource].amount >= cost) && !isMax;
        const btn = document.getElementById(`buy-btn-${upg.id}`);
        if (btn) btn.disabled = !canAfford || isMax;
    });

	if (gameState.unlockedRecycle) {
        let recInterval = getRecycleInterval();
        let effLv = (gameState.upgrades.recycle_efficiency?.level || 0) + (gameState.upgrades.pres_recycle_efficiency?.level || 0);
        let discountMultiplier = Math.max(0, 1 - (effLv * 0.01));
        let coinMultiplier = gameState.upgrades.recycle_amount?.level || 1;
        let presRecycleBoost = gameState.upgrades.pres_recycle_boost?.level || 1;

        const timerEl = document.getElementById('recycle-timer-desc');
        const barEl = document.getElementById('recycle-bar');

        if (timerEl) timerEl.innerText = recInterval.toFixed(2);
        if (barEl) barEl.style.width = `${Math.min(100, ((gameState.recycleTimer || 0) / recInterval) * 100)}%`;

        Object.values(gameState.recycles).forEach(rec => {
            let actualCost = Math.max(1, Math.round(rec.costAmt * discountMultiplier));
            let actualGain = rec.isCoin ? (rec.gainAmt * coinMultiplier) : (rec.gainAmt * presRecycleBoost);

            let costResName = gameState.resources[rec.costRes]?.name || '';
            let gainResName = gameState.resources[rec.gainRes]?.name || '';

            const titleEl = document.getElementById(`rec-title-${rec.id}`);
            const descEl = document.getElementById(`rec-desc-${rec.id}`);

            if (titleEl) {
                titleEl.innerText = `${costResName} ➔ ${gainResName}`;
            }

            if (descEl) {
                let costBonusText = effLv > 0 ? `<span style="color:#80ed99;">(省 ${effLv}%)</span>` : '';
                let gainBonusText = (rec.isCoin && coinMultiplier > 1) ? `<span style="color:#ffd166;">(${coinMultiplier}倍加成)</span>` : '';
                if (!rec.isCoin && presRecycleBoost > 1) gainBonusText = `<span style="color:#e0aaff;">(${presRecycleBoost}倍轉生加成)</span>`;

                descEl.innerHTML = `單次消耗: <b>${formatNumber(actualCost)}</b> ${costResName} ${costBonusText} | 單次獲得: <b>${formatNumber(actualGain)}</b> ${gainResName} ${gainBonusText}`;
            }
        });
    }

	if (gameState.unlockedPrestige) {
        const previewEl = document.getElementById('prestige-gain-preview');
        if (previewEl) previewEl.innerText = formatNumber(calculatePrestigeCoinGain());

        const prestigeBtn = document.getElementById('prestige-btn'); 
        if (prestigeBtn) {
            const isPineUnlocked = gameState.resources.pine_wood?.unlocked || false;
            if (isPineUnlocked) {
                prestigeBtn.disabled = false;
                prestigeBtn.innerText = '進行初級轉生';
            } else {
                prestigeBtn.disabled = true;
                prestigeBtn.innerText = '🔒 未解鎖（需解鎖松木）';
            }
        }
    }
}

// ==================== 3. 存檔與初始化 ====================

const SAVE_KEY_V2 = 'LEAF_REVOLUTION_IDLE_SAVE_V2';
const SAVE_KEY_V1 = 'LEAF_REVOLUTION_IDLE_SAVE';

function mergeSaveData(saved, template) {
    let merged = JSON.parse(JSON.stringify(template));
    
    if (saved.lastSaveTime) merged.lastSaveTime = saved.lastSaveTime;
    if (saved.lastInterestTime) merged.lastInterestTime = saved.lastInterestTime;
    if (saved.unlockedRecycle !== undefined) merged.unlockedRecycle = saved.unlockedRecycle;
    if (saved.unlockedMap2 !== undefined) merged.unlockedMap2 = saved.unlockedMap2;
    if (saved.unlockedMap3 !== undefined) merged.unlockedMap3 = saved.unlockedMap3; // 新增
    if (saved.unlockedMap4 !== undefined) merged.unlockedMap4 = saved.unlockedMap4; // 新增
    if (saved.unlockedPrestige !== undefined) merged.unlockedPrestige = saved.unlockedPrestige;
    if (saved.currentView) merged.currentView = saved.currentView;
    if (saved.lastMap) merged.lastMap = saved.lastMap;
    if (saved.baseMaxOfflineSeconds !== undefined) merged.baseMaxOfflineSeconds = saved.baseMaxOfflineSeconds;
    if (saved.numberFormat !== undefined) merged.numberFormat = saved.numberFormat;
	
    if (saved.resources) {
        Object.keys(saved.resources).forEach(k => {
            if (merged.resources[k]) {
                merged.resources[k].amount = saved.resources[k].amount || 0;
                merged.resources[k].lifetimeAmount = saved.resources[k].lifetimeAmount || 0;
                merged.resources[k].unlocked = saved.resources[k].unlocked || false;
            }
        });
    }

    if (saved.robots) {
        Object.keys(saved.robots).forEach(k => {
            if (merged.robots[k]) {
                merged.robots[k].unlocked = saved.robots[k].unlocked || false;
                if (saved.robots[k].baseCount !== undefined) merged.robots[k].baseCount = saved.robots[k].baseCount;
            }
        });
    }

    if (saved.upgrades) {
        Object.keys(saved.upgrades).forEach(k => {
            if (merged.upgrades[k]) {
                if (saved.upgrades[k].level !== undefined) {
                    merged.upgrades[k].level = saved.upgrades[k].level;
                }
            }    
        });
    }

    if (saved.recycles) {
        Object.keys(saved.recycles).forEach(k => {
            if (merged.recycles[k] && saved.recycles[k].enabled !== undefined) {
                merged.recycles[k].enabled = saved.recycles[k].enabled;
            }
        });
    }

    return merged;
}

function restoreUnlocksFromUpgrades() {
    if (gameState.upgrades.unlock_branch_robot?.level > 0) {
        gameState.resources.branch.unlocked = true;
        gameState.robots.branchCollector.unlocked = true;
        if (gameState.robots.branchCollector.baseCount === 0) gameState.robots.branchCollector.baseCount = 1;
    }
    if (gameState.upgrades.unlock_wood_robot?.level > 0) {
        gameState.resources.wood.unlocked = true;
        gameState.robots.lumberjack.unlocked = true;
        if (gameState.robots.lumberjack.baseCount === 0) gameState.robots.lumberjack.baseCount = 1;
    }
    if (gameState.upgrades.unlock_recycle_branch?.level > 0) {
        gameState.unlockedRecycle = true;
        gameState.resources.recycle_coin.unlocked = true;
    }
    if (gameState.upgrades.unlock_pine_robot?.level > 0) {
        gameState.resources.pine_leaf.unlocked = true;
        gameState.robots.pineSweeper.unlocked = true;
        if (gameState.robots.pineSweeper.baseCount === 0) gameState.robots.pineSweeper.baseCount = 1;
    }
    if (gameState.upgrades.unlock_map2?.level > 0) {
        gameState.unlockedMap2 = true;
    }
    if (gameState.upgrades.unlock_pine_branch_robot?.level > 0) {
        gameState.resources.pine_branch.unlocked = true;
        gameState.robots.pineBranchCollector.unlocked = true;
        if (gameState.robots.pineBranchCollector.baseCount === 0) gameState.robots.pineBranchCollector.baseCount = 1;
    }
    if (gameState.upgrades.unlock_pine_wood_robot?.level > 0) {
        gameState.resources.pine_wood.unlocked = true;
        gameState.robots.pineLumberjack.unlocked = true;
        if (gameState.robots.pineLumberjack.baseCount === 0) gameState.robots.pineLumberjack.baseCount = 1;
    }
    if (gameState.upgrades.unlock_prestige?.level > 0) {
        gameState.unlockedPrestige = true;
        gameState.resources.prestige_coin.unlocked = true;
    }
    // Map 3 解鎖還原
    if (gameState.upgrades.unlock_broad_robot?.level > 0) {
        gameState.resources.broad_leaf.unlocked = true;
        gameState.robots.broadSweeper.unlocked = true;
        if (gameState.robots.broadSweeper.baseCount === 0) gameState.robots.broadSweeper.baseCount = 1;
    }
    if (gameState.upgrades.unlock_broad_branch_robot?.level > 0) {
        gameState.resources.broad_branch.unlocked = true;
        gameState.robots.broadBranchCollector.unlocked = true;
        if (gameState.robots.broadBranchCollector.baseCount === 0) gameState.robots.broadBranchCollector.baseCount = 1;
    }
    if (gameState.upgrades.unlock_broad_wood_robot?.level > 0) {
        gameState.resources.broad_wood.unlocked = true;
        gameState.robots.broadLumberjack.unlocked = true;
        if (gameState.robots.broadLumberjack.baseCount === 0) gameState.robots.broadLumberjack.baseCount = 1;
    }
    // Map 4 解鎖還原
    if (gameState.upgrades.unlock_sakura_robot?.level > 0) {
        gameState.resources.sakura_leaf.unlocked = true;
        gameState.robots.sakuraSweeper.unlocked = true;
        if (gameState.robots.sakuraSweeper.baseCount === 0) gameState.robots.sakuraSweeper.baseCount = 1;
    }
    if (gameState.upgrades.unlock_sakura_branch_robot?.level > 0) {
        gameState.resources.sakura_branch.unlocked = true;
        gameState.robots.sakuraBranchCollector.unlocked = true;
        if (gameState.robots.sakuraBranchCollector.baseCount === 0) gameState.robots.sakuraBranchCollector.baseCount = 1;
    }
    if (gameState.upgrades.unlock_sakura_wood_robot?.level > 0) {
        gameState.resources.sakura_wood.unlocked = true;
        gameState.robots.sakuraLumberjack.unlocked = true;
        if (gameState.robots.sakuraLumberjack.baseCount === 0) gameState.robots.sakuraLumberjack.baseCount = 1;
    }
    // 地圖天賦解鎖還原
    if (gameState.upgrades.unlock_map3?.level > 0) {
        gameState.unlockedMap3 = true;
    }
    if (gameState.upgrades.unlock_map4?.level > 0) {
        gameState.unlockedMap4 = true;
    }
}

function bindHooks() {
    Object.keys(defaultConfig.upgrades).forEach(key => {
        if (defaultConfig.upgrades[key].onPurchase) {
            gameState.upgrades[key].onPurchase = defaultConfig.upgrades[key].onPurchase;
        }
    });
}

function saveGame() {
    gameState.lastSaveTime = Date.now();
    localStorage.setItem(SAVE_KEY_V2, JSON.stringify(gameState));
}

function exportSave() {
    saveGame();
    const encodedData = btoa(encodeURIComponent(JSON.stringify(gameState)));
    navigator.clipboard.writeText(encodedData).then(() => {
        alert('存檔代碼已成功複製到剪貼簿！');
    }).catch(() => {
        prompt('請手動複製存檔代碼：', encodedData);
    });
}

function importSave() {
    const inputCode = prompt('請貼上你的存檔代碼：');
    if (!inputCode) return;
    try {
        const parsedSave = JSON.parse(decodeURIComponent(atob(inputCode.trim())));
        if (parsedSave) {
            gameState = mergeSaveData(parsedSave, defaultConfig);
            bindHooks();
            restoreUnlocksFromUpgrades();
            saveGame();
            initUI();
            alert('存檔已成功匯入！');
        }
    } catch (e) {
        alert('無效的存檔代碼！');
        console.error(e);
    }
}

function loadGame() {
    let saved = localStorage.getItem(SAVE_KEY_V2) || localStorage.getItem(SAVE_KEY_V1);
    if (saved) {
        try {
            let parsedSave = JSON.parse(saved);
            gameState = mergeSaveData(parsedSave, defaultConfig);
            bindHooks();
            restoreUnlocksFromUpgrades();

            let offlineSec = (Date.now() - (gameState.lastSaveTime || Date.now())) / 1000;

            if (offlineSec > 3) {
                let maxOfflineSec = getMaxOfflineTime();
                let actualOfflineSec = Math.min(offlineSec, maxOfflineSec);
                processTick(actualOfflineSec);
            }
        } catch (e) {
            console.error('存檔讀取失敗，還原至預設數據', e);
        }
    }
}

function resetGame() {
    if (confirm('確定要重置遊戲進度嗎？所有數據將清空！')) {
        localStorage.removeItem(SAVE_KEY_V2);
        localStorage.removeItem(SAVE_KEY_V1);
        location.reload();
    }
}

// 啟動遊戲
setInterval(saveGame, 5000);
loadGame();
initUI();
requestAnimationFrame(gameLoop);