var today = new Date();
var RMuidField, closedDate, fromDate, toDate;

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
	document.getElementById('go').addEventListener('click', todayClick);
	document.getElementById('godiap').addEventListener('click', buttonGoDiapClick);
	document.getElementById('reset').addEventListener('click', uidresetClick);
	checkLocal();
	RMuidField.placeholder = getLocalRMuid();
	closedDate.valueAsDate = today;
	fromDate.valueAsDate = monday();
	toDate.valueAsDate = today;
	
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
	
	addnumber.addEventListener('click', copy);
	
}


// old

function checkLocal(){
	while (!localStorage.localRMuid){
			firtsRun();
	}
}

function firtsRun(){
	let askRMuid = prompt ('Введи свой логин в RM:');
	if (askRMuid == null){
		return false;
		}
	let loginInput = inputCheck(askRMuid);
	if (loginInput == false){
		return false;
	}else{
		if (confirm ('Записать "' + loginInput + '"?')){
			localStorage.localRMuid = loginInput;
		}else{
			return false;
		}
	}
}

function inputCheck(testStting){
	let re = /^[A-Z0-9]{2,4}$/;
	let testStrUpper = testStting.toUpperCase();
	if (re.test(testStrUpper)){
		return testStrUpper;
	}else{
		return false;
	}
}

function getLocalRMuid(){
	return localStorage.localRMuid;
}

function change() {
	let pattern = /[^a-z0-9]/gi;
	str = RMuidField.value.toUpperCase();
	RMuidField.value = str.replace(pattern, '');
}

function getRMuid (){
	let RMuidFromInput = inputCheck(RMuidField.value);
	if (RMuidFromInput==false){
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
		date.setDate(today.getDate - 6);
		return date;
	} else if (thisDay == 1){
		return date;
	} else {
		date.setDate(today.getDate() - thisDay + 1);
		return date;
	}
}

function showMe (uid, date){
	let url = 'https://work.binotel.com/issues?c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=status_id&f[]=cf_77&f[]=closed_on&f[]=&group_by=cf_79&op[cf_77]==&op[closed_on]==&op[status_id]=c&per_page=200&set_filter=1&utf8=✓&v[cf_77][]=' + uid + '&v[closed_on][]=' + date;
	window.open(url, '_blank');
}

function showMeDiap (uid, from, to){
	let url = 'https://work.binotel.com/issues?c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&c[]=closed_on&f[]=status_id&f[]=cf_77&f[]=closed_on&f[]=&group_by=cf_79&op[cf_77]==&op[closed_on]=><&op[status_id]=c&per_page=200&set_filter=1&utf8=✓&v[cf_77][]=' + uid + '&v[closed_on][]=' + from + '&v[closed_on][]=' + to;
	window.open(url, '_blank');
}

function showMeAllTime (uid){
	let url = 'https://work.binotel.com/issues?c[]=cf_77&c[]=subject&c[]=cf_79&c[]=created_on&f[]=status_id&f[]=cf_77&f[]=&group_by=cf_79&op[cf_77]==&op[status_id]=c&per_page=500&set_filter=1&utf8=✓&v[cf_77][]=' + uid;
	window.open(url, '_blank');
}

// add number
function input() {
	let re = /[\s]/g;
	let temp = this.value = this.value.replace(re, '');
	check(this);
	if (this.value == '') {
		this.placeholder = this.id;
	}
	switch (this.id) {
		
		case 'panelid':
		panelidOut.textContent = temp;
		break;
		
		case 'number':
		numberOut.textContent = numberReg.textContent = temp;
		break;
		
		case 'defaultuser':
		defaultuserOut.textContent = temp;
		if (fromuser.value == '') { fromuser.placeholder = fromuserOut.textContent = fromuserReg.textContent = temp; }
		if (fromuser.placeholder == '') { fromuser.placeholder = 'fromuser'; }
		break;
		
		case 'fromuser':
		fromuserOut.textContent = fromuserReg.textContent = temp;
		break;
		
		case 'secret':
		secretOut.textContent = secretReg.textContent = temp;
		break;
		
		case 'host':
		hostOut.textContent = temp;
		if (fromdomain.value == '') { fromdomain.placeholder = fromdomainOut.textContent = fromdomainReg.textContent = temp; }
		if (fromdomain.placeholder == '') { fromdomain.placeholder = 'fromuser'; }
		break;
		
		case 'fromdomain':
		fromdomainOut.textContent = fromdomainReg.textContent = temp;
		break;
	}
}

function check(elem) {
	let re = /[а-яА-ЯіІ:@\/]/g;
	if (re.test(elem.value)) {
		elem.classList.add('err');
	} else {
		elem.classList.remove('err');
	}
}

function copy() {
	navigator.clipboard.writeText(out.innerText);
}
