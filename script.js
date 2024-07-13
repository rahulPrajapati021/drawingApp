console.log("connected");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const toolBtns = document.querySelectorAll(".tool")
const fillColor = document.querySelector("#fill-color")
const sizeSlider = document.querySelector("#size-slider")
const colorBtns = document.querySelectorAll(".colors .option")
const colorPicker = document.querySelector("#color-picker")
const clearCanvasBtn = document.querySelector("#clear-canvas")
const saveImgBtn = document.querySelector("#save-img")

//global variables
let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let selectedColor = "#000";
let brushWidth = 5;


const setCanvasBackground = () => {
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
}

// window.onresize = () => {
//   console.log("resizing windows")
//   canvas.width = canvas.offsetWidth;
//   canvas.height = canvas.offsetHeight;
//   setCanvasBackground()
// }


window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground()
});


const drawRect = (e) => {
  if(!fillColor.checked) {
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
  }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
  ctx.beginPath()
  let radius = Math.sqrt(Math.pow((prevMouseX-e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked?ctx.fill():ctx.stroke();
}


const drawTriangle = (e) => {
  ctx.beginPath()
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked?ctx.fill():ctx.stroke();

}


const drawing = (e) => {
  if (!isDrawing) return;

  ctx.putImageData(snapshot, 0, 0);

  if(selectedTool === "brush" || selectedTool === "eraser") {
      ctx.strokeStyle = (selectedTool==="eraser")?"#fff":selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
    else if(selectedTool == "rectangle") {
        drawRect(e);
    }
    else if(selectedTool == "circle") {
        drawCircle(e);
    }
    else if(selectedTool == "triangle") {
        drawTriangle(e);
    }
};


toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active")
        selectedTool = btn.id
        btn.classList.add("active")
    })
})


sizeSlider.addEventListener("change", (e) => {
  brushWidth = sizeSlider.value
})

colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
  })
})

colorPicker.addEventListener("change", (e) => {
  e.target.parentElement.style.backgroundColor = e.target.value;
  selectedColor = e.target.value;
})


clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height) // clearing whole canvas
  setCanvasBackground()
})
saveImgBtn.addEventListener("click", () => {
  let link = document.createElement("a")
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click()
})



canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  ctx.lineWidth = brushWidth;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
});
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));




