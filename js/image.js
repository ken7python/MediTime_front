function view(){
    app.viewPhotoRadio = true;
    app.registerPhotoRadio = false;
    app.viewPhotoDiv = true;
}

function register(){
    app.viewPhotoRadio = false;
    app.registerPhotoRadio = true;
    app.registerPhotoDiv = true;
}

function shoot(time){
    console.log("time: " + time);
    app.viewPhotoRadio = false;
    app.registerPhotoRadio = false;
    app.time = time;
    app.uploadDiv = true;
    app.registerPhotoDiv = false;
}

function Preview(){
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            app.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

function cancelUpload(){
    app.viewPhotoRadio = true;
    app.registerPhotoRadio = true;
    app.uploadDiv = false;
    app.registerPhotoDiv = false;
    app.imagePreview = null;
}

function upload(){
    data = {label: app.time, image: app.imagePreview};
    let param = {
        method:  "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body:    JSON.stringify( data ),
    };
    console.log(data);
    let obj;
    //alert(url);
    fetch(url + "/uploadImage", param).then(async function(res){
        obj = res.statusText;
        console.log(obj);

        alert(app.time + "の薬を登録しました。");
        app.viewPhotoRadio = true;
        app.registerPhotoRadio = true;
        app.uploadDiv = false;
        app.registerPhotoDiv = false;
        app.imagePreview = null;
        getImage();
    }).catch(function(e){alert(e);});
}

function showImage(label){
    app.showingLabel = label;
    image = app.images.find(image => image.label == app.showingLabel);
    if (image == null){
        app.showingImage = null;
        app.showingText = "登録なし";
    }else{
        app.showingImage = image.image;
        app.showingText = null;
    }
}
function deleteImage(){
    data = {label: app.showingLabel};
    let param = {
        method:  "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body:    JSON.stringify( data ),
    };
    console.log(data);
    let obj;
    fetch(url + "/deleteImage", param).then(async function(res){
        obj = res.statusText;
        console.log(obj);
        
        alert(app.showingLabel + "の薬を削除しました。");
        getshowImage();
        
    }).catch(function(e){console.log(e);});
}

const app = new Vue({
    el: '#app',
    data: {
        time: "",
        viewPhotoRadio: true,
        registerPhotoRadio: true,
        viewPhotoDiv: false,
        registerPhotoDiv: false,
        uploadDiv: false,
        imagePreview: null,

        images: [],
        showingLabel: null,
        showingImage: null,
        showingText: null,
    },
});
function getImage(){
    fetch(url + "/getImage").then(async function(res){
        obj = await res.json();
        obj = obj.image;
        console.log(obj);
        app.images = obj;
    }).catch(function(e){alert(e);});
}
getImage();


function getshowImage(){
    fetch(url + "/getImage").then(async function(res){
        obj = await res.json();
        obj = obj.image;
        console.log(obj);
        app.images = obj;
        showImage(app.showingLabel);
    }).catch(function(e){alert(e);});
}