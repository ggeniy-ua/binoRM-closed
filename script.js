var today = new Date();
var modal;
const baseUrl = 'https://work.binotel.com/issues?utf8=✓&set_filter=1&per_page=200&';
const teamsDefaultName = 'Добавь команду';
const teamsDefaultValue = 'Добавь команду';

window.onload = function(){
	// old
	closedDate = document.getElementById('closed_date');
	fromDate = document.getElementById('from_date');
	toDate = document.getElementById('to_date');
	RMuidField = document.getElementById('RMuid');	
	RMuidField.addEventListener('input', change);
	document.getElementById('button_today').addEventListener('click', function(){todayClick('solo');});
	document.getElementById('button_yesterday').addEventListener('click', function(){yesterdayClick('solo');});
	document.getElementById('button_alltime').addEventListener('click', alltimeClick);
	document.getElementById('go').addEventListener('click', function(){goClick('solo');});
	document.getElementById('godiap').addEventListener('click', function(){buttonGoDiapClick('solo');});
	document.getElementById('reset').addEventListener('click', uidresetClick);
	
	
	closedDate.valueAsDate = today;
	fromDate.valueAsDate = monday();
	toDate.valueAsDate = today;
	
	filters = document.getElementById('filters');
	document.getElementById('gofilter').addEventListener('click', goFilterClick);
	
	// add number
	panelid = document.getElementById('panelid');
	number = document.getElementById('number');
	defaultuser = document.getElementById('defaultuser');
	fromuser = document.getElementById('fromuser');
	secret = document.getElementById('secret');
	host = document.getElementById('host');
	fromdomain = document.getElementById('fromdomain');
	
	out = document.getElementById('out');
	
	panelidOut = document.getElementById('panelidOut');
	numberOut = document.getElementById('numberOut');
	defaultuserOut = document.getElementById('defaultuserOut');
	fromuserOut = document.getElementById('fromuserOut');
	secretOut = document.getElementById('secretOut');
	hostOut = document.getElementById('hostOut');
	fromdomainOut = document.getElementById('fromdomainOut');
	
	fromuserReg = document.getElementById('fromuserReg');
	secretReg = document.getElementById('secretReg');
	fromdomainReg = document.getElementById('fromdomainReg');
	numberReg = document.getElementById('numberReg');
	
	addnumber = document.getElementById('addnumber');
	
	panelid.addEventListener('input', input);
	number.addEventListener('input', input);
	defaultuser.addEventListener('input', input);
	fromuser.addEventListener('input', input);
	secret.addEventListener('input', input);
	host.addEventListener('input', input);
	fromdomain.addEventListener('input', input);
	
	addnumber.addEventListener('click', function(){copy(out);});
	
	//changelog
	btnVer = document.getElementById('ver');
	btnVer.addEventListener('click', showModal);
	
	//BW
	idScenario = document.getElementById('idScenario');
	idt = document.getElementById('idt');
	phones = document.getElementById('phones');
	outBWlist = document.getElementById('outBWlist');
	idScenario.addEventListener('input', replacingBW);
	idt.addEventListener('input', replacingBW);
	
	document.getElementById('generateBWlist').addEventListener('click', generateBW);
	document.getElementById('copyBWlist').addEventListener('click', function(){copy(outBWlist);});
	
	btnVer.innerText = 'ver ' + currentVersion;
		
	
	window.addEventListener('resize', cons);
	cons();
	
	//boss mode
	add = document.getElementById('add');
	edit = document.getElementById('edit');
	del = document.getElementById('del');
	toggleBossMode = document.getElementById('toggleBossMode');
	teams = document.getElementById('teams');
	button_today_team = document.getElementById('button_today_team');
	button_yesterday_team = document.getElementById('button_yesterday_team');
	goTeam = document.getElementById('goTeam');
	godiapTeam = document.getElementById('godiapTeam');
	
	toggleBossMode.addEventListener('click', switchBoss);
	add.addEventListener('click', addTeam);
	edit.addEventListener('click', editTeam);
	del.addEventListener('click', delTeam);
	
	button_today_team.addEventListener('click', function(){todayClick('team');});
	button_yesterday_team.addEventListener('click', function(){yesterdayClick('team');});
	goTeam.addEventListener('click', function(){goClick('team');});
	godiapTeam.addEventListener('click', function(){buttonGoDiapClick('team');});
	teams.addEventListener('change', fillTeamButtons);

	
	bossElements = document.querySelectorAll('.boss');
	
	useOldCf = document.getElementById('useOldCf');
	
	checkLocal();
	RMuidField.placeholder = getLocalRMuid();
}

