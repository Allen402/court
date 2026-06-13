const objectiveByNode={
 opening:'決定辯方的核心攻防方向',witnessIntro:'檢驗目擊者的觀察條件與時間依據',witnessPosition:'判斷四十公尺外的辨識可信度',witnessTime:'驗證 21:20 這個時間是否可靠',witnessPower:'確認黑暗環境是否足以辨認被告',parkingChallenge:'用移動距離推翻目擊時間線',curatorIntro:'檢驗被告是否仍有系統操作能力',curatorAccess:'確認誰真正擁有庫房權限',curatorDiscovery:'檢查館長自己的行動時間線',accessReveal:'解釋 21:20 的管理卡紀錄',curatorCornered:'判斷複製卡片是否只是推測',frameQuestion:'確認背包碎片是否來自失竊畫作',frameReveal:'決定如何運用材質鑑定結果',objection:'回應檢方對技術能力的主張',powerReveal:'找出手動關閉監視器的權限持有人',messageReveal:'整合簡訊、門禁與監視器紀錄',closing:'選擇能涵蓋完整證據鏈的結案論證',
 c2_open:'區分「識別卡被使用」與「本人進入」',c2_witness:'檢驗證人是否真正看清持卡者',c2_log:'追查遺失備用卡如何恢復權限',c2_batch:'連結藥品批號與權限異動',c2_close:'建立無法由被告完成的時間線',
 c3_open:'區分帳號紀錄與實際操作人',c3_witness:'檢驗「只有被告有能力」的主張',c3_token:'追查登入權杖的管理與匯出權限',c3_server:'還原打包與下載的先後順序',c3_close:'用數位鑑識證明帳號遭冒用'
};
const clueLabels={parking:'停車紀錄',access:'門禁權限',frame:'材質鑑定',system:'系統操作',identity:'身分辨識',alibi:'不在場影像',chain:'紀錄關聯',device:'裝置指紋'};

