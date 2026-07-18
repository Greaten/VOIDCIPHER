/**
 * 「写给你的信」— 数据层
 * 旧手机解密游戏的所有内容数据
 */

// ========== 短信记录 ==========
const SMS_DATA = {
  inbox: [
    {
      id: 'msg_001',
      from: '遥遥',
      name: '遥遥',
      date: '2024-06-15 19:32',
      text: '爸，父亲节快乐。给你买的茶叶到了没？对了，遥遥生日是9月15号，你上次说要设个提醒的，设了没？',
      read: true,
      deleted: false
    },
    {
      id: 'msg_002',
      from: '遥遥',
      name: '遥遥',
      date: '2024-06-15 19:35',
      text: '嗯知道了',
      read: true,
      deleted: false,
      note: '这是最后一条短信。三个月后，父亲去世。'
    },
    {
      id: 'msg_003',
      from: '遥遥',
      name: '遥遥',
      date: '2024-05-20 12:00',
      text: '爸，我在忙，晚点给你打电话。',
      read: true,
      deleted: false
    },
    {
      id: 'msg_004',
      from: '遥遥',
      name: '遥遥',
      date: '2024-05-01 09:15',
      text: '五一快乐爸，我不回去了，公司有事。',
      read: true,
      deleted: false
    },
    {
      id: 'msg_005',
      from: '遥遥',
      name: '遥遥',
      date: '2024-04-12 22:30',
      text: '今天发了条朋友圈，你看到了吗？',
      read: true,
      deleted: false
    },
    {
      id: 'msg_006',
      from: '遥遥',
      name: '遥遥',
      date: '2024-04-12 22:31',
      text: '就是加班那个，没什么大事，别担心。',
      read: true,
      deleted: false,
      clue: true,
      note: '这条紧接着上一条。父亲从「加班」两个字开始警觉。'
    },
    {
      id: 'msg_007',
      from: '138xxxx4721',
      name: '小陈',
      date: '2024-03-28 14:20',
      text: '周叔，我是小陈，上次您说想了解的情况我整理了一下，方便见面聊吗？',
      read: true,
      deleted: false,
      clue: true
    },
    {
      id: 'msg_008',
      from: '138xxxx4721',
      name: '小陈',
      date: '2024-03-15 10:08',
      text: '周叔您好，我是遥遥以前的同事小陈。听您说遥遥最近状态不好，我有些情况想跟您说，但电话里不方便。',
      read: true,
      deleted: false,
      clue: true,
      note: '第一个关键线索：小陈是前员工，主动联系了父亲。'
    },
    {
      id: 'msg_009',
      from: '139xxxx8830',
      name: '工会老李',
      date: '2024-04-03 16:45',
      text: '周师傅，劳动仲裁的流程材料我发您邮箱了，您看看。另外那个号码是仲裁咨询热线，您有问题可以打。',
      read: true,
      deleted: false,
      clue: true
    },
    {
      id: 'msg_010',
      from: '12333',
      name: '劳动保障热线',
      date: '2024-04-05 09:00',
      text: '【人力资源和社会保障局】您的劳动保障咨询已登记，编号LA20240405-3372，可致电12333查询进度。',
      read: true,
      deleted: false,
      clue: true
    },
    {
      id: 'msg_011',
      from: '遥遥',
      name: '遥遥',
      date: '2024-02-10 20:00',
      text: '爸新年快乐，今年过年可能回不去了。',
      read: true,
      deleted: false
    },
    {
      id: 'msg_012',
      from: '遥遥',
      name: '物业',
      date: '2024-06-20 08:00',
      text: '周建国业主您好，您家3月份的水费尚未缴纳，请尽快处理。',
      read: true,
      deleted: false,
      note: '父亲去世后物业还在催费。'
    }
  ],
  deleted: [
    {
      id: 'del_001',
      from: '遥遥',
      name: '遥遥',
      date: '2024-03-02 23:47',
      text: '爸你别担心了，就是普通加班，大家都是这样的。',
      read: false,
      deleted: true,
      clue: true,
      note: '已删除的短信。孩子在凌晨接近12点回复，语气过于平静。'
    },
    {
      id: 'del_002',
      from: '遥遥',
      name: '遥遥',
      date: '2024-03-10 01:20',
      text: '没事爸，真的没事。',
      read: false,
      deleted: true,
      clue: true
    },
    {
      id: 'del_003',
      from: '138xxxx4721',
      name: '小陈',
      date: '2024-03-22 19:30',
      text: '周叔，其实遥遥在那边不太好。部门经理姓王，经常让人无偿加班，不干的就扣绩效。遥遥上次扛不住想辞职，王经理说辞职不给开离职证明。我怕遥遥不跟您说。',
      read: false,
      deleted: true,
      clue: true,
      note: '关键线索：小陈揭示了职场霸凌的具体情况。'
    },
    {
      id: 'del_004',
      from: '爸',
      name: '草稿箱',
      date: '2024-06-10 02:15',
      text: '遥遥，爸有些话想跟你说。不是催你回家，是……',
      read: false,
      deleted: true,
      clue: true,
      note: '父亲写给孩子的短信草稿，没有发出去。'
    }
  ]
};

