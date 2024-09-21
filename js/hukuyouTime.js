var app = new Vue({
    el: '#main',
    data: {
        time_select: document.getElementById('time_select').value,
        valid_button: document.getElementById('valid_button').checked,
        weekdaySchedule: document.getElementById('WeekdaySchedule').checked,
    }
})
var hukuyouData;
var valid;
var hukuyouTime;
var weekdayBool;
var OnceDayData;
var times = ["朝","昼","夜","寝る前"];
var selectedTime;

function updateData(){
    fetch(url + "/hukuyouTime").then(async function(res){
        hukuyouData = await res.json();
        console.log(hukuyouData);

        selectedTime = document.getElementById('time_select').value;
        for (var i=0;i<times.length;i++){
            if (selectedTime == times[i]){
                selectedTimeIndex = i;
            }
        }
        valid = hukuyouData.valid[selectedTimeIndex].hukuyouTime == 1;
        weekdayBool = hukuyouData.valid[selectedTimeIndex].WeekdaySchedule == 1;

        hukuyouTime = {"morning": "","noon":"","night":"","before_bed":""};
        for(var i=0;i<hukuyouData.hukuyouTime.length;i++){
            var d = hukuyouData.hukuyouTime[i];
            console.log(d);
            if (d.label == times[0]){
                hukuyouTime.morning = d;
            }else
            if (d.label == times[1]){
                hukuyouTime.noon = d;
            }else
            if (d.label == times[2]){
                hukuyouTime.night = d;
            }else
            if (d.label == times[3]){
                hukuyouTime.before_bed = d;
            }
        }
        document.getElementById('valid_button').checked = valid;
        app.valid_button = valid;

        document.getElementById('WeekdaySchedule').checked = weekdayBool;
        document.getElementById('everydayCheckBox').checked = !weekdayBool;

        app.weekdaySchedule = weekdayBool;

        changeTime();
    }).catch(function(e){console.log(e);});
}

function changeTime(){
    var time = document.getElementById('time_select').value;
    for (var i=0;i<hukuyouData.hukuyouTime.length;i++){
        if (hukuyouData.hukuyouTime[i].label == time){
            OnceDayData = hukuyouData.hukuyouTime[i];
        }
    }
    console.log(OnceDayData);
    console.log(weekdayBool);
    if (weekdayBool){
        document.getElementById("sunday").value = OnceDayData.Sunday;
        document.getElementById("monday").value = OnceDayData.Monday;
        document.getElementById("tuesday").value = OnceDayData.Tuesday;
        document.getElementById("wednesday").value = OnceDayData.Wednesday;
        document.getElementById("thursday").value = OnceDayData.Thursday;
        document.getElementById("friday").value = OnceDayData.Friday;
        document.getElementById("saturday").value = OnceDayData.Saturday;
    }else{
        document.getElementById("everydaySchedule").value = OnceDayData.Sunday;
    }
}

function init(){
    updateData();
}

init();

function updateVue(){
    //console.log("change");
    app.time_select = document.getElementById('time_select').value;
    app.valid_button = document.getElementById('valid_button').checked;
    app.weekdaySchedule = document.getElementById('WeekdaySchedule').checked;
    //console.log(app.time_select,app.valid_button,app.weekdaySchedule);
    setScheduleColor();
}

function getOnceDaySchedule(day){
    value = document.getElementById(day).value;
    return value;
}
var result = true;
function setHukuyouTime(){
    var valid;
    var schedule;
    var week = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var everydaySchedule = document.getElementById("everydaySchedule").value;
    var schedule = {"sunday":"","monday":"","tuesday":"","wednesday":"","thursday":"","friday":"","saturday":""};
    result = true;
    if (document.getElementById('valid_button').checked){
        valid = true;
        if (document.getElementById('WeekdaySchedule').checked){
            for(var i=0;i<week.length;i++){
                schedule[week[i]] = document.getElementById(week[i]).value;
                /*
                if (document.getElementById(week[i]).value == ""){
                    //alert("時刻が入力されていないところがあります");
                    result = window.confirm(countSelected() + "日分でいいですか？")
                    break;
                }
                    */
            }
            if (countSelected() < 7){
                result = window.confirm(countSelected() + "日分でいいですか？")
            }
        }else{
            if (everydaySchedule == ""){
                alert("時刻が入力されていません");
                return;
            }
            schedule = {"sunday": everydaySchedule,"monday":everydaySchedule,"tuesday":everydaySchedule,"wednesday":everydaySchedule,"thursday":everydaySchedule,"friday":everydaySchedule,"saturday":everydaySchedule}
        }
    }else{
        valid = false;
    }
    console.log(result);
    if (result){
        data = {label: document.getElementById('time_select').value,schedule: schedule,valid: valid,weekBool: document.getElementById('WeekdaySchedule').checked};
        let param = {
            method:  "POST",
            headers: { "content-type": "application/json; charset=utf-8" },
            body:    JSON.stringify( data ),
        };
        console.log(data);

        let obj;
        //alert(url);
        fetch(url + "/hukuyouTime", param).then(async function(res){
            obj = await res.statusText;
            console.log(obj);
            alert("OK");
            updateData();
        }).catch(function(e){alert(e);});
    }
}
var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

function setScheduleColor(){
    if (document.getElementById('WeekdaySchedule').checked){
        for (var i=0;i<days.length;i++){
            document.getElementById(days[i]).style.backgroundColor = "#ffffff";
            if (getOnceDaySchedule(days[i]) == ""){
                document.getElementById(days[i]).style.backgroundColor = "#f0908d";
                break;
            }
        }
    }else{
        if (document.getElementById("everydaySchedule").value == ""){
            document.getElementById("everydaySchedule").style.backgroundColor = "#f0908d";
        }else{
            document.getElementById("everydaySchedule").style.backgroundColor = "#ffffff";
        }
    }
}

function countSelected(){
    var count = 0;
    for (var i=0;i<days.length;i++){
        if (document.getElementById(days[i]).value != ""){
            count++;
        }
    }
    return count;
}