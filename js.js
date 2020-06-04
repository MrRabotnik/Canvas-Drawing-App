//=================================================================
//                        DEFINING VARIABLES
//=================================================================
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let tool_container_height = document.getElementById("tools_container").offsetHeight
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
let canvasURL,savingTimeOut,currentToolId,elem;
let canvasIMG = [];
let saved_text = document.getElementById("saved");
let delete_storage = document.getElementById("delete_storage");
let yes_btn = document.getElementById("yes_btn");
let no_btn = document.getElementById("no_btn");
let img = document.getElementById("canvas_img");
let save = document.getElementById("save");
let deleted_text = document.getElementById("deleted");
let undo_elements = [];
let index = -1;
let dropDown = document.getElementById("drop_down");
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
    tool_text:"fas fa-keyboard",
    tool_zoom_in:"fas fa-search-plus",
    tool_zoom_out:"fas fa-search-minus",
    tool_line:"fas fa-slash",
    tool_color_picker:"fas fa-eye-dropper",
};
let cursorImages = {
    tool_pencil:"url(Images/pencil.png),auto;",
    tool_fill:"url(Images/fill-color.png),auto;",
    tool_square_fill:"",
    tool_square_stroke:"",
    tool_circle_fill:"",
    tool_circle_stroke:"",
    tool_paint_roller:"",
    tool_feather:"",
    tool_brush:"",
    tool_text:"",
    tool_zoom_in:"",
    tool_zoom_out:"",
}
let currentToolContainer = document.getElementById("currentToolContainer");
let CtrlPressed = false;
let autoSaveValue = document.getElementById("autosave").value;
let autoSave = document.getElementById("autosave");
let settingsBtn = document.getElementById("settings_btn")
let settings_drop_down = document.getElementById("settings_drop_down")
let settingsShowed = false
let topMouseX,topMouseY,bottomMouseX,bottomMouseY,customAttributeValue,canvasLeavedX,canvasLeavedYt;
let shape_boxes_arr = document.getElementsByClassName("shape_box")
let square_fill = document.getElementsByClassName("shape_box")[0]
let square_stroke = document.getElementsByClassName("shape_box")[1]
let circle_fill = document.getElementsByClassName("shape_box")[2]
let circle_stroke = document.getElementsByClassName("shape_box")[3]
let text_box = document.getElementById("text_box_before_drawing");
let line_tool_box = document.getElementsByClassName("shape_box")[4];
let blue_pressed = false
let canvasLeaved = false
let canvasW,canvasH,backupCanvasImage;

//=================================================================
//                        WINDOW ON LOAD FUNCTIONS
//=================================================================
window.addEventListener("load",checkingLocalStorage)
canvas.width = W;
canvas.height = H - 4;
canvasW = canvas.width
canvasH = canvas.height
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
square_fill.id = "square_fill_shape_box_before_drawing";
square_stroke.id = "square_stroke_shape_box_before_drawing";
circle_fill.id = "circle_fill_shape_box_before_drawing";
circle_stroke.id = "circle_stroke_shape_box_before_drawing";
line_tool_box.id = "line_box_before_drawing";

//=================================================================
//                        FUNCTIONS
//=================================================================
// $(window).resize(function(){
//     W = window.innerWidth - 3;
//     H = window.innerHeight - tool_container_height;
//     canvas.width = W;
//     canvas.height = H;
// })
 
function startDrawing(e) {
    drawing = true;
    if(e.which == 3){
        eraser.style.backgroundColor = "#ccc";
        selected =  true;
        e.preventDefault();
    }else if(customAttributeValue == "shapes"){
            topMouseX = e.clientX
            topMouseY = e.clientY
    };
    clearTimeout(savingTimeOut)
    backupCanvasImage = canvas.toDataURL();
    if(currentToolId !== "tool_line"){
        Draw(e);
    }
}

function endDrawing(e) {
    if(e.which == 3){
        selected =  false
        eraser.style.backgroundColor = "rgb(245,245,245)";
    }else if(!selected){
        if(customAttributeValue == "shapes"){
            if(canvasLeaved){
                bottomMouseX = canvasLeavedX
                bottomMouseY = canvasLeavedY
            }else{
                bottomMouseX = e.clientX
                bottomMouseY = e.clientY
            }
            shapeBoxDrawing = false
            if(drawing){
                drawingDecidedShape()
            }
        } 
    }
    drawing = false;
    canvasLeaved = false
    ctx.beginPath();
}