// ========== 通话记录 ==========
const CALL_DATA = [
  { type: 'incoming', from: '遥遥', number: '135xxxx0915', date: '2024-06-15 19:30', duration: '0:42' },
  { type: 'outgoing', to: '遥遥', number: '135xxxx0915', date: '2024-06-10 20:15', duration: '未接通' },
  { type: 'outgoing', to: '遥遥', number: '135xxxx0915', date: '2024-06-08 19:00', duration: '未接通' },
  { type: 'outgoing', to: '遥遥', number: '135xxxx0915', date: '2024-06-05 21:30', duration: '1:30' },
  { type: 'incoming', from: '138xxxx4721', number: '138xxxx4721', date: '2024-04-20 15:22', duration: '12:45', clue: true },
  { type: 'outgoing', to: '12333', number: '12333', date: '2024-04-05 08:55', duration: '8:30', clue: true },
  { type: 'outgoing', to: '139xxxx8830', number: '139xxxx8830', date: '2024-04-03 16:30', duration: '15:20', clue: true },
  { type: 'incoming', from: '138xxxx4721', number: '138xxxx4721', date: '2024-03-28 14:00', duration: '6:10', clue: true },
  { type: 'incoming', from: '138xxxx4721', number: '138xxxx4721', date: '2024-03-15 10:00', duration: '22:30', clue: true, note: '小陈第一次来电，谈了22分钟。' },
  { type: 'outgoing', to: '遥遥', number: '135xxxx0915', date: '2024-03-02 23:40', duration: '未接通', note: '深夜打给孩子，没接。' },
  { type: 'outgoing', to: '遥遥', number: '135xxxx0915', date: '2024-03-02 23:30', duration: '未接通', note: '连续两次未接通。' },
  { type: 'incoming', from: '遥遥', number: '135xxxx0915', date: '2024-02-10 20:00', duration: '3:20' },
  { type: 'outgoing', to: '遥遥', number: '135xxxx0915', date: '2024-02-02 18:00', duration: '5:10' },
  { type: 'incoming', from: '物业', number: '021-5xxx', date: '2024-01-15 10:00', duration: '1:00' }
];

// ========== 相册 ==========
const PHOTO_DATA = [
  {
    id: 'photo_001',
    date: '2024-04-15',
    title: ' IMG_001',
    desc: '一张街景照片，远处能看到写字楼的灯还亮着。时间戳20:47。',
    clue: true,
    note: '父亲在公司楼下蹲拍的照片，证明加班。',
    locked: false
  },
  {
    id: 'photo_002',
    date: '2024-04-20',
    title: 'IMG_002',
    desc: '咖啡店角落的照片，桌对面坐着一个年轻人（小陈），桌上摊着几份文件。',
    clue: true,
    note: '和小陈见面的照片。',
    locked: false
  },
  {
    id: 'photo_003',
    date: '2024-05-05',
    title: 'IMG_003',
    desc: '一张超市小票的照片。小票上除了日常用品，还有一箱牛奶。手写备注：遥遥爱喝的。',
    clue: true,
    locked: false,
    note: '最后的情感锚点。'
  },
  {
    id: 'photo_004',
    date: '2009-09-01',
    title: 'IMG_004',
    desc: '一张老照片的翻拍。一个小女孩穿着红色校服站在学校门口，身后是「阳光小学」的招牌。旁边站着一个年轻的男人，笑着摸她的头。',
    clue: true,
    locked: false,
    note: '转学那天的合影。密码线索：红色校服。'
  },
  {
    id: 'photo_005',
    date: '2024-04-22',
    title: 'IMG_005',
    desc: '一张模糊的照片，像是偷拍的。一个中年男人（王经理）在公司门口对另一个人指指点点。',
    clue: true,
    locked: false,
    note: '偷拍的王经理在公司门口训人。'
  },
  {
    id: 'photo_006',
    date: '2024-03-19',
    title: 'IMG_006',
    desc: '一张电脑屏幕的照片，上面是一份工资条明细。基本工资3000，加班费0，绩效扣款-800，实发2200。',
    clue: true,
    locked: false,
    note: '孩子发朋友圈时无意间露出的工资条，父亲截图保存了。'
  }
];

