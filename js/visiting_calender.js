var weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var modal_mode="";
document.getElementById('select_day_message').style.display = "none";

function mode_check(mode){
    document.getElementById('select_day_message').style.display = "block";
    modal_mode = mode;
}

function slideout(mode){
    document.getElementById(mode).style.display = "none";
    document.getElementById('memo_text_field').value = "";
}

var date;
var dataStr;
function add_memo(){
    var result = document.getElementById("memo_text_field").value;
    events.push({start: dateStr,end:dateStr,title: result})
        console.log(events);
        //ec.setOption("events",events);
        
        data = {label: result,date: dateStr,day_of_week: weekDay[date.getDay()]};
        let param = {
            method:  "POST",
            headers: { "content-type": "application/json; charset=utf-8" },
            body:    JSON.stringify( data ),
        };
        console.log(data);
        let obj;
        //alert(url);
        fetch(url + "/visiting_memo", param).then(async function(res){
            obj = await res.statusText;
            console.log(obj);
            //location.reload();
            slideout(modal_mode);
            reload();
        }).catch(function(e){alert(e);});
}

function dateclick(info){
    date = info.date;
    dateStr = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    console.log(dateStr)
    
    console.log(date);
    if (modal_mode == "modal_add_visiting"){
        data = {date: dateStr,day_of_week: weekDay[date.getDay()]};
        let param = {
            method:  "POST",
            headers: { "content-type": "application/json; charset=utf-8" },
            body:    JSON.stringify( data ),
        };
        console.log(data);
        let obj;
        //alert(url);
        fetch(url + "/visiting", param).then(async function(res){
            obj = await res.statusText;
            console.log(obj);
            //location.reload();
            reload();
        }).catch(function(e){alert(e);});
    }else
    if (modal_mode == "modal_add_memo"){
        document.getElementById("modal_add_memo").style.display = "block";
    }
}

var edit_id;
function eventclick(info){
    console.log(info);
    console.log(info.LongPressDelay)
    edit_id = info.event.classNames[1];
    var classname = info.event.classNames[0];
    var title = info.event.title;
    var date = info.event.start;
    
    if (classname == "memo"){
        //alert(title);
        document.getElementById("modal_edit_memo").style.display = "block";
        document.getElementById("memo_edit_field").value = title;
    }else
    if (classname == "label"){
        result = confirm("通院履歴を削除していいですか？");
        if (result){
            data = {id: edit_id};
            let param = {
                method:  "POST",
                headers: { "content-type": "application/json; charset=utf-8" },
                body:    JSON.stringify( data ),
            };
            console.log(data);
            let obj;
            //alert(url);
            
            fetch(url + "/delete_visiting_label", param).then(async function(res){
                obj = await res.statusText;
                console.log(obj);
                //location.reload();
                reload();
            }).catch(function(e){alert(e);});            
        }
    }
}
function edit_memo(){
    console.log("id:" +edit_id + "を" + document.getElementById("memo_edit_field").value + "に編集します");
    data = {id: edit_id,value: document.getElementById("memo_edit_field").value};
        let param = {
            method:  "POST",
            headers: { "content-type": "application/json; charset=utf-8" },
            body:    JSON.stringify( data ),
        };
        console.log(data);
        let obj;
        //alert(url);
        fetch(url + "/edit_visiting_memo", param).then(async function(res){
            obj = await res.statusText;
            console.log(obj);
            //location.reload();
            slideout("modal_edit_memo");
            reload();
        }).catch(function(e){alert(e);});
}

var events = [];
let ec;
var visitingHistory;

function eventPush(){
    events = [];
    for (let i = 0; i < visitingHistory.length; i++) {
        //visitingHistory[i].date = ;
        var id = visitingHistory[i].id;
        var color = "#000000";
        var label = visitingHistory[i].label;
        var type = visitingHistory[i].type;
        if (type == "memo"){
            color = "#ff6c94"
        }else{
            color = "#FFA726"
        }
        events.push({start: visitingHistory[i].date, end: visitingHistory[i].date,title: label,color: color,classNames:[type,id]});
    }
}

fetch(url + "/visiting").then(async function(res) {
    const data = await res.json();
    console.log(data);
    visitingHistory = data.visitingHistory;
    console.log(visitingHistory);
    eventPush();
    console.log(events);
    ec = new EventCalendar(document.getElementById('ec'), {
        view: 'dayGridMonth',
        headerToolbar: {
            start: 'prev,next',
            center: 'title',
            end: 'dayGridMonth,listWeek'
        },
        events: events,
        
        dateClick: dateclick,
        eventClick: eventclick,
    });
}).catch(e => {
    console.error(e);
});
function reload(){
    fetch(url + "/visiting").then(async function(res) {
        const data = await res.json();
        console.log(data);
        visitingHistory = data.visitingHistory;
        console.log(visitingHistory);
        eventPush();
        ec.setOption("events",events);
    }).catch(e => {
        console.error(e);
    });
}