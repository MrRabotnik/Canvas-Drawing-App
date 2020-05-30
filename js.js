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
let canvasURL;
let canvasIMG = [];
let saved_text = document.getElementById("saved");
let delete_storage = document.getElementById("delete_storage");
let yes_btn = document.getElementById("yes_btn")
let no_btn = document.getElementById("no_btn")
let save = document.getElementById("save")
let deleted_text = document.getElementById("deleted")
let undo_elements = []
let index = -1;
let dropDown = document.getElementById("drop_down")
let toolSelection = {
    tool_pencil:"fas fa-pencil-alt",
    tool_fill:"fas fa-fill-drip",
    tool_square_fill:"fas fa-square",
    tool_square_stroke:"far fa-square",
    tool_circle_fill:"fas fa-circle",
    tool_circle_stroke:"far fa-circle",
}

//=================================================================
//                        WINDOW ON LOAD FUNCTIONS
//=================================================================
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
$(window).resize(function(){
    W = window.innerWidth - 3;
    H = window.innerHeight - tool_container_height;
    canvas.width = W;
    canvas.height = H;
})

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

function savingCanvas(e){
    e.preventDefault()
    if(e.which == 115){
        canvasURL = canvas.toDataURL();
        localStorage.setItem("items", canvasURL);
        //Showing and hiding the SAVED text
        $(deleted_text).hide();
        $(saved_text).fadeIn(1000);
        setTimeout(() => {$(saved_text).fadeOut(1000)},3000);
    }
}

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // ctx.fillStyle = "white";
    // ctx.fillRect(0,0,canvas.width,canvas.height);
    // ctx.fill()
    eraser.style.backgroundColor = "rgb(245,245,245)";
    selected =  false;
}

function clearCanvasWithR(e){
    if(e.which == 114){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        eraser.style.backgroundColor = "rgb(245,245,245)";
        selected =  false;
    }
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
    dropDown.style.color = color;
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

function saveButton(){
    canvasURL = canvas.toDataURL();
    localStorage.setItem("items", canvasURL);
    $(deleted_text).hide();
    $(saved_text).fadeIn(1000);
    setTimeout(() => {$(saved_text).fadeOut(1000)},3000);
}

function settingTheCanvasImage(e){
    let img = document.getElementById("canvas_img");
    if(localStorage.getItem("items")){
        img.setAttribute("src",localStorage.getItem("items"));
    }else{
        img.setAttribute("src","");
    }
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
}   

function deletingLocalStorage(){
    localStorage.clear();
    $(saved_text).hide();
    $(deleted_text).fadeIn(1000);
    setTimeout(() => {$(deleted_text).fadeOut(1000)},3000);
    undo_elements = [];
    index = -1;
}

function clearSavingsWithDel(e){
    if(e.which == 46){
        localStorage.clear();
        $(saved_text).hide();
        $(deleted_text).fadeIn(1000);
        setTimeout(() => {$(deleted_text).fadeOut(1000)},3000);
        undo_elements = [];
        index = -1;
    }
}
function checkingLocalStorage(){
    if(localStorage.getItem("items")){
        $("#new_or_saved_section").css("display","flex");
    }
}

function savingCurrentCanvasForUndo(){
    let undo_elements_URL = canvas.toDataURL();
    undo_elements.push(undo_elements_URL);
    console.log(undo_elements);
    index++;
}

function undo(e){
    if(e.which == 122){
        let img = document.getElementById("canvas_img");
        if(undo_elements.length !== 1){
            if(index > 0){
                index--;
            }
            img.setAttribute("src",undo_elements[index]);
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            console.log(undo_elements);
        }else{
            img.setAttribute("src","");
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            console.log("Array is empty");
        }
    }
}

function redo(e){
    if(e.which == 121){
        if(index == undo_elements.length){
            index++;
        }
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
canvas.addEventListener("mouseup",savingCurrentCanvasForUndo)
document.addEventListener("keypress",savingCanvas);
document.addEventListener("keypress",undo);
document.addEventListener("keypress",redo);
document.addEventListener("keypress",clearCanvasWithR);
yes_btn.addEventListener("click",settingTheCanvasImage)
window.addEventListener("load",checkingLocalStorage)
delete_storage.addEventListener("click",deletingLocalStorage);
document.addEventListener("keydown",clearSavingsWithDel);
save.addEventListener("click",saveButton);


//=================================================================
//                        JQUERY THINGS
//=================================================================
$(".new_or_saved_btns").click(function(){
    $("#new_or_saved_section").fadeOut(500);
})
$("#tools").click(function(){
    $("#downAndUpArrow").removeClass("fa-caret-down")
    $("#downAndUpArrow").addClass("fa-caret-up")
    $("#drop_down").show()
})

$("#tools").mouseleave(function(){
    $("#downAndUpArrow").removeClass("fa-caret-up")
    $("#downAndUpArrow").addClass("fa-caret-down")
    $("#drop_down").hide()
})

$("#info_btn").mouseenter(function(){
    $("#info_box").show();
})

$("#info_btn").mouseleave(function(){
    $("#info_box").hide()
})