// ========== 备忘录 ==========
const MEMO_DATA = [
  {
    id: 'memo_001',
    title: '买菜清单',
    date: '2024-06-18',
    content: '鸡蛋\n白菜\n豆腐\n酱油\n（遥遥爱喝的牛奶——买了一箱放冰箱）',
    locked: false
  },
  {
    id: 'memo_002',
    title: '电话号码',
    date: '2024-04-03',
    content: '小陈 138xxxx4721\n工会老李 139xxxx8830\n劳动仲裁咨询 12333\n仲裁编号 LA20240405-3372',
    locked: false,
    clue: true
  },
  {
    id: 'memo_003',
    title: '加密备忘 · 一',
    date: '2024-04-01',
    content: '小陈说的那些情况我记下来了。\n\n1. 王经理强制无偿加班，不加班扣绩效\n2. 辞职不给开离职证明\n3. 有几个人已经走了，但都不敢说话\n4. 小陈说他有当时的排班表和群聊截图\n\n我得出面。遥遥不会跟我说，我知道她。',
    locked: true,
    lockHint: '你小学二年级转学那天穿的什么颜色衣服？（英文）',
    password: 'red',
    clue: true
  },
  {
    id: 'memo_004',
    title: '加密备忘 · 二',
    date: '2024-05-10',
    content: '今天又去了一趟公司楼下。数了一下，晚上9点还有14个人在加班。\n\n拍了照。保安认识我了，问我是不是接孩子的。我说是。\n\n不是假话。',
    locked: true,
    lockHint: '我们第一次养小米是哪天？（8位数字，如20090101）',
    password: '20090312',
    clue: true
  },
  {
    id: 'memo_005',
    title: '给遥遥的信',
    date: '2024-06-20',
    content: '遥遥：\n\n爸帮你查了一些事，你别怪爸多管闲事。\n\n你那个王经理，他做的事不合法。我找了工会老李，也打了12333。材料我都整理好了，在文件管理里，密码你知道的。\n\n你可以去申请劳动仲裁。排班表、群聊截图、工资条照片、还有小陈他们的证言，都在里面。\n\n不是爸要你跟公司闹。是你不能让人这么欺负。\n\n爸没什么本事，但帮你跑跑腿、拍个照还是行的。\n\n你回来的路上要是渴了，冰箱里有牛奶。',
    locked: true,
    lockHint: '需要从音乐播放器找到线索',
    password: 'gxnd',
    clue: true,
    isFinal: true
  },
  {
    id: 'memo_006',
    title: '提醒',
    date: '2024-06-12',
    content: '下周去把信寄出去。\n\n牛奶快过期了，遥遥还没回来。',
    locked: false,
    clue: true,
    note: '信最终没有寄出去。'
  }
];

// ========== 日历 ==========
const CALENDAR_DATA = [
  { date: '2024-09-15', title: '遥遥生日', note: '记得发红包', clue: true },
  { date: '2024-06-15', title: '父亲节', note: '遥遥发了消息' },
  { date: '2024-06-10', title: '', note: '打电话没接', clue: true },
  { date: '2024-05-10', title: '去公司', note: '晚上8点到，数了14个人', clue: true },
  { date: '2024-04-20', title: '见小陈', note: '咖啡店，带了文件', clue: true },
  { date: '2024-04-05', title: '打电话', note: '12333，仲裁咨询', clue: true },
  { date: '2024-04-03', title: '见老李', note: '工会，拿材料', clue: true },
  { date: '2024-03-28', title: '小陈来电', note: '说有情况要当面聊', clue: true },
  { date: '2024-03-15', title: '', note: '小陈第一次联系我', clue: true },
  { date: '2024-03-02', title: '', note: '遥遥朋友圈说加班。打电话没接。', clue: true },
  { date: '2009-03-12', title: '领养小米', note: '遥遥放学路上捡的猫', clue: true },
  { date: '2009-09-01', title: '遥遥转学', note: '阳光小学，穿了新校服', clue: true }
];

