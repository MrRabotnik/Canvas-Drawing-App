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
let canvasURL,savingTimeOut,currentToolId;
let canvasIMG = [];
let saved_text = document.getElementById("saved");
let delete_storage = document.getElementById("delete_storage");
let yes_btn = document.getElementById("yes_btn")
let no_btn = document.getElementById("no_btn")
let img = document.getElementById("canvas_img");
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
    tool_paint_roller:"fas fa-paint-roller",
    tool_feather:"fas fa-feather-alt",
    tool_brush:"fas fa-paint-brush",
};
let cursorImages = {
    tool_pencil:"url('Images/pencil.png'),auto;",
    tool_fill:"url('Images/fill-color.png'),auto;",
    tool_square_fill:"",
    tool_square_stroke:"",
    tool_circle_fill:"",
    tool_circle_stroke:"",
}
let currentToolContainer = document.getElementById("currentToolContainer");
let CtrlPressed = false;
let autoSaveValue = document.getElementById("autosave").value;
let autoSave = document.getElementById("autosave");
let settingsBtn = document.getElementById("settings_btn")
let settings_drop_down = document.getElementById("settings_drop_down")
let settingsShowed = false

//=================================================================
//                        WINDOW ON LOAD FUNCTIONS
//=================================================================
canvas.width = W;
canvas.height = H;
ctx.beginPath();
ctx.lineWidth = size;
//Filling the color options
for(let i = 0;i < options.length;i++){
    options[i].style.backgroundColor = options[i].value;
}
if(localStorage.getItem("autoSaveEnabled")){
    localStorage.setItem("autoSaveEnabled",localStorage.getItem("autoSaveEnabled"));
    if(localStorage.getItem("autoSaveEnabled") == "notChecked"){
        autoSave.removeAttribute("checked")
    }
}else{
    localStorage.setItem("autoSaveEnabled","checked");
}
//=================================================================
//                        FUNCTIONS
//=================================================================
// $(window).resize(function(){
//     W = window.innerWidth - 3;
//     H = window.innerHeight - tool_container_height;
//     canvas.width = W;
//     canvas.height = H;
// })

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
    clearTimeout(savingTimeOut)
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
    console.log(undo_elements,index);
}

function Draw(e){
    if(!drawing) return;
    if(selected){
        eraserTool(e);
        return;
    }
    ctx.strokeStyle = color;
    switch(currentToolId){
        case "tool_pencil":
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;  
            ctx.lineCap = "round";
            ctx.lineTo(e.clientX,e.clientY - tool_container_height + 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX,e.clientY - tool_container_height + 4);
            break;
        case "tool_fill":
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;  
            // I DONT KNOW HOW LOL
            break;
        case "tool_paint_roller":
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;  
        
            break;
        case "tool_feather":
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;  
        
            break;
        case "tool_brush":
            ctx.shadowColor = color;
            ctx.shadowBlur = size;    
            ctx.lineCap = "round";
            ctx.lineTo(e.clientX,e.clientY - tool_container_height + 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX,e.clientY - tool_container_height + 4);
            break;
        case "tool_square_fill":
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;   
            break;
        case "tool_square_stroke":
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;   
            break;
        case "tool_circle_fill":
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;   
            break;
        case "tool_circle_stroke":
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;   
            break;
        default:   
            ctx.lineCap = "round";
            ctx.lineTo(e.clientX,e.clientY - tool_container_height + 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX,e.clientY - tool_container_height + 4);
            break;
    }
}

function eraserTool(e){
    ctx.strokeStyle = "#fff";
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX,e.clientY - tool_container_height + 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX,e.clientY - tool_container_height + 4);
}

function savingCanvasWithS(e){
    if(e.ctrlKey && e.key == "s"){
        e.preventDefault()
        canvasURL = canvas.toDataURL();
        localStorage.setItem("items", canvasURL);
        //Showing and hiding the SAVED text
        $(deleted_text).hide();
        $(saved_text).fadeIn(1000);
        setTimeout(() => {$(saved_text).fadeOut(1000)},3000);
    }
}

function saveButton(){
    canvasURL = canvas.toDataURL();
    localStorage.setItem("items", canvasURL);
    $(deleted_text).hide();
    $(saved_text).fadeIn(1000);
    setTimeout(() => {$(saved_text).fadeOut(1000)},3000);
}

function clearCanvasButton(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    eraser.style.backgroundColor = "rgb(245,245,245)";
    selected =  false;
    if(localStorage.getItem("autoSaveEnabled") == "checked"){
        savingTimeOut = setTimeout(saveButton,2000)
    }
}

