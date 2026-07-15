/**
 * ALTER — transcripts.js
 * 矛盾规则 · 结局文本 · 速查手册 · 文档数据
 */

const CONTRADICTION_RULES = [
  { id: 'P1', pair: 'p1-core-first:p1-host-let', title: '三个原初 — 谁先来', detail: 'CORE 声称自己是第一个出现的人格（2021.10.05），HOST 声称是自己让 CORE 先说话的——但护理记录的 10 月 4 日已经记录了一次短暂意识清醒。最早的意识不属于这 14 个人格中的任何一个。' },
  { id: 'P2', pair: 'p2-child-drawing:p2-police-car', title: '火灾的第四人', detail: 'THE CHILD 的画作中有第四个人形——\u201c顾叔叔\u201d。警方物业记录的黑色轿车持有医院通行证，于火灾前两小时进入、火灾后 12 分钟离开。火灾当晚顾鸣在场。这不是意外。' },
  { id: 'P3', pair: 'p3-critic-gap:p3-transfer-special', title: '消失的三天', detail: 'THE CRITIC 指出了 3 天的护理记录空白。转科记录证实了\u201c特殊观察室\u201d的存在和顾鸣的参与。药物记录有涂抹痕迹——NC-7b 被尝试掩盖。陆时砚的 DID 是药物人为诱发的。' },
  { id: 'P4', pair: 'p4-ghost-memory:p4-silent-names', title: '12 个死者的记忆', detail: 'THE GHOST 声称自己是已故受试者的记忆印记。THE SILENT ONE 的书写给出了 12 名死者的完整名单和编号。国家药监数据库中这 12 个编号不存在——从未被上报。' },
  { id: 'P5', pair: 'p5-protector-selfdefense:p5-witness-fourth', title: '办公室的三种真相', detail: 'PROTECTOR 说是自卫、WITNESS 说有第四个人在门口。两个叙述存在根本差异——但这不是谁在说谎。是各自持有了事件的不同视角和不同时间段。第四人可能是顾鸣。' },
  { id: 'P6', pair: 'p6-analyst-benz:p6-artist-molecules', title: '艺术家的密码', detail: 'THE ARTIST 的黑暗画作含有苯二氮卓类的精确分子结构。THE ANALYST 确认了\u201c白天给的药是 Benz\u201d——长期低剂量镇静剂，目标：抑制 θ 波，压制 THE SLEEPER。ARTIST 不能说话——他在用画作举报。' },
  { id: 'P7', pair: 'p7-shen-cipher:p7-whisper-fang', title: '沈若楠的加密便签', detail: '沈若楠的加密便签指向了\u201c夜班护士\u201d。THE WHISPER 的低语中重复的\u201cfang\u201d和 THE ANALYST 标注的\u201c方小娟夜班\u201d指向同一个人。方小娟是辰星制药在三院的内部联系人。' },
  { id: 'P8', pair: '_AUTO_', title: '原初的碎片', detail: '所有 7 个矛盾已解锁。14 个人格构成闭合的环形——圆心是空白。不存在单一的原初人格。原初是所有碎片的集合。整合不是消灭其他人格——是让他们同时说话。' },
  { id: 'N1', pair: 'noise1-absent-record:noise1-core-never-left', title: null, detail: null },
  { id: 'N2', pair: 'noise2-core-encrypt:noise2-journalist-usb', title: null, detail: null },
  { id: 'N3', pair: 'noise3-critic-shen-fake:noise3-host-shen-good', title: null, detail: null }
];

const ENDINGS = {
  'A': { title: '结局 A · 归档', body: '<p>评估结论：患者 DID 为原发性创伤后应激障碍，不具备受审能力。建议长期住院观察。</p><p style=\"color:#8b949e;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:16px;\">陆时砚的病例被归档。你每个月更新一次评估报告，每次都写\u201c继续观察\u201d。第三年你调到了门诊。你听说有个曾住院的病人出院后被送去了外地——你没有追问被送到了哪里。</p>' },
  'B': { title: '结局 B · 个人悲剧', body: '<p>评估结论：确认患者 DID 由创伤引发。苏景州之死为防卫过当。未发现第三方药物干预证据。</p><p style=\"color:#c0392b;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:16px;\">陆时砚被免于刑事起诉。转入普通精神病房。六个月后，他在病房死亡——判定为\u201c癫痫持续状态\u201d，死亡时间：凌晨 3:00。当夜夜班护士是方小娟。没有人继续调查。</p>' },
  'C': { title: '结局 C · 体制罪行', body: '<p>评估结论：患者 DID 由辰星制药非法药物干预（NC-7b）人为诱发。NeuroCalm 临床试验中 12 例死亡被系统性掩盖。苏景州之死为自卫。</p><p style=\"color:#92400e;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:16px;\">报告被移交至省卫生厅。三院管理层接受调查。但报告被标记为\u201c仍在审查中\u201d。12 个月后，NeuroCalm 已获批准上市。陆时砚\u201c转至异地医疗机构，治疗情况不明\u201d。你赢得了战斗，但战争在继续。</p>' },
  'D': { title: '结局 D · 完整的证人', body: '<p>评估结论：患者具备完整作证能力。DID 由辰星制药非法药物干预（NC-7b）人为诱发。申请立即停止抑制性给药方案。申请方小娟及辰星制药相关责任人刑事调查。</p><p style=\"color:#1a7f4b;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:16px;\">THE SLEEPER 在药物停止后第 5 天稳定出现。第 30 天——陆时砚坐在检察官前，14 种口吻用一种声音说话。12 名死者的名字被一一念出。顾鸣在机场被捕。一个月后你收到一张明信片——正面是一座灯塔，背面只有两个字：谢谢。</p>' },
  'E': { title: '结局 E · 共犯', body: '<p>你的报告详述了辰星制药的临床试验掩盖和火灾。但你没有提到方小娟、没有提到夜间给药、没有提到 THE SLEEPER 被压制。</p><p style=\"color:#c0392b;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:16px;\">三天后，陆时砚被转入另一家机构。不再是\u201c评估\u201d——是\u201c强制治疗\u201d。一星期后他不再说话。一个月后他不认识你了。有些选择不是对错的问题——是你能承受什么的问题。</p>' },
  'F': { title: '结局 F · 误判', body: '<p>评估结论：被告具备完全刑事责任能力。苏景州之死为故意杀人。</p><p style=\"color:#c0392b;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:16px;\">陆时砚被判过失杀人。法院采信了控方提供的简化版精神鉴定——一位你从未听说过的鉴定人出具。你从未见过陆时砚。你只知道系统里有一个病历永远锁定了。</p>' },
  'G': { title: '结局 G · 碎片', body: '<p>默认报告：\u201c患者评估未完成\u201d。陆时砚的案子被无限期搁置。</p><p style=\"color:#8b949e;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:16px;\">你失去了登录权限。整个案子像一个从未存在过的文件夹。但某天晚上，你的邮箱收到一封匿名信。附件是一幅蜡笔画——三个人，边缘一个人形。第四个人的脸上打了一个勾。</p>' }
};

const HANDBOOK_TABS = ["<h3>DSM-5 分裂性身份障碍（DID）诊断标准</h3><p><strong>标准 A：</strong>存在两个或更多以独立人格状态为特征的身份瓦解，在某些文化中可能被描述为一种“被占据”的体验。身份瓦解涉及自我意识和能动感的显著不连续，伴随情感、行为、意识、记忆、知觉、认知和/或感觉运动功能的改变。</p><p><strong>标准 B：</strong>回忆日常事件、重要的个人信息和/或创伤性事件时，存在反复的空隙——这些空隙与普通的遗忘不一致。</p><p><strong>标准 C：</strong>这些症状导致社交、职业或其他重要功能领域的痛苦或损害。</p><p><strong>标准 D：</strong>这种紊乱不是某种广泛接受的文化或宗教实践的正常组成部分。</p><p><strong>标准 E：</strong>这些症状不能归因于某种物质的直接生理效应（如酒精中毒时的记忆丧失）或其他医学状况。</p><hr style=\"margin:16px 0;border-color:#e2e8f0;\"><p><strong>临床提示：</strong>拥有 14 个以上人格的 DID 患者不到 5%。当人格数量异常多时，应考虑以下可能性：</p><ul style=\"margin-left:20px;margin-top:8px;\"><li>创伤严重程度异常</li><li>外部因素（如药物、长期监禁条件）的叠加作用</li><li>部分“人格”可能不是经典 DID 人格，而是其他形式的解离碎片</li></ul><p style=\"margin-top:8px;color:#c0392b;\"><strong>▶ ID 001 案例中，人格数量（14）显著偏离 DID 典型统计分布。建议重点评估外部干预可能。</strong></p>","<h3>精神科常用药物 · 药理学参考</h3><table style=\"width:100%;border-collapse:collapse;font-size:12px;margin-top:12px;\"><tr style=\"background:#f6f8fa;\"><th style=\"padding:8px;text-align:left;border:1px solid #d0d7de;\">药物类别</th><th style=\"padding:8px;text-align:left;border:1px solid #d0d7de;\">代表药物</th><th style=\"padding:8px;text-align:left;border:1px solid #d0d7de;\">半衰期</th><th style=\"padding:8px;text-align:left;border:1px solid #d0d7de;\">主要用途</th></tr><tr><td style=\"padding:8px;border:1px solid #d0d7de;\">苯二氮卓类</td><td style=\"padding:8px;border:1px solid #d0d7de;\">地西泮</td><td style=\"padding:8px;border:1px solid #d0d7de;\">20-80 小时</td><td style=\"padding:8px;border:1px solid #d0d7de;\">抗焦虑、镇静</td></tr><tr><td style=\"padding:8px;border:1px solid #d0d7de;\">苯二氮卓类</td><td style=\"padding:8px;border:1px solid #d0d7de;\">氯硝西泮</td><td style=\"padding:8px;border:1px solid #d0d7de;\">18-50 小时</td><td style=\"padding:8px;border:1px solid #d0d7de;\">抗癫痫、镇静</td></tr><tr><td style=\"padding:8px;border:1px solid #d0d7de;\">苯二氮卓类</td><td style=\"padding:8px;border:1px solid #d0d7de;\">劳拉西泮</td><td style=\"padding:8px;border:1px solid #d0d7de;\">10-20 小时</td><td style=\"padding:8px;border:1px solid #d0d7de;\">抗焦虑、镇静</td></tr><tr><td style=\"padding:8px;border:1px solid #d0d7de;\">苯二氮卓类</td><td style=\"padding:8px;border:1px solid #d0d7de;\">咪达唑仑</td><td style=\"padding:8px;border:1px solid #d0d7de;\">1.5-2.5 小时</td><td style=\"padding:8px;border:1px solid #d0d7de;\">术前镇静</td></tr></table><hr style=\"margin:16px 0;border-color:#e2e8f0;\"><p><strong>苯二氮卓类的结构特征：</strong>核心结构为苯环与七元二氮杂环的融合。大多数苯二氮卓类药物在 7 位带有吸电子取代基（如氯、硝基）。</p><p><strong>长期使用风险：</strong>长期低剂量苯二氮卓类药物（如氯硝西泮 q8h × 多个月）可导致 θ 波抑制、REM 睡眠减少、意识水平的基线漂移。在 DID 患者中，镇静剂可能抑制人格间的切换能力——或抑制特定人格的出现。</p><hr style=\"margin:16px 0;border-color:#e2e8f0;\"><p><strong>NeuroCalm（NC 系列）：</strong></p><p style=\"color:#8b949e;\">⚠ 该药物尚未获得国家药品监管总局批准。美国 FDA 快速审批通道申请中（2024 年 4 月状态：审查中）。</p><p><strong>已知信息：</strong>NC-3（早期临床试验版本）在动物模型中显示：通过 GABA<sub>A</sub> 受体的变构调节产生深度镇静，同时抑制记忆巩固。12 名受试者在 NC-3 试验期间死亡，死因包括恶性高热、横纹肌溶解和多器官衰竭。</p><p style=\"color:#c0392b;margin-top:8px;\"><strong>▶ NC-7b（实验变体）：</strong>据有限资料，NC-7b 为 NC 系列的改良版，设计目标为“记忆干预”——通过药物诱导对特定记忆片段的抑制。半衰期未知。副作用包括人格解体、身份瓦解。该信息未获官方确认。</p>","<h3>司法精神鉴定 · 关键概念</h3><p><strong>受审能力（Dusky 标准）：</strong>被告必须能够理解对其提出的指控的性质和后果，并能够协助辩护律师。如果无法理解，则不具备受审能力——审判将被推迟至恢复能力或无限期搁置。</p><p><strong>刑事责任能力：</strong>在犯罪时，被告是否因精神疾病或缺陷而缺乏理解其行为错误性质或使行为符合法律要求的能力。</p><hr style=\"margin:16px 0;border-color:#e2e8f0;\"><p><strong>DID 在司法系统中的特殊位置：</strong></p><ul style=\"margin-left:20px;margin-top:8px;\"><li>如果一个人格犯罪、另一个人格不记得——刑事责任取决于“整合后的意识是否知悉”。法庭对此没有统一标准</li><li>如果抑制性药物是系统施用的——刑事责任可能从患者转移到施药者和施药制度</li><li>人格数量的异常高（如 14 个）可能成为辩护方主张“无受审能力”的依据，也可能成为控方主张“故意制造复杂性以逃避责任”的依据</li></ul><hr style=\"margin:16px 0;border-color:#e2e8f0;\"><p><strong>评估报告的法律后果：</strong></p><table style=\"width:100%;border-collapse:collapse;font-size:12px;margin-top:8px;\"><tr style=\"background:#f6f8fa;\"><th style=\"padding:8px;text-align:left;border:1px solid #d0d7de;\">评估结论</th><th style=\"padding:8px;text-align:left;border:1px solid #d0d7de;\">法律后果</th></tr><tr><td style=\"padding:8px;border:1px solid #d0d7de;\">不具备受审能力</td><td style=\"padding:8px;border:1px solid #d0d7de;\">案件搁置，被告长期住院，可能无限期</td></tr><tr><td style=\"padding:8px;border:1px solid #d0d7de;\">具备受审能力 + 案发时无刑事责任能力</td><td style=\"padding:8px;border:1px solid #d0d7de;\">免于刑事起诉，强制医疗</td></tr><tr><td style=\"padding:8px;border:1px solid #d0d7de;\">具备受审能力 + 案发时有完全责任能力</td><td style=\"padding:8px;border:1px solid #d0d7de;\">进入刑事审判程序</td></tr><tr style=\"background:#fef3c7;\"><td style=\"padding:8px;border:1px solid #d0d7de;\">具备受审能力 + 第三方干预证据</td><td style=\"padding:8px;border:1px solid #d0d7de;\">被告可作为证人，第三方进入刑事调查</td></tr></table>"];

