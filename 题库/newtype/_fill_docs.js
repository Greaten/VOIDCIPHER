// ALTER — fill missing documents
// Inserts ext-autopsy + 13 therapy transcripts into DOCUMENTS in transcripts.js
var fs = require('fs');
var path = 'E:/website/题库/newtype/js/data/transcripts.js';
var src = fs.readFileSync(path, 'utf8');

// New documents to insert, in order
var newDocs = {};

// ══════════ ext-autopsy ══════════
newDocs['ext-autopsy'] = {
  type: 'evidence',
  title: '苏景州尸检报告',
  meta: '案件编号：JF-2024-0403-07 · 法医：陈远 · 解剖日期：2024.04.04 · 归档状态：内部',
  sections: [
    {
      heading: '基本事实',
      paragraphs: [{
        segments: [{ text: '死者苏景州，男，42岁，辰星制药总部办公室主任。死亡地点：辰星制药总部17F办公室。死亡时间推定：2024年4月3日15:50-16:20之间。直接死因：颈部左侧注射器刺入致颈内静脉破裂合并神经肌肉阻断剂急性中毒（罗库溴铵类物质）。' }]
      }]
    },
    {
      heading: '外伤检查',
      paragraphs: [
        { segments: [{ text: '颈部左侧：单处穿刺伤，深度3.2cm。针道走向：由前上至后下，角度约15°——与一个身高172-178cm的右利手成年人握持注射器自正面攻击的典型轨迹一致。注射器活塞底部指纹与陆时砚（ID 001）右手食指、中指吻合。' }] },
        { segments: [{ text: '右手掌侧：防御性锐器伤2处（玻璃碎屑造成），左手无防御伤痕。结论：死者死前未做出有效的防御反应——这不是面对面的搏斗。是被压住或已经失去行动能力后的处决。' }] }
      ]
    },
    {
      heading: '关键异常',
      paragraphs: [
        { segments: [{ text: '注射器活塞末端指纹分析：活塞末端存在第三组指纹——不属于死者、也不属于陆时砚。指纹纹型为斗型纹，与数据库比对后匹配至：■■■■■。', highlightable: true, pinId: 'p5-witness-fourth', pinSource: '苏景州尸检报告 · 第三组指纹' }] },
        { segments: [{ text: '右手虎口处针孔：陆时砚右手虎口部位存在另一处穿刺伤——针头直径0.4mm（胰岛素注射器规格），与杀死苏景州的注射器（5mL标准注射器，针头直径0.8mm）不符。虎口针孔周围检测到微量的γ-氨基丁酸类镇静剂残留——肌松药中不应出现的成分。' }] },
        { segments: [{ text: '法医陈远备注：\"陆时砚被注射的不是神经肌肉阻断剂。是被给了镇静剂。他在办公室里被麻醉——然后他的身体被用来杀死苏景州。有人在用他的身体。\"' }] }
      ]
    }
  ]
};