// old

function checkLocal(){
	while (!localStorage.localRMuid){
			firtsRun();
	}
	if (!versionCheck()){
		localStorage.lastVer = currentVersion;
		showModal();
	}
	
	if (!localStorage.getItem('teams')){
		teams.add(defteam());
	} else if (JSON.parse(localStorage.getItem('teams')).length == 0){
		teams.add(defteam());
	} else {
		createTeamsFromLocal();
	}
	
	fillTeamButtons();
	
	if (localStorage.iAmBoss == 'true'){
		switchBoss();
	}
}

function firtsRun(){
	let askRMuid = prompt('Введи свой логин в RM:');
	if (askRMuid == null || askRMuid == ''){
		return false;
		}
	let loginInput = inputReplace(askRMuid, 'rm_uid');
	if (confirm('Записать "' + loginInput + '"?')){
		localStorage.localRMuid = loginInput;
	}else{
		return false;
	}
}

function getLocalRMuid(){
	return [localStorage.localRMuid];
}

function change(){
	RMuidField.value = inputReplace(RMuidField.value, 'rm_uid');
}

function getRMuid(type){
	switch (type){
		case 'solo':
		let RMuidFromInput = RMuidField.value;
		if (RMuidFromInput==''){
			return getLocalRMuid();
		}else{
			return [RMuidFromInput];
		}
		break;
		
		case 'team':
		let uids = teams.options[teams.selectedIndex].value.split(', ');
		return uids;
		break;
	}
}

function todayClick(type){
	if (type == 'team' && checkIsTeamDef()){
		return;
	}
	showMe(getRMuid(type), ftoday());
}

function ftoday(){
	return today.toISOString().substr(0,10);
}

function yesterdayClick(type){
	if (type == 'team' && checkIsTeamDef()){
		return;
	}
	showMe(getRMuid(type), fyesterday());
}

function fyesterday(){
	let date = new Date();
	date.setDate(today.getDate() - 1);
	return date.toISOString().substr(0,10);
}

function alltimeClick(){
	showMeAllTime(getRMuid('solo'));
}

function uidresetClick(){
	if (confirm('Сбросить настройку логина?')){
		firtsRun();
	}
	RMuidField.placeholder = getLocalRMuid();
}

function buttonGoDiapClick(type){
	if (type == 'team' && checkIsTeamDef()){
		return;
	}
	showMeDiap(getRMuid(type), from_date.value, to_date.value);
}

function monday(){
	let date = new Date();
	let thisDay = date.getDay();
	if (thisDay == 0){
		date.setDate(today.getDate() - 6);
		return date;
	} else if (thisDay == 1){
		return date;
	} else {
		date.setDate(today.getDate() - thisDay + 1);
		return date;
	}
}

function showMe(uid, date){
	let cf = newOrOldFilter();
	let url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=status_id&f[]=' + cf + '&f[]=closed_on&f[]=&op[' + cf + ']==&op[closed_on]==&op[status_id]=c' + uidsUrlConstructor(uid) + '&v[closed_on][]=' + date;
	window.open(url, '_blank');
}

function showMeDiap(uid, from, to){
	let cf = newOrOldFilter();
	let url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=status_id&f[]=' + cf + '&f[]=closed_on&f[]=&op[' + cf + ']==&op[closed_on]=><&op[status_id]=c' + uidsUrlConstructor(uid) + '&v[closed_on][]=' + from + '&v[closed_on][]=' + to;
	window.open(url, '_blank');
}

function uidsUrlConstructor(uids){
	let url = '';
	let cf = newOrOldFilter();
	if (uids.length > 1){
		url += '&group_by=' + cf + '';
		for (i = 0; i < uids.length; i++){
			url += '&v[' + cf + '][]=' + uids[i];
		}
	} else {
		url += '&group_by=cf_79&v[' + cf + '][]=' + uids[0];
	}
	
	return url;
}

