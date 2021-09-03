var today = new Date();
var modal;
var baseUrl = 'https://work.binotel.com/issues?utf8=✓&set_filter=1&per_page=200&';

window.onload = function(){
	// old
	closedDate = document.getElementById('closed_date');
	fromDate = document.getElementById('from_date');
	toDate = document.getElementById('to_date');
	RMuidField = document.getElementById('RMuid');	
	RMuidField.addEventListener('input', change);
	document.getElementById('button_today').addEventListener('click', todayClick);
	document.getElementById('button_yesterday').addEventListener('click', yesterdayClick);
	document.getElementById('button_alltime').addEventListener('click', alltimeClick);
	document.getElementById('go').addEventListener('click', goClick);
	document.getElementById('godiap').addEventListener('click', buttonGoDiapClick);
	document.getElementById('reset').addEventListener('click', uidresetClick);
	
	RMuidField.placeholder = getLocalRMuid();
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
		
	checkLocal();
	window.addEventListener('resize', cons);
	cons();
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
}

function firtsRun(){
	let askRMuid = prompt ('Введи свой логин в RM:');
	if (askRMuid == null){
		return false;
		}
	let loginInput = inputReplace(askRMuid, 'rm_uid');
	if (confirm ('Записать "' + loginInput + '"?')){
		localStorage.localRMuid = loginInput;
	}else{
		return false;
	}
}

function getLocalRMuid(){
	return localStorage.localRMuid;
}

function change(){
	RMuidField.value = inputReplace(RMuidField.value, 'rm_uid');
}

function getRMuid (){
	let RMuidFromInput = RMuidField.value;
	if (RMuidFromInput==''){
		return getLocalRMuid();
	}else{
		return RMuidFromInput;
	}
}

function todayClick (){
	showMe(getRMuid(), ftoday());
}

function ftoday(){
	return today.toISOString().substr(0,10);
}

function yesterdayClick (){
	showMe(getRMuid(), fyesterday());
}

function fyesterday(){
	let date = new Date();
	date.setDate(today.getDate() - 1);
	return date.toISOString().substr(0,10);
}

function alltimeClick(){
	showMeAllTime(getRMuid());
}

function uidresetClick(){
	if (confirm ('Сбросить настройку логина?')){
		firtsRun();
	}
	RMuidField.placeholder = getLocalRMuid();
}

function buttonGoDiapClick (){
	showMeDiap(getRMuid(), from_date.value, to_date.value);
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

function showMe (uid, date){
	let url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=status_id&f[]=cf_77&f[]=closed_on&f[]=&group_by=cf_79&op[cf_77]==&op[closed_on]==&op[status_id]=c&v[cf_77][]=' + uid + '&v[closed_on][]=' + date;
	window.open(url, '_blank');
}

function showMeDiap (uid, from, to){
	let url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=status_id&f[]=cf_77&f[]=closed_on&f[]=&group_by=cf_79&op[cf_77]==&op[closed_on]=><&op[status_id]=c&v[cf_77][]=' + uid + '&v[closed_on][]=' + from + '&v[closed_on][]=' + to;
	window.open(url, '_blank');
}

function showMeAllTime (uid){
	let url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&f[]=status_id&f[]=cf_77&f[]=&group_by=cf_79&op[cf_77]==&op[status_id]=c&v[cf_77][]=' + uid;
	window.open(url, '_blank');
}

function goClick(){
	showMe(getRMuid(), closedDate.value);
}

function goFilterClick(){
	showMeFilter (filters.selectedIndex, closedDate.value);
}

function showMeFilter (id, date){
	let url = '';
	switch (id){
		case 0:
		url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=cf_77&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=38. ОТП Изменение cценария обработки Входящих звонков | Исходящих звонков&v[cf_79][]=5. ОТП Поддержка клиента &v[closed_on][]=' + date;
		break;
		
		case 1:
		url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=cf_77&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=2. ОТП Авария локально клиент&v[cf_79][]=3. ОТП Авария Бинотел&v[cf_79][]=4. ОТП ОК Авария&v[closed_on][]=' + date;
		break;
		
		case 2:
		url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=cf_77&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=32. ОТП Удаленная настройка - Интеграция c Bitrix24 &v[cf_79][]=33. ОТП Удаленная настройка - Интеграция c AmoCRM &v[cf_79][]=36. ОТП Консультация API &v[cf_79][]=8. ОТП Удаленная настройка - Интеграция CRM &v[closed_on][]=' + date;
		break;
		
		case 3:
		url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=cf_77&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=12. ОТП Включение - Исполнить ТЗ сложное&v[cf_79][]=11. ОТП Включение - Исполнить ТЗ легкое&v[closed_on][]=' + date;
		break;
		
		case 4:
		url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=cf_77&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=17. ОТП Включение - Подключение номера&v[cf_79][]=6. ОТП Удаленная настройка - Программный телефон&v[cf_79][]=7. ОТП Удаленная настройка - IP телефон&v[cf_79][]=9. ОТП Удаленная настройка - GSM шлюз&v[closed_on][]=' + date;
		break;
		
		case 5:
		url = baseUrl + 'c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=cf_79&f[]=status_id&f[]=closed_on&f[]=&group_by=cf_77&op[cf_79]==&op[closed_on]==&op[status_id]=c&v[cf_79][]=16. АЗ Включение - Аудиозапись Медиасистем&v[cf_79][]=15. АЗ Включение - Аудиозапись Ольга Писаренко&v[closed_on][]=' + date;
		break;
	}
	window.open(url, '_blank');
}

// add number
function input(){
	let temp = this.value = inputReplace(this.value, 'no_spaces');
	check(this);
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
		break;
	}
}

function check(elem){
	if (checkInputs(elem.value, 'kirill_and_spec')){
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
