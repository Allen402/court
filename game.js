const $=id=>document.getElementById(id);
const evidence=[
 {id:'camera',code:'A',name:'監視器截圖',desc:'藝廊後門畫面於 21:18 突然中斷。中斷前可見一名穿深色外套的人。',open:true},
 {id:'parking',code:'B',name:'停車繳費紀錄',desc:'被告使用信用卡於 21:22 在相距 600 公尺的停車場完成付款。',open:true},
 {id:'frame',code:'C',name:'畫框鑑定報告',desc:'被告背包中的木屑為松木；失竊畫框則為胡桃木，兩者並不相符。',open:true},
 {id:'power',code:'D',name:'電力維修紀錄',desc:'21:17 至 21:24 藝廊西側迴路停電，但監視器使用獨立備援電源。',open:false},
 {id:'message',code:'E',name:'館長簡訊',desc:'館長 21:12 傳訊給助理：「把西側鏡頭處理好，別留下紀錄。」',open:false},
 {id:'access',code:'F',name:'門禁紀錄',desc:'21:20 館長的管理卡開啟庫房；被告舊卡已在兩週前停權。',open:false}
];
const people=[
 {name:'林哲宇',role:'被告／藝廊前保全',desc:'案發當晚返回藝廊取回私人物品。否認偷畫。'},
 {name:'周美玲',role:'目擊者／咖啡店店員',desc:'聲稱 21:20 看見被告抱著畫離開後巷。'},
 {name:'高文彥',role:'藝廊館長',desc:'最早發現畫作失竊，並向警方指認被告。'},
 {name:'沈若晴',role:'檢察官',desc:'主張被告熟悉保全系統，具有犯案能力。'}
];
const baseTimeline=[['21:12','館長傳送不明簡訊'],['21:15','藝廊閉館'],['21:17','西側迴路停電'],['21:18','後門監視器中斷'],['21:20','目擊者聲稱看見被告'],['21:22','被告於停車場付款'],['21:24','電力恢復'],['21:30','館長報警']];
let state={node:'opening',jury:50,cred:5,clues:new Set(),phase:1,choices:0,mistakes:0,flags:{},history:[]};