function showMeAllTime(uid){
	let cf = newOrOldFilter();
	let url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&f[]=status_id&f[]=' + cf + '&f[]=&group_by=cf_79&op[' + cf + ']==&op[status_id]=c&v[' + cf + '][]=' + uid;
	window.open(url, '_blank');
}

function goClick(type){
	if (type == 'team' && checkIsTeamDef()){
		return;
	}
	showMe(getRMuid(type), closedDate.value);
}

function goFilterClick(){
	showMeFilter(filters.selectedIndex, closedDate.value);
}

function showMeFilter(id, date){
	let url = '';
	let cf = newOrOldFilter();
	switch (id){
		case 0:
		url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=' + cf + '&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=38. ОТП Изменение cценария обработки Входящих звонков | Исходящих звонков&v[cf_79][]=5. ОТП Поддержка клиента &v[closed_on][]=' + date;
		break;
		
		case 1:
		url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=' + cf + '&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=2. ОТП Авария локально клиент&v[cf_79][]=3. ОТП Авария Бинотел&v[cf_79][]=4. ОТП ОК Авария&v[closed_on][]=' + date;
		break;
		
		case 2:
		url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=' + cf + '&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=32. ОТП Удаленная настройка - Интеграция c Bitrix24 &v[cf_79][]=33. ОТП Удаленная настройка - Интеграция c AmoCRM &v[cf_79][]=36. ОТП Консультация API &v[cf_79][]=8. ОТП Удаленная настройка - Интеграция CRM &v[closed_on][]=' + date;
		break;
		
		case 3:
		url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=' + cf + '&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=12. ОТП Включение - Исполнить ТЗ сложное&v[cf_79][]=11. ОТП Включение - Исполнить ТЗ легкое&v[closed_on][]=' + date;
		break;
		
		case 4:
		url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=' + cf + '&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=17. ОТП Включение - Подключение номера&v[cf_79][]=6. ОТП Удаленная настройка - Программный телефон&v[cf_79][]=7. ОТП Удаленная настройка - IP телефон&v[cf_79][]=9. ОТП Удаленная настройка - GSM шлюз&v[closed_on][]=' + date;
		break;
		
		case 5:
		url = baseUrl + 'c[]=' + cf + '&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=' + cf + '&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=16. АЗ Включение - Аудиозапись Медиасистем&v[cf_79][]=15. АЗ Включение - Аудиозапись Ольга Писаренко&v[closed_on][]=' + date;
		break;
	}
	window.open(url, '_blank');
}

// add number
function input(){
	let temp = this.value = inputReplace(this.value, 'no_spaces');
	if (this.id == 'panelid' || this.id == 'number'){
		check(this, 'not_a_num');
	} else {
		check(this, 'kirill_and_spec');
	}
	if (this.value == ''){
		this.placeholder = this.id;
	}
	switch (this.id){
		
		case 'panelid':
		panelidOut.textContent = temp;
		break;
		
		case 'number':
		numberOut.textContent = numberReg.textContent = temp;
		break;
		
		case 'defaultuser':
		defaultuserOut.textContent = temp;
		if (fromuser.value == ''){ fromuser.placeholder = fromuserOut.textContent = fromuserReg.textContent = temp; }
		if (fromuser.placeholder == ''){ fromuser.placeholder = 'fromuser'; }
		break;
		
		case 'fromuser':
		fromuserOut.textContent = fromuserReg.textContent = temp;
		if (fromuser.value == '' && defaultuser.value != ''){ fromuser.placeholder = fromuserOut.textContent = fromuserReg.textContent = defaultuser.value; }
		break;
		
		case 'secret':
		secretOut.textContent = secretReg.textContent = temp;
		break;
		
		case 'host':
		hostOut.textContent = temp;
		if (fromdomain.value == ''){ fromdomain.placeholder = fromdomainOut.textContent = fromdomainReg.textContent = temp; }
		if (fromdomain.placeholder == ''){ fromdomain.placeholder = 'fromuser'; }
		break;
		
		case 'fromdomain':
		fromdomainOut.textContent = fromdomainReg.textContent = temp;
		if (fromdomain.value == '' && host.value != ''){ fromdomain.placeholder = fromdomainOut.textContent = fromdomainReg.textContent = host.value; }
		break;
	}
}

