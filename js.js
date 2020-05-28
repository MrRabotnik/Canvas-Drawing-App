let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let tool_container_height = document.getElementById("tools_container").offsetHeight + 4
let W = window.innerWidth - 3;
let H = window.innerHeight - tool_container_height;
let YFromMouse = 40;
let sizeSelect = document.getElementById("size");
let colorSelect = document.getElementById("color");
let eraser = document.getElementById("eraser")
let color = document.getElementById("color").value;
let selected =  false
let drawing = false;
let right_clicked = false
let options = document.getElementsByClassName("color_options")

canvas.width = W;
canvas.height = H;
ctx.beginPath()

for(let i = 0;i < options.length;i++){
    options[i].style.backgroundColor = options[i].value;
}

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
        eraser.style.backgroundColor = "#fff";
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
    let size = document.getElementById("size").value;
    ctx.lineWidth = size;
}

function changeColor(){
    color = document.getElementById("color").value;
    selected =  false
    eraser.style.backgroundColor = "#fff";
    colorSelect.style.backgroundColor = color;
    colorSelect.style.borderColor = color;
    colorSelect.style.boxShadow = `0 0 1.5vw ${color}`;
}

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    eraser.style.backgroundColor = "#fff";
    selected =  false
}

function selectingEraser(){
    if(!selected){
        eraser.style.backgroundColor = "#ccc";
        selected =  true
    }else{
        eraser.style.backgroundColor = "#fff";
        selected =  false
    }
}


btn.addEventListener("click",clearCanvas);
sizeSelect.addEventListener("change",changeSize);
colorSelect.addEventListener("change",changeColor);
eraser.addEventListener("click",selectingEraser);
canvas.addEventListener("mousedown",startDrawing);
canvas.addEventListener("mouseup",endDrawing);
canvas.addEventListener("mouseleave",endDrawing);
canvas.addEventListener("mousemove",Draw);
canvas.addEventListener("mousemove",movingTool);
