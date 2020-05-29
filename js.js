//=================================================================
//                        DEFINING VARIABLES
//=================================================================
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let tool_container_height = document.getElementById("tools_container").offsetHeight + 4
let W = window.innerWidth - 3;
let H = window.innerHeight - tool_container_height;
let YFromMouse = 40;
let sizeSelect = document.getElementById("size");
let colorSelect = document.getElementById("color");
let eraser = document.getElementById("eraser");
let color = document.getElementById("color").value;
let selected =  false
let drawing = false;
let right_clicked = false;
let options = document.getElementsByClassName("color_options");
let colorsThatNeedWhite = ["#000","#a1a1a1","#ff0000","#8f0000","#0000ff","#b247ff","#4f2907","#f06f0c","#6e4724","#078a09","#0d5bba","#fa05d1"];
let size = document.getElementById("size").value;
let canvasURL,data;
let canvasIMG = [];
let img = document.getElementById("canvas_img")
let saved_text = document.getElementById("saved")
let itemsArray = []

//=================================================================
//                        WINDOW ON LOAD FUNCTIONS
//=================================================================
localStorage.setItem('items', JSON.stringify(itemsArray))
canvas.width = W;
canvas.height = H;
ctx.beginPath();
ctx.lineWidth = size;
for(let i = 0;i < options.length;i++){
    options[i].style.backgroundColor = options[i].value;
}

//=================================================================
//                        FUNCTIONS
//=================================================================
function movingTool(e){
    // ctx.beginPath()
    // ctx.arc(e.clientX,e.clientY,size,0,2 * Math.PI);
    // ctx.stroke();
}
function startDrawing(e) {
    drawing = true;
    if(e.which == 3){
        eraser.style.backgroundColor = "#ccc";
        selected =  true;
        e.preventDefault();
    };
    Draw(e);
}

function endDrawing(e) {
    drawing = false;
    if(e.which == 3){
        e.preventDefault()
        selected =  false
        eraser.style.backgroundColor = "rgb(245,245,245)";
    }
    ctx.beginPath();
}

function Draw(e){
    if(!drawing) return;
    if(selected){
        ctx.strokeStyle = "#fff";
    }else{
        ctx.strokeStyle = color;
    }
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX,e.clientY - tool_container_height + 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX,e.clientY - tool_container_height + 4);
    
}

function changeSize(){
    size = document.getElementById("size").value;
    ctx.lineWidth = size;
}

function changeColor(){
    color = document.getElementById("color").value;
    selected =  false
    eraser.style.backgroundColor = "rgb(245,245,245)";
    colorSelect.style.backgroundColor = color;
    colorSelect.style.borderColor = color;
    if(colorsThatNeedWhite.includes(color)){
        colorSelect.style.color = "white";
    }else{
        colorSelect.style.color = "black";
    }
}

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // ctx.fillStyle = "white";
    // ctx.fillRect(0,0,canvas.width,canvas.height);
    // ctx.fill()
    eraser.style.backgroundColor = "rgb(245,245,245)";
    selected =  false
}

function selectingEraser(){
    if(!selected){
        eraser.style.backgroundColor = "#ccc";
        selected =  true
    }else{
        eraser.style.backgroundColor = "rgb(245,245,245)";
        selected =  false
    }
};

function savingCanvas(e){
    if(e.which == 115){
        canvasURL = canvas.toDataURL();
        itemsArray.push(canvasURL);
        localStorage.setItem('items', JSON.stringify(itemsArray))

        //Showing and hiding the SAVED text
        $(saved_text).fadeIn(1000);
        setTimeout(() => {$(saved_text).fadeOut(1000)},3000);
    }
}

function settingTheCanvasImage(e){
    if(e.which == 13){
        data = JSON.parse(localStorage.getItem('items'));
        img.setAttribute("src",data[data.length - 1]);
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
    }
}


//=================================================================
//                        CALLING THE FUNCTIONS
//=================================================================

btn.addEventListener("click",clearCanvas);
sizeSelect.addEventListener("change",changeSize);
colorSelect.addEventListener("change",changeColor);
colorSelect.addEventListener("mouseover",() => {colorSelect.style.boxShadow = `0 0 1vw ${color}`;})
colorSelect.addEventListener("mouseout",() => {colorSelect.style.boxShadow = `none`;})
eraser.addEventListener("click",selectingEraser);
canvas.addEventListener("mousedown",startDrawing);
document.addEventListener("mouseup",endDrawing);
canvas.addEventListener("mouseleave",() => {ctx.beginPath()});
canvas.addEventListener("mousemove",Draw);
canvas.addEventListener("mousemove",movingTool);
document.addEventListener("keypress",savingCanvas);
document.addEventListener("keypress",settingTheCanvasImage);









// data.forEach(item => {
//     liMaker(item)
// })   