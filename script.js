const today = new Date();
let modal;
let tempNumber = '';
const baseUrl = 'https://work.binotel.com/issues?utf8=✓&set_filter=1&per_page=200&';
const teamsDefaultName = 'Добавь команду';
const teamsDefaultValue = 'Добавь команду';
let closedDate, fromDate, toDate, RMuidField, filters, panelid, number, defaultuser, fromuser, secret, host, fromdomain, port, outboundproxy, dtmfmode, noReg, out, addnumberGenerate, addnumberAdd, addnumberCopy, phoneInputs, operators, btnVer, idScenario, idt, phones, outBWlist, add, edit, del, toggleBossMode, teams, button_today_team, button_yesterday_team, goTeam, godiapTeam, bossElements, useOldCf, light, dark, old, OS, formAddnumber, formBWlist;
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
	document.getElementById('addnumberReset').addEventListener('click', function(){resetForm('addnumber');});
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
	document.getElementById('resetBWlist').addEventListener('click', function(){resetForm('BWlist');});	
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
	formAddnumber = document.getElementById('form-number');
	formBWlist = document.getElementById('form-blacklist');
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
		modal.getElementsByTagName('iframe')[0].contentWindow.postMessage('show', '*');
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
		console.log('%c+', 'font-size: 1px; padding: 200px; line-height: 0; background: url("data:image/webp;base64,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"); background-repeat: no-repeat; color: transparent;');		
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
		str = str.replace(/[^a-z0-9]/gi, '').substring(0, 5).toUpperCase();
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
function resetForm(tform){
	if (tform === 'addnumber'){
		formAddnumber.reset();
		out.innerText = '';
	} else if (tform === 'BWlist'){
		formBWlist.reset();
		outBWlist.innerText = '';
	}
}