const nodes={
 opening:{phase:1,role:'審判長',speaker:'許正義',portrait:'法',text:'辯護人，檢方主張被告熟悉藝廊保全系統，且身上發現畫框碎片。你的答辯立場是？',choices:[
  ['被告完全沒有犯案動機。','openMotive',1,'動機並非本案唯一爭點，但陪審團願意聽下去。'],
  ['檢方的犯案時間線存在無法解釋的矛盾。','openTimeline',5,'你直接指出本案核心：消失的十五分鐘。'],
  ['警方的所有調查都不可信。','openAttack',-4,'過度攻擊警方而沒有證據，法官要求你保持克制。'] ]},
 witnessIntro:{phase:2,role:'檢方證人',speaker:'周美玲',portrait:'周',text:'我在後門對面的咖啡店工作。晚上九點二十分左右，我親眼看到林哲宇抱著一幅畫跑出來。',choices:[
  ['確認她當時所在的位置。','askPosition',2,'先建立觀察條件是穩健的詰問方式。'],
  ['立刻指控她說謊。','accuseEarly',-5,'沒有基礎就指控證人，遭到檢方反對。'],
  ['詢問她如何確認時間。','askTime',4,'時間是這份證詞最重要的支點。'] ]},
 witnessPosition:{phase:2,role:'檢方證人',speaker:'周美玲',portrait:'周',text:'我站在咖啡店收銀台。後門就在斜對面，大概四十公尺。當時外面雖然暗，但路燈很亮。',choices:[
  ['追問她是否戴眼鏡。','askGlasses',1,'她承認當晚沒有戴平常使用的遠視眼鏡。'],
  ['詢問路燈是否受到停電影響。','askPower',4,'你注意到光線可能和停電紀錄有關。'],
  ['改問被告為什麼出現在附近。','askDefendant',-1,'這個問題偏離證人的觀察能力。'] ]},
 witnessTime:{phase:2,role:'檢方證人',speaker:'周美玲',portrait:'周',text:'我很確定是 21:20，因為收銀機剛印出一張 21:20 的發票。我看完發票後就抬頭看到他。',choices:[
  ['提出停車繳費紀錄，質疑移動時間。','presentParking',6,'EVIDENCE'],
  ['提出畫框鑑定報告。','wrongFrame',-4,'這份證物與目擊時間沒有直接關係。'],
  ['詢問發票上的時間是否準確。','askClock',3,'證人表示收銀機時間可能快了幾分鐘。'] ]},
 witnessPower:{phase:2,role:'檢方證人',speaker:'周美玲',portrait:'周',text:'停電？我記得咖啡店有亮，但藝廊那側確實很暗。我看到的可能只是輪廓，可是外套很像他常穿的那件。',choices:[
  ['所以你無法辨識那個人的臉？','forceIdentity',6,'關鍵矛盾成立：證人只能辨認衣著輪廓。'],
  ['深色外套很多人都有。','genericCoat',2,'論點合理，但力道有限。'],
  ['要求證人撤回全部證詞。','forceWithdraw',-3,'法官認為你的要求過度。'] ]},
 parkingChallenge:{phase:2,role:'辯護人',speaker:'你',portrait:'辯',text:'被告在 21:22 已於六百公尺外的停車場刷卡付款。若他 21:20 還抱著畫離開藝廊，兩分鐘內幾乎不可能完成這段路程。',choices:[
  ['主張目擊時間根本不可靠。','finishWitness',5,'你成功削弱了目擊證詞的可信度。'],
  ['主張證人才是真正的小偷。','blameWitness',-6,'毫無證據的指控激怒法庭。'],
  ['承認被告可能跑得很快。','concede',-5,'你親手削弱了自己的不在場論證。'] ]},
 curatorIntro:{phase:3,role:'檢方證人',speaker:'高文彥',portrait:'高',text:'林哲宇以前管理保全系統。他被解雇後一直心懷不滿。只有他知道如何讓監視器在 21:18 中斷。',choices:[
  ['詢問被告離職後是否仍有系統權限。','askAccess',5,'權限狀態將決定被告是否具備犯案能力。'],
  ['追問館長何時發現失竊。','askDiscovery',2,'你開始檢視館長自己的時間線。'],
  ['指控館長解雇被告是私人報復。','attackCurator',-4,'人格攻擊無法反駁技術證詞。'] ]},
 curatorAccess:{phase:3,role:'檢方證人',speaker:'高文彥',portrait:'高',text:'他的員工卡確實停權了，但他很熟悉藝廊，也許能從其他地方進入。管理卡只有我和副館長持有。',choices:[
  ['要求調閱完整門禁紀錄。','unlockAccess',6,'法官准許調閱，新的關鍵證物加入紀錄。'],
  ['接受他可能從其他地方進入。','acceptMaybe',-3,'你讓檢方的推測沒有受到挑戰。'],
  ['改問失竊畫作價值。','askValue',0,'畫作價值並不能證明誰進入庫房。'] ]},
 curatorDiscovery:{phase:3,role:'檢方證人',speaker:'高文彥',portrait:'高',text:'我在 21:25 左右巡視時發現畫不見，確認現場後，21:30 立刻報警。我整晚都在辦公室處理帳務。',choices:[
  ['詢問辦公室是否位於西側。','officeWest',3,'館長的辦公室正位於停電的西側區域。'],
  ['詢問他為什麼等待五分鐘才報警。','delayReport',2,'館長表示他先確認是否為內部移展。'],
  ['直接提出監視器截圖。','wrongCamera',-2,'監視器中斷不能直接推翻館長的說法。'] ]},
 accessReveal:{phase:4,role:'書記官',speaker:'法庭調查結果',portrait:'證',text:'門禁紀錄顯示：被告的員工卡已停權；然而 21:20 有一張館長管理卡開啟畫作庫房。',choices:[
  ['要求館長解釋管理卡使用紀錄。','confrontAccess',6,'館長的證詞與客觀紀錄正面衝突。'],
  ['認為管理卡可能被偷走。','cardStolen',-2,'你主動替館長提出了尚無根據的辯解。'],
  ['先檢查畫框碎片。','frameStage',2,'你保留門禁矛盾，轉向物證。'] ]},
 curatorCornered:{phase:4,role:'檢方證人',speaker:'高文彥',portrait:'高',text:'那、那張卡可能被林哲宇複製了！他以前碰過門禁設備，這不是不可能。',choices:[
  ['要求提出卡片遭複製的鑑定證據。','demandProof',5,'檢方無法提出任何複製痕跡。'],
  ['指出他先前說被告只能從其他地方進入。','priorConflict',6,'你抓到館長在入侵方式上的證詞矛盾。'],
  ['接受複製卡片的可能性。','acceptClone',-5,'純粹的可能性讓陪審團重新懷疑被告。'] ]},
 frameQuestion:{phase:4,role:'檢察官',speaker:'沈若晴',portrait:'檢',text:'即使門禁仍有疑點，被告背包中的畫框碎片就是最直接的物證。辯方如何解釋？',choices:[
  ['提出畫框鑑定報告。','presentFrame',7,'EVIDENCE'],
  ['主張碎片是警方放進去的。','plantEvidence',-6,'你提出嚴重指控，卻沒有任何證據。'],
  ['表示被告可能撿到碎片。','foundFragment',-2,'這個解釋無法排除碎片與失竊案的關聯。'] ]},
 frameReveal:{phase:4,role:'辯護人',speaker:'你',portrait:'辯',text:'鑑定報告證明，被告背包中的碎片是松木；《暮光港灣》的畫框則是胡桃木。檢方所稱的「直接物證」，其實與失竊畫作無關。',choices:[
  ['要求排除畫框碎片的證據能力。','excludeFrame',5,'法官同意該碎片無法證明被告持有失竊畫作。'],
  ['乘勝指控警方偽造證物。','overreach',-4,'法官制止你擴張尚未證明的指控。'],
  ['詢問檢方是否還有直接物證。','noDirect',4,'檢方承認目前沒有找到畫作或相符碎片。'] ]},
 objection:{phase:5,role:'檢察官',speaker:'沈若晴',portrait:'檢',text:'反對！辯方試圖以個別紀錄製造混亂。即使被告的卡已停權，他仍然具備關閉監視器的專業知識。',choices:[
  ['反對成立，改談被告的人格。','yieldObjection',-4,'你避開了核心技術爭點。'],
  ['指出停電與監視器中斷時間一致。','powerLogic',3,'時間吻合，但仍需要解釋備援電源。'],
  ['要求調閱停電期間的設備維修紀錄。','unlockPower',6,'你找到檢驗監視器中斷原因的方法。'] ]},
 powerReveal:{phase:5,role:'書記官',speaker:'法庭調查結果',portrait:'證',text:'維修紀錄顯示西側迴路於 21:17 停電，但監視器使用獨立備援電源，不應中斷。系統日誌顯示中斷是由管理端手動執行。',choices:[
  ['被告熟悉系統，所以仍可能操作。','hurtSelf',-5,'你重複了檢方論點。'],
  ['結合門禁紀錄：當時持有管理權限的是館長。','connectEvidence',8,'你將兩份獨立證物連成完整推論。'],
  ['表示可能只是設備故障。','randomFault',-3,'維修紀錄已排除一般斷電故障。'] ]},
 messageReveal:{phase:5,role:'審判長',speaker:'許正義',portrait:'法',text:'鑑於管理端操作疑點，本庭准許檢視館長公務手機。21:12 的簡訊內容為：「把西側鏡頭處理好，別留下紀錄。」',choices:[
  ['主張簡訊加上門禁紀錄足以證明館長涉案。','accuseCurator',7,'三項證據形成一致時間線，陪審團明顯動搖。'],
  ['只主張被告應該無罪，不談館長。','reasonableDoubt',4,'合理懷疑已成立，但你沒有完整解釋真相。'],
  ['認為簡訊可能只是一般維修指示。','softMessage',-2,'語境與「別留下紀錄」仍難以解釋。'] ]},
 closing:{phase:6,role:'審判長',speaker:'許正義',portrait:'法',text:'證據調查結束。辯護人，請選擇你的結案陳詞主軸。',choices:[
  ['被告很可憐，不應受到刑罰。','closeEmotion',-4,'情緒訴求無法取代證據分析。'],
  ['檢方沒有證明被告有罪，所以應判無罪。','closeBurden',4,'你正確指出刑事案件的舉證責任。'],
  ['重建 21:12 至 21:22 的完整矛盾時間線。','closeTimeline',8,'你用證據串起監視器、門禁與停車紀錄。'],
  ['集中攻擊館長的人格與財務問題。','closeAttack',-5,'未經調查的人格指控破壞了你的可信度。'] ]}
};