function check(elem, type){
	if (checkInputs(elem.value, type)){
		elem.classList.add('err');
	} else {
		elem.classList.remove('err');
	}
}

function copy(elem){
	navigator.clipboard.writeText(elem.innerText);
}

function showModal(){
	if (modal){
		modal.classList.toggle('hidden');
		window.addEventListener('click', outerCloseModal);
	} else {
		modal = document.createElement('div');
		modal.id = 'modal';
		modal.classList.add('hidden');
		modal.innerHTML = '<div class="modal-ver"><div id="verHeader"><h1>История изменений:</h1><span id="close">×</span></div><iframe id="versions" class="ui-element" src="changelog.html"></iframe></div>';
		document.getElementsByTagName('body')[0].append(modal);
		btnCloseModal = document.getElementById('close');
		btnCloseModal.addEventListener('click', closeModal);
		showModal();
	}
}

function closeModal(){
	modal.classList.toggle('hidden');
	window.removeEventListener('click', outerCloseModal);
}

function outerCloseModal(){
	if (event.target == modal){
		modal.classList.toggle('hidden');
	}
}

function generateBW(){
	outBWlist.innerText = 'exten => s,1,Goto(${CALLERID(num)},1)\n';
	phones.value = inputReplace(phones.value, 'phone_nums');
	let arr = phones.value.split('\n');
	arr.forEach(element => outBWlist.innerText += colorListEntity(idScenario.value, element));
	outBWlist.innerText += `exten => t,1,Set(ivrRouteID=${idt.value})
exten => t,n,Return
exten => i,1,Goto(t,1)
exten => h,1,Goto(vOfficeIvrAddHangupedCall,s,1)`;
}

function colorListEntity(scid, phnum){
	let result = `exten => _${phnum},1,Set(ivrRouteID=${scid})
exten => _${phnum},n,Return
`;
	return result;
}

function versionCheck(){
	if (!localStorage.lastVer){
		return false;
	}
	
	let stored = localStorage.lastVer.split('.');
	let current = currentVersion.split('.');
	
	if (parseInt(current[0], 10) > parseInt(stored[0], 10)){
		return false;
	} else {
		if (parseInt(current[1], 10) > parseInt(stored[1], 10)){
			return false;
		} else {
			return true;
		}
	}
}

function cons(){
	if (((window.outerHeight - window.innerHeight) > 200) || ((window.outerWidth - window.innerWidth) > 16)){
		console.clear();
		console.log('%c+', 'font-size: 1px; padding: 200px; line-height: 0; background: url("https://drive.google.com/uc?id=1bbr8NW5kF2phdFCEzXYfO9oJHmhsnST7"); background-size: 253px 370px; background-repeat: no-repeat; color: transparent;');		
	}
}

function replacingBW(){
	this.value = inputReplace(this.value, 'numbers');
}

function checkInputs(str, type){
	let re;
	switch (type){
		case 'kirill_and_spec':
		re = /[а-яА-ЯіІ:@\/]/; 
		return re.test(str);
		
		case 'not_a_num':
		re = /\D/; 
		return re.test(str);
	}	
}

function inputReplace(str, type){
	switch (type){
		case 'no_spaces':
		str = str.replace(/[\s]/g, '');
		return str;
		break;
		
		case 'rm_uid':
		str = str.replace(/[^a-z0-9]/gi, '').substring(0, 4).toUpperCase();
		return str;
		break;
		
		case 'numbers':
		str = str.replace(/[\D]+/g, '');
		return str;
		break;
		
		case 'phone_nums':
		str = str.replace(/[ ()-]+/g, '').replace(/[^+\d]+/g, '\n').replace(/^\n+|\n+$/gm, '');
		return str;
		break;
	}
}