// ========== 音乐播放器 ==========
const MUSIC_DATA = [
  { id: 'song_001', title: '给自己的歌', artist: '李宗盛', duration: '4:32' },
  { id: 'song_002', title: '想念你', artist: '未知歌手', duration: '3:45' },
  { id: 'song_003', title: '你的样子', artist: '罗大佑', duration: '4:18' },
  { id: 'song_004', title: '等你等到我心痛', artist: '张学友', duration: '4:05' }
];

// 4首歌名首字拼音首字母：给(G) 想(X) 你(N) 等(D) → GXND

// ========== 文件管理 ==========
const FILE_DATA = [
  {
    id: 'file_001',
    name: '证据材料_整理.pdf',
    size: '2.3 MB',
    date: '2024-06-18',
    locked: true,
    password: 'gxnd',
    content: `【劳动仲裁证据材料】

一、当事人信息
申请人：周遥
被申请人：XX科技有限公司

二、证据清单
1. 2024年1-6月排班表（小陈提供原件照片）
   - 证明每周加班时长超过36小时
   
2. 部门群聊截图（小陈提供）
   - 王经理：「不加班的绩效自己看着办」
   - 王经理：「离职证明？你想清楚再说」
   
3. 工资条照片（遥遥朋友圈截图）
   - 基本工资3000，加班费0，绩效扣款-800
   - 实发2200，低于当地最低工资标准
   
4. 加班人员统计（父亲实地蹲点记录）
   - 2024年5月10日 20:00-21:30 在岗14人
   - 2024年5月17日 20:00-21:00 在岗11人
   - 2024年5月24日 20:00-21:30 在岗13人
   
5. 证人证言
   - 前员工陈XX（小陈）：书面证言已整理
   - 前员工张XX：口头证实相同情况
   - 工会李XX：提供公司往年加班数据对比

三、法律依据
- 《劳动法》第41条：加班每日不超过3小时，每月不超过36小时
- 《劳动合同法》第31条：用人单位不得强迫劳动
- 《劳动合同法》第50条：离职时应当出具解除证明

四、建议行动
1. 携带以上材料到劳动仲裁委员会申请仲裁
2. 仲裁编号已登记：LA20240405-3372
3. 可同时主张加班费、克扣工资及经济补偿`
  },
  {
    id: 'file_002',
    name: '给遥遥的信.txt',
    size: '1.2 KB',
    date: '2024-06-20',
    locked: true,
    password: 'gxnd',
    content: `遥遥：

爸帮你查了一些事，你别怪爸多管闲事。

你那个王经理，他做的事不合法。我找了工会老李，也打了12333。材料我都整理好了，在文件管理里，密码你知道的。

你可以去申请劳动仲裁。排班表、群聊截图、工资条照片、还有小陈他们的证言，都在里面。

不是爸要你跟公司闹。是你不能让人这么欺负。

爸没什么本事，但帮你跑跑腿、拍个照还是行的。

你回来的路上要是渴了，冰箱里有牛奶。

                                        爸
                                   2024年6月20日

P.S. 超市小票我放相册里了。那箱牛奶是顺便买的，你别嫌多。`
  },
  {
    id: 'file_003',
    name: '超市小票.jpg',
    size: '850 KB',
    date: '2024-06-18',
    locked: false,
    content: `[图片文件] 一张超市小票的照片。

小票内容：
鸡蛋 ×1        6.80
白菜 ×2        3.60
豆腐 ×1        2.50
酱油 ×1        8.90
纯牛奶（整箱）×1   58.00

总计：¥79.80

小票空白处有手写字迹：遥遥爱喝的，买了一箱放冰箱。`
  }
];