Object.assign(nodes,{
 opening:{...nodes.opening,choices:[
  ['先攻擊畫框碎片的鑑定程序，主張採證可能受污染。','openMotive',1,'採證程序值得檢視，但目前沒有污染跡象，難以成為主要防線。'],
  ['主張檢方的犯案時間線無法同時容納目擊與停車紀錄。','openTimeline',5,'你把兩份客觀紀錄放在同一條時間線上比較。'],
  ['先保留立場，要求檢方證明被告仍有進入藝廊的權限。','openAttack',2,'權限是重要爭點，但尚未處理現有的目擊證詞。']]},
 witnessIntro:{...nodes.witnessIntro,choices:[
  ['先確認證人與後門的距離、光線及視線遮蔽物。','askPosition',3,'你先建立辨識可信度所需的客觀條件。'],
  ['先確認證人是否曾與被告見面，以及熟悉程度。','accuseEarly',1,'熟悉程度有參考價值，但仍不足以確認當晚所見。'],
  ['先鎖定證人判斷 21:20 的具體依據。','askTime',4,'時間是檢方將被告放入現場的關鍵。']]},
 witnessPosition:{...nodes.witnessPosition,choices:[
  ['確認證人當晚是否配戴平常使用的眼鏡。','askGlasses',2,'視力狀況會影響遠距離辨識能力。'],
  ['比對停電紀錄，確認藝廊側路燈是否真的亮著。','askPower',4,'證詞中的照明條件與客觀紀錄可能衝突。'],
  ['追問收銀台到窗戶間是否有顧客阻擋視線。','askDefendant',1,'視線遮蔽可能削弱證詞，但尚未觸及核心時間矛盾。']]},
 parkingChallenge:{...nodes.parkingChallenge,choices:[
  ['要求證人承認她只能確認「某個人」，不能精確確認時間。','finishWitness',5,'你把目擊內容限縮到證人真正能確認的範圍。'],
  ['主張刷卡可能由他人代付，因此停車紀錄只能作輔助證據。','blameWitness',-2,'這個可能性存在，但沒有任何代付跡象，反而削弱辯方證據。'],
  ['要求現場實測六百公尺的最快移動時間。','concede',2,'實測能補強論證，但現有紀錄已足以顯示時間極度緊迫。']]},
 curatorIntro:{...nodes.curatorIntro,choices:[
  ['先調查離職後帳號、員工卡與遠端權限是否全數撤銷。','askAccess',5,'犯案知識不等於案發時仍有操作權限。'],
  ['先要求館長交代發現失竊到報警間的每一段行動。','askDiscovery',3,'館長自己的時間線也必須受到檢驗。'],
  ['先證明其他員工也熟悉保全系統，削弱「只有被告能做」的說法。','attackCurator',2,'排除唯一性有幫助，但仍需找出實際權限紀錄。']]},
 curatorAccess:{...nodes.curatorAccess,choices:[
  ['要求調閱所有管理卡在案發時段的完整門禁日誌。','unlockAccess',6,'比起猜測其他入口，管理卡紀錄能直接驗證誰進入庫房。'],
  ['要求搜索藝廊其他無門禁入口是否留下痕跡。','acceptMaybe',1,'可以排除替代入口，但無法立即確認庫房是誰開啟。'],
  ['調查副館長當晚的不在場證明，先排除另一名持卡者。','askValue',2,'排除副館長有價值，但完整門禁日誌仍是更直接的證據。']]},
 curatorCornered:{...nodes.curatorCornered,choices:[
  ['要求鑑識卡片是否有遭複製或異常寫入的技術痕跡。','demandProof',5,'複製卡片不能只靠推測，必須有技術證據。'],
  ['指出館長先前主張被告從其他入口進入，現在卻改稱複製管理卡。','priorConflict',6,'館長為配合新證據而改變說法，可信度下降。'],
  ['接受複製卡可能性，但要求檢方證明被告何時取得管理卡資料。','acceptClone',1,'你保留爭點，卻暫時讓未證實的複製說成立。']]},
 frameQuestion:{...nodes.frameQuestion,choices:[
  ['提出材質鑑定，證明碎片與失竊畫框的木材種類不同。','presentFrame',7,'物證必須先確認與犯罪客體具有同一性。'],
  ['要求重新檢查碎片是否可能來自藝廊內其他畫框。','plantEvidence',1,'來源調查合理，但無法直接排除檢方目前的連結。'],
  ['主張碎片取得時間不明，檢方無法證明是在案發當晚產生。','foundFragment',2,'時間來源是弱點，但材質差異會是更直接的反證。']]},
 objection:{...nodes.objection,choices:[
  ['主張熟悉系統只能證明能力，不能證明案發時實際操作。','yieldObjection',2,'法律上正確，但仍需找出誰擁有當時的管理權限。'],
  ['以停電時間吻合為由，主張監視器可能因電力問題中斷。','powerLogic',1,'這個解釋看似合理，但必須先確認監視器是否有備援電源。'],
  ['要求調閱維修紀錄與系統日誌，判斷中斷是斷電還是手動操作。','unlockPower',6,'你選擇用可驗證資料區分兩種競爭假說。']]},
 closing:{...nodes.closing,choices:[
  ['聚焦檢方無法證明碎片與失竊畫作相同，主張物證不足。','closeEmotion',2,'物證確實被削弱，但單一爭點沒有涵蓋全部時間線。'],
  ['強調刑事案件由檢方負擔舉證責任，現有疑點應作有利被告解釋。','closeBurden',4,'法律原則正確，但仍需要以本案證據具體說明疑點。'],
  ['依序串連 21:12 簡訊、21:18 系統操作、21:20 門禁與 21:22 停車紀錄。','closeTimeline',8,'你提出能解釋所有客觀紀錄的完整替代時間線。'],
  ['主張館長說法反覆，因此其全部證詞都不應採信。','closeAttack',1,'可信度受損不代表所有內容當然排除，論證過度延伸。']]},
 c2_open:{...nodes.c2_open,choices:[
  ['先驗證手術室監測是否能連續確認被告位置。','c2_where',5,'不在場影像可直接檢驗被告是否可能親自進入藥庫。'],
  ['先檢查門禁系統是否曾發生延遲寫入或時間不同步。','c2_fault',2,'系統時間可能影響判讀，但沒有跡象顯示紀錄失準。'],
  ['先主張醫囑到配藥涉及多人，責任不能只由開立醫囑者承擔。','c2_careless',1,'流程確實涉及多人，但仍需解釋被告名下的門禁卡。']]},
 c2_witness:{...nodes.c2_witness,choices:[
  ['確認證人是否看清正面、姓名牌或只有白袍背影。','c2_sight',4,'證人實際辨識到的特徵比她的結論更重要。'],
  ['比對證人說法與藥局當班表，確認她是否一直在場。','c2_attack',2,'在場時間值得確認，但尚未推翻她看到持卡人的主張。'],
  ['提出手術室連續監測影像，要求解釋同一時間出現在兩地的矛盾。','c2_or',7,'客觀影像與門禁時間形成無法迴避的衝突。']]},
 c2_log:{...nodes.c2_log,choices:[
  ['調閱備用卡停用、重啟與管理者操作紀錄。','c2_unlock',7,'誰能恢復卡片權限，是判斷冒用可能性的核心。'],
  ['調查被告是否曾把備用卡交給同事代班。','c2_concede',1,'代班紀錄可能解釋持卡人，但現階段沒有交付證據。'],
  ['要求檢方證明被告知道備用卡仍可使用。','c2_character',3,'主觀認知是爭點，但權限異動紀錄更能找出實際操作者。']]},
 c2_batch:{...nodes.c2_batch,choices:[
  ['將卡片重啟權限與召回批次管理責任連成同一控制鏈。','c2_connect',8,'蘇主任同時控制身分憑證與錯誤藥品來源。'],
  ['將兩項紀錄視為個別管理疏失，主張不足以證明故意調包。','c2_admin',1,'故意仍待證明，但這無法解釋為何重啟他人遺失卡。'],
  ['要求鑑定錯誤藥品是否可能在運送途中被替換。','c2_apology',2,'替代路徑值得調查，但目前批號直接指向封存庫存。']]},
 c2_close:{...nodes.c2_close,choices:[
  ['門禁證明的是憑證而非本人；手術影像、卡片重啟與批號紀錄共同排除被告。','c2_win',8,'你完整區分身分、位置與藥品控制權。'],
  ['即使門禁卡屬於被告，醫院鬆散管理已足以形成合理懷疑。','c2_lose',3,'管理缺失有利辯方，但沒有完整指出真正的矛盾鏈。'],
  ['檢方無法證明被告有調包動機，因此應判無罪。','c2_vague',2,'缺乏動機有幫助，但不能單獨推翻客觀門禁紀錄。']]},
 c3_open:{...nodes.c3_open,choices:[
  ['先區分帳號驗證成功與本人實際操作，要求裝置層級證據。','c3_identity',6,'帳號只是憑證，裝置與權杖才能進一步確認操作者。'],
  ['先質疑外洩檔案是否真的屬於營業秘密。','c3_value',2,'法律保護範圍值得確認，但不影響目前的身分爭點。'],
  ['先檢查 VPN 時間、時區與伺服器時鐘是否同步。','c3_allfake',3,'時間校準是合理的數位鑑識步驟，但尚未直接辨識操作者。']]},
 c3_witness:{...nodes.c3_witness,choices:[
  ['提出登入裝置指紋，對比被告公司電腦的作業系統。','c3_device',7,'裝置環境不一致，帳號與本人之間出現裂縫。'],
  ['要求列出所有能存取核心程式與備份系統的人員。','c3_staff',3,'你削弱了「只有被告有能力」的唯一性主張。'],
  ['調查 CEO 是否曾要求被告分享帳號或代為部署。','c3_jealous',2,'共用憑證習慣可能有關，但仍需要系統紀錄支持。']]},
 c3_token:{...nodes.c3_token,choices:[
  ['調閱權杖建立、匯出、撤銷與管理者稽核紀錄。','c3_unlock',7,'權杖的保管鏈能確認誰有能力冒用帳號。'],
  ['檢查被告家中是否有 Linux 裝置曾連上公司 VPN。','c3_concede',2,'這可以排除私人設備假說，但無法追查權杖來源。'],
  ['確認公司是否強制多因素驗證，以及第二因素由誰保管。','c3_work',3,'驗證機制是重要環節，但匯出權杖可能繞過互動驗證。']]},
 c3_server:{...nodes.c3_server,choices:[
  ['串連 CEO 帳號打包、權杖匯出與 Linux 裝置下載的先後關係。','c3_connect',8,'三份獨立日誌形成一致的冒用流程。'],
  ['結合手機定位，主張被告當時沒有出現在公司。','c3_phoneonly',3,'定位能補強不在場，但無法排除遠端操作。'],
  ['追查下載 IP 是否來自公司內部或匿名代理服務。','c3_hacker',2,'網路來源有助辨識操作者，但現有管理日誌已更直接。']]},
 c3_close:{...nodes.c3_close,choices:[
  ['帳號是被冒用的工具；真正操作者必須同時掌握管理權限、打包權與匯出權杖。','c3_win',8,'你用完整數位保管鏈區分帳號與本人。'],
  ['裝置指紋不符，加上手機定位在家，已足以形成合理懷疑。','c3_weak',4,'兩項證據支持被告，但尚未完整解釋權杖如何遭使用。'],
  ['公司權限管理混亂，因此任何人都有可能登入。','c3_vague',2,'一般性的管理缺失不能取代對本次登入流程的具體分析。']]}
});

function renderChainProgress(){
 const required=activeCase.requiredClues||[];
 $('chainProgress').innerHTML=required.map(id=>`<span class="chain-node ${state.clues.has(id)?'found':''}">${clueLabels[id]||'關鍵證據'}</span>`).join('');
 $('currentObjective').textContent=objectiveByNode[state.node]||activeCase.mission;
}
function showImpact(delta,note){
 const banner=$('impactBanner'),text=$('impactText');
 banner.classList.remove('show','bad');
 text.textContent=delta>=7?'關鍵突破':delta>=4?'證言動搖':delta<0?'反對成立':'爭點更新';
 if(delta<0)banner.classList.add('bad');
 void banner.offsetWidth;banner.classList.add('show');
 if(Math.abs(delta)>=4){$('courtScene').classList.remove('shake');void $('courtScene').offsetWidth;$('courtScene').classList.add('shake')}
 $('juryBox').classList.add('react');setTimeout(()=>$('juryBox').classList.remove('react'),550);
}
const polishedRenderNode=renderNode;
renderNode=function(id,feedback){polishedRenderNode(id,feedback);renderChainProgress()};
const polishedChoose=choose;
choose=function(choice,index){showImpact(choice[2],choice[3]);polishedChoose(choice,index)};