function reset(){state={node:'opening',jury:50,cred:5,clues:new Set(),phase:1,choices:0,mistakes:0,flags:{},history:[]};evidence.forEach((e,i)=>e.open=i<3);show('briefingScreen');renderDrawer('evidence')}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));$(id).classList.remove('hidden')}
function orderedChoices(id,choices){
 const list=[...choices],seed=[...id].reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
 for(let i=list.length-1;i>0;i--){const j=(seed+i*7)%(i+1);[list[i],list[j]]=[list[j],list[i]]}
 return list;
}
function renderNode(id,feedback){state.node=id;const n=nodes[id];if(!n)return finish();state.phase=n.phase;$('phaseNumber').textContent=n.phase;$('phaseLabel').textContent=['','開庭陳述','目擊證人','館長證詞','物證攻防','最終反證','結案陳詞'][n.phase];$('speakerRole').textContent=n.role;$('dialogueSpeaker').textContent=n.speaker;$('speakerName').textContent=n.speaker;$('speakerPortrait').textContent=n.portrait;$('dialogueText').textContent=n.text;
 $('feedback').classList.toggle('hidden',!feedback);if(feedback){$('feedback').textContent=feedback.text;$('feedback').classList.toggle('bad',feedback.delta<0)}
 const displayed=orderedChoices(id,n.choices);$('choices').innerHTML=displayed.map((c,i)=>`<button class="choice ${c[3]==='EVIDENCE'?'evidence-choice':''}" data-index="${i}" data-key="${String.fromCharCode(65+i)}">${c[0]}</button>`).join('');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>choose(displayed[+b.dataset.index],+b.dataset.index));updateStatus()}
