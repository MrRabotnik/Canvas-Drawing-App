let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let W = window.innerWidth - 3;
let H = window.innerHeight - 47;
let YFromMouse = 40;
let sizeSelect = document.getElementById("size");
let colorSelect = document.getElementById("color");
let eraser = document.getElementById("eraser")
let color = document.getElementById("color").value;
canvas.width = W;
canvas.height = H;

ctx.beginPath()
let drawing = false;

function startDrawing(e) {
    drawing = true;
    Draw(e)
}

function endDrawing() {
    drawing = false;
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
    ctx.lineTo(e.clientX,e.clientY - YFromMouse);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX,e.clientY - YFromMouse);
}

function changeSize(){
    let size = document.getElementById("size").value;
    ctx.lineWidth = size;
}

function changeColor(){
    color = document.getElementById("color").value;
    selected =  false
    eraser.style.backgroundColor = "#fff";
}

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    eraser.style.backgroundColor = "#fff";
    selected =  false
}
let selected =  false
function selectingEraser(){
    if(!selected){
        eraser.style.backgroundColor = "#ccc";
        selected =  true
    }else{
        eraser.style.backgroundColor = "#fff";
        selected =  false
    }
}

btn.addEventListener("click",clearCanvas)
sizeSelect.addEventListener("change",changeSize)
colorSelect.addEventListener("change",changeColor)
canvas.addEventListener("mousedown",startDrawing)
canvas.addEventListener("mouseup",endDrawing)
canvas.addEventListener("mouseleave",endDrawing)
canvas.addEventListener("mousemove",Draw)
eraser.addEventListener("click",selectingEraser)