//点击开始游戏 -》 动态生成100个小格--》100div
//leftClick  没有雷  --》显示数字（代表以当前小格为中心周围8个格的雷数） 扩散（当前周围八个格没有雷）
//           有累 --》game Over
//rightClick 没有标记并且没有数字--》进行标记。 有标记 --》取消标记 --》标记是否正确，10个都正确标记，提示成功
//已经出现数字--》无效果
var content = document.getElementById('content');
var startBtn = document.getElementById('startBtn');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var closeBtn = document.getElementById('close');
var block;
var startGameBool = true;
var mine = document.getElementById('mine');

bindEvent();

function init() {
    
    minesNum = 20;//雷数
    mineOver = 20;
    // score.innerHTML = mineOver;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var con = document.createElement('div');
            con.classList.add('block');
            con.setAttribute('id', i + '-' + j);
            content.appendChild(con);
        }
    }
    block = document.getElementsByClassName('block');
    while(minesNum){
        var mineIndex = Math.floor((Math.random() * 100));
        if(!block[mineIndex].classList.contains('isLei')){
            block[mineIndex].classList.add('isLei');
            minesNum--;
        }
    }
    mine.innerHTML = mineOver;
}

function leftClick(dom) {
    if(dom.classList.contains('flag')){
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    if(dom && dom.classList.contains('isLei')){
        alertBox.style.display = 'block';
        for(var i = 0; i < isLei.length; i++){
            isLei[i].classList.add('show');
        }
    }else{
        var n = 0;
        dom.classList.add('num');
        var posArr = dom && dom.getAttribute('id').split('-');
        console.log(posArr);

        var posX = +posArr[0];
        var posY = +posArr[1];
        for(var i = posX - 1; i <= posX + 1; i++ ){
            for(var j = posY - 1; j <= posY + 1; j++ ){
                var aroundBox  = document.getElementById(i + '-' + j);
                if(aroundBox  && aroundBox.classList.contains('isLei')){
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        if(n == 0){
            for(var i = posX - 1; i <= posX + 1; i++ ){
                for(var j = posY - 1; j <= posY + 1; j++ ){
                    var nearBox = document.getElementById(i + '-' + j);
                    if(nearBox && nearBox.length != 0){
                        if (!nearBox.classList.contains('check')) {
                            nearBox.classList.add('check');
                            leftClick(nearBox);
                        }
                    }
                }
            }
            
        }
    }
}

function rightClick(dom) {
    if(dom.classList.contains('num')){
        return;
    }
    dom.classList.toggle('flag');
    if(dom && !dom.classList.contains('flag')){
        if(dom && dom.classList.contains('isLei')){
            mineOver++;
        }
    }
    if(dom && dom.classList.contains('isLei')){
        if(dom && dom.classList.contains('flag')){
            mineOver--;
        }
    }
    mine.innerHTML = mineOver;
    if(mineOver == 0){
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("img/success.png")';
    }
}

function bindEvent() {
    startBtn.onclick = function () {
        if(startGameBool) {
            content.style.display = 'block';
            flagBox.style.display = 'block';
            init();
            startGameBool = false;
        }
    }
    content.onmousedown = function(e) {
        var e = e || window.event;
        var target = e.target || e.srcElement;
        if(e.button == 0){ //e.which 也ok;不知道是否有兼容性问题；
            leftClick(target);
        }else if(e.button == 2){
            rightClick(target);
        }
    }
    content.oncontextmenu = function(e) {
        e.returnValue = false;
        return false;
    }
    closeBtn.onclick = function(){
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        content.style.display = 'none';
        content.innerHTML = null;
        startGameBool = true;
    }
}