function choose(choice,index){const [label,action,delta,note]=choice;state.choices++;state.lastChoiceIndex=index;state.jury=Math.max(0,Math.min(100,state.jury+delta));if(delta<0){state.cred=Math.max(0,state.cred-1);state.mistakes++}state.history.push({phase:state.phase,label,delta});flash();const result=actions[action]?actions[action]():null;if(result==='finish'){finish();return}const next=result||nextDefault(action);renderNode(next,{text:note==='EVIDENCE'?'證物提出成功：你的主張獲得客觀紀錄支持。':note,delta})}
function clue(id){state.clues.add(id)}
const actions={
 openMotive:()=> 'witnessIntro',openTimeline:()=>{clue('timeline');return'witnessIntro'},openAttack:()=> 'witnessIntro',
 askPosition:()=> 'witnessPosition',accuseEarly:()=> 'witnessPosition',askTime:()=> 'witnessTime',askGlasses:()=> 'witnessTime',askPower:()=> 'witnessPower',askDefendant:()=> 'witnessTime',
 forceIdentity:()=>{clue('identity');return'curatorIntro'},genericCoat:()=> 'curatorIntro',forceWithdraw:()=> 'curatorIntro',askClock:()=> 'witnessPosition',wrongFrame:()=> 'witnessPosition',
 presentParking:()=>{clue('parking');return'parkingChallenge'},finishWitness:()=> 'curatorIntro',blameWitness:()=> 'curatorIntro',concede:()=> 'curatorIntro',
 askAccess:()=> 'curatorAccess',askDiscovery:()=> 'curatorDiscovery',attackCurator:()=> 'curatorDiscovery',unlockAccess:()=>{unlock('access');return'accessReveal'},acceptMaybe:()=> 'curatorDiscovery',askValue:()=> 'curatorDiscovery',
 officeWest:()=> 'curatorAccess',delayReport:()=> 'curatorAccess',wrongCamera:()=> 'curatorAccess',confrontAccess:()=>{clue('access');return'curatorCornered'},cardStolen:()=> 'frameQuestion',frameStage:()=> 'frameQuestion',
 demandProof:()=> 'frameQuestion',priorConflict:()=>{clue('access');return'frameQuestion'},acceptClone:()=> 'frameQuestion',presentFrame:()=>{clue('frame');return'frameReveal'},plantEvidence:()=> 'objection',foundFragment:()=> 'objection',
 excludeFrame:()=> 'objection',overreach:()=> 'objection',noDirect:()=> 'objection',yieldObjection:()=> 'closing',powerLogic:()=> 'powerReveal',unlockPower:()=>{unlock('power');return'powerReveal'},
 hurtSelf:()=> 'closing',randomFault:()=> 'closing',connectEvidence:()=>{unlock('message');clue('system');return'messageReveal'},accuseCurator:()=> 'closing',reasonableDoubt:()=> 'closing',softMessage:()=> 'closing',
 closeEmotion:()=> 'finish',closeBurden:()=> 'finish',closeTimeline:()=>{clue('timeline');return'finish'},closeAttack:()=> 'finish'
};
function nextDefault(){return'closing'}
function unlock(id){const e=evidence.find(x=>x.id===id);if(e)e.open=true;$('newEvidenceBadge').textContent=evidence.filter(x=>x.open).length}
function updateStatus(){$('juryValue').textContent=state.jury;$('juryBar').style.width=state.jury+'%';$('credibilityHearts').textContent='◆ '.repeat(state.cred)+'◇ '.repeat(5-state.cred);$('clueCount').textContent=state.clues.size}
function flash(){$('flash').classList.remove('go');void $('flash').offsetWidth;$('flash').classList.add('go')}
function finish(){const won=state.jury>=56&&state.clues.size>=2&&state.cred>0;const perfect=state.jury>=75&&state.clues.size>=5&&state.cred>=3;show('verdictScreen');$('verdictTitle').textContent=won?'無罪':'有罪';$('verdictTitle').style.color=won?'#e3be72':'#ba5353';$('verdictSubtitle').textContent=won?'被告林哲宇，罪名不成立':'被告林哲宇，罪名成立';const score=state.jury+state.clues.size*8+state.cred*4-state.mistakes*3;const rank=perfect?'S':score>=95?'A':score>=75?'B':score>=55?'C':'D';$('rankValue').textContent=rank;$('scoreDetails').innerHTML=`<li>陪審團支持：${state.jury}%</li><li>關鍵矛盾：${state.clues.size} / 5</li><li>法庭威信：${state.cred} / 5</li><li>錯誤攻防：${state.mistakes} 次</li>`;$('verdictReason').textContent=won?(perfect?'你完整串連停車、門禁、監視器與簡訊紀錄，不只建立合理懷疑，也揭露了真正的犯案時間線。':'你成功證明檢方證據存在重大矛盾，已達合理懷疑標準。'):'你的攻防未能形成穩定的證據鏈，陪審團仍相信檢方提出的犯案可能性。';buildAnalysis(won,rank)}
function renderDrawer(tab){document.querySelectorAll('.drawer-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));if(tab==='evidence')$('drawerContent').innerHTML=evidence.map(e=>`<article class="evidence-card ${e.open?'':'locked'}"><div class="ev-icon">${e.open?e.code:'?'}</div><div><h3>${e.open?e.name:'尚未取得'}</h3><p>${e.open?e.desc:'在庭審中做出正確選擇以取得此證物。'}</p></div></article>`).join('');if(tab==='people')$('drawerContent').innerHTML=people.map(p=>`<article class="evidence-card"><div class="ev-icon">${p.name[0]}</div><div><h3>${p.name}</h3><p><b>${p.role}</b><br>${p.desc}</p></div></article>`).join('');if(tab==='timeline')$('drawerContent').innerHTML=baseTimeline.map(t=>`<div class="timeline-item"><b>${t[0]}</b>${t[1]}</div>`).join('')}
function buildAnalysis(won,rank){$('analysisContent').innerHTML=`<p><b>本次結果：</b>${won?'無罪判決':'有罪判決'}，評價 ${rank}。</p><p><b>正確推理鏈：</b>21:12 館長要求處理鏡頭；21:18 監視器遭管理端手動關閉；21:20 館長管理卡開啟庫房；21:22 被告已在六百公尺外付款。</p><p><b>核心法律概念：</b>辯方不必證明真正犯人是誰，只需指出檢方證據無法排除合理懷疑。</p><p><b>遊戲系統：</b>選擇會同步影響陪審團傾向、法庭威信、證物解鎖及結局評級。</p>`}

$('startBtn').onclick=()=>show('briefingScreen');$('beginTrialBtn').onclick=()=>{show('gameScreen');renderNode('opening')};$('restartBtn').onclick=reset;$('howBtn').onclick=()=>$('helpDialog').showModal();$('reportBtn').onclick=()=>$('analysisDialog').showModal();document.querySelectorAll('[data-close-dialog]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('recordBtn').onclick=()=>{$('evidenceDrawer').classList.add('open');renderDrawer('evidence')};$('closeEvidence').onclick=()=>$('evidenceDrawer').classList.remove('open');document.querySelectorAll('.drawer-tabs button').forEach(b=>b.onclick=()=>renderDrawer(b.dataset.tab));$('menuBtn').onclick=()=>$('helpDialog').showModal();renderDrawer('evidence');
