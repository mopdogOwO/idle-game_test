// 預設資料與遊戲數值資料庫
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
    numberFormat: 'abbreviation', // 新增：控制進位制表示法 ('abbreviation' or 'scientific')

    resources: {
        leaf: { id: 'leaf', name: '落葉', amount: 0, lifetimeAmount: 0, unlocked: true },
        branch: { id: 'branch', name: '樹枝', amount: 0, lifetimeAmount: 0, unlocked: false },
        wood: { id: 'wood', name: '木頭', amount: 0, lifetimeAmount: 0, unlocked: false },
		
        pine_leaf: { id: 'pine_leaf', name: '松葉', amount: 0, lifetimeAmount: 0, unlocked: false },
        pine_branch: { id: 'pine_branch', name: '松枝', amount: 0, lifetimeAmount: 0, unlocked: false },
        pine_wood: { id: 'pine_wood', name: '松木', amount: 0, lifetimeAmount: 0, unlocked: false },
		
        broad_leaf: { id: 'broad_leaf', name: '闊葉', amount: 0, lifetimeAmount: 0, unlocked: false },
        broad_branch: { id: 'broad_branch', name: '闊枝', amount: 0, lifetimeAmount: 0, unlocked: false },
        broad_wood: { id: 'broad_wood', name: '闊木', amount: 0, lifetimeAmount: 0, unlocked: false },
		
        sakura_leaf: { id: 'sakura_leaf', name: '櫻花', amount: 0, lifetimeAmount: 0, unlocked: false },
        sakura_branch: { id: 'sakura_branch', name: '櫻枝', amount: 0, lifetimeAmount: 0, unlocked: false },
        sakura_wood: { id: 'sakura_wood', name: '櫻木', amount: 0, lifetimeAmount: 0, unlocked: false },
		
        recycle_coin: { id: 'recycle_coin', name: '回收幣', amount: 0, lifetimeAmount: 0, unlocked: false },
        prestige_coin: { id: 'prestige_coin', name: '初級硬幣', amount: 0, unlocked: false }
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
		//落葉
        leaf_amount: { id: 'leaf_amount', category: 'leaf', name: '清掃量升級', desc: '增加清掃落葉量，每級 +1 片落葉', level: 0, maxLevel: 500, baseCost: 10, costResource: 'leaf', multiplier: 1.15 },
        leaf_speed: { id: 'leaf_speed', category: 'leaf', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 150, baseCost: 10, costResource: 'leaf', multiplier: 1.1 },
        leaf_count: { id: 'leaf_count', category: 'leaf', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 500, costResource: 'leaf', multiplier: 3.0 },
        unlock_branch_robot: {
            id: 'unlock_branch_robot', category: 'leaf', name: '撿樹枝機器人採購', desc: '解鎖樹枝與撿樹枝機器人', level: 0, maxLevel: 1, baseCost: 10000, costResource: 'leaf', multiplier: 1.0,
            onPurchase: () => { gameState.resources.branch.unlocked = true; gameState.robots.branchCollector.unlocked = true; gameState.robots.branchCollector.baseCount = 1; initUI(); }
        },
		//樹枝
        branch_amount: { id: 'branch_amount', category: 'branch', name: '清掃量升級', desc: '增加清掃樹枝量，每級 +1 個樹枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'branch', multiplier: 1.15 },
        branch_speed: { id: 'branch_speed', category: 'branch', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 200, baseCost: 15, costResource: 'branch', multiplier: 1.1 },
        branch_count: { id: 'branch_count', category: 'branch', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 1000, costResource: 'branch', multiplier: 3.0 },
        unlock_wood_robot: {
            id: 'unlock_wood_robot', category: 'branch', name: '伐木機器人採購', desc: '解鎖木頭與伐木機器人', level: 0, maxLevel: 1, baseCost: 15000, costResource: 'branch', multiplier: 1.0,
            onPurchase: () => { gameState.resources.wood.unlocked = true; gameState.robots.lumberjack.unlocked = true; gameState.robots.lumberjack.baseCount = 1; initUI(); }
        },
        unlock_recycle_branch: {
            id: 'unlock_recycle_branch', category: 'branch', name: '資源回收', desc: '開啟【回收廠】獨立功能', level: 0, maxLevel: 1, baseCost: 10000, costResource: 'branch', multiplier: 1.0,
            onPurchase: () => { gameState.unlockedRecycle = true; gameState.resources.recycle_coin.unlocked = true; initUI(); }
        },
		//木頭
        wood_amount: { id: 'wood_amount', category: 'wood', name: '清掃量升級', desc: '增加砍伐木頭量，每級 +1 個木頭', level: 0, maxLevel: 500, baseCost: 20, costResource: 'wood', multiplier: 1.15 },
        wood_speed: { id: 'wood_speed', category: 'wood', name: '清掃效率升級', desc: '增加砍伐速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 20, costResource: 'wood', multiplier: 1.1 },
        wood_count: { id: 'wood_count', category: 'wood', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'wood', multiplier: 3.0 },
        unlock_pine_robot: {
            id: 'unlock_pine_robot', category: 'wood', name: '掃松葉機器人採購', desc: '解鎖松葉與掃松葉機器人', level: 0, maxLevel: 1, baseCost: 20000, costResource: 'wood', multiplier: 1.0,
            onPurchase: () => { gameState.resources.pine_leaf.unlocked = true; gameState.robots.pineSweeper.unlocked = true; gameState.robots.pineSweeper.baseCount = 1; initUI(); }
        },
        unlock_map2: {
            id: 'unlock_map2', category: 'wood', name: '解鎖【地圖】', desc: '可切換至其他地區，並解鎖寒帶針葉林', level: 0, maxLevel: 1, baseCost: 30000, costResource: 'wood', multiplier: 1.0,
            onPurchase: () => { gameState.unlockedMap2 = true; initUI(); }
        },
		
		//松葉
        pine_leaf_amount: { id: 'pine_leaf_amount', category: 'pine_leaf', name: '清掃量升級', desc: '增加清掃松葉量，每級 +1 片松葉', level: 0, maxLevel: 500, baseCost: 10, costResource: 'pine_leaf', multiplier: 1.2 },
        pine_leaf_speed: { id: 'pine_leaf_speed', category: 'pine_leaf', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 150, baseCost: 10, costResource: 'pine_leaf', multiplier: 1.15 },
        pine_leaf_count: { id: 'pine_leaf_count', category: 'pine_leaf', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 500, costResource: 'pine_leaf', multiplier: 3.2 },
        unlock_pine_branch_robot: {
            id: 'unlock_pine_branch_robot', category: 'pine_leaf', name: '撿松枝機器人採購', desc: '解鎖松枝與撿松枝機器人', level: 0, maxLevel: 1, baseCost: 15000, costResource: 'pine_leaf', multiplier: 1.0,
            onPurchase: () => { gameState.resources.pine_branch.unlocked = true; gameState.robots.pineBranchCollector.unlocked = true; gameState.robots.pineBranchCollector.baseCount = 1; initUI(); }
        },
		//松枝
        pine_branch_amount: { id: 'pine_branch_amount', category: 'pine_branch', name: '清掃量升級', desc: '增加清掃松枝量，每級 +1 個松枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'pine_branch', multiplier: 1.2 },
        pine_branch_speed: { id: 'pine_branch_speed', category: 'pine_branch', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 200, baseCost: 15, costResource: 'pine_branch', multiplier: 1.15 },
        pine_branch_count: { id: 'pine_branch_count', category: 'pine_branch', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 1000, costResource: 'pine_branch', multiplier: 3.2 },
        unlock_pine_wood_robot: {
            id: 'unlock_pine_wood_robot', category: 'pine_branch', name: '伐松木機器人採購', desc: '解鎖松木與伐松木機器人', level: 0, maxLevel: 1, baseCost: 20000, costResource: 'pine_branch', multiplier: 1.0,
            onPurchase: () => { gameState.resources.pine_wood.unlocked = true; gameState.robots.pineLumberjack.unlocked = true; gameState.robots.pineLumberjack.baseCount = 1; initUI(); }
        },
		//松木
        pine_wood_amount: { id: 'pine_wood_amount', category: 'pine_wood', name: '清掃量升級', desc: '增加砍伐松木量，每級 +1 個松木', level: 0, maxLevel: 500, baseCost: 20, costResource: 'pine_wood', multiplier: 1.2 },
        pine_wood_speed: { id: 'pine_wood_speed', category: 'pine_wood', name: '清掃效率升級', desc: '增加砍伐速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 20, costResource: 'pine_wood', multiplier: 1.15 },
        pine_wood_count: { id: 'pine_wood_count', category: 'pine_wood', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'pine_wood', multiplier: 3.2 },
        unlock_prestige: {
            id: 'unlock_prestige', category: 'pine_wood', name: '解鎖【初級轉生】', desc: '解鎖初級轉生系統與專屬升級系統', level: 0, maxLevel: 1, baseCost: 50000, costResource: 'pine_wood', multiplier: 1.0,
            onPurchase: () => { gameState.unlockedPrestige = true; gameState.resources.prestige_coin.unlocked = true; initUI(); }
        },
		unlock_broad_robot: {
            id: 'unlock_broad_robot', category: 'pine_wood', name: '掃闊葉機器人採購', desc: '解鎖闊葉與掃闊葉機器人', level: 0, maxLevel: 1, baseCost: 30000, costResource: 'pine_wood', multiplier: 1.0,
            onPurchase: () => { gameState.resources.broad_leaf.unlocked = true; gameState.robots.broadSweeper.unlocked = true; gameState.robots.broadSweeper.baseCount = 1; initUI(); }
        },
		
		//闊葉
		broad_leaf_amount: { id: 'broad_leaf_amount', category: 'broad_leaf', name: '清掃量升級', desc: '增加清掃闊葉量，每級 +1 片闊葉', level: 0, maxLevel: 500, baseCost: 10, costResource: 'broad_leaf', multiplier: 1.25 },
        broad_leaf_speed: { id: 'broad_leaf_speed', category: 'broad_leaf', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 10, costResource: 'broad_leaf', multiplier: 1.18 },
        broad_leaf_count: { id: 'broad_leaf_count', category: 'broad_leaf', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 2000, costResource: 'broad_leaf', multiplier: 3.3 },
		unlock_broad_branch_robot: {
            id: 'unlock_broad_branch_robot', category: 'broad_leaf', name: '撿闊枝機器人採購', desc: '解鎖闊枝與撿闊枝機器人', level: 0, maxLevel: 1, baseCost: 20000, costResource: 'broad_leaf', multiplier: 1.0,
            onPurchase: () => { gameState.resources.broad_branch.unlocked = true; gameState.robots.broadBranchCollector.unlocked = true; gameState.robots.broadBranchCollector.baseCount = 1; initUI(); }
        },
		//闊枝
        broad_branch_amount: { id: 'broad_branch_amount', category: 'broad_branch', name: '清掃量升級', desc: '增加清掃闊枝量，每級 +1 個闊枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'broad_branch', multiplier: 1.25 },
        broad_branch_speed: { id: 'broad_branch_speed', category: 'broad_branch', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 15, costResource: 'broad_branch', multiplier: 1.18 },
        broad_branch_count: { id: 'broad_branch_count', category: 'broad_branch', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 2000, costResource: 'broad_branch', multiplier: 3.3 },
		unlock_broad_wood_robot: {
            id: 'unlock_broad_wood_robot', category: 'broad_branch', name: '伐闊木機器人採購', desc: '解鎖闊木與伐闊木機器人', level: 0, maxLevel: 1, baseCost: 30000, costResource: 'broad_branch', multiplier: 1.0,
            onPurchase: () => { gameState.resources.broad_wood.unlocked = true; gameState.robots.broadLumberjack.unlocked = true; gameState.robots.broadLumberjack.baseCount = 1; initUI(); }
        },
		//闊木
        broad_wood_amount: { id: 'broad_wood_amount', category: 'broad_wood', name: '清掃量升級', desc: '增加砍伐闊木量，每級 +1 個闊木', level: 0, maxLevel: 500, baseCost: 20, costResource: 'broad_wood', multiplier: 1.25 },
        broad_wood_speed: { id: 'broad_wood_speed', category: 'broad_wood', name: '清掃效率升級', desc: '增加砍伐速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 20, costResource: 'broad_wood', multiplier: 1.18 },
        broad_wood_count: { id: 'broad_wood_count', category: 'broad_wood', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'broad_wood', multiplier: 3.3 },
		unlock_sakura_robot: {
            id: 'unlock_sakura_robot', category: 'broad_wood', name: '掃櫻花機器人採購', desc: '解鎖櫻花與掃櫻花機器人', level: 0, maxLevel: 1, baseCost: 40000, costResource: 'broad_wood', multiplier: 1.0,
            onPurchase: () => { gameState.resources.sakura_leaf.unlocked = true; gameState.robots.sakuraSweeper.unlocked = true; gameState.robots.sakuraSweeper.baseCount = 1; initUI(); }
        },		

		//櫻花
		sakura_leaf_amount: { id: 'sakura_leaf_amount', category: 'sakura_leaf', name: '清掃量升級', desc: '增加清掃櫻花量，每級 +1 片櫻花', level: 0, maxLevel: 500, baseCost: 10, costResource: 'sakura_leaf', multiplier: 1.25 },
        sakura_leaf_speed: { id: 'sakura_leaf_speed', category: 'sakura_leaf', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 10, costResource: 'sakura_leaf', multiplier: 1.18 },
        sakura_leaf_count: { id: 'sakura_leaf_count', category: 'sakura_leaf', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 2000, costResource: 'sakura_leaf', multiplier: 3.3 },
		unlock_sakura_branch_robot: {
            id: 'unlock_sakura_branch_robot', category: 'sakura_leaf', name: '撿櫻枝機器人採購', desc: '解鎖櫻枝與撿櫻枝機器人', level: 0, maxLevel: 1, baseCost: 30000, costResource: 'sakura_leaf', multiplier: 1.0,
            onPurchase: () => { gameState.resources.sakura_branch.unlocked = true; gameState.robots.sakuraBranchCollector.unlocked = true; gameState.robots.sakuraBranchCollector.baseCount = 1; initUI(); }
        },
		//櫻枝
        sakura_branch_amount: { id: 'sakura_branch_amount', category: 'sakura_branch', name: '清掃量升級', desc: '增加清掃櫻枝量，每級 +1 個櫻枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'sakura_branch', multiplier: 1.25 },
        sakura_branch_speed: { id: 'sakura_branch_speed', category: 'sakura_branch', name: '清掃效率升級', desc: '增加清掃速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 15, costResource: 'sakura_branch', multiplier: 1.18 },
        sakura_branch_count: { id: 'sakura_branch_count', category: 'sakura_branch', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 2000, costResource: 'sakura_branch', multiplier: 3.3 },
		unlock_sakura_wood_robot: {
            id: 'unlock_sakura_wood_robot', category: 'sakura_branch', name: '伐櫻木機器人採購', desc: '解鎖櫻木與伐櫻木機器人', level: 0, maxLevel: 1, baseCost: 45000, costResource: 'sakura_branch', multiplier: 1.0,
            onPurchase: () => { gameState.resources.sakura_wood.unlocked = true; gameState.robots.sakuraLumberjack.unlocked = true; gameState.robots.sakuraLumberjack.baseCount = 1; initUI(); }
        },
		//櫻木
        sakura_wood_amount: { id: 'sakura_wood_amount', category: 'sakura_wood', name: '清掃量升級', desc: '增加砍伐櫻木量，每級 +1 個櫻木', level: 0, maxLevel: 500, baseCost: 20, costResource: 'sakura_wood', multiplier: 1.25 },
        sakura_wood_speed: { id: 'sakura_wood_speed', category: 'sakura_wood', name: '清掃效率升級', desc: '增加砍伐速度，每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 20, costResource: 'sakura_wood', multiplier: 1.18 },
        sakura_wood_count: { id: 'sakura_wood_count', category: 'sakura_wood', name: '機器採購', desc: '增加機器人數量，每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'sakura_wood', multiplier: 3.3 },

		
		//回收幣
        recycle_amount: { id: 'recycle_amount', category: 'recycle', name: '幣值提升', desc: '回收量增加，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 834, costResource: 'recycle_coin', multiplier: 1.2 },
        recycle_speed: { id: 'recycle_speed', category: 'recycle', name: '回收效率升級', desc: '回收速度增加，每級 -0.02 秒轉換所需時間', level: 0, maxLevel: 250, baseCost: 500, costResource: 'recycle_coin', multiplier: 1.15 },
        recycle_efficiency: { id: 'recycle_efficiency', category: 'recycle', name: '成本降低', desc: '回收轉換成本降低，每級 -1% 消耗材料量', level: 0, maxLevel: 50, baseCost: 750, costResource: 'recycle_coin', multiplier: 1.175 },
        recycle_factory: { id: 'recycle_factory', category: 'recycle', name: '新建廠房', desc: '回收廠房增加，每級 +1 回收次數', level: 0, maxLevel: 10, baseCost: 2000, costResource: 'recycle_coin', multiplier: 1.25 },

		//初級轉生硬幣
        pres_leaf_boost: { id: 'pres_leaf_boost', category: 'prestige', name: '落葉 升級', desc: '提升 落葉 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 0.5, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_branch_boost: { id: 'pres_branch_boost', category: 'prestige', name: '樹枝 升級', desc: '提升 樹枝 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 1, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_wood_boost: { id: 'pres_wood_boost', category: 'prestige', name: '木頭 升級', desc: '提升 木頭 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 2, costResource: 'prestige_coin', multiplier: 2.0 },
        
		pres_pine_leaf_boost: { id: 'pres_pine_leaf_boost', category: 'prestige', name: '松葉 升級', desc: '提升 松葉 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 2, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_pine_branch_boost: { id: 'pres_pine_branch_boost', category: 'prestige', name: '松枝 升級', desc: '提升 松枝 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 4, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_pine_wood_boost: { id: 'pres_pine_wood_boost', category: 'prestige', name: '松木 升級', desc: '提升 松木 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 8, costResource: 'prestige_coin', multiplier: 2.0 },
		
		pres_broad_leaf_boost: { id: 'pres_broad_leaf_boost', category: 'prestige', name: '闊葉 升級', desc: '提升 闊葉 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 8, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_broad_branch_boost: { id: 'pres_broad_branch_boost', category: 'prestige', name: '闊枝 升級', desc: '提升 闊枝 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 16, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_broad_wood_boost: { id: 'pres_broad_wood_boost', category: 'prestige', name: '闊木 升級', desc: '提升 闊木 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 32, costResource: 'prestige_coin', multiplier: 2.0 },
		
		pres_sakura_leaf_boost: { id: 'pres_sakura_leaf_boost', category: 'prestige', name: '櫻花 升級', desc: '提升 櫻花 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 32, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_sakura_branch_boost: { id: 'pres_sakura_branch_boost', category: 'prestige', name: '櫻枝 升級', desc: '提升 櫻枝 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 64, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_sakura_wood_boost: { id: 'pres_sakura_wood_boost', category: 'prestige', name: '櫻木 升級', desc: '提升 櫻木 的獲得量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 128, costResource: 'prestige_coin', multiplier: 2.0 },
        
		pres_recycle_boost: { id: 'pres_recycle_boost', category: 'prestige', name: '回收廠 轉換效率升級', desc: '提升 回收廠 素材轉換的數量，每級為基礎量的100%', level: 1, maxLevel: 20, baseCost: 1, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_recycle_efficiency: { id: 'pres_recycle_efficiency', category: 'prestige', name: '回收廠 成本降低', desc: '降低回收廠材料消耗，每級 -1% 消耗材料量', level: 0, maxLevel: 30, baseCost: 10, costResource: 'prestige_coin', multiplier: 1.2 },
		pres_coin_boost: { id: 'pres_coin_boost', category: 'prestige', name: '提升獲得的初級硬幣量', desc: '提升獲得的初級硬幣量，每級+1%', level: 0, maxLevel: 100, baseCost: 10, costResource: 'prestige_coin', multiplier: 1.8 },
    
		unlock_map3: {
            id: 'unlock_map3', category: 'prestige', name: '解鎖 闊木林', desc: '解鎖後可切換至闊木林地區', level: 0, maxLevel: 1, baseCost: 200, costResource: 'prestige_coin', multiplier: 1.0,
            onPurchase: () => { gameState.unlockedMap3 = true; initUI(); }
        },
		unlock_map4: {
            id: 'unlock_map4', category: 'prestige', name: '解鎖 櫻花林', desc: '解鎖後可切換至櫻花林地區', level: 0, maxLevel: 1, baseCost: 1000, costResource: 'prestige_coin', multiplier: 1.0,
            onPurchase: () => { gameState.unlockedMap4 = true; initUI(); }
        },
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