function Draw(e){
    if(!drawing) return;
    if(selected){
        eraserTool(e);
        return;
    }
    ctx.strokeStyle = color;
    canvasLeavedX = e.clientX
    canvasLeavedY = e.clientY
    localStorage.setItem("cleared","notCleared")
    switch(currentToolId){
        case "tool_pencil":
            nulifyingEverythingWithTools();  
            ctx.lineCap = "round";
            ctx.lineTo(e.clientX,e.clientY - tool_container_height + 0.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX,e.clientY - tool_container_height + 0.5);
            break;
        case "tool_fill":
            nulifyingEverythingWithTools();  
            break;
        case "tool_paint_roller":
            nulifyingEverythingWithTools();  
            ctx.lineWidth = 10;
            ctx.lineCap = "butt";
            ctx.moveTo(e.clientX - size,e.clientY - tool_container_height + 0.5)
            ctx.lineTo(Number(e.clientX) + Number(size),e.clientY - tool_container_height + 0.5 )
            ctx.stroke()
            ctx.beginPath()
            break;
        case "tool_feather":
            nulifyingEverythingWithTools();  
            ctx.lineWidth = 2;
            ctx.lineCap = "butt";
            size = document.getElementById("size").value;
            ctx.moveTo(e.clientX - size,e.clientY - tool_container_height + size/2)
            ctx.lineTo(Number(e.clientX) + Number(size),e.clientY - tool_container_height + 0.5 - 20)
            ctx.stroke()
            ctx.beginPath()
            break;
        case "tool_brush":
            ctx.shadowColor = color;
            ctx.shadowBlur = size;    
            ctx.lineCap = "round";
            ctx.lineTo(e.clientX,e.clientY - tool_container_height + 0.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX,e.clientY - tool_container_height + 0.5);
            break;
        case "tool_text":
            nulifyingEverythingWithTools();   
            showingBoxBeforeDrawingShape(e,"text_box_before_drawing");
            break;
        case "tool_line":
            nulifyingEverythingWithTools();   
            elem = document.getElementById("line_box_before_drawing");
            ctx.clearRect(0,0,canvas.width,canvas.height)
            img.setAttribute("src",backupCanvasImage)
            ctx.drawImage(img,0,0,canvas.width,canvas.height)
            ctx.moveTo(topMouseX,topMouseY - tool_container_height)
            ctx.lineTo(e.clientX,e.clientY - tool_container_height)
            ctx.stroke()
            ctx.beginPath()
            break;
        case "tool_color_picker":
            nulifyingEverythingWithTools();   
            break;
        case "tool_square_fill":
            nulifyingEverythingWithTools(); 
            showingBoxBeforeDrawingShape(e,"square_fill_shape_box_before_drawing");
            break;
        case "tool_square_stroke":
            nulifyingEverythingWithTools(); 
            showingBoxBeforeDrawingShape(e,"square_stroke_shape_box_before_drawing");
            break;
        case "tool_circle_fill":
            nulifyingEverythingWithTools(); 
            showingBoxBeforeDrawingShape(e,"circle_fill_shape_box_before_drawing");
            break;
        case "tool_circle_stroke":
            nulifyingEverythingWithTools(); 
            showingBoxBeforeDrawingShape(e,"circle_stroke_shape_box_before_drawing");
            break;
        case "tool_zoom_in":
            nulifyingEverythingWithTools();  
            break;
        case "tool_zoom_out":
            nulifyingEverythingWithTools();  
            break;
        default:   
            nulifyingEverythingWithTools(); 
            ctx.lineCap = "round";
            ctx.lineTo(e.clientX,e.clientY - tool_container_height + 0.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX,e.clientY - tool_container_height + 0.5);
            break;
    }
}

function nulifyingEverythingWithTools(){
    ctx.shadowBlur = 0;   
}

function eraserTool(e){
    nulifyingEverythingWithTools();
    changeSize()
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
    setTimeout(() => {$(saved_text).fadeOut(1000)},2000);
}

function clearCanvasButton(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    eraser.style.backgroundColor = "rgb(245,245,245)";
    selected =  false;
    if(localStorage.getItem("autoSaveEnabled") == "checked"){
        savingTimeOut = setTimeout(saveButton,1000)
    }
    shape_boxes_arr[shape_boxes_arr.length - 1].style.display = "none";
    localStorage.setItem("cleared","cleared")
    text_box.style.display = "none";
}

