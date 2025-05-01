export const zh = {
  // 公共
  common: {
    goLogin: '去登录',
    verifying: '身份验证中...',
    cancel: '取消',
    confirm: '确认',
    ok: '确定',
    error: '错误',
    select: '请选择',
    inputNumber: '请输入',
    selectDate: '请选择日期',
    noData: '暂无数据',
    loading: '加载中...',
    success: '操作成功',
  },

  // 导航和标签
  navigation: {
    home: '首页',
    my: '我的',
    settings: '设置',
  },

  // 身份验证
  auth: {
    login: '登录',
    loginToViewProfile: '请登录以查看个人信息',
  },

  // 首页
  home: {
    functionMenu: '功能菜单',
  },

  // 模块标题
  modules: {
    challengeNew: '发起挑战',
    record: '记录',
    allChallengeList: '所有挑战列表',
    updateRecorder: '更新记录人',
    funding: '出资',
    viewTranscoding: '查看转码',
    pitcher_ranking: '排行榜',
  },

  // 榜单相关
  pitcher_ranking: {
    title: '排行榜单',
    hitRateTab: '命中率榜',
    killCountTab: '杀数榜',
    hitRate: '命中率',
    killCount: '杀数',
    totalGames: '总把数',
    winCount: '胜数',
    info: '榜单说明',
    infoTitle: '榜单说明',
    killRate: '杀数',
    noData: '暂无榜单数据',
    selectLocation: '选择地点',
    totalProfit: '上下水',
    totalTurnOver: '转码',
    allLocations: '全部地点',
    company: '公司',
    personal: '个人',
  },

  // 设置相关
  settings: {
    settings: '设置',
    language: '语言设置',
    accountSecurity: '账户安全',
  },

  // 账户安全
  accountSecurity: {
    title: '修改密码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    enterNewPassword: '请输入新密码',
    confirmNewPassword: '请再次输入新密码',
    passwordNotMatch: '两次输入的密码不一致',
    passwordEmpty: '密码不能为空',
    submit: '提交',
    success: '密码修改成功',
    failed: '密码修改失败，请重试',
  },

  // 挑战详情
  challengeDetail: {
    round: '场次',
    roundWaterInfo: '本场上下水',
    roundTranscoding: '本场转码',
    inProgress: '进行中',
    ended: '已结束',
    detailInfo: '详细信息',
    createTime: '创建时间',
    faultBetData: '修改的押注数据',
    faultBetNumber: '修改后押注金额',
    detail: '挑战详情',
    endChallenge: '结束挑战',
    endSuccess: '挑战已成功结束',
    endFailed: '操作失败，请重试',
    confirmEnd: '确认结束挑战',
    confirmEndMessage: '确定要结束该挑战吗？此操作不可撤销。',
    confirmEndAction: '确认结束',
    noDetail: '暂无挑战详情',
    roundInfo: '场次信息',
    challengeName: '挑战名称',
    location: '挑战地点',
    time: '挑战时间',
    pitcher: '投手',
    recorder: '记录人',
    waterProfit: '上下水',
    turnover: '转码',
  },

  // 场次详情
  roundDetail: {
    title: '场次详情',
    betAmount: '金额',
    status: '状态',
    eventNumber: '轮次',
    modifyBet: '修改押注',
    inputNumber: '请输入数字',
    modifyBetTitle: '修改押注金额',
    modifyBetConfirmation: '确认修改押注金额为:',
    modifyBetPlaceholder: '请输入新的押注金额',
    modifySuccess: '修改成功',
    modifyFailed: '修改失败',
    betAmountMin: '押注金额必须大于0',
    betAmountMax: '押注金额必须小于3000000',
    betAmountMultiple: '押注金额必须是100的倍数',
    round: '场次',
    roundWaterInfo: '本场上下水',
    roundTranscoding: '本场转码',
    createTime: '创建时间',
    noRounds: '暂无场次记录',
    restartRound: '重启本场',
    restartRoundTitle: '重启场次',
    restartRoundConfirmation: '确定要重启该场次吗？这将删除最后一把的数据。',
    restartRoundFailed: '重启场次失败',
  },

  // 挑战状态
  challenge: {
    status: {
      ended: '已结束',
      inProgress: '进行中',
      fundraising: '募资中',
      fundraisingCompleted: '募资完成',
      completed: '已完成',
      unknown: '未知',
    },
    createTime: '创建时间',
    location: '挑战地点',
    time: '挑战时间',
    pitcher: '投手',
    recorder: '记录人',
  },

  // 募资挑战
  fundraisingChallenge: {
    fundraisingInfo: '募资信息',
    principal: '本金',
    raisedAmount: '已募资金额',
    availableAmount: '可募资金额',
    contributionDetails: '出资明细',
    amount: '金额',
    noContributionRecords: '暂无出资记录',
    challengeDetails: '挑战详情',
    challengeName: '挑战名称',
    time: '时间',
    location: '地点',
    pitcher: '投手',
    view: '查看',
    fundraisingChallenges: '募资中挑战',
    noFundraisingChallenges: '暂无募资中的挑战',
    contriRate: '出资比例',
  },

  // 我的页面
  my: {
    membershipBenefits: '会员权益',
    historyRecord: '历史记录',
    myGames: '我的挑战',
    loginout: '退出',
  },

  // 我的挑战
  myGames: {
    title: '我的挑战',
    noGames: '暂无已完成的挑战记录',
    viewProfit: '查看利润分配',
    viewContribution: '查看出资',
    restart: '场次重启',
    editBet: '修改押注',
    roundDetails: '场次详情',
    noRounds: '暂无场次记录',
    restartRound: '重启本场',
    restartRoundTitle: '重启场次',
    restartRoundConfirmation: '确定要重启该场次吗？这将删除最后一把的数据。',
    restartRoundFailed: '重启场次失败',
    challengeTime: '挑战时间',
    challengeLocation: '挑战地点',
    pitcher: '投手',
    recorder: '记录',
    waterProfit: '挑战上下水',
    turnover: '挑战转码',
    profitDetails: '利润分配详情',
    loadingDetails: '正在加载详情...',
    noProfitInfo: '暂无利润分配信息',
    docCompany: '记录公司(总)',
    investCompany: '投资公司(总)',
    operationCompany: '运营公司',
    playerCompany: '投手公司',
    investCompanyProfitDetails: '投资公司利润详情',
    investPersonProfitDetails: '投资人利润详情',
    companyProfitDetails: '记录公司分配详情',
  },
};