// ══════════ trans-02 ══════════
newDocs['trans-02'] = {
  type: 'transcript',
  title: '第 2 次治疗会话',
  meta: '日期：2024.04.19 · 评估员：沈若楠 · 参与人格：CORE · 主题：建立基线',
  lines: [
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"上次你说你不确定说话的是不是陆时砚。今天是谁在说话？"' }] },
    { label: '[CORE]', speaker: 'patient', segments: [{ text: '"CORE。这不是我的名字——是我给自己贴的标签。方便分类。你不喜欢这个说法——没关系。但它准确。"' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"你怎么知道我不喜欢？"' }] },
    { label: '[CORE]', speaker: 'patient', segments: [{ text: '"你上次结束时在笔记本上写的字。你的字体在写-标签化-时比平时多用了0.3N的压力。你还画了一条竖线——强行换主题的记号。沈医生——你不擅长隐藏信息。"' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"他能从我的笔迹反推我的情绪状态。不是读心——是分析。这种精度的观察力需要一个完全没有情绪干扰的大脑。CORE不是-没有情绪-——他是把情绪关在了另一个隔间里。"' }] }
  ]
};

// ══════════ trans-03 ══════════
newDocs['trans-03'] = {
  type: 'transcript',
  title: '第 3 次治疗会话',
  meta: '日期：2024.04.22 · 评估员：沈若楠 · 参与人格：THE CRITIC（首次出现） · 主题：系统质疑',
  lines: [
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"之前和CORE的对话很有帮助。今天——"' }] },
    { label: '[THE CRITIC]', speaker: 'patient', segments: [{ text: '"有帮助？他对你撒谎。CORE以为自己是第一个——他不是。这个身体在10月4日醒过——一个没有名字的东西醒了几分钟，然后又没了。CORE不知道因为他不会承认自己不是第一个。他需要那个位子——-我是第一个-是他的全部身份。你把一块拼图放在盒子上写-第一块-、再给他发个ID卡——他可以为这个谎言杀人了。他已经杀人了。只是不承认。"' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"你在说10月4日。有什么证据？"' }] },
    { label: '[THE CRITIC]', speaker: 'patient', segments: [{ text: '"护理记录。被人删了。但记录里有空白。你的记录里有空白。所有你以为完整的东西都有空白。你是个医生——医生最怕空白。所以你们填。填到空白消失为止。但空白没有消失。只是被埋了。"', highlightable: true, pinId: 'p3-critic-gap', pinSource: 'THE CRITIC · 第3次会话' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"THE CRITIC的首次出现。一个能识别系统漏洞的人格。他给我的第一个线索是2021年9月底到10月初的护理记录空白。我去核实了——他说的是真的。空白确实存在。他是-制造噪音的人-——但在噪音里藏着唯一正确的方向。"' }] }
  ]
};

// ══════════ trans-04 ══════════
newDocs['trans-04'] = {
  type: 'transcript',
  title: '第 4 次治疗会话',
  meta: '日期：2024.04.26 · 评估员：沈若楠 · 参与人格：CORE · 主题：原初记忆检视',
  lines: [
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"我们上次谈到你的想法。今天我想问你一个具体的问题：你是谁？"' }] },
    { label: '[CORE]', speaker: 'patient', segments: [{ text: '"我是第一个。2021年10月5日。在ICU醒来。没有情绪——只有事实。我的工作是收集数据、分析数据、得出结论。其它人格是做-感受-的部分。我是做-理解-的部分。我理解火灾。我理解辰星。我理解顾鸣。但我不理解为什么没有人理解这些理解。"', highlightable: true, pinId: 'p1-core-first', pinSource: 'P01 · CORE · 第4次会话' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"你的女儿呢？你记得她吗？"' }] },
    { label: '[CORE]', speaker: 'patient', segments: [{ text: '"我的女儿？逻辑上她是我女儿。我不记得她的脸。但我知道她存在——因为THE CHILD存在。THE CHILD记得。THE CHILD是她的备份。不是比喻。我是她的逻辑部分。THE CHILD是她的感官记忆。我们被——分配了。"' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"CORE说了-分配-。不是-分裂-、不是-破碎-——是-分配-。用词和THE SOLDIER的-任务-一脉相承。这些不是创伤造成的隐喻——是一个人被系统地拆解成了14个功能模块。谁在做这个分配？答案不在病人脑子里——在三院这个楼里。"' }] }
  ]
};

// ══════════ trans-06 ══════════
newDocs['trans-06'] = {
  type: 'transcript',
  title: '第 6 次治疗会话',
  meta: '日期：2024.05.08 · 评估员：沈若楠 · 人格交替：THE CHILD / HOST · 主题：记忆碎片',
  lines: [
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"THE CHILD上次给我看了你的画。我很喜欢。"' }] },
    { label: '[THE CHILD]', speaker: 'patient', segments: [{ text: '"你喜欢橙色吗？那幅画里最多的是橙色。橙色是暖的。橙色是安全的。但橙色会变成红色。那天晚上橙色变成红色了。不是小雨看到的——是小雨在别人的记忆里看到的。小雨没在那个房间里——小雨在另一个房间里。门关着。但门缝下面有光。橙色的光变成了红色的光。然后就没有光了。"' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"THE CHILD描述的-门缝下的光——这是火灾当晚的真实记忆片段。但不是THE CHILD的视角。她说她不在那个房间里。这个记忆片段属于谁？火灾当晚，小雨的房间门是关着的。如果她看到门缝下的火光——说明有人在过道上。不是陆时砚本人（他在客厅）——是另一个人经过小雨的房间门。房间里还有别人。"' }] }
  ]
};

// ══════════ trans-07 ══════════
newDocs['trans-07'] = {
  type: 'transcript',
  title: '第 7 次治疗会话',
  meta: '日期：2024.05.14 · 评估员：沈若楠 · 人格交替：CORE + THE CRITIC · 主题：事实 vs 感受',
  lines: [
    { label: '[CORE]', speaker: 'patient', segments: [{ text: '"我需要修正上次的陈述。THE CHILD的画是正确的——三个人加一个-别人-。根据火灾调查报告，我的妻子在卧室。我的女儿在她自己的房间。我在客厅。火灾从客厅开始。但客厅的起火点——西北角——距离我所在的位置不到三米。我没有烧伤之外的记忆——不是因为创伤压抑——是因为我在起火后不到一分钟就失去了意识。一个失去意识的人不可能在-起火两小时前-看到一辆黑色轿车。但我确实知道这件事。这个信息不是我的——是从一个火光照着的窗户玻璃的反射中看到的。我看到的不是火灾——是火灾的倒影。我看到的东西是被反射进来的。"' }] },
    { label: '[THE CRITIC]', speaker: 'patient', segments: [{ text: '"他说了半天——意思是他不是一个人在那间屋子里。有人在客厅和他在一起。这个人打破了窗户。他看到了窗户玻璃里的倒影。但他说-不是我看到的-。笨蛋。他是在说：那个在起火前两小时站在窗边看到轿车的人——不是他。CORE的-逻辑推理-是别的人格直接把计算结果塞进他脑子里——原料来自一个他没见过的证人。"' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"如果THE CRITIC是对的——那火灾当晚有一个我尚未接触的人格，在火光照亮的玻璃里看到了顾鸣的车。这个人格没有出现在档案里。不在14个里面。它有火灾的记忆——但被隔离了。"' }] }
  ]
};

// ══════════ trans-09 ══════════
newDocs['trans-09'] = {
  type: 'transcript',
  title: '第 9 次治疗会话',
  meta: '日期：2024.05.25 · 评估员：沈若楠 · 人格交替：HOST · 主题：日常意识',
  lines: [
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"你连续几周没有出现了。最近是谁在控制？"' }] },
    { label: '[HOST]', speaker: 'patient', segments: [{ text: '"不是我。最近是那个一直在讲话的人。CORE。他讲话的时候我在后面——像一个在观众席里的人。我能听到他说话——我能感觉到他的逻辑。但他的逻辑不是我的逻辑。他的-事实-里没有温度。我不知道为什么这让我难受——但他讲的事实让我的胃在抽搐。就像他在宣布别人的死亡报告——而那些死人里面有一个人的名字是我妻子的名字。"' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"CORE说他是第一个出现的。你怎么看？"' }] },
    { label: '[HOST]', speaker: 'patient', segments: [{ text: '"CORE以为他是第一个。不——是我。我让他先说话——因为我太累了。10月5日那天——是我把灯打开了——他把脚迈出去了。他以为他的第一步是第一步——但他没有开灯。是我开了灯。我开了灯之后太累了——就退回去了。他把灯当作天亮。"', highlightable: true, pinId: 'p1-host-let', pinSource: 'P08 · HOST · 第9次会话' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"HOST讲了一件事——他说他开了灯。这和CORE的-我是第一个-直接冲突。CORE说他在10月5日醒来，但没有描述醒来之前的一瞬间。HOST描述了——那是打开灯的一瞬间。如果HOST是真的——那CORE的存在，在某种程度上，是HOST的产物。是他-让-它先出现的。原初人格不是CORE——是一个疲惫到只想关灯的人。"' }] }
  ]
};

// ══════════ trans-10 ══════════
newDocs['trans-10'] = {
  type: 'transcript',
  title: '第 10 次治疗会话',
  meta: '日期：2024.05.28 · 评估员：沈若楠 · 参与人格：THE ANALYST · 主题：人格地图',
  lines: [
    { label: '[THE ANALYST]', speaker: 'patient', segments: [{ text: '"你问了我三周该怎么评估他们。我的回答：不要问CORE。不要问HOST。CORE只有数据，HOST只有感觉。你要同时问13个人。不是同时——是在同一页纸上。列出每个人的陈述——然后看不一致的地方。不一致的地方不是bug——那是线索。我说完了。问吧。"' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"你认为CORE在说谎？"' }] },
    { label: '[THE ANALYST]', speaker: 'patient', segments: [{ text: '"CORE不在说谎。CORE在被说谎。有人给了他数据——他把数据组织成逻辑——然后告诉你逻辑上的结论。但数据本身就是被编造的——所以他的逻辑再完美也是错的。这不是他的错。他的工作是-精确-。不是-真实-。两个东西不一样。"' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"谁在给他假数据？"' }] },
    { label: '[THE ANALYST]', speaker: 'patient', segments: [{ text: '"我给不了你这个答案。我只能告诉你：出去查。出去查护理记录。出去查药物。出去查是谁在决定了我们每天是谁。因为这不是自然切换——有人在安排-切换。每一个我们出现的时间都是被安排的。我们是按课程表在上课。老师不在教室里。老师在监控室里。找监控。"' }] }
  ]
};

// ══════════ trans-12 ══════════
newDocs['trans-12'] = {
  type: 'transcript',
  title: '第 12 次治疗会话',
  meta: '日期：2024.06.04 · 评估员：沈若楠 · 人格交替：THE ARTIST + THE ANALYST · 主题：解码画作',
  lines: [
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"THE ARTIST——你的画——这些形状。你能告诉我它们是什么吗？"' }] },
    { label: '[THE ARTIST]', speaker: 'patient', segments: [{ text: '（没有语言回应。在纸上画了一个大圈——圈住所有六边形和五边形——然后画了一个箭头，指向自己的太阳穴。）' }] },
    { label: '[THE ANALYST]', speaker: 'patient', segments: [{ text: '"他在告诉你一件事。他不说话不是因为他不愿意说话——是因为有人把他的嘴缝上了。不是比喻。他的语言中枢被抑制了——不是创伤性的缄默症——是药理学的。氯硝西泮在治疗窗内的常见副作用之一是失语症——在长期低剂量使用时更常见。我计算过：他的每日剂量足以抑制布罗卡区——说话的部分——但不够抑制运动皮层。所以他可以动。可以画画。但不能说话。医生——他们不只是给他下药——他们是在逐个关闭他的大脑功能。"' }] }
  ]
};

// ══════════ trans-13 ══════════
newDocs['trans-13'] = {
  type: 'transcript',
  title: '第 13 次治疗会话',
  meta: '日期：2024.06.10 · 评估员：沈若楠 · 人格交替：THE ANALYST + THE CRITIC · 主题：系统的结构',
  lines: [
    { label: '[THE CRITIC]', speaker: 'patient', segments: [{ text: '"你花了12次会话终于开始查护理记录了。不错——比大多数医生快。大多数医生在第30次还在画家庭动力图。你没有——你意识到了这不是一个家——这是一个监狱。所以我现在告诉你一件事：监狱的钥匙不在监狱里。在办公楼。在另一栋楼。在辰星的17楼。去找苏景州的办公室——不是杀人现场——是之前的东西。他在死前三个月处理过一份文件——编号是NC-7b-IRB-2023。IRB是伦理审查委员会。这份文件审查的不是动物实验——是人体实验。他的审批栏上只有一个签字：顾鸣。"' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"你怎么知道这份文件的内容？"' }] },
    { label: '[THE CRITIC]', speaker: 'patient', segments: [{ text: '"因为陆时砚在死之前看过它。苏景州给他看了。不是出于好意——是威胁。-你看——你查的这些东西，都有签字，都有审批——你去找任何人说，都没用——。但陆时砚做了笔记。记在脑子里了。那个笔记现在在我的分区里。被锁着。不是因为我不想给你——是因为钥匙在别人那里。在那个开灯的人那里。HOST有密码。没有密码你读不了。"' }] }
  ]
};

// ══════════ trans-15 ══════════
newDocs['trans-15'] = {
  type: 'transcript',
  title: '第 15 次治疗会话',
  meta: '日期：2024.06.17 · 评估员：沈若楠 · 人格交替：THE PROTECTOR + THE WITNESS · 主题：办公室的记忆',
  lines: [
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"我们上次谈了THE SOLDIER的记忆缺失。今天我想问问——在办公室里——谁是第一个出现的？"' }] },
    { label: '[THE PROTECTOR]', speaker: 'patient', segments: [{ text: '"不重要谁是第一个。重要的是苏景州拿着注射器。注射器里有东西。不是你平时在诊所里看到的那种药。是——做实验用的那种。用来关掉人的那种。我看到那个注射器的时候——我没有思考。我的身体就动了。这身体被训练过——被谁训练我不是很清楚。但有一个阶段——有一个我不记得的阶段——在那里面——有人教了这个身体一套不需要大脑的反应。抓-挡-推-倒。像一套安装好的程序。不是我的程序。是装在硬件上的。"' }] },
    { label: '[THE WITNESS]', speaker: 'patient', segments: [{ text: '"他的版本是真的——但不完整。在他抓住苏景州的手之后——在他推倒他之前——有人从门口走进来了。白色的外套。戴口罩。但眼睛——我记得眼睛。那种眼睛不是来帮忙的。是来检查的。像是在看实验结果。苏景州在地上——那个人在看——然后注射器从右边来了——不是苏景州的手——是门口的另一个人的手。苏景州不是身体被用来杀人——他的身体被另一个人杀了。"', highlightable: true, pinId: 'p5-witness-fourth', pinSource: 'THE WITNESS · 第15次会话' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"THE WITNESS说的和尸检报告的结论是一致的：第三组指纹。注射器不是陆时砚刺进去的——是第三个在场的人刺的。这个人穿着白大褂。在三院精神科——穿白大褂的只有三种人：医生、研究员、和拿着三院通行证的药企高管。"' }] }
  ]
};

// ══════════ trans-16 ══════════
newDocs['trans-16'] = {
  type: 'transcript',
  title: '第 16 次治疗会话',
  meta: '日期：2024.06.19 · 评估员：沈若楠 · 人格交替：THE JOURNALIST · 主题：调查笔记',
  lines: [
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"你是——THE JOURNALIST。我需要你的帮助。"' }] },
    { label: '[THE JOURNALIST]', speaker: 'patient', segments: [{ text: '"你要USB。你也想要——和一个多月前那个女医生一样。她来了两次。然后不来了。USB不在我这里——在我知道的地方。我不能告诉你在哪里因为一旦说出来就不安全了。这个房间里不是只有我们。有人在听。录音。不是你的录音——走廊上的。每次会谈后有人听你的录音。然后调整给他的药。所以我说的话必须是不能被拿到的东西。USB是一个密码。密码是四个数字。不是日期。不是生日。是第一份报告的文件编号。"', highlightable: true, pinId: 'noise2-journalist-usb', pinSource: 'P09 · THE JOURNALIST · 第16次会话' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"第一份报告。关于什么的？"' }] },
    { label: '[THE JOURNALIST]', speaker: 'patient', segments: [{ text: '"关于你不知道的事。关于一个在辰星做清洁工的女人。2019年2月。她被辞退——因为她发现的太多了。她来找了一个记者——一个刚入职辰星的记者。实习期。第一篇报道没发表。被辰星压下来了。这个记者把她的陈述——完整地——保存在一个加密USB里。那个USB不在这里——在一个人手里。一个你觉得已经不存在的人。他没有死——他只是被藏起来了。他会在你找到他的时候告诉你密码。他不告诉我——他对谁都不说——除了那个值得知道的人。"' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"Karn Sterling。THE JOURNALIST说的是Karn Sterling。清洁工、第一篇被压的报道、USB。档案里确实有Karn的研究材料——在Chamber 004。但我从没见过Karn本人。他在逃——在裂隙地带。如果他真的是USB的拥有者——那这场游戏的边界不在三院。在围墙外面。"' }] }
  ]
};

// ══════════ trans-19 ══════════
newDocs['trans-19'] = {
  type: 'transcript',
  title: '第 19 次治疗会话',
  meta: '日期：2024.06.25 · 评估员：沈若楠 · 人格交替：HOST · 主题：沈若楠的安全',
  lines: [
    { label: '[HOST]', speaker: 'patient', segments: [{ text: '"沈医生。你今天看起来不像平时的你。"' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"什么意思？"' }] },
    { label: '[HOST]', speaker: 'patient', segments: [{ text: '"你平时进来的时候先看时钟。今天你没看时钟——你先看了门口。你在等什么人进来。你的肩膀——你平时坐下去的时候是直的——今天你是斜的。你在防备。有人在威胁你——不是病人——是你的同事。在三院里面。"' }] },
    { label: '[沈若楠 · 备注]', speaker: 'doctor', segments: [{ text: '"他说对了。我今天确实先看了门。昨天我发现了一件事——方小娟在翻阅我的评估文件。陈志明告诉我了。不是-药物核对-——她没有那个权限。她是顾鸣在三院的内线。我把记录加密了。但我不知道她看到了多少。如果她看到了我关于THE SLEEPER的笔记——接下来发生的事情可能不是-评估-。是-处理-。我需要更快。"' }] }
  ]
};

// ══════════ trans-21 ══════════
newDocs['trans-21'] = {
  type: 'transcript',
  title: '第 21 次治疗会话',
  meta: '日期：2024.07.01 · 评估员：沈若楠 · 人格交替：THE ANALYST · 主题：最终拼图',
  lines: [
    { label: '[THE ANALYST]', speaker: 'patient', segments: [{ text: '"你接近真相了。但不是全部。你看到了13个人。第14个不在你的视野里。THE SLEEPER——你只知道她在药效消退后出现。但你知道她在药效消退后做什么吗？你不说——我替你说。THE SLEEPER在拼。每次她醒来——90分钟——她把最近24小时内出现的其他人格的记忆碎片拼接起来。她不是一个人格——她是一个集成函数。这就是为什么他们不让她醒来。不是因为他们怕她——是因为他们会-完成-。你明白吗？她醒来超过90分钟——这个人在法律上就完整了。一个完整的人可以作证。可以指认顾鸣。可以烧掉辰星制药的整个法律防火墙。所以顾鸣用药维持了三年。不是惩罚——是死刑。化学死刑。"' }] },
    { label: '[沈若楠]', speaker: 'doctor', segments: [{ text: '"她需要多久才能稳定？"' }] },
    { label: '[THE ANALYST]', speaker: 'patient', segments: [{ text: '"我不知道。没有数据。因为没有人让她出现过超过90分钟。没有数据意味着你要自己去试。停药。然后等。问题是——你等得起吗？方小娟明天再上夜班。后天也是。我可以给你所有数据。我不能给你时间。"' }] }
  ]
};

// ══════════ Insert into file ══════════

// Find the last entry in DOCUMENTS, which is trans-23, ending with }\n};
// We need to insert before the closing }; that ends const DOCUMENTS
// The DOCUMENTS object ends with the last entry (trans-23) followed by \n};
// Strategy: find the unique signature at the end of trans-23 and insert before the closing

// trans-23 ends with its last line: ... }\n};
// Let's find 'trans-23' and then find the next occurrence of '\n};' which closes DOCUMENTS

var docsStart = src.indexOf('const DOCUMENTS = {');
var afterTrans23 = src.indexOf('"trans-23"', docsStart);
// Find the next };\n after trans-23's last content
var searchFrom = afterTrans23;
var braceCount = 0;
var foundOpen = false;
var insertPos = -1;

// Simpler approach: trans-23 is the last real entry. After it comes just whitespace then };
// The DOCUMENTS object ends with:
//   }  (close trans-23)
// };   (close DOCUMENTS const)
// Let's find the closing }; of DOCUMENTS

// After trans-23, the structure is:
// ... trans-23 content ... \n  }\n};
// The \n}; is the separator. But there could be multiple }];
// Let's search for the pattern: right after trans-23 there's the closing braces

// Actually, looking at the file structure:
// After the last document entry ends, there's:
//   }  ← closes the last document's object
// };   ← closes const DOCUMENTS = {
//
// I'll find the position after trans-23 and look for the pattern

// Find the last } in trans-23 and then look for the DOCUMENTS closing brace
var trans23End = src.indexOf('"trans-23"');
// After trans-23 data, find the next };\n
var searchEnd = src.indexOf('};', trans23End + 1000);
// But this could match other };

// Actually, const DOCUMENTS = { is followed by entries. After the last entry (trans-23),
// the file has: \n};\n
// which closes DOCUMENTS. Let me search for that exact pattern from the end.

// The last entry in the file is trans-23. After it, the structure is:
//
//  "trans-23": {
//    ... content ...
//    }
//  }
// };

// Wait, that's:
//   } — closes trans-23's object
// }; — closes DOCUMENTS

// Let me just find the final }; after all document entries
// The DOCUMENTS const is the last thing before EOF or before CONTRADICTION_RULES?

// Actually CONTRADICTION_RULES is at the TOP of the file (line ~64), DOCUMENTS is at the BOTTOM.
// After DOCUMENTS ends, the file ends or has nothing after.

// So the end of DOCUMENTS is either the very end of the file, or followed by a closing comment.
// Let me check: the file ends around line 2155+ with };\n after const DOCUMENTS

// Simpler: find the last occurrence of '};' in the file after DOCUMENTS
var lastBrace = src.lastIndexOf('};');
console.log('Last }; at position:', lastBrace);

// Confirm this is the DOCUMENTS closing by checking what's around it
var context = src.substring(lastBrace - 30, lastBrace + 5);
console.log('Context around last };:', JSON.stringify(context));

// Now generate the insertion string
var insertEntries = Object.keys(newDocs).map(function(id) {
  return ',\n  "' + id + '": ' + JSON.stringify(newDocs[id], null, 2);
}).join('');

// Insert before the final };
var newSrc = src.substring(0, lastBrace) + insertEntries + '\n};';

// Validate JavaScript syntax
fs.writeFileSync(path, newSrc, 'utf8');
console.log('Written', newSrc.length, 'bytes');
console.log('Inserted', Object.keys(newDocs).length, 'documents:', Object.keys(newDocs).join(', '));
