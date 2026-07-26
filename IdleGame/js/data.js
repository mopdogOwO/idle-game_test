// 預設資料與遊戲數值資料庫
const defaultConfig = {
    lastSaveTime: Date.now(),
    lastInterestTime: Date.now(),
    currentView: 'map1',
    lastMap: 'map1',
    unlockedRecycle: false,
    unlockedMap2: false,
    unlockedPrestige: false,
    recycleTimer: 0,
    baseMaxOfflineSeconds: 86400,

    resources: {
        leaf: { id: 'leaf', name: '落葉', amount: 0, lifetimeAmount: 0, unlocked: true },
        branch: { id: 'branch', name: '樹枝', amount: 0, lifetimeAmount: 0, unlocked: false },
        wood: { id: 'wood', name: '木頭', amount: 0, lifetimeAmount: 0, unlocked: false },
        pine_leaf: { id: 'pine_leaf', name: '松葉', amount: 0, lifetimeAmount: 0, unlocked: false },
        pine_branch: { id: 'pine_branch', name: '松枝', amount: 0, lifetimeAmount: 0, unlocked: false },
        pine_wood: { id: 'pine_wood', name: '松木', amount: 0, lifetimeAmount: 0, unlocked: false },
        recycle_coin: { id: 'recycle_coin', name: '回收幣', amount: 0, lifetimeAmount: 0, unlocked: false },
        prestige_coin: { id: 'prestige_coin', name: '初級硬幣', amount: 0, unlocked: false }
    },

    robots: {
        sweeper: { id: 'sweeper', map: 'map1', name: '掃地機器人', targetResource: 'leaf', baseCount: 1, baseInterval: 2.0, currentTimer: 0, unlocked: true },
        branchCollector: { id: 'branchCollector', map: 'map1', name: '撿樹枝機器人', targetResource: 'branch', baseCount: 0, baseInterval: 3.0, currentTimer: 0, unlocked: false },
        lumberjack: { id: 'lumberjack', map: 'map1', name: '伐木機器人', targetResource: 'wood', baseCount: 0, baseInterval: 4.0, currentTimer: 0, unlocked: false },
        pineSweeper: { id: 'pineSweeper', map: 'map2', name: '松葉掃地機器人', targetResource: 'pine_leaf', baseCount: 0, baseInterval: 2.0, currentTimer: 0, unlocked: false },
        pineBranchCollector: { id: 'pineBranchCollector', map: 'map2', name: '撿松枝機器人', targetResource: 'pine_branch', baseCount: 0, baseInterval: 3.0, currentTimer: 0, unlocked: false },
        pineLumberjack: { id: 'pineLumberjack', map: 'map2', name: '伐松木機器人', targetResource: 'pine_wood', baseCount: 0, baseInterval: 4.0, currentTimer: 0, unlocked: false }
    },

    upgrades: {
        leaf_amount: { id: 'leaf_amount', category: 'leaf', name: '增加清掃落葉量', desc: '每級 +1 片落葉', level: 0, maxLevel: 500, baseCost: 10, costResource: 'leaf', multiplier: 1.15 },
        leaf_speed: { id: 'leaf_speed', category: 'leaf', name: '增加清掃速度', desc: '每級 -0.01 秒冷卻', level: 0, maxLevel: 150, baseCost: 10, costResource: 'leaf', multiplier: 1.1 },
        leaf_count: { id: 'leaf_count', category: 'leaf', name: '增加機器人數量', desc: '每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 500, costResource: 'leaf', multiplier: 3.0 },
        unlock_branch_robot: {
            id: 'unlock_branch_robot', category: 'leaf', name: '獲得撿樹枝機器人', desc: '解鎖樹枝與撿樹枝機器人', level: 0, maxLevel: 1, baseCost: 10000, costResource: 'leaf', multiplier: 1.0,
            onPurchase: () => { gameState.resources.branch.unlocked = true; gameState.robots.branchCollector.unlocked = true; gameState.robots.branchCollector.baseCount = 1; initUI(); }
        },

        branch_amount: { id: 'branch_amount', category: 'branch', name: '增加清掃樹枝量', desc: '每級 +1 個樹枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'branch', multiplier: 1.15 },
        branch_speed: { id: 'branch_speed', category: 'branch', name: '增加清掃速度', desc: '每級 -0.01 秒冷卻', level: 0, maxLevel: 200, baseCost: 15, costResource: 'branch', multiplier: 1.1 },
        branch_count: { id: 'branch_count', category: 'branch', name: '增加機器人數量', desc: '每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 1000, costResource: 'branch', multiplier: 3.0 },
        unlock_wood_robot: {
            id: 'unlock_wood_robot', category: 'branch', name: '獲得伐木機器人', desc: '解鎖木頭與伐木機器人', level: 0, maxLevel: 1, baseCost: 5000, costResource: 'branch', multiplier: 1.0,
            onPurchase: () => { gameState.resources.wood.unlocked = true; gameState.robots.lumberjack.unlocked = true; gameState.robots.lumberjack.baseCount = 1; initUI(); }
        },
        unlock_recycle_branch: {
            id: 'unlock_recycle_branch', category: 'branch', name: '資源回收', desc: '開啟【回收廠】獨立功能', level: 0, maxLevel: 1, baseCost: 10000, costResource: 'branch', multiplier: 1.0,
            onPurchase: () => { gameState.unlockedRecycle = true; gameState.resources.recycle_coin.unlocked = true; initUI(); }
        },

        wood_amount: { id: 'wood_amount', category: 'wood', name: '增加砍伐木頭量', desc: '每級 +1 個木頭', level: 0, maxLevel: 500, baseCost: 20, costResource: 'wood', multiplier: 1.15 },
        wood_speed: { id: 'wood_speed', category: 'wood', name: '增加砍伐速度', desc: '每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 20, costResource: 'wood', multiplier: 1.1 },
        wood_count: { id: 'wood_count', category: 'wood', name: '增加機器人數量', desc: '每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'wood', multiplier: 3.0 },
        unlock_pine_robot: {
            id: 'unlock_pine_robot', category: 'wood', name: '獲得松葉掃地機器人', desc: '解鎖松葉資源與相關機器人', level: 0, maxLevel: 1, baseCost: 20000, costResource: 'wood', multiplier: 1.0,
            onPurchase: () => { gameState.resources.pine_leaf.unlocked = true; gameState.robots.pineSweeper.unlocked = true; gameState.robots.pineSweeper.baseCount = 1; initUI(); }
        },
        unlock_map2: {
            id: 'unlock_map2', category: 'wood', name: '開放【地圖】選項', desc: '可切換至其他地區（解鎖寒帶針葉林）', level: 0, maxLevel: 1, baseCost: 50000, costResource: 'wood', multiplier: 1.0,
            onPurchase: () => { gameState.unlockedMap2 = true; initUI(); }
        },

        pine_leaf_amount: { id: 'pine_leaf_amount', category: 'pine_leaf', name: '增加清掃松葉量', desc: '每級 +1 片松葉', level: 0, maxLevel: 500, baseCost: 10, costResource: 'pine_leaf', multiplier: 1.2 },
        pine_leaf_speed: { id: 'pine_leaf_speed', category: 'pine_leaf', name: '增加清掃速度', desc: '每級 -0.01 秒冷卻', level: 0, maxLevel: 150, baseCost: 10, costResource: 'pine_leaf', multiplier: 1.15 },
        pine_leaf_count: { id: 'pine_leaf_count', category: 'pine_leaf', name: '增加機器人數量', desc: '每級 +1 台機器人', level: 0, maxLevel: 7, baseCost: 500, costResource: 'pine_leaf', multiplier: 3.2 },
        unlock_pine_branch_robot: {
            id: 'unlock_pine_branch_robot', category: 'pine_leaf', name: '獲得撿松枝機器人', desc: '解鎖松枝與撿松枝機器人', level: 0, maxLevel: 1, baseCost: 10000, costResource: 'pine_leaf', multiplier: 1.0,
            onPurchase: () => { gameState.resources.pine_branch.unlocked = true; gameState.robots.pineBranchCollector.unlocked = true; gameState.robots.pineBranchCollector.baseCount = 1; initUI(); }
        },

        pine_branch_amount: { id: 'pine_branch_amount', category: 'pine_branch', name: '增加清掃松枝量', desc: '每級 +1 個松枝', level: 0, maxLevel: 500, baseCost: 15, costResource: 'pine_branch', multiplier: 1.2 },
        pine_branch_speed: { id: 'pine_branch_speed', category: 'pine_branch', name: '增加清掃速度', desc: '每級 -0.01 秒冷卻', level: 0, maxLevel: 200, baseCost: 15, costResource: 'pine_branch', multiplier: 1.15 },
        pine_branch_count: { id: 'pine_branch_count', category: 'pine_branch', name: '增加機器人數量', desc: '每級 +1 台機器人', level: 0, maxLevel: 6, baseCost: 1000, costResource: 'pine_branch', multiplier: 3.2 },
        unlock_pine_wood_robot: {
            id: 'unlock_pine_wood_robot', category: 'pine_branch', name: '獲得伐松木機器人', desc: '解鎖松木與伐松木機器人', level: 0, maxLevel: 1, baseCost: 5000, costResource: 'pine_branch', multiplier: 1.0,
            onPurchase: () => { gameState.resources.pine_wood.unlocked = true; gameState.robots.pineLumberjack.unlocked = true; gameState.robots.pineLumberjack.baseCount = 1; initUI(); }
        },

        pine_wood_amount: { id: 'pine_wood_amount', category: 'pine_wood', name: '增加砍伐松木量', desc: '每級 +1 個松木', level: 0, maxLevel: 500, baseCost: 20, costResource: 'pine_wood', multiplier: 1.2 },
        pine_wood_speed: { id: 'pine_wood_speed', category: 'pine_wood', name: '增加砍伐速度', desc: '每級 -0.01 秒冷卻', level: 0, maxLevel: 300, baseCost: 20, costResource: 'pine_wood', multiplier: 1.15 },
        pine_wood_count: { id: 'pine_wood_count', category: 'pine_wood', name: '增加機器人數量', desc: '每級 +1 台機器人', level: 0, maxLevel: 5, baseCost: 2000, costResource: 'pine_wood', multiplier: 3.2 },
        unlock_prestige: {
            id: 'unlock_prestige', category: 'pine_wood', name: '開啟【初級轉生】功能', desc: '解鎖初級轉生系統與專屬天賦樹', level: 0, maxLevel: 1, baseCost: 50000, costResource: 'pine_wood', multiplier: 1.0,
            onPurchase: () => { gameState.unlockedPrestige = true; gameState.resources.prestige_coin.unlocked = true; initUI(); }
        },

        recycle_amount: { id: 'recycle_amount', category: 'recycle', name: '回收量增加', desc: '每級增加 1 倍基礎回收幣量', level: 1, maxLevel: 10, baseCost: 834, costResource: 'recycle_coin', multiplier: 1.2 },
        recycle_speed: { id: 'recycle_speed', category: 'recycle', name: '回收速度增加', desc: '每級 -0.02 秒轉換所需時間', level: 0, maxLevel: 250, baseCost: 500, costResource: 'recycle_coin', multiplier: 1.15 },
        recycle_efficiency: { id: 'recycle_efficiency', category: 'recycle', name: '回收轉換效率增加', desc: '每級 -1% 消耗材料量', level: 0, maxLevel: 50, baseCost: 750, costResource: 'recycle_coin', multiplier: 1.175 },
        recycle_factory: { id: 'recycle_factory', category: 'recycle', name: '回收廠房增加', desc: '每級 +1 回收次數', level: 0, maxLevel: 10, baseCost: 2000, costResource: 'recycle_coin', multiplier: 1.25 },

        pres_leaf_boost: { id: 'pres_leaf_boost', category: 'prestige', name: '提升 落葉 的獲得量', desc: '每級 *1 倍（直加於基礎獲得量）', level: 1, maxLevel: 20, baseCost: 5, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_branch_boost: { id: 'pres_branch_boost', category: 'prestige', name: '提升 樹枝 的獲得量', desc: '每級 *1 倍（直加於基礎獲得量）', level: 1, maxLevel: 20, baseCost: 10, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_wood_boost: { id: 'pres_wood_boost', category: 'prestige', name: '提升 木頭 的獲得量', desc: '每級 *1 倍（直加於基礎獲得量）', level: 1, maxLevel: 20, baseCost: 20, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_pine_leaf_boost: { id: 'pres_pine_leaf_boost', category: 'prestige', name: '提升 松葉 的獲得量', desc: '每級 *1 倍（直加於基礎獲得量）', level: 1, maxLevel: 20, baseCost: 40, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_pine_branch_boost: { id: 'pres_pine_branch_boost', category: 'prestige', name: '提升 松枝 的獲得量', desc: '每級 *1 倍（直加於基礎獲得量）', level: 1, maxLevel: 20, baseCost: 80, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_pine_wood_boost: { id: 'pres_pine_wood_boost', category: 'prestige', name: '提升 松木 的獲得量', desc: '每級 *1 倍（直加於基礎獲得量）', level: 1, maxLevel: 20, baseCost: 160, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_recycle_boost: { id: 'pres_recycle_boost', category: 'prestige', name: '提升 回收廠 素材間轉換量', desc: '每級 *1 倍（不包含回收幣）', level: 1, maxLevel: 20, baseCost: 5, costResource: 'prestige_coin', multiplier: 2.0 },
        pres_coin_boost: { id: 'pres_coin_boost', category: 'prestige', name: '提升獲得的初級硬幣量', desc: '每級 +1% 硬幣獲得量', level: 0, maxLevel: 100, baseCost: 10, costResource: 'prestige_coin', multiplier: 1.4 },
        pres_interest: { id: 'pres_interest', category: 'prestige', name: '被動利息', desc: '每分鐘額外獲得目前初級硬幣的 0.1%', level: 0, maxLevel: 1, baseCost: 100, costResource: 'prestige_coin', multiplier: 1.2 }
    },

    recycles: {
        leaf_to_branch: { id: 'leaf_to_branch', costRes: 'leaf', costAmt: 10, gainRes: 'branch', gainAmt: 1, isCoin: false, enabled: false },
        branch_to_wood: { id: 'branch_to_wood', costRes: 'branch', costAmt: 10, gainRes: 'wood', gainAmt: 1, isCoin: false, enabled: false },
        wood_to_pine_leaf: { id: 'wood_to_pine_leaf', costRes: 'wood', costAmt: 10, gainRes: 'pine_leaf', gainAmt: 1, isCoin: false, enabled: false },
        pine_leaf_to_branch: { id: 'pine_leaf_to_branch', costRes: 'pine_leaf', costAmt: 20, gainRes: 'pine_branch', gainAmt: 1, isCoin: false, enabled: false },
        pine_branch_to_wood: { id: 'pine_branch_to_wood', costRes: 'pine_branch', costAmt: 20, gainRes: 'pine_wood', gainAmt: 1, isCoin: false, enabled: false },

        leaf_to_coin: { id: 'leaf_to_coin', costRes: 'leaf', costAmt: 10000, gainRes: 'recycle_coin', gainAmt: 1, isCoin: true, enabled: false },
        branch_to_coin: { id: 'branch_to_coin', costRes: 'branch', costAmt: 8000, gainRes: 'recycle_coin', gainAmt: 1, isCoin: true, enabled: false },
        wood_to_coin: { id: 'wood_to_coin', costRes: 'wood', costAmt: 5000, gainRes: 'recycle_coin', gainAmt: 1, isCoin: true, enabled: false },
        pine_leaf_to_coin: { id: 'pine_leaf_to_coin', costRes: 'pine_leaf', costAmt: 8000, gainRes: 'recycle_coin', gainAmt: 2, isCoin: true, enabled: false },
        pine_branch_to_coin: { id: 'pine_branch_to_coin', costRes: 'pine_branch', costAmt: 6000, gainRes: 'recycle_coin', gainAmt: 2, isCoin: true, enabled: false },
        pine_wood_to_coin: { id: 'pine_wood_to_coin', costRes: 'pine_wood', costAmt: 4000, gainRes: 'recycle_coin', gainAmt: 2, isCoin: true, enabled: false }
    }
};