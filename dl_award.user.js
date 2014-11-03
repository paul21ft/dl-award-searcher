// ==UserScript==
// @name        DL Award Calendar
// @namespace   www.delta.com
// @description Builds Award Calendar
// @include     https://www.delta.com/awards/selectFlights.do?EventId=VIEW_SELECT_FLIGHTS*
// @include     http://www.delta.com/awards/selectFlights.do?EventId=VIEW_SELECT_FLIGHTS*
// @version     0.1
// @grant       none
// ==/UserScript==

//Version 0.1

//Written by paul21 of FlyerTalk.com
//http://www.flyertalk.com/forum/members/paul21.html
//Copyright Reserved -- At least share with credit if you do

//Simple sleep function
function slp(millis, callback) {
	setTimeout(function()
	{ callback(); }
	, millis);
}

//Parses all of the outputs of regexp matches into an array
function exRE(str,re){
	var ret= new Array();
	var m;
	var i=0;
	while( (m = re.exec(str)) != null ) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		for (k=1;k<m.length;k++) {
			ret[i++]=m[k];
		}
	}
	return ret;

}

function bldCal() {
  var el = document.querySelector("#td_0_0_0 > div:nth-child(1) > div:nth-child(2)");
  if (!el) {
  el = document.querySelector("#td_selectAwardFlightsSegment_0_0_0 > div:nth-child(1) > div:nth-child(2)");
  }
    //alert(el.innerHTML);
  
  var re=/([0-9]+)\,/g;
  var lowPrice = exRE(el.innerHTML,re);
  
  //alert("Price: " + lowPrice[0].toString() + "k");
  var el = document.querySelector("#revisedDeptDate");
  var td = Date.parse(el.value);
  var d = new Date(td);
  //alert(d.toDateString());
  var tmp = "";
  tmp += localStorage.das_results;
  
  tmp += d.toDateString() + " : " + lowPrice[0].toString() + " k<br>";
  localStorage.das_results=tmp;
  //alert(localStorage.das_results);
  //var el = document.querySelector("#td_selectFlightsDetailsNew_1_0_0 > span:nth-child(1) > span:nth-child(1)");
  //alert(el.innerHTML);
  
}

function setSrch() {
  
  var el = document.querySelector("#SortSearchResults > div:nth-child(1) > select:nth-child(2)");
  el.value=7;
  el.onchange();
  
}

function nextSrch(numDays) {
  
  //var d= new Date(localStorage.das_baseDate);
  var el = document.querySelector("#revisedDeptDate");
  var d = Date.parse(el.value);
  //alert(numDays.toString());
  var newDate = new Date(d + numDays*60000*60*24);
  
  //alert("NextSearch");
  //alert((newDate.getMonth()+1).toString() + newDate.getDate().toString() + newDate.getFullYear().toString());
  
  el.value = (newDate.getMonth()+1).toString() + "/" + newDate.getDate().toString() + "/" + newDate.getFullYear().toString();

  var el = document.querySelector("#submitRevise");
  el.onclick();
  
  var el = document.querySelector("#ModifySearchContainer > form:nth-child(3)");
  el.submit();
  
}

function dispCal() {
  var el = document.querySelector(".header_container");
  var chtm= "<p><font color=blue>Calendar Results:</font><br>";
  chtm += localStorage.das_results;
  el.innerHTML += chtm;
}

function adSearchDone() {
  var el = document.querySelector(".header_container");
  var chtm= "";
  chtm += "<font color=red>DONE!</font><br>";
  el.innerHTML += chtm;
}

function dasStartSearch() {
  var el = document.getElementById("dasSearchNumDays");
  var searchNumDays = parseInt(el.value);
  
  //alert(searchNumDays.toString());
  
  localStorage.das_remDays=searchNumDays-1;
  localStorage.das_curDay=0;
  
  var searchDays = new Array();
  
  var i;
  for(i=0;i<searchNumDays;i++)
    {
      searchDays[i]=1;
    }
  
  localStorage.das_searchDays=searchDays.join(',');
  
  
  
  //localStorage.das_baseDate=d;
  
  localStorage.das_state=1;
  var tmp="";
  localStorage.das_results=tmp;
  execSM();
  
  return false;
  
}

function adCtrl() {
  var el = document.querySelector("#ModifySearchContainer > form:nth-child(3)");
  var chtm = "<p><font color=white size=5>Build Award Calendar:<br>";

  //chtm += '<form name=\"dasSearchN\" onsubmit=\"return dasStartSearch\(\)\;\">';
  chtm += '<br>Number of Days:<input id=\"dasSearchNumDays\" type=text name=\"dasNumDays\" value=\"7\" size=2><br>';
  chtm += '<input id="dasSearchBtn" type=button value=\"Calendar Search\"><br>';
  
  
  chtm+="</font>";
  el.outerHTML+=chtm;
  var button = document.getElementById("dasSearchBtn");
  button.addEventListener('click',dasStartSearch,true);
  
}



function execSM() {
  
  var el = document.querySelector("#FlightDepartureDate");
  if (el.length < 1) {
    //alert("Wrong Page");
    return;
  }
  
  if (!localStorage.das_state) {
    localStorage.das_state=0;
  }
  var state=localStorage.das_state;
  //alert("State: " + state.toString());
  if (state==1) {
        setSrch();
        slp(4000,execSM);
        state=2;
  }else if (state==2) {
        bldCal();
        dispCal();
        var remDays=localStorage.das_remDays;
        var curDay=localStorage.das_curDay;
        var searchDaysStr = localStorage.das_searchDays;
        var searchDays = searchDaysStr.split(',');
        if (--remDays >= 0) {
          localStorage.das_remDays = remDays;
          localStorage.das_curDay++;
          state=1;
          nextSrch(searchDays[curDay]);
        }else{
          state=0;
          adSearchDone();
          adCtrl();
        }
  }else{
    //state==0;
    
    //Insert Controls
    adCtrl();
    dispCal();
    //state=1;
    //slp(2000,execSM);
  }
  localStorage.das_state=state;
}

slp(2000,execSM);
