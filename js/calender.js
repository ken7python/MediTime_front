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
    document.getElementById("morning").checked = false;
    document.getElementById("afternoon").checked = false;
    document.getElementById("night").checked = false;
    document.getElementById("before_sleep").checked = false;
    document.getElementById("tonpuku").checked = false;
}

var date;
var dataStr;
function add_memo(){
    var result = document.getElementById("memo_text_field").value;
    if (result == ""){
        alert("メモ内容を入力してください");
        return;
    }
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
        fetch(url + "/memo", param).then(async function(res){
            obj = await res.statusText;
            console.log(obj);
            //location.reload();
            slideout(modal_mode);
            reload();
        }).catch(function(e){alert(e);});
}

function add_label(){
    morning = document.getElementById("morning").checked;
    afternoon = document.getElementById("afternoon").checked;
    night = document.getElementById("night").checked;
    before_sleep = document.getElementById("before_sleep").checked;
    tonpuku = document.getElementById("tonpuku").checked;
    console.log(morning,afternoon,night,before_sleep,tonpuku);

    var labels = []

    if (morning){
        labels.push("朝")
    }
    if (afternoon){
        labels.push("昼")
    }
    if (night){
        labels.push("夜")
    }
    if (before_sleep){
        labels.push("寝る前")
    }
    if (tonpuku){
        labels.push("頓服")
    }
    console.log(labels)
    if (labels.length == 0){
        alert("追加したいものを選択してください");
        return;
    }

    data = {labels: labels,date: dateStr,day_of_week: weekDay[date.getDay()]};
        let param = {
            method:  "POST",
            headers: { "content-type": "application/json; charset=utf-8" },
            body:    JSON.stringify( data ),
        };
        console.log(data);
        let obj;
        //alert(url);
        fetch(url + "/hukuyou_multiple", param).then(async function(res){
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
    if (modal_mode != ""){
        document.getElementById(modal_mode).style.display = "block";
    }
    /*
    var result = prompt(dateStr + "にメモする内容を入力してください。")
    if (result){
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
        fetch(url + "/memo", param).then(async function(res){
            obj = await res.statusText;
            console.log(obj);
            //location.reload();
            reload();
        }).catch(function(e){alert(e);});
    }
    */
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
        result = confirm("服薬履歴「" + title + "」を削除していいですか？");
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
            
            fetch(url + "/delete_label", param).then(async function(res){
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
        fetch(url + "/edit_memo", param).then(async function(res){
            obj = await res.statusText;
            console.log(obj);
            //location.reload();
            slideout("modal_edit_memo");
            reload();
        }).catch(function(e){alert(e);});
}

var events = [];
let ec;
var hukuyouHistory;

function eventPush(){
    events = [];
    for (let i = 0; i < hukuyouHistory.length; i++) {
        //hukuyouHistory[i].date = ;
        var id = hukuyouHistory[i].id;
        var color = "#000000";
        var label = hukuyouHistory[i].label;
        var type = hukuyouHistory[i].type;
        if (type == "memo"){
            color = "#ff6c94"
        }else
        if (label == "朝"){
            color = "#FFA726";
        }else
        if (label == "昼"){
            color = "#66BB6A";
        }else
        if (label == "夜"){
            color = "#42A5F5";
        }else
        if (label == "寝る前"){
            color = "#AB47BC";
        }else
        if (label == "頓服"){
            color = "#d52f25"
        }
        events.push({start: hukuyouHistory[i].date, end: hukuyouHistory[i].date,title: label,color: color,classNames:[type,id]});
    }
}

fetch(url + "/hukuyou").then(async function(res) {
    const data = await res.json();
    console.log(data);
    hukuyouHistory = data.hukuyouHistory;
    console.log(hukuyouHistory);
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
    fetch(url + "/hukuyou").then(async function(res) {
        const data = await res.json();
        console.log(data);
        hukuyouHistory = data.hukuyouHistory;
        console.log(hukuyouHistory);
        eventPush();
        ec.setOption("events",events);
    }).catch(e => {
        console.error(e);
    });
}