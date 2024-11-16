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
    alert(app.time + "の薬を登録しました。");
    app.viewPhotoRadio = true;
    app.registerPhotoRadio = true;
    app.uploadDiv = false;
    app.registerPhotoDiv = false;
    app.imagePreview = null;
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
    },
});