function clearCanvasWithR(e){
    if(e.ctrlKey && e.key == "r"){
        e.preventDefault()
        ctx.clearRect(0,0,canvas.width,canvas.height);
        eraser.style.backgroundColor = "rgb(245,245,245)";
        selected =  false;
        if(localStorage.getItem("autoSaveEnabled") == "checked"){
            savingTimeOut = setTimeout(saveButton,2000)
        }
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

function applyingTools(){
    currentToolId = this.id
    currentToolContainer.innerHTML = ""
    currentToolContainer.innerHTML = `<i class="${toolSelection[currentToolId]}"></i>`;
    $("#canvas").css({
        cursor: cursorImages[currentToolId],
    })
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

function settingTheCanvasImage(){
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
}   

function deletingLocalStorage(){
    localStorage.removeItem("items");
    $(saved_text).hide();
    $(deleted_text).fadeIn(1000);
    setTimeout(() => {$(deleted_text).fadeOut(1000)},3000);
    undo_elements = [];
    index = -1;
}

function deleteSavingsWithDel(e){
    if(e.key == "Delete"){
        localStorage.removeItem("items");
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
        img.setAttribute("src",localStorage.getItem("items"));
    }else{
        img.setAttribute("src","");
    }
}

function savingCurrentCanvasForUndo(){
    let undo_elements_URL = canvas.toDataURL();
    undo_elements.push(undo_elements_URL);
    index++;
    if(localStorage.getItem("autoSaveEnabled") == "checked"){
        savingTimeOut = setTimeout(saveButton,2000)
    }
}

function undo(e){
    if(e.ctrlKey && e.key == "z"){
        e.preventDefault()
        undo_elements.pop()
        if(index == 0){
            ctx.clearRect(0,0,canvas.width,canvas.height)
            ctx.drawImage(img,0,0,canvas.width,canvas.height)
            index = -1;
            console.log("Array empty")
        }else if(index > 0){
            index--
            img.setAttribute("src",undo_elements[index]);  
            console.log(img)
            ctx.clearRect(0,0,canvas.width,canvas.height)
            console.log(ctx)
            ctx.drawImage(img,0,0,canvas.width,canvas.height)
        }
        console.log(undo_elements,index);
    }
}

function redo(e){
    if(e.ctrlKey && e.key == "y"){
        console.log("Redo")
    }
}

function autoSaveing(){
    if(localStorage.getItem("autoSaveEnabled") == "checked"){
        localStorage.setItem("autoSaveEnabled","notChecked");
    }else{
        localStorage.setItem("autoSaveEnabled","checked");
    }
}

//=================================================================
//                        CALLING THE FUNCTIONS
//=================================================================
canvas.addEventListener("mousedown",startDrawing);
canvas.addEventListener("mousemove",Draw);
document.addEventListener("mouseup",endDrawing);
// save.addEventListener("click",saveButton);
document.addEventListener("keydown",savingCanvasWithS);
btn.addEventListener("click",clearCanvasButton);
document.addEventListener("keydown",clearCanvasWithR);
sizeSelect.addEventListener("change",changeSize);
colorSelect.addEventListener("change",changeColor);
colorSelect.addEventListener("mouseover",() => {colorSelect.style.boxShadow = `0 0 1vw ${color}`;})
colorSelect.addEventListener("mouseout",() => {colorSelect.style.boxShadow = `none`;})
eraser.addEventListener("click",selectingEraser);
canvas.addEventListener("mouseleave",() => {ctx.beginPath()});
// canvas.addEventListener("mousemove",movingTool);
canvas.addEventListener("mouseup",savingCurrentCanvasForUndo)
document.addEventListener("keydown",undo);
document.addEventListener("keydown",redo);
window.addEventListener("load",checkingLocalStorage)
yes_btn.addEventListener("click",settingTheCanvasImage)
delete_storage.addEventListener("click",deletingLocalStorage);
document.addEventListener("keydown",deleteSavingsWithDel);
autoSave.addEventListener("change",autoSaveing);


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

$("#settings_btn").click(function(){
    if(settingsShowed){
        $("#settings_drop_down").hide()
        settingsShowed = false
    }else{
        $("#settings_drop_down").show();
        settingsShowed = true
    }
})

$("#canvas").click(function(){
    $("#settings_drop_down").hide()
    settingsShowed = false
})

$(".tool_favicon_container").click(applyingTools)