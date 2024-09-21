var dt = new Date();
var weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const day_str = weekDay[dt.getDay()];

fetch(url + "/hukuyouTime").then(async function(res){
    hukuyouData = await res.json();
    console.log(hukuyouData);

    app = new Vue({
        el: "#app",
        data: {
            hukuyouTime: hukuyouData.hukuyouTime,
            valid: hukuyouData.valid,
            day: day_str,
        }
    })
}).catch(function(e){console.log(e);});

document.getElementById("setting_div").style.display = "none";
document.getElementById("logo").style.display = "none";

setTimeout(function(){
    document.getElementById("setting_div").style.display = "flex";
    document.getElementById("logo").style.display = "block";
},1500);