function switchBoss(){	
	for (i = 0; i < bossElements.length; i++){
		let t = bossElements[i].classList;
		t.toggle('hidden');
	}
	toggleBossMode.classList.toggle('pressed');
	if (this.toString() != '[object Window]'){
		if (localStorage.iAmBoss == 'true'){
			localStorage.iAmBoss = 'false';
		} else {
			localStorage.iAmBoss = 'true';
		}
	}
}

function addTeam(){
	let tempData = editAndAddDialog();
	
	if (tempData.innerText == 'null' || tempData.value == 'null'){
		return;
	}
	
	editStoredTeams(teams.options.length+1, [tempData.innerText, tempData.value]);
	
	if (teams.options[0].value == teamsDefaultValue){
		teams.remove(0);
	}
	teams.add(tempData);
	fillTeamButtons();
}

function editTeam(){
	let selected = teams.selectedIndex;
	if (checkIsTeamDef()){
		return;
	}
	
	let tempData = editAndAddDialog(selected);
	
	if (tempData.value == 'null' || tempData.innerText == 'null'){
		return;
	}
	
	editStoredTeams(selected, [tempData.innerText,tempData.value]);
	
	teams.options[selected].innerText = tempData.innerText;
	teams.options[selected].value = tempData.value;
	fillTeamButtons();
}

function delTeam(){
	let selected = teams.selectedIndex;
	if (checkIsTeamDef()){
		return;
	}
	if (confirm('Удалить команду "'+ teams.options[selected].innerText + '" с логинами "' + teams.options[selected].value + '"?')){
		teams.remove(selected);
		editStoredTeams(selected);
	}
	if (teams.options.length == 0){
		teams.add(defteam());
	}
	fillTeamButtons();
}

function editAndAddDialog(id = -1){
	let tempName = '';
	let tempValue = '';
	
	if (id >= 0){
		tempName = teams.selectedOptions[0].innerText;
		tempValue = teams.selectedOptions[0].value;
	}
	
	do {
		tempName = prompt('Название', tempName);
		if (tempName == null){
			return new Option(null, null);
		}
		tempValue = prompt('Логины', tempValue);
		if (tempValue == null){
			return new Option(null, null);
		}
	} while (tempName == '' || tempValue == '');
	
	
	let temp = tempValue.replace(/[^a-z0-9]+/gi, ' ').replace(/^\s+/, '').split(' ');
	for (i in temp){
		temp[i] = inputReplace(temp[i], 'rm_uid');
	}
	tempValue = temp.join(', ');
	
	let newOption = new Option(tempName, tempValue);
	
	
	return newOption;
}

function createTeamsFromLocal(){
	let stored = JSON.parse(localStorage.getItem('teams'));
	for (i in stored){
		teams.add(new Option(stored[i][0], stored[i][1]));
	}
}

function defteam(){
	let defName = teamsDefaultName;
	let defValue = teamsDefaultValue;
	let defOption = new Option(defName, defValue);
	defOption.selected = defOption.disabled = defOption.hidden = true;
	return defOption;
}

function editStoredTeams(id, newTeam = null){
	let stored = JSON.parse(localStorage.getItem('teams'));
	if (stored == undefined){
		stored = [];
	}
	if (id > stored.length){
		stored.push(newTeam);
	} else if (newTeam != null){
		stored[id][0] = newTeam[0];
		stored[id][1] = newTeam[1];
	} else {
		stored.splice(id, 1);
	}
	localStorage.setItem('teams', JSON.stringify(stored));	
}

function checkIsTeamDef(){
	let selected = teams.selectedIndex;
	if (teams.options[selected].value == teamsDefaultValue){
		return true;
	} else {
		return false;
	}
}

function fillTeamButtons(){
	let team = teams.selectedOptions[0].innerText;
	if (team == teamsDefaultValue){
		button_today_team.innerText = button_yesterday_team.innerText = goTeam.innerText = godiapTeam.innerText = 'Команда не выбрана';
	} else {
		button_today_team.innerText = 'Сегодня по "' + team + '"';
		button_yesterday_team.innerText = 'Вчера по "' + team + '"';
		goTeam.innerText = godiapTeam.innerText = '"' + team + '"';
	}
	return;
}

function newOrOldFilter(){
	if (useOldCf.checked){
		return 'cf_77';
	} else {
		return 'cf_154';
	}
}