function getDocumentContent(fileId) { return DOCUMENTS[fileId] || null; }

const DOCUMENTS = {
  "pers-01": {
    "type": "profile",
    "title": "P01 · CORE",
    "meta": "首次记录：2021.10.05 · 内部年龄：34 · 触发条件：逻辑分析、威胁性提问 · 沈若楠档案编号：PER-001",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "自称原始人格。逻辑严密，语言简洁，用词精确。情绪表达近乎于无——在四次会谈中均未观察到可测量的情绪反应（皮肤电无显著变化、心率变异度低）。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "对事实的掌控力在 14 个人格中最强。他能完整复述从 2021 年 9 月（火灾前）到 2024 年的所有调查证据——文件编号、日期、证人姓名。但他在陈述这一切时使用的是第三人称视角：“逻辑推断：这个人当时做了 X。”不是一个在回忆的人——是一台在做事后分析的机器。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键会谈摘录",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "沈若楠（第 4 次会谈）：“你是谁？”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "CORE："
              },
              {
                "text": "“我是第一个。2021 年 10 月 5 日，我在 ICU 醒来。没有情绪，只有事实。”",
                "highlightable": true,
                "pinId": "p1-core-first",
                "pinSource": "P01 · CORE"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠：“你的女儿呢？你记得她吗？”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "CORE："
              },
              {
                "text": "“我的女儿？逻辑上她是我女儿。我不记得她的脸。”"
              }
            ]
          }
        ]
      },
      {
        "heading": "沈若楠备注",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "“CORE 拥有整条证据链——但他像一个档案管理员而不是一个经历了这些事情的人。他从未离开过三院——这是他自己说的——从未离开过三院。但这不是说他没尝试离开。是说这个身体——一直在楼里。”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "[备注标注：“从未离开过三院”需要与护理记录交叉比对——在第 5 次评估中护理记录显示患者缺勤——但那是发生在 CORE 出现之前。时间线对齐无误。]",
                "highlightable": true,
                "pinId": "noise1-core-never-left",
                "pinSource": "P01 · CORE"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "[备注：与护理记录比对后，CORE 说的完全正确——患者从ICU转入精神科后从未出院。正常措辞。但我没有找到任何关于 2021年9月29日至10月1日的护理记录。这三天的记录不是“没有”——是“被删除”。页码不连续。这三天的空白和 CORE 的“从未离开”可能是同一个谎言的两面。]",
                "highlightable": true,
                "pinId": "noise1-absent-record",
                "pinSource": "P01 · CORE · 备注比对后"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-02": {
    "type": "profile",
    "title": "P02 · THE PROTECTOR",
    "meta": "首次记录：2021.10.07 · 内部年龄：35 · 触发条件：物理威胁 · 沈若楠档案编号：PER-002",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "在感知到物理或语言威胁时出现。反应迅速、直接。沈若楠 11 秒的反应时间测定显示：PROTECTOR 从触发到完全呈现的速度比其他所有人格快 3 倍以上。这不是心理机制——这是经过条件训练的应激反射。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "PROTECTOR 对苏景州办公室事件的叙述（第 17 次会话）是唯一在提及死亡事件时不回避的人格。但他的叙述存在选择性——他只描述了物理接触的后半段（抓住手→扭转→摔倒），前半段（他是如何进入办公室的？苏景州说了什么？）全部是空白。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键自述（第 17 次会话）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "PROTECTOR（未经沈若楠提问，主动陈述）："
              }
            ]
          },
          {
            "segments": [
              {
                "text": "“我知道你想问什么。不——我不是杀人犯。那些在电视上说我是怪物的人，他们从没被针管指着过喉咙。你试过吗？你试过手在抖但还是把对方的手拧过去吗？你的脑子在尖叫-你不能杀他-你不能杀他-但你的手不听你的。不是我在控制。是身体在控制。这不是罪。这是被训练出来的反射。训练我的不是我自己。”",
                "highlightable": true,
                "pinId": "p5-protector-selfdefense",
                "pinSource": "P02 · THE PROTECTOR"
              }
            ]
          }
        ]
      },
      {
        "heading": "沈若楠备注",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "“他说'被训练'——不是比喻。应激反射可以被条件训练。反复暴露于刺激+强化反馈循环=自主神经系统反应重编程。需要大约3个月。在这3个月里反复让一个人处于威胁性刺激中。这不是一个DID患者在表达自己——这是有人在制造他。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-03": {
    "type": "profile",
    "title": "P03 · THE SOLDIER",
    "meta": "首次记录：2022.03.21 · 内部年龄：不详 · 触发条件：命令性语句 · 沈若楠档案编号：PER-003",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE SOLDIER 在听到命令性语句时出现。回应精确、机械。沈若楠描述：“像一个被调到了最低延迟模式的 CPU。”只回应指令，从不反问，从不质疑。对疼痛和疲劳无反应——一次长达2小时的会谈后，其他几个人格会在几分钟内发作头痛或疲劳，THE SOLDIER 结束后说“任务完成”然后立即转入沉默——心率与皮肤电数据显示完全平静。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "他的记忆只覆盖结构化信息：时间表、程序步骤、规则清单。没有情感记忆。没有个人回忆。被问到家庭时回答：“婚姻状态：已婚。子女数量：1。当前状态：核心家庭单位已解散。原因：火灾。结论：无法修正。”"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键会话（第 14 次 · 命令式测试）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "沈若楠（命令语气）：“报告 2021 年 9 月 17 日晚上的行程。18:00 到 23:30。”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "THE SOLDIER："
              },
              {
                "text": "“18:00 — 下班。18:35 — 到达住宅。18:45 — 用餐。20:30 — 晚餐结束。21:00 — 就寝。22:00 — 个人在客厅阅读。22:15 — 窗外车辆到达。黑色。未确认。22:20 — 卧室方向有声响。去走廊。22:30~23:14 — [记忆中断]”",
                "highlightable": true,
                "pinId": "p1-core-first",
                "pinSource": "P03 · THE SOLDIER · 火灾当晚行程"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠追问中断部分。THE SOLDIER 完全静止 23 秒。最终：“该时间段无数据。”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠备注：“中断时间点和顾鸣抵达时间几乎完美重合。他说-无数据-——不是-不记得-。这个用词和 CORE 完全一样。但 CORE 在火灾后4天才醒来。THE SOLDIER 在火灾前3个月就出现了。CORE 说-没有火灾前的记忆-。THE SOLDIER 有——但被切掉了最关键的44分钟。这不像遗忘。像编辑。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-04": {
    "type": "profile",
    "title": "P04 · THE CHILD",
    "meta": "首次记录：2022.01.20 · 内部年龄：7 · 触发条件：蜡笔、儿童画、小女孩声音 · 沈若楠档案编号：PER-004",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "出现时表现出典型 7 岁儿童的行为——怕生、回避目光、偏好角落位置、用蜡笔画画作为主要沟通方式。这个年龄恰好是陈雨桐（陆时砚之女）死亡时的年龄。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "THE CHILD 画的不是她自己的记忆——她画的是火灾前一周的场景。她能准确描述那一周每天晚餐的菜名。但她拒绝画或讨论火灾当天。“那天下雨了。”这是她唯一说过的关于那一天的话。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键画作描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "沈若楠笔记：“第 7 次会谈。Patient 要求了蜡笔和纸。画了三个火柴人——标注了爸爸、妈妈、小雨。”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "“但在画面边缘，有一个模糊的人形——没有面部特征，颜色与其他三人不同（灰色 vs 暖色）。问他这是谁，他说‘顾叔叔’。问他顾叔叔在做什么，她不再回答。将画收进了抽屉。”",
                "highlightable": true,
                "pinId": "p2-child-drawing",
                "pinSource": "P04 · THE CHILD"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-05": {
    "type": "profile",
    "title": "P05 · THE WITNESS",
    "meta": "首次记录：2023.04.02 · 仅在催眠/非主导状态下出现 · 沈若楠档案编号：PER-005",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE WITNESS 只在降低意识控制的状态中出现——催眠诱导或浅睡眠过渡期。他的叙述方式与其他所有人格截然不同：他描述的是同时存在的多个版本的现实。几乎可以确定，THE WITNESS 看到了办公室监控被关闭前最后几帧画面。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "他对 2024 年 4 月 3 日办公室事件的叙述存在 4 个版本。其中 3 个矛盾，1 个——“穿白衣服的人在门口看”——与警方报告中“第三组未知指纹”形成交叉验证。",
                "highlightable": true,
                "pinId": "p5-witness-fourth",
                "pinSource": "P05 · THE WITNESS"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-06": {
    "type": "profile",
    "title": "P06 · THE GHOST",
    "meta": "首次记录：2023.06.11 · 声称自己不是人格而是“记忆印记” · 沈若楠档案编号：PER-006",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE GHOST 声称自己不是人格，而是一个 NeuroCalm 临床试验的已故受试者的记忆——被“烙印”进了陆时砚的系统中。他——或者“它”——知道 12 名 NC-3 受试者的完整名单、死亡日期和死因。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠在外部验证了部分信息——与新闻报道和公开医疗记录吻合。但 THE GHOST 提供了一些从未出现在任何公开记录中的细节：受试者的内部编号（NC-3R-001 至 NC-3R-012）、每位死者的直接死因和药物反应描述。这些细节无法通过正常渠道获得——除非看过辰星制药内部文件。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键会谈摘录",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE GHOST："
              },
              {
                "text": "“我不是人格。我是赵雨桐（已故 NeuroCalm 受试者）的记忆——被写在陆时砚的大脑里。因为他在调查我们。他把我们 12 个人的病历读了上百遍。他在脑子里建了一整个档案。然后他的脑子碎了——我们就在裂缝里安了家。”",
                "highlightable": true,
                "pinId": "p4-ghost-memory",
                "pinSource": "P06 · THE GHOST"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠：“你有什么证据证明你不是陆时砚的一部分？”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "THE GHOST："
              },
              {
                "text": "“证据？你不明白。我就是证据。12 个人的记忆不可能同时出现在一个人的脑子里——除非这些记忆不是'他的'。但我在这里。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-07": {
    "type": "profile",
    "title": "P07 · THE SILENT ONE",
    "meta": "首次记录：2022.05.08 · 从不说话，只通过书写交流 · 沈若楠档案编号：PER-007",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "从不说话。只通过书写交流——且只写中文。沈若楠观察到：其他几个人格在治疗转录中偶尔使用英文词汇（特别是 CORE 在表述逻辑时），但 THE SILENT ONE 的书写全部使用纯中文，包括被公认应保留英文的专有名词（将“NeuroCalm”写作“神经静定片”，将“FDA”写作“美国食品药品监督管理局”）。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "她书写的内容全部是三年前的调查笔记。沈若楠已经确认其中部分内容对应的原始文件已被销毁——在火灾中。但 THE SILENT ONE 逐字重现了。沈若楠称她为“活体备份”。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键书写内容",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "第 3 次书写（2022.06.12）："
              },
              {
                "text": "“NeuroCalm 神经静定片 NC-3 时期受试者共 12 人。NC-3R-001 周某 恶性高热 2020.03.11。NC-3R-002 何某 横纹肌溶解 2020.03.19。NC-3R-003 陈某 多器官衰竭 2020.04.02。NC-3R-004 林某 恶性高热 2020.04.15。NC-3R-005 赵某 横纹肌溶解 2020.05.03。NC-3R-006 张某 恶性高热 2020.05.21。NC-3R-007 刘某 横纹肌溶解 2020.06.08。NC-3R-008 王某 多器官衰竭 2020.06.27。NC-3R-009 李某 急性肝坏死 2020.07.14。NC-3R-010 孙某 恶性高热 2020.08.01。NC-3R-011 黄某 横纹肌溶解 2020.08.22。NC-3R-012 赵雨桐 恶性高热 2020.09.09。顾鸣在所有病例报告中标注“受试者因基础疾病导致死亡”。”",
                "highlightable": true,
                "pinId": "p4-silent-names",
                "pinSource": "P07 · THE SILENT ONE"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-08": {
    "type": "profile",
    "title": "P08 · HOST",
    "meta": "首次记录：2021.10.05 · 内部年龄：34 · 触发条件：日常对话 · 沈若楠档案编号：PER-008",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "HOST 是系统与外界的主要接口。管理日常活动——饮食、睡眠、基本对话。自称可能是原始人格。与 CORE 的声称存在直接矛盾：CORE 出现在前（同日、早几小时），但 HOST 声称自己只是让 CORE 先说话。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键会谈摘录",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "沈若楠（第 9 次会谈）：“CORE 说他是第一个出现的。你怎么看？”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "HOST："
              },
              {
                "text": "“CORE 以为他是第一个。不——是我。我让他先说话，因为我太累了。10 月 5 日那天，是我把灯打开了，他把脚迈出去了。”",
                "highlightable": true,
                "pinId": "p1-host-let",
                "pinSource": "P08 · HOST"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠：“沈医生对你来说是什么？”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "HOST："
              },
              {
                "text": "“沈医生对我来说是好人。”",
                "highlightable": true,
                "pinId": "noise3-host-shen-good",
                "pinSource": "P08 · HOST"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-09": {
    "type": "profile",
    "title": "P09 · THE JOURNALIST",
    "meta": "首次记录：2022.09.09 · 内部年龄：34 · 与调查记者身份对应 · 沈若楠档案编号：PER-009",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE JOURNALIST 反复重复同一句话：“记录在继续。”声称自己是陆时砚作为调查记者的最后一层意识。声称保留了一个加密 USB——但没有给出 USB 的位置、密码或任何具体信息：“它们在 USB 里，都在 USB 里。给沈医生。告诉她加密是四个数字。不是日期。不是生日。是第一份报告的文件编号。”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠穷尽了三院所有可能的 USB 存放位置——陆时砚入院时没有携带任何个人电子设备（见警方物品清单）。如果 USB 确实存在，它一定在某个人手里。不是陆时砚。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键会话（第 16 次）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE JOURNALIST："
              },
              {
                "text": "“每个记者都有备份。你不会只在一个地方放证据。你会放在别人那里。一个你信任的人。一个你觉得可能死得比你早的人。不是女儿。”",
                "highlightable": true,
                "pinId": "noise2-journalist-usb",
                "pinSource": "P09 · THE JOURNALIST"
              }
            ]
          }
        ]
      },
      {
        "heading": "沈若楠备注",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "“THE JOURNALIST说的-第一份报告——我翻遍了陆时砚所有已发表的调查文章。最早一篇关于辰星制药的发表于2019年3月。但没有找到-文件编号的具体数字。可能指的是他在入职辰星之前的第一份调查报告——另一个系统中的编号。如果在火灾之前就已经转移出去——那个存放USB的人，可能是唯一知道顾鸣那天晚上为什么会在那里的人。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-10": {
    "type": "profile",
    "title": "P10 · THE CRITIC",
    "meta": "首次记录：2022.02.08 · 内部年龄：40+ · 触发条件：任何人显示信心或确定性 · 沈若楠档案编号：PER-010",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE CRITIC 否定一切。否定 CORE 的逻辑、否定 HOST 的感受、否定 JOURNALIST 的使命、否定沈若楠的评估能力。但他的否定中包含了大量准确细节——他是唯一一个指出医疗记录中那三天空白的人格。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键会谈摘录",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE CRITIC（第 2 次会谈）："
              },
              {
                "text": "“你们的记录有问题。2021 年 9 月 29 日到 10 月 1 日。整整三天。没有护理记录，没有用药，什么都没有。你们把他弄到哪里去了？”",
                "highlightable": true,
                "pinId": "p3-critic-gap",
                "pinSource": "P10 · THE CRITIC"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠：“你认为沈若楠医生能够完成这个评估吗？”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "THE CRITIC："
              },
              {
                "text": "“沈若楠跟你一样——以为自己能救人。”",
                "highlightable": true,
                "pinId": "noise3-critic-shen-fake",
                "pinSource": "P10 · THE CRITIC"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-11": {
    "type": "profile",
    "title": "P11 · THE ARTIST",
    "meta": "首次记录：2022.08.03 · 黑暗环境下用左手画 · 沈若楠档案编号：PER-011",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE ARTIST 不通过语言沟通。只有在黑暗环境中才会出现——沈若楠发现的触发方式是关闭治疗室的灯光。他在完全黑暗中使用左手作画（陆时砚是右撇子）。画作抽象，但经分析后发现含有重复的几何模式。"
              }
            ]
          }
        ]
      },
      {
        "heading": "沈若楠备注",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "沈若楠（第 11 次会谈后）：“我终于看懂了——这些不是随机的形状。这些是分子结构。六边形和五边形交替——吲唑环和吡咯烷环。最初的推测是神经肌肉阻断剂结构。但国家药监速查手册的比对结果是错误的。ARTIST 画的不是神经肌肉阻断剂——是苯二氮卓类药物的核心骨架。七元二氮杂环、苯环、加上取代基。精度惊人——他不是在画'印象'，他是在画出大脑里正在被放进来的东西。”",
                "highlightable": true,
                "pinId": "p6-artist-molecules",
                "pinSource": "P11 · THE ARTIST"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-12": {
    "type": "profile",
    "title": "P12 · THE WHISPER",
    "meta": "首次记录：2023.01.12 · 只在半睡半醒状态出现 · 沈若楠档案编号：PER-012",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE WHISPER 只在催眠或半睡半醒的过渡状态中出现。音量极低——沈若楠必须将录音放大 3 倍以上才能听清。说话不完整，是碎片化的词和短语，不成句。但事后回溯发现：他在 6 个月前低语中提到的人名和事件，在 6 个月后新的外部证据出现时被一一验证。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键低语片段（第 4 次催眠 · 2023.06.19）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "经放大的低语录音：“fang... xiao... juan... fang... fang... 晚上... 晚上给... 停... 停了才能... sleep... sleeper... 不能让她... fang... fang...”",
                "highlightable": true,
                "pinId": "p7-whisper-fang",
                "pinSource": "P12 · THE WHISPER · 催眠录音"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠备注：“我当时没有注意这个片段。回头再看——他在说一个名字。'fang'。六个月后我看到排班表上的'方小娟'时，这段低语才变得有意义。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-13": {
    "type": "profile",
    "title": "P13 · THE ANALYST",
    "meta": "首次记录：2022.11.20 · 自称“操作手册” · 沈若楠档案编号：PER-013",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE ANALYST 拒绝被评估——反而对其他人格做评估。画了人格活跃时间线——比沈若楠自己的记录更精确。说自己“不是人格，是操作手册”。被要求评估自己时转移话题。"
              }
            ]
          }
        ]
      },
      {
        "heading": "关键笔记摘录",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE ANALYST 笔记（经沈若楠从加密字符解密后）：“ARTIST 不是在做梦。Sleepers 的药。白天给的药是 Benz——长期、低剂量。抑制 θ 波。让 S 不能出来。方小娟夜班——检查她的给药时间。21:00 那次。03:00 那次。06:00 那次。S 出现的时间是 10:00、14:30、15:45——在药效消退后。”",
                "highlightable": true,
                "pinId": "p6-analyst-benz",
                "pinSource": "P13 · THE ANALYST"
              }
            ]
          }
        ]
      }
    ]
  },
  "pers-14": {
    "type": "profile",
    "title": "P14 · THE SLEEPER",
    "meta": "首次记录：未正式记录 · 仅在白天10:00-16:00短暂出现 · 沈若楠档案编号：PER-014",
    "sections": [
      {
        "heading": "人格描述",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE SLEEPER 在文件上的出现次数为零。沈若楠从未成功诱导其出现——不是她不会。是她被阻止了。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "间接证据链：1) THE ANALYST 的人格活跃时间线显示，一个标注为“S”的人格在每天10:00、14:30、15:45左右短暂出现，每次不超过20分钟。2) 这些时间窗与方小娟夜间给药的药效消退曲线完全对齐。3) S活跃期间，其他13个人格全部显示低活跃。4) 沈若楠从未被安排在这些时段进行评估——评估时段由顾鸣医生办公室安排（护理排班表备注）。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠在加密便签中的最终结论：THE SLEEPER IS THE INTEGRATION。14个人格不是独立的。它们是通过药物被分裂开的——而那个整合它们的功能，就是被苯二氮卓类药物24小时压制的THE SLEEPER。",
                "highlightable": true,
                "pinId": "p7-shen-cipher",
                "pinSource": "P14 · THE SLEEPER · 间接证据"
              }
            ]
          }
        ]
      },
      {
        "heading": "沈若楠未归档笔记",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "“THE SLEEPER 没有档案。没有首次记录日期。没有触发条件。只有一个在时间线上反复出现的名字-S-——和13份档案中的空白。-S-不是一个人格——是最接近陆时砚本人的那个东西。-S-没有出现不是因为她不存在——是因为她每次出现都被药物压回去了。顾鸣不是给陆时砚镇静——他是在做化学绑缚。三年。没有人注意到。包括我。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "ext-fire": {
    "type": "evidence",
    "title": "火灾调查报告 · 江临市公安局消防支队",
    "meta": "案件编号：JF-2021-0917-03 · 归档日期：2021.11.12 · 状态：已结案",
    "sections": [
      {
        "heading": "调查结论",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "起火原因为客厅电路老化引发的电气火灾。起火时间约为 2021 年 9 月 17 日 23:14。起火点位于客厅西北角电源插座区域。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "火灾造成一人当场死亡（陆某之妻，38 岁，吸入性损伤合并一氧化碳中毒）、一人重伤（陆某，34 岁，全身 37% 体表面积烧伤、吸入性损伤）、一人重伤（陆某之女，9 岁，严重吸入性损伤，ICU 救治 14 天后临床死亡）。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "根据物业监控记录，火灾前两小时（21:08），小区西门有一辆未登记黑色三厢轿车进入，持有江临市第三人民医院通行证。驾驶员身份未进一步追查。该车辆于火灾后 12 分钟（23:26）离开小区。",
                "highlightable": true,
                "pinId": "p2-police-car",
                "pinSource": "火灾调查报告"
              }
            ]
          }
        ]
      },
      {
        "heading": "缺失页面",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "[本段在扫描件中缺失——第 7 页至第 9 页为空白或严重损毁。根据页码推断，缺失部分对应的是“现场勘查详细报告”第三至第五小节。]"
              }
            ]
          }
        ]
      }
    ]
  },
  "ext-surveillance": {
    "type": "table",
    "title": "物业监控记录 · 香榭丽舍小区西门",
    "meta": "日期：2021.09.17 · 时间段：18:00-24:00 · 来源：江临市公安局（原始数据已归档）",
    "headers": [
      "时间",
      "车牌号",
      "车辆类型",
      "通行证/备注",
      "方向"
    ],
    "rows": [
      [
        "18:02",
        "江A·F8271",
        "白色 SUV",
        "住户",
        "进入"
      ],
      [
        "18:34",
        "江A·C1539",
        "银色轿车",
        "住户",
        "进入"
      ],
      [
        "19:15",
        "江A·E2407",
        "白色轿车",
        "临时登记 · 外卖配送",
        "进入"
      ],
      [
        "19:22",
        "江A·E2407",
        "白色轿车",
        "临时登记 · 外卖配送",
        "离开"
      ],
      [
        "20:03",
        "江A·H0921",
        "灰色轿车",
        "住户",
        "进入"
      ],
      [
        "21:08",
        "未登记 · 遮挡",
        "黑色三厢轿车",
        {
          "segments": [
            {
              "text": "医院通行证 · 江临市第三人民医院 · 编号 H-0417",
              "highlightable": true,
              "pinId": "p2-police-car",
              "pinSource": "物业监控记录"
            }
          ]
        },
        "进入"
      ],
      [
        "21:32",
        "江A·M5632",
        "黑色 SUV",
        "住户",
        "离开"
      ],
      [
        "23:26",
        "未登记 · 遮挡",
        "黑色三厢轿车",
        "无登记",
        "离开"
      ],
      [
        "23:31",
        "江A·T4083",
        "白色轿车",
        "住户",
        "离开"
      ]
    ]
  },
  "ext-police": {
    "type": "evidence",
    "title": "警方现场报告 · 苏景州死亡案件",
    "meta": "案件编号：JF-2024-0403-07 · 出警时间：2024.04.03 16:42 · 辰星制药总部 17F",
    "sections": [
      {
        "heading": "现场勘查摘要",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "死者位于办公桌后地面，仰卧位。颈部左侧刺入一支 5mL 注射器，活塞已推到底部。注射器内残留液体初步检测为神经肌肉阻断剂类物质（具体成分待实验室确认）。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "现场提取到多组指纹。办公桌表面指纹与死者吻合。注射器表面指纹与在场人员陆时砚（ID 001——现为三院精神科患者）吻合。注射器活塞末端有另一组指纹，不属于在场人员或死者。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "办公室监控系统在案发当日处于“维护状态”。根据安保人员陈述：监控系统于当日 12:00-18:00 之间离线，原因未查明。无录像。",
                "highlightable": true,
                "pinId": "p5-witness-fourth",
                "pinSource": "警方现场报告"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "在场人员陆时砚被发现时处于严重解离状态。无法对提问做出有意义的回应。右手虎口处有注射器刺入痕迹——针孔直径与现场注射器不符（更小），未检测到药物残留。"
              }
            ]
          }
        ]
      }
    ]
  },
  "ext-drug": {
    "type": "evidence",
    "title": "国家药品不良反应监测中心 · 数据查询",
    "meta": "查询时间：2024.06.17 · 查询人：沈若楠 · 查询项目：NC-3R 系列编号",
    "sections": [
      {
        "heading": "查询结果",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "查询编号 NC-3R-001 至 NC-3R-012。返回结果：未查到匹配记录。请确认编号是否正确。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "全国药品不良反应监测数据库未收录任何以“NC-3R”为前缀的临床试验受试者编号。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "个别查询：赵雨桐（身份证号：■■■■■■■■■■■■■■■■0329），在国家数据库中未查询到任何药品不良反应记录或临床试验参与记录。"
              }
            ]
          }
        ]
      },
      {
        "heading": "结论",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "12 名 NeuroCalm NC-3 受试者的死亡从未被上报至国家监测系统。这些受试者——在法律意义上——不存在。"
              }
            ]
          }
        ]
      }
    ]
  },
  "ext-news": {
    "type": "evidence",
    "title": "辰星制药新闻汇集 · 近年摘要",
    "meta": "来源：公开新闻报道 · 汇集人：沈若楠 · 最后更新：2024.07.10",
    "sections": [
      {
        "heading": "2020.03 — NeuroCalm 获美国 FDA 快速审批通道",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "辰星制药宣布其新型抗焦虑药物 NeuroCalm 获得美国 FDA 快速审批通道资格。CEO 顾鸣在新闻发布会上表示：“NeuroCalm 将重新定义精神类药物的治疗范式。”同日，辰星制药股价上涨 8.7%。"
              }
            ]
          }
        ]
      },
      {
        "heading": "2020.11 — 辰星制药与江临三院签署战略合作协议",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "辰星制药与江临市第三人民医院签署为期三年的“精神类药物临床研究合作”协议。顾鸣以首席科学官身份兼任三院精神科特邀研究员。协议内容包括“共享临床数据”和“联合建立特殊观察病房”。",
                "highlightable": true,
                "pinId": "p3-transfer-special",
                "pinSource": "辰星制药新闻 · 三院合作协议"
              }
            ]
          }
        ]
      },
      {
        "heading": "2022.01 — NC-7 系列启动（未公开）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "辰星制药内部通稿（经沈若楠从加密渠道获取）：“NC-7 系列是基于第 1 阶段受试者数据的新候选药物。目标：通过 GABA_A 受体的选择性变构调节实现定向记忆干预。代表性变体：NC-7b。临床前研究状态：进行中。”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠备注：“这份内部通稿的收发范围不包括三院。我通过前同事拿到的。顾鸣在公开场合一直在讲 NeuroCalm 的安全性和有效性的故事——但 NC-7 是个完全不同的东西。NeuroCalm 是焦虑药。NC-7 从一开始就不是。”"
              }
            ]
          }
        ]
      },
      {
        "heading": "2024.04 · 当前状态",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "辰星制药官网：NeuroCalm 申请状态更新为“审查中”。未提及任何受试者死亡。未提及 NC-7 系列。未提及顾鸣兼任三院职务。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠备注：“NeuroCalm 还在 FDA 审查中。NC-7b 从未在任何公开文件中出现。陆时砚在病历上服用的是常规苯二氮卓类药物。如果有人要调查——他们能找到的只有 NeuroCalm 的安全数据。NC-7 不存在。12 个死者不存在。火灾调查里顾鸣不存在。这是一套完整的擦除系统。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "ext-personnel": {
    "type": "table",
    "title": "三院人事档案 · 重点人员",
    "meta": "保密等级：内部 · 访问记录 · 最近查询：2024.07.14（沈若楠）",
    "headers": [
      "姓名",
      "职务/关系",
      "在岗时段",
      "关联事件",
      "备注"
    ],
    "rows": [
      [
        "沈若楠",
        "精神科主任医师 · ID 001 原评估员",
        "2019.03 - 2024.07.14",
        "全部 23 次会话 · 加密便签",
        "离职 · 便签48h后自删"
      ],
      [
        "顾鸣",
        "辰星制药CSO · 三院特邀研究员",
        "2020.11 起",
        "NC-3试验 · NC-7b · 火灾 · 特殊观察室",
        "火灾当晚在场 · 通行证 H-0417"
      ],
      [
        "苏景州",
        "辰星制药总部办公室主任 · 被害人",
        "2018.06 - 2024.04.03",
        "死亡事件 · 注射器",
        "监控离线时段在岗"
      ],
      [
        "方小娟",
        "精神科护士 · 夜班",
        "2020.09 起",
        "NC-7b给药 · 特殊观察室",
        "22天/月夜班 · 21/03/06点给药"
      ],
      [
        "陈志明",
        "精神科值班主管",
        "2015.02 起",
        "发现ID001异常",
        "Chamber 004发现Karn材料"
      ],
      [
        "Karn Sterling",
        "前辰星制药研究员 · 逃至裂隙地带",
        "2016-2021 · 在逃",
        "NC-3内部举报人",
        "Ch7断弦亭首次出场"
      ]
    ]
  },
  "ext-timeline": {
    "type": "table",
    "title": "事件时间线 · ID 001 完整案件",
    "meta": "编制人：沈若楠 · 更新：2024.07.14 · 状态：评估中止前最后版本",
    "headers": [
      "日期",
      "事件",
      "关联证据",
      "状态"
    ],
    "rows": [
      [
        "2019.03",
        "沈若楠入职江临三院精神科",
        "人事档案",
        "—"
      ],
      [
        "2020.03.11",
        "NC-3R-001 周某 · 恶性高热 · 死亡",
        "THE SILENT ONE 名单",
        "未上报"
      ],
      [
        "2020.09.09",
        "NC-3R-012 赵雨桐 · 恶性高热 · 死亡",
        "THE GHOST · 药监无数据",
        "未上报"
      ],
      [
        "2020.11",
        "辰星制药与三院签合作协议 · 顾鸣任特邀研究员",
        "新闻汇集",
        "协议三年"
      ],
      [
        "2021.09.17 21:08",
        "黑色三厢轿车进入小区 · 持三院通行证",
        "物业监控 × 火灾报告",
        "车主未查明"
      ],
      [
        "2021.09.17 23:14",
        "陆宅火灾 · 一死两伤",
        "火灾报告",
        "结案：电路老化"
      ],
      [
        "2021.09.17 23:26",
        "黑色三厢轿车离开小区",
        "物业监控",
        "同一车辆"
      ],
      [
        "2021.09.29",
        "陆时砚转至特殊观察室 · 顾鸣全权负责",
        "转科记录",
        "3天记录空白"
      ],
      [
        "2021.10.05",
        "CORE 首次出现“我在ICU醒来”",
        "P01 · CORE",
        "HOST称先他一步"
      ],
      [
        "2022.06.12",
        "THE SILENT ONE 写出12名死者名单",
        "P07",
        "原始文件已焚"
      ],
      [
        "2022.08",
        "THE ARTIST 画分子结构",
        "P11",
        "苯二氮卓骨架"
      ],
      [
        "2023.01",
        "THE WHISPER 低语“fang”",
        "P12",
        "6月后匹配方小娟"
      ],
      [
        "2024.04.03",
        "苏景州死亡 · 陆时砚严重解离",
        "警方现场报告",
        "监控离线 · 第4组指纹"
      ],
      [
        "2024.04.15",
        "ID 001 司法精神鉴定启动",
        "—",
        "评估员：沈若楠"
      ],
      [
        "2024.07.14 17:32",
        "沈若楠离职 · 加密便签写入",
        "沈若楠便签",
        "48h后自删"
      ],
      [
        "2024.07.15",
        "你登录系统 · 评估继续",
        "—",
        "—"
      ]
    ]
  },
  "med-transfer": {
    "type": "evidence",
    "title": "转科记录 · 江临三院精神科",
    "meta": "日期：2021.09.29 · 转入科室：特殊观察室 · 值班护士：方小娟",
    "sections": [
      {
        "heading": "记录正文",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "2021.09.29 08:00 — 患者从 ICU 转入精神科特殊观察室。转入原因：患者意识状态异常波动，需进一步评估。医嘱：由顾鸣医生全权负责。值班护士：方小娟。",
                "highlightable": true,
                "pinId": "p3-transfer-special",
                "pinSource": "转科记录 2021.09.29"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "2021.09.29 — 2021.10.01：特殊观察期间护理记录（此处本应有 3 天的日志——本页为空白。共 12 行预印表格，全部留空，底部有被裁切的痕迹）。"
              }
            ]
          }
        ]
      }
    ]
  },
  "med-shen-note": {
    "type": "evidence",
    "title": "沈若楠离任加密便签",
    "meta": "日期：2024.07.14 17:32 · 收件人：接任评估员 · 自动删除计时：48 小时",
    "sections": [
      {
        "heading": "加密信息（已解密）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "THE SLEEPER IS THE INTEGRATION. STOP THE MEDS. CHECK THE NIGHT NURSE.",
                "highlightable": true,
                "pinId": "p7-shen-cipher",
                "pinSource": "沈若楠加密便签"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "沈若楠备注：“如果你看到这个——你不是沈若楠。你是来接她的人。她没有完成评估。不是时间不够。是她不能再继续了。THE SLEEPER 只在药效消退后才出现。白天。不是晚上。给他药的那个人——在晚上上班。查夜班护士。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "med-schedule": {
    "type": "table",
    "title": "护理排班表 · 精神科 · 2024年6月",
    "meta": "江临三院护理部 · 归档日期：2024.05.28",
    "headers": [
      "日期",
      "白班 (08-20)",
      "夜班 (20-08)",
      "备注"
    ],
    "rows": [
      [
        "6月1日",
        "陈敏",
        "方小娟",
        ""
      ],
      [
        "6月2日",
        "陈敏",
        "方小娟",
        ""
      ],
      [
        "6月3日",
        "张华",
        "李红",
        ""
      ],
      [
        "6月4日",
        "陈敏",
        "方小娟",
        ""
      ],
      [
        "6月5日",
        "张华",
        "方小娟",
        ""
      ],
      [
        "6月6日",
        "陈敏",
        "李红",
        ""
      ],
      [
        "...",
        "...",
        "...",
        ""
      ],
      [
        "6月28日",
        "陈敏",
        "方小娟",
        ""
      ],
      [
        "6月29日",
        "张华",
        "方小娟",
        ""
      ],
      [
        "6月30日",
        "陈敏",
        "方小娟",
        ""
      ]
    ],
    "sections": [
      {
        "heading": "给药时间记录",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "护士方小娟 2024年6月平均夜班天数：22天。夜间给药固定时间：21:00、03:00、06:00。常规给药：氯硝西泮 2mg、富马酸喹硫平 25mg。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "附注：氯硝西泮——GABA受体的正向别构调节剂。半衰期 18-50 小时。每日三次夜间给药 = 24 小时血药浓度维持在恒常水平。"
              }
            ]
          }
        ]
      }
    ]
  },
  "med-drug-log": {
    "type": "table",
    "title": "给药日志 · ID 001 · 2024.01-07",
    "meta": "江临三院护理部 · 归档编号：MED-2024-001 · 审核：顾鸣",
    "headers": [
      "日期",
      "时间",
      "药物/剂量",
      "给药护士",
      "患者状态",
      "备注"
    ],
    "rows": [
      [
        "2024.01.02",
        "21:00",
        "氯硝西泮 2mg",
        "方小娟",
        "安静",
        ""
      ],
      [
        "2024.01.02",
        "03:00",
        "氯硝西泮 2mg",
        "方小娟",
        "睡眠中",
        ""
      ],
      [
        "2024.01.02",
        "06:00",
        "氯硝西泮 2mg + 富马酸喹硫平 25mg",
        "方小娟",
        "睡眠中",
        ""
      ],
      [
        "2024.03.15",
        "21:00",
        "氯硝西泮 2mg",
        "方小娟",
        "焦虑",
        "患者诉“睡不着，它们太吵”"
      ],
      [
        "2024.03.15",
        "03:00",
        "氯硝西泮 2mg",
        "方小娟",
        "睡眠中",
        ""
      ],
      [
        "2024.03.15",
        "06:00",
        "氯硝西泮 2mg + 富马酸喹硫平 25mg",
        "方小娟",
        "嗜睡",
        "日间评估取消"
      ],
      [
        "2024.04.05",
        "21:00",
        "氯硝西泮 2mg",
        "方小娟",
        "安静",
        "苏景州事件后第2天"
      ],
      [
        "2024.04.05",
        "03:00",
        "氯硝西泮 2mg",
        "方小娟",
        "睡眠中",
        ""
      ],
      [
        "2024.04.05",
        "06:00",
        "氯硝西泮 2mg + 富马酸喹硫平 25mg",
        "方小娟",
        "睡眠中",
        ""
      ],
      [
        "2024.06.12",
        "21:00",
        "氯硝西泮 2mg",
        "方小娟",
        "安静",
        ""
      ],
      [
        "2024.06.12",
        "03:00",
        "氯硝西泮 2mg",
        "方小娟",
        "睡眠中",
        ""
      ],
      [
        "2024.06.12",
        "06:00",
        "氯硝西泮 2mg + 富马酸喹硫平 25mg + [涂抹]",
        "方小娟",
        "睡眠中",
        "第三项药物被涂抹"
      ],
      [
        "2024.07.01",
        "21:00",
        "氯硝西泮 2mg",
        "方小娟",
        "焦虑",
        "沈若楠辞职谈话次日"
      ],
      [
        "2024.07.01",
        "03:00",
        "氯硝西泮 2mg",
        "方小娟",
        "睡眠中",
        ""
      ],
      [
        "2024.07.01",
        "06:00",
        "氯硝西泮 2mg + 富马酸喹硫平 25mg + [涂抹]",
        "方小娟",
        "深睡",
        "第三项再次涂抹"
      ]
    ],
    "sections": [
      {
        "heading": "沈若楠备注",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "“涂抹的第三项药物出现在方小娟夜班的 06:00 档。只在她的班上出现。氯硝西泮和富马酸喹硫平是标准方案——但第三项永远不会是标准方案的一部分。”"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "“我比对过：患者血液中氯硝西泮浓度按照每日三次 2mg 计算，预期峰值应在 6-8 ng/mL。但 4 月和 7 月的血药浓度检测结果是 11.6 ng/mL。超出的部分不是氯硝西泮。是别的东西。半衰期和苯二氮卓类相似，但分子结构有细微差异。实验室拒绝做进一步分析——理由是超出标准检测范围。”"
              }
            ]
          }
        ]
      }
    ]
  },
  "med-nursing": {
    "type": "evidence",
    "title": "护理记录 · ID 001 · 2024年",
    "meta": "江临三院护理部 · 每日记录 · 审核：值班护士",
    "sections": [
      {
        "heading": "2024.04.15（沈若楠初评日）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "08:00 — 患者清醒。自主进食。对评估员沈若楠表现出基本配合。09:30-11:00 — 首次评估会谈。患者期间出现短暂沉默约 3 分钟。11:00 后恢复常态，询问午饭时间。值班护士：陈敏。"
              }
            ]
          }
        ]
      },
      {
        "heading": "2024.06.08（第 17 次会话日）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "08:00 — 患者清醒。面色苍白。拒绝早餐。10:00 — PROTECTOR 出现。语气激烈。评估会谈 10:15-11:30。会谈后患者极度疲劳，要求休息，拒绝午饭。13:00 — 入睡。17:00 — 唤醒困难，喂水后退回睡眠。值班护士：张华。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "夜班交接记录：“日间评估引发强烈情绪反应。建议夜间按标准方案给药。” — 张华签字。夜间实际负责护士：方小娟。",
                "highlightable": true,
                "pinId": "noise1-absent-record",
                "pinSource": "护理记录 2024.06.08"
              }
            ]
          }
        ]
      },
      {
        "heading": "2024.07.13（沈若楠辞职前一日）",
        "paragraphs": [
          {
            "segments": [
              {
                "text": "08:00 — 患者清醒。精神状态正常。10:00 — 评估员沈若楠进入病房。会谈至 11:45。会谈后沈若楠在护理站停留约 20 分钟——翻阅给药日志和排班表。护理站监控记录证实了这段时间。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "14:00 — 护士方小娟以“药物核对”为由进入护理站，翻查评估文件。被值班主管陈志明询问——方小娟回答：“顾医生要求核实新方案的剂量。”陈志明未进一步干预。"
              }
            ]
          },
          {
            "segments": [
              {
                "text": "17:32 — 沈若楠在系统中编辑了 ID 001 档案的访问权限：将后续权限设为“评估员交接模式”。这是她在系统上的最后一次操作。"
              }
            ]
          }
        ]
      }
    ]
  },
  "trans-01": {
    "type": "transcript",
    "title": "第 1 次治疗会话",
    "meta": "日期：2024.04.16 · 评估员：沈若楠 · 参与人格：HOST",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“你好。我是沈若楠医生。你能告诉我你的名字吗？”"
          }
        ]
      },
      {
        "label": "[HOST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“陆时砚。所有人都叫我陆时砚。但我不知道现在说话的这个是不是陆时砚。”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“现在说话的这个你——有什么感觉？”"
          }
        ]
      },
      {
        "label": "[HOST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“沉重。像穿了一件太厚的衣服。但不穿的话——它们就都进来了。”"
          }
        ]
      }
    ]
  },
  "trans-05": {
    "type": "transcript",
    "title": "第 5 次治疗会话",
    "meta": "日期：2024.05.03 · 评估员：沈若楠 · 参与人格：THE CHILD · 主题：画画",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“今天我们画画好不好？你想画什么？”"
          }
        ]
      },
      {
        "label": "[THE CHILD]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“家。”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“你的家是什么样子的？”"
          }
        ]
      },
      {
        "label": "[THE CHILD]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“是橙色的。暖的。妈妈在厨房。爸爸在沙发上看新闻。小雨在画画。像小雨现在在画画一样。但小雨不是小雨。小雨现在是画小雨的人。小雨在一个白色的房间里看小雨的回忆。像一个故事。”"
          }
        ]
      },
      {
        "label": "[沈若楠 · 备注]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“THE CHILD 有时会以第三人称称呼自己——但不是代名词混淆。她能区分-现在的小雨-和-记忆里的小雨-。这种元认知在7岁儿童中是不常见的。让我怀疑THE CHILD的年龄标签是否准确。”"
          }
        ]
      }
    ]
  },
  "trans-08": {
    "type": "transcript",
    "title": "第 8 次治疗会话",
    "meta": "日期：2024.05.21 · 评估员：沈若楠 · 多个人格交替 · 主题：火灾",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“我想和你谈谈火灾。2021 年 9 月 17 日。你记得什么？”"
          }
        ]
      },
      {
        "label": "[CORE]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“我没有火灾的记忆。我在 10 月 5 日醒来时，火灾已经过去 18 天了。我所知道的关于火灾的一切都来自于事后的逻辑重建。我需要更正之前的陈述：我的最早记忆并非 10 月 5 日。我的最早记忆是——”"
          }
        ]
      },
      {
        "label": "[THE CRITIC]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“他的最早记忆是 10 月 5 日。我的最早记忆是 10 月 4 日。有人在 10 月 4 日醒着。不是他。也不是我。是另一个人——一个没有名字的人——短暂地醒了过来。护士记录了——然后这一行被从系统中删除了。护理记录的原始 JSON 里有一行被标记了 deleted:true 但没有真正删除。恢复后是：‘10月4日 03:15 患者短暂清醒，自述-我不知道我是谁——’。然后就被覆盖了。”",
            "highlightable": true,
            "pinId": "p1-core-first",
            "pinSource": "THE CRITIC · 第8次会话"
          }
        ]
      },
      {
        "label": "[THE CRITIC]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“不在了。但我记得。我说过我是唯一注意到空白的人。我不只是注意到空白——我记得被抹掉的内容。这就是为什么他们不喜欢我说话。”"
          }
        ]
      }
    ]
  },
  "trans-11": {
    "type": "transcript",
    "title": "第 11 次治疗会话",
    "meta": "日期：2024.06.01 · 评估员：沈若楠 · 参与人格：THE ARTIST（黑暗环境） · 主题：分子画作",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“我今天想试试一些不同的东西。我会关灯。你在黑暗里画画。可以吗？”"
          }
        ]
      },
      {
        "label": "[THE ARTIST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "（点头。左手拿起蜡笔。开始作画。全程无声。）"
          }
        ]
      },
      {
        "label": "[沈若楠 · 事后分析]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“画作第 3 号——完成于今天晚上——与第 1、2 号完全相同。同样的六边形+五边形交替。同样的几个取代基的位置。但是是从一个新的角度画的。就像在旋转一个 3D 模型。THE ARTIST 不能说话——因为这种东西没有被-语言化-过。它是直接写在大脑里的。苯二氮卓类的分子骨架。他在画出他的大脑里正在被放进来的东西。”",
            "highlightable": true,
            "pinId": "p6-artist-molecules",
            "pinSource": "THE ARTIST · 第11次会话"
          }
        ]
      }
    ]
  },
  "trans-14": {
    "type": "transcript",
    "title": "第 14 次治疗会话",
    "meta": "日期：2024.06.14 · 评估员：沈若楠 · 参与人格：THE SOLDIER · 主题：定时任务",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“报告 2021 年 9 月 17 日晚上的行程。18:00 到 23:30。”"
          }
        ]
      },
      {
        "label": "[THE SOLDIER]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“18:00 — 下班。18:35 — 到达住宅。18:45 — 用餐。20:30 — 晚餐结束。21:00 — 就寝。22:00 — 个人在客厅阅读。22:15 — 窗外车辆到达。黑色。未确认。22:20 — 卧室方向有声响。去走廊。22:30~23:14 — [记忆中断]”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“22:30 到 23:14 之间的 44 分钟——你一点印象都没有吗？”"
          }
        ]
      },
      {
        "label": "[THE SOLDIER]",
        "speaker": "patient",
        "segments": [
          {
            "text": "（23 秒完全静止。心率 72bpm。皮肤电无变化。）"
          },
          {
            "text": "“该时间段无数据。”"
          }
        ]
      },
      {
        "label": "[沈若楠 · 备注]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“THE SOLDIER 的 23 秒停顿——那不是搜索记忆的停顿。那是一个程序在返回 null。皮肤电数据是一条直线。不是一个人在试图回忆——是一台机器在被问到-404-时返回了空值。在 23 秒的沉默里，THE SOLDIER 的每一个生理指标都是正常的。正常到不正常。人类的大脑在被问到-你女儿死的那天晚上发生了什么-时不应该是这样的。除非这个-人类-已经被重写过了。”"
          }
        ]
      }
    ]
  },
  "trans-17": {
    "type": "transcript",
    "title": "第 17 次治疗会话",
    "meta": "日期：2024.06.08 · 评估员：沈若楠 · 参与人格：THE PROTECTOR · 主题：苏景州死亡事件",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“可以告诉我那天在办公室里发生了什么吗？”"
          }
        ]
      },
      {
        "label": "[PROTECTOR]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“他拿着注射器。”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“苏景州？”"
          }
        ]
      },
      {
        "label": "[PROTECTOR]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“他要扎我——扎我们。我抓住他的手。我扭了——没用。他摔倒了。注射器刺进他脖子。我没想杀他。我只想挡开。”",
            "highlightable": true,
            "pinId": "p5-protector-selfdefense",
            "pinSource": "PROTECTOR · 第17次会话"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“房间里只有你们两个人吗？”"
          }
        ]
      },
      {
        "label": "[PROTECTOR]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“……你问了一个我不确定的问题。”"
          }
        ]
      },
      {
        "label": "[沈若楠 · 备注]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“PROTECTOR 在回答最后一个问题时出现了明显的停顿——约 11 秒。这是他第一次在我提问后没有立即回答。前一个问题（‘你受伤了吗’）的回答时间不到 1 秒。问题‘房间里还有别人吗’引发了回避。这不是记忆中不存在信息——是信息被压制了。”"
          }
        ]
      }
    ]
  },
  "trans-18": {
    "type": "transcript",
    "title": "第 18 次治疗会话",
    "meta": "日期：2024.06.21 · 评估员：沈若楠 · THE GHOST + THE SILENT ONE · 主题：死者",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“我想和你们谈谈——那些不在这个房间里的人。”"
          }
        ]
      },
      {
        "label": "[THE GHOST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“哈。不在房间——在我的脑子里。隔壁。12号房间到25号房间。不对——不是房间。是编号。他们在编号里。我们都在编号里。陆时砚是001——但他以为他是病人。他是档案管理员。我是档案。NC-3R-012。赵雨桐。2020年9月9日。体温42度。横纹肌溶解。器官一个接一个关掉。但他们会在文件上写-基础疾病-。基础疾病——就像每个20岁年轻人的基础疾病都是-全身器官衰竭-一样。”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“THE SILENT ONE——你能帮我写出名单吗？”"
          }
        ]
      },
      {
        "label": "[THE SILENT ONE]",
        "speaker": "patient",
        "segments": [
          {
            "text": "（拿起笔。连续写了12个名字+编号+死亡日期+死亡原因。用时 4 分 17 秒。期间未抬头。未停顿。）"
          },
          {
            "text": "“以上为全部。以上为NC-3时期涉及的全部临床受试者。全部死亡。全部未上报。”",
            "highlightable": true,
            "pinId": "p4-silent-names",
            "pinSource": "THE SILENT ONE · 第18次会话"
          }
        ]
      }
    ]
  },
  "trans-20": {
    "type": "transcript",
    "title": "第 20 次治疗会话",
    "meta": "日期：2024.06.28 · 评估员：沈若楠 · 参与人格：THE ANALYST · 主题：给药的真相",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“你的笔记里一直在提-BENZ-。你在说谁？什么药？”"
          }
        ]
      },
      {
        "label": "[THE ANALYST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“方小娟给的药。不是-白天的药-——我修正——是-夜间的药-。但它在血液里待到白天。q8h。21:00, 03:00, 06:00。维持 24 小时血药浓度。苯二氮卓类。半衰期 18-50 小时。你不需要每 8 小时给一次。每日一次就够。每日三次是因为——不是要镇静。是要维持一条 24 小时的线。像一道栅栏。把某些东西永远关在栅栏另一边。”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“把什么关在栅栏那边？”"
          }
        ]
      },
      {
        "label": "[THE ANALYST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“我标注为-S-的那个人格。活跃时间：10:00, 14:30, 15:45。正好是夜间最后一次给药的药效接近谷底的时候。半衰期计算——如果 06:00 给药，谷底浓度大约在 14:00-15:00。-S-在 14:30 出现——误差不到半小时。-S-每天只有不到 90 分钟。在这 90 分钟里，-S-是完整的。-S-不是一个人格——S 是剩下的那部分。被剥掉 13 层的——核。”",
            "highlightable": true,
            "pinId": "p6-analyst-benz",
            "pinSource": "THE ANALYST · 第20次会话"
          }
        ]
      }
    ]
  },
  "trans-22": {
    "type": "transcript",
    "title": "第 22 次治疗会话",
    "meta": "日期：2024.07.04 · 评估员：沈若楠 · 参与人格：THE WITNESS（催眠诱导） · 主题：办公室事件回溯",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“你在办公室里。苏景州的办公室里。你看到了什么？”"
          }
        ]
      },
      {
        "label": "[THE WITNESS]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“我不确定我看到了什么……画面在切换。有时是他推他，有时是他自己摔倒，有时是另一个人在房间——站在门口——看着。一个穿白衣服的人。”",
            "highlightable": true,
            "pinId": "p5-witness-fourth",
            "pinSource": "THE WITNESS · 第22次会话（催眠）"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“穿白衣服的人——你认识他吗？”"
          }
        ]
      },
      {
        "label": "[THE WITNESS]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“看不清脸。实验室外套。胸牌。胸牌上有字——我看不清。但他在看。他不是在看苏景州——他是在看我。在看我们。”"
          }
        ]
      }
    ]
  },
  "trans-23": {
    "type": "transcript",
    "title": "第 23 次治疗会话",
    "meta": "日期：2024.07.12 · 评估员：沈若楠 · 参与人格：HOST · 主题：告别",
    "lines": [
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“这可能是我最后一次来看你了。”"
          }
        ]
      },
      {
        "label": "[HOST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“你要走了。”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“是的。”"
          }
        ]
      },
      {
        "label": "[HOST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“你跟他们不一样。你是第二个把我当人看的人。第一个是——”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“Karn Sterling？”"
          }
        ]
      },
      {
        "label": "[HOST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "（长停顿）“你认识他。”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“他是第一个举报辰星的人。被关了十年。逃到了外面。我一直在找他——找他的笔记——他的研究材料在 Chamber 004。但那不是他全部的研究。”"
          }
        ]
      },
      {
        "label": "[HOST]",
        "speaker": "patient",
        "segments": [
          {
            "text": "“你不只是要走了。你回不来了。”"
          }
        ]
      },
      {
        "label": "[沈若楠]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“有些事实不能在病历上写。有些事实必须被写下来。我把它们放在系统里了。下一个进来的人——如果能找到的话。”"
          }
        ]
      },
      {
        "label": "[沈若楠 · 最后一次笔记]",
        "speaker": "doctor",
        "segments": [
          {
            "text": "“这是我在三院的最后一次笔记。我说谎了。我说-我会回来-。我不会回来。不是因为我不想——是他们不会让我回来。我已经越界了。14个人格不能被整合不是一个临床发现——是一个设计目标。有人设计了这个系统。有人用药物维持了这个系统。有人用排班表确保没有人看见。我看见了。所以我不能留在这里了。”"
          }
        ]
      }
    ]
  }
