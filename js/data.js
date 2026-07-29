const defaultConfig = {
    lastSaveTime: Date.now(),
    lastInterestTime: Date.now(),
    currentView: 'map1',
    lastMap: 'map1',
    unlockedRecycle: false,
    unlockedMap2: false,
	unlockedMap3: false,
	unlockedMap4: false,
    unlockedPrestige: false,
    recycleTimer: 0,
    baseMaxOfflineSeconds: 86400,
    numberFormat: 'abbreviation',

    resources: {
        leaf: { id: 'leaf', name: '落葉', amount: 0, lifetimeAmount: 0, unlocked: true, icon: 'images/leaf.png' },
        branch: { id: 'branch', name: '樹枝', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/branch.png' },
        wood: { id: 'wood', name: '木頭', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/wood.png' },
        pine_leaf: { id: 'pine_leaf', name: '松葉', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/pine_leaf.png' },
        pine_branch: { id: 'pine_branch', name: '松枝', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/pine_branch.png' },
        pine_wood: { id: 'pine_wood', name: '松木', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/pine_wood.png' },
        broad_leaf: { id: 'broad_leaf', name: '闊葉', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/broad_leaf.png' },
        broad_branch: { id: 'broad_branch', name: '闊枝', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/broad_branch.png' },
        broad_wood: { id: 'broad_wood', name: '闊木', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/broad_wood.png' },
        sakura_leaf: { id: 'sakura_leaf', name: '櫻花', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/sakura_leaf.png' },
        sakura_branch: { id: 'sakura_branch', name: '櫻枝', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/sakura_branch.png' },
        sakura_wood: { id: 'sakura_wood', name: '櫻木', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/sakura_wood.png' },
        recycle_coin: { id: 'recycle_coin', name: '回收幣', amount: 0, lifetimeAmount: 0, unlocked: false, icon: 'images/recycle_coin.png' },
        prestige_coin: { id: 'prestige_coin', name: '初級硬幣', amount: 0, unlocked: false, icon: 'images/prestige_coin.png' }
    },

    robots: {
        sweeper: { id: 'sweeper', map: 'map1', name: '掃地機器人', targetResource: 'leaf', baseCount: 1, baseInterval: 2.0, currentTimer: 0, unlocked: true },
        branchCollector: { id: 'branchCollector', map: 'map1', name: '撿樹枝機器人', targetResource: 'branch', baseCount: 0, baseInterval: 3.0, currentTimer: 0, unlocked: false },
        lumberjack: { id: 'lumberjack', map: 'map1', name: '伐木機器人', targetResource: 'wood', baseCount: 0, baseInterval: 4.0, currentTimer: 0, unlocked: false },
        pineSweeper: { id: 'pineSweeper', map: 'map2', name: '掃松葉機器人', targetResource: 'pine_leaf', baseCount: 0, baseInterval: 2.0, currentTimer: 0, unlocked: false },
        pineBranchCollector: { id: 'pineBranchCollector', map: 'map2', name: '撿松枝機器人', targetResource: 'pine_branch', baseCount: 0, baseInterval: 3.0, currentTimer: 0, unlocked: false },
        pineLumberjack: { id: 'pineLumberjack', map: 'map2', name: '伐松木機器人', targetResource: 'pine_wood', baseCount: 0, baseInterval: 4.0, currentTimer: 0, unlocked: false },
		broadSweeper: { id: 'broadSweeper', map: 'map3', name: '掃闊葉機器人', targetResource: 'broad_leaf', baseCount: 0, baseInterval: 2.0, currentTimer: 0, unlocked: false },
        broadBranchCollector: { id: 'broadBranchCollector', map: 'map3', name: '撿闊枝機器人', targetResource: 'broad_branch', baseCount: 0, baseInterval: 3.0, currentTimer: 0, unlocked: false },
        broadLumberjack: { id: 'broadLumberjack', map: 'map3', name: '伐闊木機器人', targetResource: 'broad_wood', baseCount: 0, baseInterval: 4.0, currentTimer: 0, unlocked: false },
        sakuraSweeper: { id: 'sakuraSweeper', map: 'map4', name: '掃櫻花機器人', targetResource: 'sakura_leaf', baseCount: 0, baseInterval: 2.0, currentTimer: 0, unlocked: false },
        sakuraBranchCollector: { id: 'sakuraBranchCollector', map: 'map4', name: '撿櫻枝機器人', targetResource: 'sakura_branch', baseCount: 0, baseInterval: 3.0, currentTimer: 0, unlocked: false },
        sakuraLumberjack: { id: 'sakuraLumberjack', map: 'map4', name: '伐櫻木機器人', targetResource: 'sakura_wood', baseCount: 0, baseInterval: 4.0, currentTimer: 0, unlocked: false }
    },

	upgrades: {
        // --- Map 1: 平原樹林 ---
        leaf_amount: { id: 'leaf_amount', category: 'leaf', name: '清掃量升級', desc: '增加清掃落葉量，每級 +1 片落葉', level: 0, maxLevel: 500, baseCost: 10, costResource: 'leaf', multiplier: 1.15 },
        leaf_speed: { id: 'leaf_speed', category: 'leaf', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 150, baseCost: 10, costResource: 'leaf', multiplier: 1.1 },
        leaf_count: { id: 'leaf_count', category: 'leaf', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 500, costResource: 'leaf', multiplier: 3.0 },
        unlock_branch_robot: { id: 'unlock_branch_robot', category: 'leaf', name: '撿樹枝機器人採購', desc: '解鎖樹枝與撿樹枝機器人', level: 0, maxLevel: 1, baseCost: 10000, costResource: 'leaf', multiplier: 1.0, onPurchase: () => { gameState.resources.branch.unlocked = true; gameState.robots.branchCollector.unlocked = true; gameState.robots.branchCollector.baseCount = 1; initUI(); } },

        branch_amount: { id: 'branch_amount', category: 'branch', name: '清掃量升級', desc: '增加清掃樹枝量，每級 +1 個樹枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'branch', multiplier: 1.15 },
        branch_speed: { id: 'branch_speed', category: 'branch', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 250, baseCost: 15, costResource: 'branch', multiplier: 1.1 },
        branch_count: { id: 'branch_count', category: 'branch', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 1000, costResource: 'branch', multiplier: 3.2 },
        unlock_wood_robot: { id: 'unlock_wood_robot', category: 'branch', name: '伐木機器人採購', desc: '解鎖木頭與伐木機器人', level: 0, maxLevel: 1, baseCost: 15000, costResource: 'branch', multiplier: 1.0, onPurchase: () => { gameState.resources.wood.unlocked = true; gameState.robots.lumberjack.unlocked = true; gameState.robots.lumberjack.baseCount = 1; initUI(); } },
        unlock_recycle_branch: { id: 'unlock_recycle_branch', category: 'branch', name: '資源回收', desc: '開啟【回收廠】獨立功能', level: 0, maxLevel: 1, baseCost: 10000, costResource: 'branch', multiplier: 1.0, onPurchase: () => { gameState.unlockedRecycle = true; gameState.resources.recycle_coin.unlocked = true; initUI(); } },

        wood_amount: { id: 'wood_amount', category: 'wood', name: '清掃量升級', desc: '增加砍伐木頭量，每級 +1 個木頭', level: 0, maxLevel: 500, baseCost: 20, costResource: 'wood', multiplier: 1.15 },
        wood_speed: { id: 'wood_speed', category: 'wood', name: '清掃效率升級', desc: '增加砍伐速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 350, baseCost: 20, costResource: 'wood', multiplier: 1.1 },
        wood_count: { id: 'wood_count', category: 'wood', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'wood', multiplier: 3.0 },
        unlock_pine_robot: { id: 'unlock_pine_robot', category: 'wood', name: '掃松葉機器人採購', desc: '解鎖松葉與掃松葉機器人', level: 0, maxLevel: 1, baseCost: 20000, costResource: 'wood', multiplier: 1.0, onPurchase: () => { gameState.resources.pine_leaf.unlocked = true; gameState.robots.pineSweeper.unlocked = true; gameState.robots.pineSweeper.baseCount = 1; initUI(); } },
        unlock_map2: { id: 'unlock_map2', category: 'wood', name: '地圖', desc: '解鎖【地圖】，可切換至其他地區，並解鎖寒帶針葉林', level: 0, maxLevel: 1, baseCost: 30000, costResource: 'wood', multiplier: 1.0, onPurchase: () => { gameState.unlockedMap2 = true; initUI(); } },

        // --- Map 2: 寒帶針葉林 ---
        pine_leaf_amount: { id: 'pine_leaf_amount', category: 'pine_leaf', name: '清掃量升級', desc: '增加清掃松葉量，每級 +1 片松葉', level: 0, maxLevel: 500, baseCost: 10, costResource: 'pine_leaf', multiplier: 1.2 },
        pine_leaf_speed: { id: 'pine_leaf_speed', category: 'pine_leaf', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 150, baseCost: 10, costResource: 'pine_leaf', multiplier: 1.15 },
        pine_leaf_count: { id: 'pine_leaf_count', category: 'pine_leaf', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 500, costResource: 'pine_leaf', multiplier: 3.2 },
        unlock_pine_branch_robot: { id: 'unlock_pine_branch_robot', category: 'pine_leaf', name: '撿松枝機器人採購', desc: '解鎖松枝與撿松枝機器人', level: 0, maxLevel: 1, baseCost: 15000, costResource: 'pine_leaf', multiplier: 1.0, onPurchase: () => { gameState.resources.pine_branch.unlocked = true; gameState.robots.pineBranchCollector.unlocked = true; gameState.robots.pineBranchCollector.baseCount = 1; initUI(); } },

        pine_branch_amount: { id: 'pine_branch_amount', category: 'pine_branch', name: '清掃量升級', desc: '增加清掃松枝量，每級 +1 個松枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'pine_branch', multiplier: 1.2 },
        pine_branch_speed: { id: 'pine_branch_speed', category: 'pine_branch', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 250, baseCost: 15, costResource: 'pine_branch', multiplier: 1.15 },
        pine_branch_count: { id: 'pine_branch_count', category: 'pine_branch', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 1000, costResource: 'pine_branch', multiplier: 3.2 },
        unlock_pine_wood_robot: { id: 'unlock_pine_wood_robot', category: 'pine_branch', name: '伐松木機器人採購', desc: '解鎖松木與伐松木機器人', level: 0, maxLevel: 1, baseCost: 20000, costResource: 'pine_branch', multiplier: 1.0, onPurchase: () => { gameState.resources.pine_wood.unlocked = true; gameState.robots.pineLumberjack.unlocked = true; gameState.robots.pineLumberjack.baseCount = 1; initUI(); } },

        pine_wood_amount: { id: 'pine_wood_amount', category: 'pine_wood', name: '清掃量升級', desc: '增加砍伐松木量，每級 +1 個松木', level: 0, maxLevel: 500, baseCost: 20, costResource: 'pine_wood', multiplier: 1.2 },
        pine_wood_speed: { id: 'pine_wood_speed', category: 'pine_wood', name: '清掃效率升級', desc: '增加砍伐速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 350, baseCost: 20, costResource: 'pine_wood', multiplier: 1.15 },
        pine_wood_count: { id: 'pine_wood_count', category: 'pine_wood', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'pine_wood', multiplier: 3.2 },
        unlock_prestige: { id: 'unlock_prestige', category: 'pine_wood', name: '初級轉生', desc: '解鎖【初級轉生】系統與專屬升級系統', level: 0, maxLevel: 1, baseCost: 50000, costResource: 'pine_wood', multiplier: 1.0, onPurchase: () => { gameState.unlockedPrestige = true; gameState.resources.prestige_coin.unlocked = true; initUI(); } },
        unlock_broad_robot: { id: 'unlock_broad_robot', category: 'pine_wood', name: '掃闊葉機器人採購', desc: '解鎖闊葉與掃闊葉機器人', level: 0, maxLevel: 1, baseCost: 30000, costResource: 'pine_wood', multiplier: 1.0, onPurchase: () => { gameState.resources.broad_leaf.unlocked = true; gameState.robots.broadSweeper.unlocked = true; gameState.robots.broadSweeper.baseCount = 1; initUI(); } },

        // --- Map 3: 闊木林 ---
        broad_leaf_amount: { id: 'broad_leaf_amount', category: 'broad_leaf', name: '清掃量升級', desc: '增加清掃闊葉量，每級 +1 片闊葉', level: 0, maxLevel: 500, baseCost: 10, costResource: 'broad_leaf', multiplier: 1.25 },
        broad_leaf_speed: { id: 'broad_leaf_speed', category: 'broad_leaf', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 150, baseCost: 10, costResource: 'broad_leaf', multiplier: 1.18 },
        broad_leaf_count: { id: 'broad_leaf_count', category: 'broad_leaf', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 2000, costResource: 'broad_leaf', multiplier: 3.3 },
        unlock_broad_branch_robot: { id: 'unlock_broad_branch_robot', category: 'broad_leaf', name: '撿闊枝機器人採購', desc: '解鎖闊枝與撿闊枝機器人', level: 0, maxLevel: 1, baseCost: 20000, costResource: 'broad_leaf', multiplier: 1.0, onPurchase: () => { gameState.resources.broad_branch.unlocked = true; gameState.robots.broadBranchCollector.unlocked = true; gameState.robots.broadBranchCollector.baseCount = 1; initUI(); } },

        broad_branch_amount: { id: 'broad_branch_amount', category: 'broad_branch', name: '清掃量升級', desc: '增加清掃闊枝量，每級 +1 個闊枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'broad_branch', multiplier: 1.25 },
        broad_branch_speed: { id: 'broad_branch_speed', category: 'broad_branch', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 250, baseCost: 15, costResource: 'broad_branch', multiplier: 1.18 },
        broad_branch_count: { id: 'broad_branch_count', category: 'broad_branch', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 2000, costResource: 'broad_branch', multiplier: 3.3 },
        unlock_broad_wood_robot: { id: 'unlock_broad_wood_robot', category: 'broad_branch', name: '伐闊木機器人採購', desc: '解鎖闊木與伐闊木機器人', level: 0, maxLevel: 1, baseCost: 30000, costResource: 'broad_branch', multiplier: 1.0, onPurchase: () => { gameState.resources.broad_wood.unlocked = true; gameState.robots.broadLumberjack.unlocked = true; gameState.robots.broadLumberjack.baseCount = 1; initUI(); } },

        broad_wood_amount: { id: 'broad_wood_amount', category: 'broad_wood', name: '清掃量升級', desc: '增加砍伐闊木量，每級 +1 個闊木', level: 0, maxLevel: 500, baseCost: 20, costResource: 'broad_wood', multiplier: 1.25 },
        broad_wood_speed: { id: 'broad_wood_speed', category: 'broad_wood', name: '清掃效率升級', desc: '增加砍伐速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 350, baseCost: 20, costResource: 'broad_wood', multiplier: 1.18 },
        broad_wood_count: { id: 'broad_wood_count', category: 'broad_wood', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'broad_wood', multiplier: 3.3 },
        unlock_sakura_robot: { id: 'unlock_sakura_robot', category: 'broad_wood', name: '掃櫻花機器人採購', desc: '解鎖櫻花與掃櫻花機器人', level: 0, maxLevel: 1, baseCost: 40000, costResource: 'broad_wood', multiplier: 1.0, onPurchase: () => { gameState.resources.sakura_leaf.unlocked = true; gameState.robots.sakuraSweeper.unlocked = true; gameState.robots.sakuraSweeper.baseCount = 1; initUI(); } },

        // --- Map 4: 櫻花林 ---
        sakura_leaf_amount: { id: 'sakura_leaf_amount', category: 'sakura_leaf', name: '清掃量升級', desc: '增加清掃櫻花量，每級 +1 片櫻花', level: 0, maxLevel: 500, baseCost: 10, costResource: 'sakura_leaf', multiplier: 1.25 },
        sakura_leaf_speed: { id: 'sakura_leaf_speed', category: 'sakura_leaf', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 150, baseCost: 10, costResource: 'sakura_leaf', multiplier: 1.18 },
        sakura_leaf_count: { id: 'sakura_leaf_count', category: 'sakura_leaf', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 2000, costResource: 'sakura_leaf', multiplier: 3.3 },
        unlock_sakura_branch_robot: { id: 'unlock_sakura_branch_robot', category: 'sakura_leaf', name: '撿櫻枝機器人採購', desc: '解鎖櫻枝與撿櫻枝機器人', level: 0, maxLevel: 1, baseCost: 30000, costResource: 'sakura_leaf', multiplier: 1.0, onPurchase: () => { gameState.resources.sakura_branch.unlocked = true; gameState.robots.sakuraBranchCollector.unlocked = true; gameState.robots.sakuraBranchCollector.baseCount = 1; initUI(); } },

        sakura_branch_amount: { id: 'sakura_branch_amount', category: 'sakura_branch', name: '清掃量升級', desc: '增加清掃櫻枝量，每級 +1 個櫻枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'sakura_branch', multiplier: 1.25 },
        sakura_branch_speed: { id: 'sakura_branch_speed', category: 'sakura_branch', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 250, baseCost: 15, costResource: 'sakura_branch', multiplier: 1.18 },
        sakura_branch_count: { id: 'sakura_branch_count', category: 'sakura_branch', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 2000, costResource: 'sakura_branch', multiplier: 3.3 },
        unlock_sakura_wood_robot: { id: 'unlock_sakura_wood_robot', category: 'sakura_branch', name: '伐櫻木機器人採購', desc: '解鎖櫻木與伐櫻木機器人', level: 0, maxLevel: 1, baseCost: 45000, costResource: 'sakura_branch',  multiplier: 1.0, onPurchase: () => { gameState.resources.sakura_wood.unlocked = true; gameState.robots.sakuraLumberjack.unlocked = true; gameState.robots.sakuraLumberjack.baseCount = 1; initUI(); } },

        sakura_wood_amount: { id: 'sakura_wood_amount', category: 'sakura_wood', name: '清掃量升級', desc: '增加砍伐櫻木量，每級 +1 個櫻木', level: 0, maxLevel: 500, baseCost: 20, costResource: 'sakura_wood', multiplier: 1.25 },
        sakura_wood_speed: { id: 'sakura_wood_speed', category: 'sakura_wood', name: '清掃效率升級', desc: '增加砍伐速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 350, baseCost: 20, costResource: 'sakura_wood', multiplier: 1.18 },
        sakura_wood_count: { id: 'sakura_wood_count', category: 'sakura_wood', name: '機器人採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'sakura_wood', multiplier: 3.3 },

        // --- 回收廠系統 (更新後：雙軌制) ---
        recycle_amount: { id: 'recycle_amount', category: 'recycle', name: '硬幣基礎提升', desc: '回收量增加，每級回收基礎量+1', level: 1, maxLevel: 30, baseCost: 417, costResource: 'recycle_coin', multiplier: 1.2 },
        recycle_boost: { id: 'recycle_boost', category: 'recycle', name: '硬幣倍率加倍', desc: '回收倍率增加，每級為基礎量的100%', level: 1, maxLevel: 30, baseCost: 834, costResource: 'recycle_coin', multiplier: 1.2 },
        recycle_material_amount: { id: 'recycle_material_amount', category: 'recycle', name: '材料基礎提升', desc: '材料轉換量增加，每級轉換基礎量+1', level: 1, maxLevel: 30, baseCost: 417, costResource: 'recycle_coin', multiplier: 1.2 },
        recycle_material_boost: { id: 'recycle_material_boost', category: 'recycle', name: '材料倍率加倍', desc: '材料轉換倍率增加，每級為轉換量的100%', level: 1, maxLevel: 30, baseCost: 834, costResource: 'recycle_coin', multiplier: 1.2 },
        recycle_speed: { id: 'recycle_speed', category: 'recycle', name: '回收效率', desc: '回收速度增加，每級 -0.1 秒轉換所需時間', level: 0, maxLevel: 80, baseCost: 500, costResource: 'recycle_coin', multiplier: 1.3 },
        recycle_efficiency: { id: 'recycle_efficiency', category: 'recycle', name: '成本降低', desc: '回收轉換成本降低，每級 -1% 消耗材料量', level: 0, maxLevel: 50, baseCost: 750, costResource: 'recycle_coin', multiplier: 1.175 },
        recycle_factory: { id: 'recycle_factory', category: 'recycle', name: '新建廠房', desc: '回收廠房增加，每級 +1 回收次數', level: 0, maxLevel: 10, baseCost: 2000, costResource: 'recycle_coin', multiplier: 1.25 },

        // --- 初級轉生硬幣天賦 ---
        pres_leaf_boost: { id: 'pres_leaf_boost', category: 'prestige', name: '落葉 升級', desc: '提升 落葉 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 2, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_branch_boost: { id: 'pres_branch_boost', category: 'prestige', name: '樹枝 升級', desc: '提升 樹枝 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 2, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_wood_boost: { id: 'pres_wood_boost', category: 'prestige', name: '木頭 升級', desc: '提升 木頭 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 2, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_pine_leaf_boost: { id: 'pres_pine_leaf_boost', category: 'prestige', name: '松葉 升級', desc: '提升 松葉 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 4, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_pine_branch_boost: { id: 'pres_pine_branch_boost', category: 'prestige', name: '松枝 升級', desc: '提升 松枝 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 4, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_pine_wood_boost: { id: 'pres_pine_wood_boost', category: 'prestige', name: '松木 升級', desc: '提升 松木 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 4, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_broad_leaf_boost: { id: 'pres_broad_leaf_boost', category: 'prestige', name: '闊葉 升級', desc: '提升 闊葉 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 8, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_broad_branch_boost: { id: 'pres_broad_branch_boost', category: 'prestige', name: '闊枝 升級', desc: '提升 闊枝 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 8, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_broad_wood_boost: { id: 'pres_broad_wood_boost', category: 'prestige', name: '闊木 升級', desc: '提升 闊木 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 8, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_sakura_leaf_boost: { id: 'pres_sakura_leaf_boost', category: 'prestige', name: '櫻花 升級', desc: '提升 櫻花 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 16, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_sakura_branch_boost: { id: 'pres_sakura_branch_boost', category: 'prestige', name: '櫻枝 升級', desc: '提升 櫻枝 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 16, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_sakura_wood_boost: { id: 'pres_sakura_wood_boost', category: 'prestige', name: '櫻木 升級', desc: '提升 櫻木 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 16, costResource: 'prestige_coin', multiplier: 2.0 },
        
        pres_recycle_material_boost: { id: 'pres_recycle_material_boost', category: 'prestige', name: '回收廠 材料轉換效率', desc: '提升 回收廠 材料轉換的數量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 2, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_recycle_boost: { id: 'pres_recycle_boost', category: 'prestige', name: '回收廠 硬幣轉換效率', desc: '提升 回收廠 硬幣轉換的數量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 2, costResource: 'prestige_coin', multiplier: 2.0 },

        pres_recycle_efficiency: { id: 'pres_recycle_efficiency', category: 'prestige', name: '回收廠 成本降低', desc: '降低回收廠材料消耗，每級 -1% 消耗材料量', level: 0, maxLevel: 30, baseCost: 10, costResource: 'prestige_coin', multiplier: 1.5 },
        pres_coin_boost: { id: 'pres_coin_boost', category: 'prestige', name: '初級硬幣量提升', desc: '提升獲得的初級硬幣量，每級+1%', level: 0, maxLevel: 100, baseCost: 3, costResource: 'prestige_coin', multiplier: 1.35 },
        unlock_map3: { id: 'unlock_map3', category: 'prestige', name: '解鎖 闊木林', desc: '解鎖後可切換至闊木林地區', level: 0, maxLevel: 1, baseCost: 200, costResource: 'prestige_coin', multiplier: 1.0, onPurchase: () => { gameState.unlockedMap3 = true; initUI(); } },
        unlock_map4: { id: 'unlock_map4', category: 'prestige', name: '解鎖 櫻花林', desc: '解鎖後可切換至櫻花林地區', level: 0, maxLevel: 1, baseCost: 1000, costResource: 'prestige_coin', multiplier: 1.0, onPurchase: () => { gameState.unlockedMap4 = true; initUI(); } }
    },

    recycles: {
        leaf_to_branch: { id: 'leaf_to_branch', costRes: 'leaf', costAmt: 10, gainRes: 'branch', gainAmt: 1, isCoin: false, enabled: false },
        branch_to_wood: { id: 'branch_to_wood', costRes: 'branch', costAmt: 10, gainRes: 'wood', gainAmt: 1, isCoin: false, enabled: false },
        wood_to_pine_leaf: { id: 'wood_to_pine_leaf', costRes: 'wood', costAmt: 10, gainRes: 'pine_leaf', gainAmt: 1, isCoin: false, enabled: false },
        pine_leaf_to_branch: { id: 'pine_leaf_to_branch', costRes: 'pine_leaf', costAmt: 20, gainRes: 'pine_branch', gainAmt: 1, isCoin: false, enabled: false },
        pine_branch_to_wood: { id: 'pine_branch_to_wood', costRes: 'pine_branch', costAmt: 20, gainRes: 'pine_wood', gainAmt: 1, isCoin: false, enabled: false },
		pine_wood_to_broad_leaf: { id: 'pine_wood_to_broad_leaf', costRes: 'pine_wood', costAmt: 20, gainRes: 'broad_leaf', gainAmt: 1, isCoin: false, enabled: false },
        broad_leaf_to_branch: { id: 'broad_leaf_to_branch', costRes: 'broad_leaf', costAmt: 30, gainRes: 'broad_branch', gainAmt: 1, isCoin: false, enabled: false },
        broad_branch_to_wood: { id: 'broad_branch_to_wood', costRes: 'broad_branch', costAmt: 30, gainRes: 'broad_wood', gainAmt: 1, isCoin: false, enabled: false },
        broad_wood_to_sakura_leaf: { id: 'broad_wood_to_sakura_leaf', costRes: 'broad_wood', costAmt: 30, gainRes: 'sakura_leaf', gainAmt: 1, isCoin: false, enabled: false },
		sakura_leaf_to_branch: { id: 'sakura_leaf_to_branch', costRes: 'sakura_leaf', costAmt: 40, gainRes: 'sakura_branch', gainAmt: 1, isCoin: false, enabled: false },
        sakura_branch_to_wood: { id: 'sakura_branch_to_wood', costRes: 'sakura_branch', costAmt: 40, gainRes: 'sakura_wood', gainAmt: 1, isCoin: false, enabled: false },
        leaf_to_coin: { id: 'leaf_to_coin', costRes: 'leaf', costAmt: 5000, gainRes: 'recycle_coin', gainAmt: 1, isCoin: true, enabled: false },
        branch_to_coin: { id: 'branch_to_coin', costRes: 'branch', costAmt: 4500, gainRes: 'recycle_coin', gainAmt: 1, isCoin: true, enabled: false },
        wood_to_coin: { id: 'wood_to_coin', costRes: 'wood', costAmt: 4000, gainRes: 'recycle_coin', gainAmt: 1, isCoin: true, enabled: false },
        pine_leaf_to_coin: { id: 'pine_leaf_to_coin', costRes: 'pine_leaf', costAmt: 6000, gainRes: 'recycle_coin', gainAmt: 2, isCoin: true, enabled: false },
        pine_branch_to_coin: { id: 'pine_branch_to_coin', costRes: 'pine_branch', costAmt: 5500, gainRes: 'recycle_coin', gainAmt: 2, isCoin: true, enabled: false },
        pine_wood_to_coin: { id: 'pine_wood_to_coin', costRes: 'pine_wood', costAmt: 5000, gainRes: 'recycle_coin', gainAmt: 2, isCoin: true, enabled: false },
        broad_leaf_to_coin: { id: 'broad_leaf_to_coin', costRes: 'broad_leaf', costAmt: 7000, gainRes: 'recycle_coin', gainAmt: 3, isCoin: true, enabled: false },
        broad_branch_to_coin: { id: 'broad_branch_to_coin', costRes: 'broad_branch', costAmt: 6500, gainRes: 'recycle_coin', gainAmt: 3, isCoin: true, enabled: false },
        broad_wood_to_coin: { id: 'broad_wood_to_coin', costRes: 'broad_wood', costAmt: 6000, gainRes: 'recycle_coin', gainAmt: 3, isCoin: true, enabled: false },
        sakura_leaf_to_coin: { id: 'sakura_leaf_to_coin', costRes: 'sakura_leaf', costAmt: 8000, gainRes: 'recycle_coin', gainAmt: 4, isCoin: true, enabled: false },
        sakura_branch_to_coin: { id: 'sakura_branch_to_coin', costRes: 'sakura_branch', costAmt: 7500, gainRes: 'recycle_coin', gainAmt: 4, isCoin: true, enabled: false },
        sakura_wood_to_coin: { id: 'sakura_wood_to_coin', costRes: 'sakura_wood', costAmt: 7000, gainRes: 'recycle_coin', gainAmt: 4, isCoin: true, enabled: false }		
    }
};