function clearCanvasWithR(e){
    if(e.ctrlKey && e.key == "r"){
        e.preventDefault()
        ctx.clearRect(0,0,canvas.width,canvas.height);
        eraser.style.backgroundColor = "rgb(245,245,245)";
        selected =  false;
        if(localStorage.getItem("autoSaveEnabled") == "checked"){
            savingTimeOut = setTimeout(saveButton,1000)
        }
        shape_boxes_arr[shape_boxes_arr.length - 1].style.display = "none";
        localStorage.setItem("cleared","cleared")
        text_box.style.display = "none";
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
    customAttributeValue = this.getAttribute("data-class")
    currentToolContainer.innerHTML = ""
    currentToolContainer.innerHTML = `<i class="${toolSelection[currentToolId]}"></i>`;
    $("#canvas").css({
        cursor: cursorImages[currentToolId],
    })
    changeSize();
    changeColor();
    text_box.style.display = "none";
}

function typingInTextBox(e){
    text_box.style.fontSize = `${(bottomMouseY - topMouseY)/2}px`;
    if(e.key == "Enter"){
        text_box.style.display = "none";
        ctx.font = `${(bottomMouseY - topMouseY)/2}px Arial`
        ctx.fillText(text_box.value, topMouseX,topMouseY + (bottomMouseY - topMouseY)/4);
    }
}

function showingBoxBeforeDrawingShape(e,currentBox){
    elem = document.getElementById(currentBox)
    if(e.clientX < topMouseX + 1 && e.clientY > topMouseY + 1){
        elem.style.display = "block";
        elem.style.left = `${e.clientX}px`;
        elem.style.top = `${topMouseY}px`;
        elem.style.width = `${topMouseX - e.clientX}px`;
        elem.style.height = `${e.clientY - topMouseY}px`;
    }else if(e.clientX > topMouseX + 1 && e.clientY < topMouseY + 1){
        elem.style.display = "block";
        elem.style.left = `${topMouseX}px`;
        elem.style.top = `${e.clientY}px`;
        elem.style.width = `${e.clientX - topMouseX}px`;
        elem.style.height = `${topMouseY - e.clientY}px`;
    }else if(e.clientX < topMouseX + 1 && e.clientY < topMouseY + 1){
        elem.style.display = "block";
        elem.style.left = `${e.clientX}px`;
        elem.style.top = `${e.clientY}px`;
        elem.style.width = `${topMouseX - e.clientX}px`;
        elem.style.height = `${topMouseY - e.clientY}px`;
    }else{
        elem.style.display = "block";
        elem.style.left = `${topMouseX}px`;
        elem.style.top = `${topMouseY}px`;
        elem.style.width = `${e.clientX - topMouseX}px`;
        elem.style.height = `${e.clientY - topMouseY}px`;
    }
}

function drawingDecidedShape(){
    for(let i = 0; i < shape_boxes_arr.length;i++){
        shape_boxes_arr[i].style.display = "none";
    }
    let startX = topMouseX;
    let startY = topMouseY - tool_container_height;
    let endX = bottomMouseX - topMouseX;
    let endY = bottomMouseY - topMouseY;
    ctx.fillStyle = color;
    switch(elem.id){
        case "square_fill_shape_box_before_drawing":
            if(blue_pressed){
                ctx.shadowColor = color;
                ctx.shadowBlur = size;   
            }
            ctx.fillRect(startX,startY,endX,endY);
            ctx.fill();
            break;
        case "square_stroke_shape_box_before_drawing":
            if(blue_pressed){
                ctx.shadowColor = color;
                ctx.shadowBlur = size;   
            }
            ctx.strokeRect(startX + Math.floor(sizeSelect.value/2),startY + Math.floor(sizeSelect.value/2),endX - Math.floor(sizeSelect.value),endY - Math.floor(sizeSelect.value));
            ctx.stroke();
            break;
        case "circle_fill_shape_box_before_drawing":
            if(blue_pressed){
                ctx.shadowColor = color;
                ctx.shadowBlur = size;   
            }
            if(endX < 0 && endY > 0){
                endX = Math.abs(endX)
                ctx.arc(startX - endX/2,startY + endY/2,endX/2,0,2 * Math.PI);
            }else if(endX < 0 && endY < 0){
                endX = Math.abs(endX)
                endY = Math.abs(endY)
                ctx.arc(startX - endX/2,startY - endY/2,endX/2,0,2 * Math.PI);
            }else{
                ctx.arc(startX + endX/2,startY + endY/2,endX/2,0,2 * Math.PI); 
            }
            ctx.fill()
            break;
        case "circle_stroke_shape_box_before_drawing":
            if(blue_pressed){
                ctx.shadowColor = color;
                ctx.shadowBlur = size;   
            }
            if(endX < 0 && endY > 0){
                endX = Math.abs(endX)
                ctx.arc(startX - endX/2,startY + endY/2,endX/2,0,2 * Math.PI);
            }else if(endX < 0 && endY < 0){
                endX = Math.abs(endX)
                endY = Math.abs(endY)
                ctx.arc(startX - endX/2,startY - endY/2,endX/2,0,2 * Math.PI);
            }else{
                ctx.arc(startX + endX/2,startY + endY/2,endX/2,0,2 * Math.PI);
            }
            ctx.stroke()
            break;
        case "line_box_before_drawing":
            if(blue_pressed){
                ctx.shadowColor = color;
                ctx.shadowBlur = size;   
            }
            ctx.lineCap = "round"; 
            ctx.lineWidth = size;
            ctx.strokeStyle = color;
            ctx.moveTo(topMouseX,topMouseY - tool_container_height)
            ctx.lineTo(bottomMouseX,bottomMouseY - tool_container_height)
            ctx.stroke()
            break;
        default:
            break;
    }
}

function blurSelecting(e){
    if(e.key = "b"){
        blue_pressed = true
    }
}

function blurDeselecting(e){
    if(e.key = "b"){
        blue_pressed = false
    }
}

function zoomInAndOut(){
    if(currentToolId == "tool_zoom_in"){
        canvas.width = canvasW + 200
        canvas.height = canvasH + 100
        canvasW = canvas.width
        canvasH = canvas.height
    }else if(currentToolId == "tool_zoom_out"){
        console.log(canvas.width,W)
        canvas.width = canvasW - 200
        canvas.height = canvasH - 100
        canvasW = canvas.width
        canvasH = canvas.height
    }
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
    setTimeout(() => {$(deleted_text).fadeOut(1000)},2000);
    undo_elements = [];
    index = -1;
}

function deleteSavingsWithDel(e){
    if(e.key == "Delete"){
        localStorage.removeItem("items");
        $(saved_text).hide();
        $(deleted_text).fadeIn(1000);
        setTimeout(() => {$(deleted_text).fadeOut(1000)},2000);
        undo_elements = [];
        index = -1;
    }
}

function checkingLocalStorage(){
    if(localStorage.getItem("items") && localStorage.getItem("cleared") == "notCleared"){
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
        if(index == 0){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if(localStorage.getItem("items")){
                img.setAttribute("src",localStorage.getItem("items"));  
            }else{
                img.setAttribute("src","");  
            }
            ctx.drawImage(img,0,0,canvas.width,canvas.height)
            index = -1;
        }else if(index > 0){
            index--
            img.setAttribute("src",undo_elements[index]);  
            
            ctx.drawImage(img,0,0,canvas.width,canvas.height)
        }
        console.log(index)
    }
}

function redo(e){
    if(e.ctrlKey && e.key == "y"){
        if(index < undo_elements.length - 1){
            index++
            img.setAttribute("src",undo_elements[index]);  
            ctx.drawImage(img,0,0,canvas.width,canvas.height)
        }
        console.log(undo_elements)
    }
}

function autoSaveing(){
    if(localStorage.getItem("autoSaveEnabled") == "checked"){
        localStorage.setItem("autoSaveEnabled","notChecked");
    }else{
        localStorage.setItem("autoSaveEnabled","checked");
    }
}


function leavingCanvas(e){
    ctx.beginPath();
    canvasLeaved = true
}




//=================================================================
//                        CALLING THE FUNCTIONS
//=================================================================
//Mouse and Key Down
canvas.addEventListener("mousedown",startDrawing);
document.addEventListener("keydown",savingCanvasWithS);
document.addEventListener("keydown",clearCanvasWithR);
document.addEventListener("keydown",undo);
document.addEventListener("keydown",redo);
document.addEventListener("keydown",deleteSavingsWithDel);
text_box.addEventListener("keypress",typingInTextBox)
document.addEventListener("keydown",blurSelecting)

//Mouse and Key Up
document.addEventListener("mouseup",endDrawing);
canvas.addEventListener("mouseup",savingCurrentCanvasForUndo)
document.addEventListener("keyup",blurDeselecting)

//Mouse move,over,out, leave
canvas.addEventListener("mousemove",Draw);
colorSelect.addEventListener("mouseover",() => {colorSelect.style.boxShadow = `0 0 1vw ${color}`;})
colorSelect.addEventListener("mouseout",() => {colorSelect.style.boxShadow = `none`;})
canvas.addEventListener("mouseleave",leavingCanvas);

//Click, change and focus
eraser.addEventListener("click",selectingEraser);
canvas.addEventListener("click",zoomInAndOut)
yes_btn.addEventListener("click",settingTheCanvasImage)
delete_storage.addEventListener("click",deletingLocalStorage);
autoSave.addEventListener("change",autoSaveing);
text_box.addEventListener("focus",typingInTextBox)
btn.addEventListener("click",clearCanvasButton);
sizeSelect.addEventListener("change",changeSize);
colorSelect.addEventListener("change",changeColor);
// save.addEventListener("click",saveButton);
 
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
    $("#settings_drop_down").hide()
    settingsShowed = false
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

$(".shape_box").mousemove(function(e){
    $(this).css({
        width:`${e.clientX - topMouseX}px`,
        height:`${e.clientY - topMouseY}px`,
    })
});