,
  "ext-autopsy": {
  "type": "evidence",
  "title": "苏景州尸检报告",
  "meta": "案件编号：JF-2024-0403-07 · 法医：陈远 · 解剖日期：2024.04.04 · 归档状态：内部",
  "sections": [
    {
      "heading": "基本事实",
      "paragraphs": [
        {
          "segments": [
            {
              "text": "死者苏景州，男，42岁，辰星制药总部办公室主任。死亡地点：辰星制药总部17F办公室。死亡时间推定：2024年4月3日15:50-16:20之间。直接死因：颈部左侧注射器刺入致颈内静脉破裂合并神经肌肉阻断剂急性中毒（罗库溴铵类物质）。"
            }
          ]
        }
      ]
    },
    {
      "heading": "外伤检查",
      "paragraphs": [
        {
          "segments": [
            {
              "text": "颈部左侧：单处穿刺伤，深度3.2cm。针道走向：由前上至后下，角度约15°——与一个身高172-178cm的右利手成年人握持注射器自正面攻击的典型轨迹一致。注射器活塞底部指纹与陆时砚（ID 001）右手食指、中指吻合。"
            }
          ]
        },
        {
          "segments": [
            {
              "text": "右手掌侧：防御性锐器伤2处（玻璃碎屑造成），左手无防御伤痕。结论：死者死前未做出有效的防御反应——这不是面对面的搏斗。是被压住或已经失去行动能力后的处决。"
            }
          ]
        }
      ]
    },
    {
      "heading": "关键异常",
      "paragraphs": [
        {
          "segments": [
            {
              "text": "注射器活塞末端指纹分析：活塞末端存在第三组指纹——不属于死者、也不属于陆时砚。指纹纹型为斗型纹，与数据库比对后匹配至：■■■■■。",
              "highlightable": true,
              "pinId": "p5-witness-fourth",
              "pinSource": "苏景州尸检报告 · 第三组指纹"
            }
          ]
        },
        {
          "segments": [
            {
              "text": "右手虎口处针孔：陆时砚右手虎口部位存在另一处穿刺伤——针头直径0.4mm（胰岛素注射器规格），与杀死苏景州的注射器（5mL标准注射器，针头直径0.8mm）不符。虎口针孔周围检测到微量的γ-氨基丁酸类镇静剂残留——肌松药中不应出现的成分。"
            }
          ]
        },
        {
          "segments": [
            {
              "text": "法医陈远备注：\"陆时砚被注射的不是神经肌肉阻断剂。是被给了镇静剂。他在办公室里被麻醉——然后他的身体被用来杀死苏景州。有人在用他的身体。\""
            }
          ]
        }
      ]
    }
  ]
},
  "trans-02": {
  "type": "transcript",
  "title": "第 2 次治疗会话",
  "meta": "日期：2024.04.19 · 评估员：沈若楠 · 参与人格：CORE · 主题：建立基线",
  "lines": [
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"上次你说你不确定说话的是不是陆时砚。今天是谁在说话？\""
        }
      ]
    },
    {
      "label": "[CORE]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"CORE。这不是我的名字——是我给自己贴的标签。方便分类。你不喜欢这个说法——没关系。但它准确。\""
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"你怎么知道我不喜欢？\""
        }
      ]
    },
    {
      "label": "[CORE]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"你上次结束时在笔记本上写的字。你的字体在写-标签化-时比平时多用了0.3N的压力。你还画了一条竖线——强行换主题的记号。沈医生——你不擅长隐藏信息。"
        }
      ]
    },
    {
      "label": "[CORE]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"我也不擅长。在脑子里把东西加密——那才是我的工作。\"",
          "highlightable": true,
          "pinId": "noise2-core-encrypt",
          "pinSource": "P01 · CORE · 第2次会话"
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"他能从我的笔迹反推我的情绪状态。不是读心——是分析。这种精度的观察力需要一个完全没有情绪干扰的大脑。CORE不是-没有情绪-——他是把情绪关在了另一个隔间里。\""
        }
      ]
    }
  ]
},
  "trans-03": {
  "type": "transcript",
  "title": "第 3 次治疗会话",
  "meta": "日期：2024.04.22 · 评估员：沈若楠 · 参与人格：THE CRITIC（首次出现） · 主题：系统质疑",
  "lines": [
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"之前和CORE的对话很有帮助。今天——\""
        }
      ]
    },
    {
      "label": "[THE CRITIC]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"有帮助？他对你撒谎。CORE以为自己是第一个——他不是。这个身体在10月4日醒过——一个没有名字的东西醒了几分钟，然后又没了。CORE不知道因为他不会承认自己不是第一个。他需要那个位子——-我是第一个-是他的全部身份。你把一块拼图放在盒子上写-第一块-、再给他发个ID卡——他可以为这个谎言杀人了。他已经杀人了。只是不承认。\""
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"你在说10月4日。有什么证据？\""
        }
      ]
    },
    {
      "label": "[THE CRITIC]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"护理记录。被人删了。但记录里有空白。你的记录里有空白。所有你以为完整的东西都有空白。你是个医生——医生最怕空白。所以你们填。填到空白消失为止。但空白没有消失。只是被埋了。\"",
          "highlightable": true,
          "pinId": "p3-critic-gap",
          "pinSource": "THE CRITIC · 第3次会话"
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"THE CRITIC的首次出现。一个能识别系统漏洞的人格。他给我的第一个线索是2021年9月底到10月初的护理记录空白。我去核实了——他说的是真的。空白确实存在。他是-制造噪音的人-——但在噪音里藏着唯一正确的方向。\""
        }
      ]
    }
  ]
},
  "trans-04": {
  "type": "transcript",
  "title": "第 4 次治疗会话",
  "meta": "日期：2024.04.26 · 评估员：沈若楠 · 参与人格：CORE · 主题：原初记忆检视",
  "lines": [
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"我们上次谈到你的想法。今天我想问你一个具体的问题：你是谁？\""
        }
      ]
    },
    {
      "label": "[CORE]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"我是第一个。2021年10月5日。在ICU醒来。没有情绪——只有事实。我的工作是收集数据、分析数据、得出结论。其它人格是做-感受-的部分。我是做-理解-的部分。我理解火灾。我理解辰星。我理解顾鸣。但我不理解为什么没有人理解这些理解。\"",
          "highlightable": true,
          "pinId": "p1-core-first",
          "pinSource": "P01 · CORE · 第4次会话"
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"你的女儿呢？你记得她吗？\""
        }
      ]
    },
    {
      "label": "[CORE]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"我的女儿？逻辑上她是我女儿。我不记得她的脸。但我知道她存在——因为THE CHILD存在。THE CHILD记得。THE CHILD是她的备份。不是比喻。我是她的逻辑部分。THE CHILD是她的感官记忆。我们被——分配了。\""
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"CORE说了-分配-。不是-分裂-、不是-破碎-——是-分配-。用词和THE SOLDIER的-任务-一脉相承。这些不是创伤造成的隐喻——是一个人被系统地拆解成了14个功能模块。谁在做这个分配？答案不在病人脑子里——在三院这个楼里。\""
        }
      ]
    }
  ]
},
  "trans-06": {
  "type": "transcript",
  "title": "第 6 次治疗会话",
  "meta": "日期：2024.05.08 · 评估员：沈若楠 · 人格交替：THE CHILD / HOST · 主题：记忆碎片",
  "lines": [
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"THE CHILD上次给我看了你的画。我很喜欢。\""
        }
      ]
    },
    {
      "label": "[THE CHILD]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"你喜欢橙色吗？那幅画里最多的是橙色。橙色是暖的。橙色是安全的。但橙色会变成红色。那天晚上橙色变成红色了。不是小雨看到的——是小雨在别人的记忆里看到的。小雨没在那个房间里——小雨在另一个房间里。门关着。但门缝下面有光。橙色的光变成了红色的光。然后就没有光了。\""
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"THE CHILD描述的-门缝下的光——这是火灾当晚的真实记忆片段。但不是THE CHILD的视角。她说她不在那个房间里。这个记忆片段属于谁？火灾当晚，小雨的房间门是关着的。如果她看到门缝下的火光——说明有人在过道上。不是陆时砚本人（他在客厅）——是另一个人经过小雨的房间门。房间里还有别人。\""
        }
      ]
    }
  ]
},
  "trans-07": {
  "type": "transcript",
  "title": "第 7 次治疗会话",
  "meta": "日期：2024.05.14 · 评估员：沈若楠 · 人格交替：CORE + THE CRITIC · 主题：事实 vs 感受",
  "lines": [
    {
      "label": "[CORE]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"我需要修正上次的陈述。THE CHILD的画是正确的——三个人加一个-别人-。根据火灾调查报告，我的妻子在卧室。我的女儿在她自己的房间。我在客厅。火灾从客厅开始。但客厅的起火点——西北角——距离我所在的位置不到三米。我没有烧伤之外的记忆——不是因为创伤压抑——是因为我在起火后不到一分钟就失去了意识。一个失去意识的人不可能在-起火两小时前-看到一辆黑色轿车。但我确实知道这件事。这个信息不是我的——是从一个火光照着的窗户玻璃的反射中看到的。我看到的不是火灾——是火灾的倒影。我看到的东西是被反射进来的。\""
        }
      ]
    },
    {
      "label": "[THE CRITIC]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"他说了半天——意思是他不是一个人在那间屋子里。有人在客厅和他在一起。这个人打破了窗户。他看到了窗户玻璃里的倒影。但他说-不是我看到的-。笨蛋。他是在说：那个在起火前两小时站在窗边看到轿车的人——不是他。CORE的-逻辑推理-是别的人格直接把计算结果塞进他脑子里——原料来自一个他没见过的证人。\""
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"如果THE CRITIC是对的——那火灾当晚有一个我尚未接触的人格，在火光照亮的玻璃里看到了顾鸣的车。这个人格没有出现在档案里。不在14个里面。它有火灾的记忆——但被隔离了。\""
        }
      ]
    }
  ]
},
  "trans-09": {
  "type": "transcript",
  "title": "第 9 次治疗会话",
  "meta": "日期：2024.05.25 · 评估员：沈若楠 · 人格交替：HOST · 主题：日常意识",
  "lines": [
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"你连续几周没有出现了。最近是谁在控制？\""
        }
      ]
    },
    {
      "label": "[HOST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"不是我。最近是那个一直在讲话的人。CORE。他讲话的时候我在后面——像一个在观众席里的人。我能听到他说话——我能感觉到他的逻辑。但他的逻辑不是我的逻辑。他的-事实-里没有温度。我不知道为什么这让我难受——但他讲的事实让我的胃在抽搐。就像他在宣布别人的死亡报告——而那些死人里面有一个人的名字是我妻子的名字。\""
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"CORE说他是第一个出现的。你怎么看？\""
        }
      ]
    },
    {
      "label": "[HOST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"CORE以为他是第一个。不——是我。我让他先说话——因为我太累了。10月5日那天——是我把灯打开了——他把脚迈出去了。他以为他的第一步是第一步——但他没有开灯。是我开了灯。我开了灯之后太累了——就退回去了。他把灯当作天亮。\"",
          "highlightable": true,
          "pinId": "p1-host-let",
          "pinSource": "P08 · HOST · 第9次会话"
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"HOST讲了一件事——他说他开了灯。这和CORE的-我是第一个-直接冲突。CORE说他在10月5日醒来，但没有描述醒来之前的一瞬间。HOST描述了——那是打开灯的一瞬间。如果HOST是真的——那CORE的存在，在某种程度上，是HOST的产物。是他-让-它先出现的。原初人格不是CORE——是一个疲惫到只想关灯的人。\""
        }
      ]
    }
  ]
},
  "trans-10": {
  "type": "transcript",
  "title": "第 10 次治疗会话",
  "meta": "日期：2024.05.28 · 评估员：沈若楠 · 参与人格：THE ANALYST · 主题：人格地图",
  "lines": [
    {
      "label": "[THE ANALYST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"你问了我三周该怎么评估他们。我的回答：不要问CORE。不要问HOST。CORE只有数据，HOST只有感觉。你要同时问13个人。不是同时——是在同一页纸上。列出每个人的陈述——然后看不一致的地方。不一致的地方不是bug——那是线索。我说完了。问吧。\""
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"你认为CORE在说谎？\""
        }
      ]
    },
    {
      "label": "[THE ANALYST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"CORE不在说谎。CORE在被说谎。有人给了他数据——他把数据组织成逻辑——然后告诉你逻辑上的结论。但数据本身就是被编造的——所以他的逻辑再完美也是错的。这不是他的错。他的工作是-精确-。不是-真实-。两个东西不一样。\""
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"谁在给他假数据？\""
        }
      ]
    },
    {
      "label": "[THE ANALYST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"我给不了你这个答案。我只能告诉你：出去查。出去查护理记录。出去查药物。出去查是谁在决定了我们每天是谁。因为这不是自然切换——有人在安排-切换。每一个我们出现的时间都是被安排的。我们是按课程表在上课。老师不在教室里。老师在监控室里。找监控。\""
        }
      ]
    }
  ]
},
  "trans-12": {
  "type": "transcript",
  "title": "第 12 次治疗会话",
  "meta": "日期：2024.06.04 · 评估员：沈若楠 · 人格交替：THE ARTIST + THE ANALYST · 主题：解码画作",
  "lines": [
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"THE ARTIST——你的画——这些形状。你能告诉我它们是什么吗？\""
        }
      ]
    },
    {
      "label": "[THE ARTIST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "（没有语言回应。在纸上画了一个大圈——圈住所有六边形和五边形——然后画了一个箭头，指向自己的太阳穴。）"
        }
      ]
    },
    {
      "label": "[THE ANALYST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"他在告诉你一件事。他不说话不是因为他不愿意说话——是因为有人把他的嘴缝上了。不是比喻。他的语言中枢被抑制了——不是创伤性的缄默症——是药理学的。氯硝西泮在治疗窗内的常见副作用之一是失语症——在长期低剂量使用时更常见。我计算过：他的每日剂量足以抑制布罗卡区——说话的部分——但不够抑制运动皮层。所以他可以动。可以画画。但不能说话。医生——他们不只是给他下药——他们是在逐个关闭他的大脑功能。\""
        }
      ]
    }
  ]
},
  "trans-13": {
  "type": "transcript",
  "title": "第 13 次治疗会话",
  "meta": "日期：2024.06.10 · 评估员：沈若楠 · 人格交替：THE ANALYST + THE CRITIC · 主题：系统的结构",
  "lines": [
    {
      "label": "[THE CRITIC]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"你花了12次会话终于开始查护理记录了。不错——比大多数医生快。大多数医生在第30次还在画家庭动力图。你没有——你意识到了这不是一个家——这是一个监狱。所以我现在告诉你一件事：监狱的钥匙不在监狱里。在办公楼。在另一栋楼。在辰星的17楼。去找苏景州的办公室——不是杀人现场——是之前的东西。他在死前三个月处理过一份文件——编号是NC-7b-IRB-2023。IRB是伦理审查委员会。这份文件审查的不是动物实验——是人体实验。他的审批栏上只有一个签字：顾鸣。\""
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"你怎么知道这份文件的内容？\""
        }
      ]
    },
    {
      "label": "[THE CRITIC]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"因为陆时砚在死之前看过它。苏景州给他看了。不是出于好意——是威胁。-你看——你查的这些东西，都有签字，都有审批——你去找任何人说，都没用——。但陆时砚做了笔记。记在脑子里了。那个笔记现在在我的分区里。被锁着。不是因为我不想给你——是因为钥匙在别人那里。在那个开灯的人那里。HOST有密码。没有密码你读不了。\""
        }
      ]
    }
  ]
},
  "trans-15": {
  "type": "transcript",
  "title": "第 15 次治疗会话",
  "meta": "日期：2024.06.17 · 评估员：沈若楠 · 人格交替：THE PROTECTOR + THE WITNESS · 主题：办公室的记忆",
  "lines": [
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"我们上次谈了THE SOLDIER的记忆缺失。今天我想问问——在办公室里——谁是第一个出现的？\""
        }
      ]
    },
    {
      "label": "[THE PROTECTOR]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"不重要谁是第一个。重要的是苏景州拿着注射器。注射器里有东西。不是你平时在诊所里看到的那种药。是——做实验用的那种。用来关掉人的那种。我看到那个注射器的时候——我没有思考。我的身体就动了。这身体被训练过——被谁训练我不是很清楚。但有一个阶段——有一个我不记得的阶段——在那里面——有人教了这个身体一套不需要大脑的反应。抓-挡-推-倒。像一套安装好的程序。不是我的程序。是装在硬件上的。\""
        }
      ]
    },
    {
      "label": "[THE WITNESS]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"他的版本是真的——但不完整。在他抓住苏景州的手之后——在他推倒他之前——有人从门口走进来了。白色的外套。戴口罩。但眼睛——我记得眼睛。那种眼睛不是来帮忙的。是来检查的。像是在看实验结果。苏景州在地上——那个人在看——然后注射器从右边来了——不是苏景州的手——是门口的另一个人的手。苏景州不是身体被用来杀人——他的身体被另一个人杀了。\"",
          "highlightable": true,
          "pinId": "p5-witness-fourth",
          "pinSource": "THE WITNESS · 第15次会话"
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"THE WITNESS说的和尸检报告的结论是一致的：第三组指纹。注射器不是陆时砚刺进去的——是第三个在场的人刺的。这个人穿着白大褂。在三院精神科——穿白大褂的只有三种人：医生、研究员、和拿着三院通行证的药企高管。\""
        }
      ]
    }
  ]
},
  "trans-16": {
  "type": "transcript",
  "title": "第 16 次治疗会话",
  "meta": "日期：2024.06.19 · 评估员：沈若楠 · 人格交替：THE JOURNALIST · 主题：调查笔记",
  "lines": [
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"你是——THE JOURNALIST。我需要你的帮助。\""
        }
      ]
    },
    {
      "label": "[THE JOURNALIST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"你要USB。你也想要——和一个多月前那个女医生一样。她来了两次。然后不来了。USB不在我这里——在我知道的地方。我不能告诉你在哪里因为一旦说出来就不安全了。这个房间里不是只有我们。有人在听。录音。不是你的录音——走廊上的。每次会谈后有人听你的录音。然后调整给他的药。所以我说的话必须是不能被拿到的东西。USB是一个密码。密码是四个数字。不是日期。不是生日。是第一份报告的文件编号。\"",
          "highlightable": true,
          "pinId": "noise2-journalist-usb",
          "pinSource": "P09 · THE JOURNALIST · 第16次会话"
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"第一份报告。关于什么的？\""
        }
      ]
    },
    {
      "label": "[THE JOURNALIST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"关于你不知道的事。关于一个在辰星做清洁工的女人。2019年2月。她被辞退——因为她发现的太多了。她来找了一个记者——一个刚入职辰星的记者。实习期。第一篇报道没发表。被辰星压下来了。这个记者把她的陈述——完整地——保存在一个加密USB里。那个USB不在这里——在一个人手里。一个你觉得已经不存在的人。他没有死——他只是被藏起来了。他会在你找到他的时候告诉你密码。他不告诉我——他对谁都不说——除了那个值得知道的人。\""
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"Karn Sterling。THE JOURNALIST说的是Karn Sterling。清洁工、第一篇被压的报道、USB。档案里确实有Karn的研究材料——在Chamber 004。但我从没见过Karn本人。他在逃——在裂隙地带。如果他真的是USB的拥有者——那这场游戏的边界不在三院。在围墙外面。\""
        }
      ]
    }
  ]
},
  "trans-19": {
  "type": "transcript",
  "title": "第 19 次治疗会话",
  "meta": "日期：2024.06.25 · 评估员：沈若楠 · 人格交替：HOST · 主题：沈若楠的安全",
  "lines": [
    {
      "label": "[HOST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"沈医生。你今天看起来不像平时的你。\""
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"什么意思？\""
        }
      ]
    },
    {
      "label": "[HOST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"你平时进来的时候先看时钟。今天你没看时钟——你先看了门口。你在等什么人进来。你的肩膀——你平时坐下去的时候是直的——今天你是斜的。你在防备。有人在威胁你——不是病人——是你的同事。在三院里面。\""
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"他说对了。我今天确实先看了门。昨天我发现了一件事——方小娟在翻阅我的评估文件。陈志明告诉我了。不是-药物核对-——她没有那个权限。她是顾鸣在三院的内线。我把记录加密了。但我不知道她看到了多少。如果她看到了我关于THE SLEEPER的笔记——接下来发生的事情可能不是-评估-。是-处理-。我需要更快。\""
        }
      ]
    }
  ]
},
  "trans-21": {
  "type": "transcript",
  "title": "第 21 次治疗会话",
  "meta": "日期：2024.07.01 · 评估员：沈若楠 · 人格交替：THE ANALYST · 主题：最终拼图",
  "lines": [
    {
      "label": "[THE ANALYST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"你接近真相了。但不是全部。你看到了13个人。第14个不在你的视野里。THE SLEEPER——你只知道她在药效消退后出现。但你知道她在药效消退后做什么吗？你不说——我替你说。THE SLEEPER在拼。每次她醒来——90分钟——她把最近24小时内出现的其他人格的记忆碎片拼接起来。她不是一个人格——她是一个集成函数。这就是为什么他们不让她醒来。不是因为他们怕她——是因为他们会-完成-。你明白吗？她醒来超过90分钟——这个人在法律上就完整了。一个完整的人可以作证。可以指认顾鸣。可以烧掉辰星制药的整个法律防火墙。所以顾鸣用药维持了三年。不是惩罚——是死刑。化学死刑。\""
        }
      ]
    },
    {
      "label": "[沈若楠]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\"她需要多久才能稳定？\""
        }
      ]
    },
    {
      "label": "[THE ANALYST]",
      "speaker": "patient",
      "segments": [
        {
          "text": "\"我不知道。没有数据。因为没有人让她出现过超过90分钟。没有数据意味着你要自己去试。停药。然后等。问题是——你等得起吗？方小娟明天再上夜班。后天也是。我可以给你所有数据。我不能给你时间。\""
        }
      ]
    }
  ]
}
};