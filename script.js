const today = new Date();
let modal;
let tempNumber = '';
const baseUrl = 'https://work.binotel.com/issues?utf8=✓&set_filter=1&per_page=200&';
const teamsDefaultName = 'Добавь команду';
const teamsDefaultValue = 'Добавь команду';
let closedDate, fromDate, toDate, RMuidField, filters, panelid, number, defaultuser, fromuser, secret, host, fromdomain, port, outboundproxy, dtmfmode, noReg, out, addnumberGenerate, addnumberAdd, addnumberCopy, phoneInputs, operators, btnVer, idScenario, idt, phones, outBWlist, add, edit, del, toggleBossMode, teams, button_today_team, button_yesterday_team, goTeam, godiapTeam, bossElements, useOldCf, light, dark, old, OS;
window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', changeTheme);
window.onload = function(){
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
	panelid = document.getElementById('panelid');
	number = document.getElementById('number');
	defaultuser = document.getElementById('defaultuser');
	fromuser = document.getElementById('fromuser');
	secret = document.getElementById('secret');
	host = document.getElementById('host');
	fromdomain = document.getElementById('fromdomain');
	port = document.getElementById('port');
	outboundproxy = document.getElementById('outboundproxy');
	dtmfmode = document.getElementById('dtmfmode');
	noReg = document.getElementById('noReg');
	out = document.getElementById('out');
	addnumberGenerate = document.getElementById('addnumberGenerate');
	addnumberAdd = document.getElementById('addnumberAdd');
	addnumberCopy = document.getElementById('addnumberCopy');
	phoneInputs = [panelid, number, defaultuser, fromuser, secret, host, fromdomain, port, outboundproxy, dtmfmode];
	phoneInputs.forEach(function(el){el.addEventListener('input', input);});	
	addnumberGenerate.addEventListener('click', function(){generateNumberClick('new');});
	addnumberAdd.addEventListener('click', function(){generateNumberClick('add');});
	addnumberCopy.addEventListener('click', function(){copy(out);});
	operators = document.getElementById('operators').options;
	btnVer = document.getElementById('ver');
	btnVer.innerText = 'ver ' + currentVersion;
	btnVer.addEventListener('click', showModal);
	idScenario = document.getElementById('idScenario');
	idt = document.getElementById('idt');
	phones = document.getElementById('phones');
	outBWlist = document.getElementById('outBWlist');
	idScenario.addEventListener('input', replacingBW);
	idt.addEventListener('input', replacingBW);
	document.getElementById('generateBWlist').addEventListener('click', generateBW);
	document.getElementById('copyBWlist').addEventListener('click', function(){copy(outBWlist);});		
	window.addEventListener('resize', cons);
	cons();
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
	light = document.getElementById('light');
	dark = document.getElementById('dark');
	old = document.getElementById('old');
	OS = document.getElementById('OS');
	document.getElementsByName('theme').forEach(e => e.addEventListener('change', changeTheme));
	checkLocal();
	RMuidField.placeholder = getLocalRMuid();
	remoteCheck();
}
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
	
	if (localStorage.iAmBoss === 'true'){
		switchBoss();
	}
	
	if ((localStorage.theme) && (localStorage.theme !== '')){
		document.getElementById(localStorage.theme).checked = true;
		changeTheme();
	} else {
		OS.checked = true;
		changeTheme();
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
		
		case 'team':
		return teams.options[teams.selectedIndex].value.split(', ');
	}
}
function todayClick(type){
	remoteCheck();
	if (type === 'team' && checkIsTeamDef()){
		return;
	}
	showMe(getRMuid(type), ftoday());
}
function ftoday(){
	return today.toISOString().substr(0,10);
}
function yesterdayClick(type){
	remoteCheck();
	if (type === 'team' && checkIsTeamDef()){
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
	remoteCheck();
	showMeAllTime(getRMuid('solo'));
}
function uidresetClick(){
	remoteCheck();
	if (confirm('Сбросить настройку логина?')){
		firtsRun();
	}
	RMuidField.placeholder = getLocalRMuid();
}
function buttonGoDiapClick(type){
	remoteCheck();
	if (type === 'team' && checkIsTeamDef()){
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
	let url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=status_id&f[]=${cf}&f[]=closed_on&f[]=&op[${cf}]==&op[closed_on]==&op[status_id]=c${uidsUrlConstructor(uid)}&v[closed_on][]=${date}`;
	window.open(url, '_blank');
}
function showMeDiap(uid, from, to){
	let cf = newOrOldFilter();
	let url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=status_id&f[]=${cf}&f[]=closed_on&f[]=&op[${cf}]==&op[closed_on]=><&op[status_id]=c${uidsUrlConstructor(uid)}&v[closed_on][]=${from}&v[closed_on][]=${to}`;
	window.open(url, '_blank');
}
function uidsUrlConstructor(uids){
	let url = '';
	let cf = newOrOldFilter();
	if (uids.length > 1){
		url += `&group_by=${cf}`;
		for (i = 0; i < uids.length; i++){
			url += `&v[${cf}][]=${uids[i]}`;
		}
	} else {
		url += `&group_by=cf_79&v[${cf}][]=${uids[0]}`;
	}
	return url;
}
function showMeAllTime(uid){
	let cf = newOrOldFilter();
	let url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&f[]=status_id&f[]=${cf}&f[]=&group_by=cf_79&op[${cf}]==&op[status_id]=c&v[${cf}][]=${uid}`;
	window.open(url, '_blank');
}
function goClick(type){
	remoteCheck();
	if (type === 'team' && checkIsTeamDef()){
		return;
	}
	showMe(getRMuid(type), closedDate.value);
}
function goFilterClick(){
	remoteCheck();
	showMeFilter(filters.selectedIndex, closedDate.value);
}
function showMeFilter(id, date){
	let url = '';
	let cf = newOrOldFilter();
	switch (id){
		case 0:
		url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=${cf}&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=38. ОТП Изменение cценария обработки Входящих звонков | Исходящих звонков&v[cf_79][]=5. ОТП Поддержка клиента &v[closed_on][]=${date}`;
		break;
		
		case 1:
		url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=${cf}&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=2. ОТП Авария локально клиент&v[cf_79][]=3. ОТП Авария Бинотел&v[cf_79][]=4. ОТП ОК Авария&v[closed_on][]=${date}`;
		break;
		
		case 2:
		url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=${cf}&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=32. ОТП Удаленная настройка - Интеграция c Bitrix24 &v[cf_79][]=33. ОТП Удаленная настройка - Интеграция c AmoCRM &v[cf_79][]=36. ОТП Консультация API &v[cf_79][]=8. ОТП Удаленная настройка - Интеграция CRM &v[closed_on][]=${date}`;
		break;
		
		case 3:
		url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=${cf}&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=12. ОТП Включение - Исполнить ТЗ сложное&v[cf_79][]=11. ОТП Включение - Исполнить ТЗ легкое&v[closed_on][]=${date}`;
		break;
		
		case 4:
		url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=${cf}&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=17. ОТП Включение - Подключение номера&v[cf_79][]=6. ОТП Удаленная настройка - Программный телефон&v[cf_79][]=7. ОТП Удаленная настройка - IP телефон&v[cf_79][]=9. ОТП Удаленная настройка - GSM шлюз&v[closed_on][]=${date}`;
		break;
		
		case 5:
		url = `${baseUrl}c[]=${cf}&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=${cf}&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=16. АЗ Включение - Аудиозапись Медиасистем&v[cf_79][]=15. АЗ Включение - Аудиозапись Ольга Писаренко&v[closed_on][]=${date}`;
		break;
	}
	window.open(url, '_blank');
}
function input(){
	let temp = this.value = inputReplace(this.value, 'no_spaces');
	if (['panelid', 'number', 'port'].includes(this.id)){
		check(this, 'not_a_num');
	} else {
		check(this, 'kirill_and_spec');
	}
	switch (this.id){
		case 'defaultuser':
		if (fromuser.value == ''){ fromuser.placeholder = temp; }
		if (fromuser.placeholder == ''){ setPlaceholderLikeId(fromuser); }
		break;
		
		case 'fromuser':
		if (fromuser.value == '' && defaultuser.value != ''){ fromuser.placeholder = defaultuser.value; }
		break;
		
		case 'host':
		host.value = temp = hostReplasingExt(host.value);
		if (fromdomain.value == ''){ fromdomain.placeholder = temp; }
		if (fromdomain.placeholder == ''){ setPlaceholderLikeId(fromdomain); }
		break;
		
		case 'fromdomain':
		if (fromdomain.value == '' && host.value != ''){ fromdomain.placeholder = host.value; }
		break;
	}
}
function hostReplasingExt(str){
	let hasInfo = /^~/g;
	
	if (hasInfo.test(str)){
		let additionalInfo = getDataFromList(str);		
		if (additionalInfo.proxy != null){ outboundproxy.placeholder = additionalInfo.proxy; }
		if (additionalInfo.port != null){ port.placeholder = additionalInfo.port; }
		if (additionalInfo.trunk != null){ noReg.checked = true; }
		if (additionalInfo.fromuserasnum != null){ fromuserasnum.checked = true; }
		return str.replace(hasInfo, '');
	} else {
		setPlaceholderLikeId(port);
		setPlaceholderLikeId(outboundproxy);
		noReg.checked = false;
		fromuserasnum.checked = false;
		return str;
	}
}
function getDataFromList(str){
	for (i in operators){
		if (str == operators[i].value){
			return {'proxy' : operators[i].getAttribute('proxy'),
					'port' : operators[i].getAttribute('port'),
					'trunk' : operators[i].getAttribute('trunk'),
					'fromuserasnum' : operators[i].getAttribute('fromuserasnum')};
		}
	}
	return {'proxy' : '',
			'port' : '',
			'trunk' : '',
			'fromuserasnum' : ''};
}
function generateNumberClick(type){
	remoteCheck();
	if (type === 'new'){
		generateNumberBase('new');
	} else if (type === 'add'){
		if (tempNumber == ''){
			generateNumberBase('new');
		} else {
			generateNumberBase('add');
		}
	}
	check(number, 'not_a_num');
}
function generateNumberBase(type){
	let temp;
	if (type === 'new'){
		temp = 'Просьба добавить для: https://panel.binotel.com/?module=pbxNumbersEnhanced&action=edit&companyID=' + panelid.value;
	}
	if (type === 'add'){
		temp = tempNumber;
	}
	temp += generateNumberMain(noReg.checked, fromuserasnum.checked);
	out.innerText = tempNumber = temp;
}
function generateNumberMain(isTrunk, fromuserasnum){
	let temp = '';
	number.value = inputReplace(number.value, 'phone_nums');
	let arr = makeArrFromPhones(number);
	arr.forEach(element => {
		temp += '\n\nНомер ' + element + '\n\n';
		for (i = 2; i < phoneInputs.length; i++){
			let phid = phoneInputs[i].id;
			if (phid == 'fromuser' && fromuserasnum){
				temp += phid + ' = ' + element + '\n';
			} else {
				let tempVal = getValue(phoneInputs[i]);
				if (tempVal != ''){
					temp += phid + ' = ' + tempVal + '\n';
				}
			}
		}
		if (!isTrunk){
			if (getValue(outboundproxy) == '' && getValue(port) == ''){
				temp += '\nregister => ' + getValue(fromuser) + ':' + getValue(secret) + '@' + getValue(fromdomain) + '/' + element + '\n';
			} else if (getValue(outboundproxy) != ''){
				temp += '\nregister => ' + getValue(fromuser) + '@' + getValue(fromdomain) + ':' + getValue(secret) + ':' + getValue(fromuser) + '@' + getValue(outboundproxy) + '/' + element + '\n';
			} else if (getValue(port) != ''){
				temp += '\nregister => ' + getValue(fromuser) + ':' + getValue(secret) + '@' + getValue(fromdomain) + ':' + getValue(port) + '/' + element + '\n';
			}
		}
	});
	return temp;
}
function getValue(elem){
	if (elem.value != ''){
		return elem.value;
	} else if (elem.placeholder != elem.id){
		return elem.placeholder;
	} else {
		return '';
	}
}
function setPlaceholderLikeId(elem){
	elem.placeholder = elem.id;
}
function check(elem, type){
	if (checkInputs(elem.value, type)){
		elem.classList.add('err');
	} else {
		elem.classList.remove('err');
	}
}
function copy(elem){
	remoteCheck();
	navigator.clipboard.writeText(elem.innerText);
}
function showModal(){
	remoteCheck();
	if (modal){
		modal.classList.toggle('hidden');
		window.addEventListener('click', outerCloseModal);
	} else {
		modal = document.createElement('div');
		modal.id = 'modal';
		modal.classList.add('hidden');
		modal.innerHTML = '<div class="modal-ver"><div id="verHeader"><h1>История изменений<a href="changelog.html" target="_blank">🔗</a>:</h1><span id="close">×</span></div><iframe id="versions" class="ui-element" src="changelog.html?ver=' + currentVersion + '"></iframe></div>';
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
	remoteCheck();
	outBWlist.innerText = 'exten => s,1,Goto(${CALLERID(num)},1)\n';
	phones.value = inputReplace(phones.value, 'phone_nums');
	let arr = makeArrFromPhones(phones);
	arr.forEach(element => outBWlist.innerText += colorListEntity(idScenario.value, element));
	outBWlist.innerText += `exten => t,1,Set(ivrRouteID=${idt.value})
exten => t,n,Return
exten => i,1,Goto(t,1)
exten => h,1,Goto(vOfficeIvrAddHangupedCall,s,1)`;
}
function colorListEntity(scid, phnum){
	return `exten => _${phnum},1,Set(ivrRouteID=${scid})
exten => _${phnum},n,Return
`;
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
		return parseInt(current[1], 10) <= parseInt(stored[1], 10);
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
		re = /[^\d\n\r+_]/; 
		return re.test(str);
	}	
}
function inputReplace(str, type){
	switch (type){
		case 'no_spaces':
		str = str.replace(/[\f\t\v​\u00A0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\u0020]/g, '');
		return str;
		
		case 'rm_uid':
		str = str.replace(/[^a-z0-9]/gi, '').substring(0, 4).toUpperCase();
		return str;
		
		case 'numbers':
		str = str.replace(/[\D]+/g, '');
		return str;
		
		case 'phone_nums':
		str = str.replace(/[ ()-]+/g, '').replace(/[^+_\d]+/g, '\n').replace(/^\n+|\n+$/gm, '');
		return str;
	}
}
function switchBoss(){	
	for (i = 0; i < bossElements.length; i++){
		let t = bossElements[i].classList;
		t.toggle('hidden');
	}
	if (this.toString() != '[object Window]'){
		if (localStorage.iAmBoss == 'true'){
			localStorage.iAmBoss = 'false';
			toggleBossMode.checked = false;
		} else {
			localStorage.iAmBoss = 'true';
			toggleBossMode.checked = true;
		}
	} else {
		toggleBossMode.checked = true;
	}
}
function addTeam(){
	let tempData = editAndAddDialog();
	
	if (tempData.innerText == 'null' || tempData.value == 'null'){
		return;
	}
	editStoredTeams(teams.options.length + 1, [tempData.innerText, tempData.value]);
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
	if (confirm(`Удалить команду "${teams.options[selected].innerText}" с логинами "${teams.options[selected].value}"?`)){
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
	return new Option(tempName, tempValue);
}
function createTeamsFromLocal(){
	let stored = JSON.parse(localStorage.getItem('teams'));
	for (i in stored){
		teams.add(new Option(stored[i][0], stored[i][1]));
	}
}
function defteam(){
	let defOption = new Option(teamsDefaultName, teamsDefaultValue);
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
	return teams.options[selected].value == teamsDefaultValue;
}
function fillTeamButtons(){
	let team = teams.selectedOptions[0].innerText;
	if (team == teamsDefaultValue){
		button_today_team.innerText = button_yesterday_team.innerText = goTeam.innerText = godiapTeam.innerText = 'Команда не выбрана';
	} else {
		button_today_team.innerText = `Сегодня по "${team}"`;
		button_yesterday_team.innerText = `Вчера по "${team}"`;
		goTeam.innerText = godiapTeam.innerText = `"${team}"`;
	}
}
function newOrOldFilter(){
	if (useOldCf.checked){
		return 'cf_77';
	} else {
		return 'cf_154';
	}
}
async function remoteVersionGet(){
	let response = await fetch('https://ggeniy-ua.github.io/binoRM-closed/current.ver?t=' + Date.now());
	if (response.ok) {
		let remote = await response.text();
		return remote.split('.').map(e => parseInt(e));
		}
	return [0, 0, 0];
}
async function remoteCheck(){
	remoteVersionCheck();
	remoteMessageGet();
}
async function remoteVersionCheck(){
	let local = currentVersion.split('.').map(e => parseInt(e));
	let remote = await remoteVersionGet();
	if (remote[0] > local[0]){
		showMessage('update_major');
	} else if (remote[1] > local[1]){
		showMessage('update_minor');
	} else if (remote[2] > local[2]){
		showMessage('update_patch');
	}
}
async function remoteMessageGet(){
	let response = await fetch('https://raw.githubusercontent.com/ggeniy-ua/external/main/binoMessage?t=' + Date.now());
	if (response.ok) {
		let remote = await response.text();
		let arr = remote.split('\n');
		if (arr[0]) {
			showMessage(arr[0],arr[1]);
		} else {
			return;
		}
	}
}
function showMessage(data, color = 'gray'){
	let msg = '';
	let isver = true;
	switch (data){
		case 'update_major':
		msg = 'Вышло крупное обновление, необходимо ';
		color = 'red';
		break;
		
		case 'update_minor':
		msg = 'Вышло обновление, добавлены новые функции, необходимо ';
		color = 'yellowgreen';
		break;
		
		case 'update_patch':
		msg = 'Вышел патч, желательно ';
		color = 'limegreen';
		break;
		
		default:
		isver = false;
		break;
	}
	
	msg += isver ? (isLocalCopy() ? 'пересохранить локальную копию.' : 'обновить страницу.') : data;
	
	let current = document.getElementById(isver ? 'version' : 'message');
	if (current){
		current.remove();
	}
	let inset = document.createElement('span');
	inset.setAttribute('id', isver ? 'version' : 'message');
	inset.innerText = msg;
	inset.style.cssText = `color: ${color};`;
	document.getElementsByTagName('header')[0].append(inset);
}
function isLocalCopy(){
	return document.location.protocol == 'file:';
}
function makeArrFromPhones(elem){
	let arr = inputReplace(elem.value, 'phone_nums').split('\n');
	let out = [...new Set(arr)];
	elem.value = out.toString().replace(/,/g, '\n');
	return out;
}
function changeTheme(){
	if (light.checked){
		document.documentElement.className = 'light';
		localStorage.theme = 'light';
	} else if (dark.checked){
		document.documentElement.className = 'dark'
		localStorage.theme = 'dark';
	} else if (old.checked){
		document.documentElement.className = 'old'
		localStorage.theme = 'old';
	} else {
		document.documentElement.className = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
		localStorage.theme = 'OS';
	}
}
