console.log("connected");


//gathering all the components on html 
// canvas, toolsBox, fillColor, sizeSlider, colors, clear btn and save btn

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvasBtn = document.querySelector("#clear-canvas");
const saveImgBtn = document.querySelector("#save-img");

//global variables
// variables to save previous mouse location
// variables to stop selectedTool, color, width;
let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let selectedColor = "#000";
let brushWidth = 5;
let undoBox = [];

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

// window.onresize = () => {
//   console.log("resizing windows")
//   canvas.width = canvas.offsetWidth;
//   canvas.height = canvas.offsetHeight;
//   setCanvasBackground()
// }


//on load event to set the current height and width to canvas
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});


//draw rectangular shape
const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};


//draw circle function
const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};


//draw trianble function
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};


//drawing function for all shapes and also brush and eraser
const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool == "rectangle") {
    drawRect(e);
  } else if (selectedTool == "circle") {
    drawCircle(e);
  } else if (selectedTool == "triangle") {
    drawTriangle(e);
  }
};



//toolbox btns event listener 
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    selectedTool = btn.id;
    btn.classList.add("active");
  });
});

//width of shapes 
sizeSlider.addEventListener("change", (e) => {
  brushWidth = sizeSlider.value;
});

//set changed color to current color
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

//color picker option
colorPicker.addEventListener("change", (e) => {
  e.target.parentElement.style.backgroundColor = e.target.value;
  selectedColor = e.target.value;
});

//clear button option
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
  setCanvasBackground();
});

//save image function
saveImgBtn.addEventListener("click", () => {
  let link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

//start draw function
const startDraw = (e) => {
  isDrawing = true;
  ctx.lineWidth = brushWidth;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

//stop draw function
const stopDraw = () => {
  isDrawing = false;
  undoBox.push(snapshot)
}

//canvas mouse functions
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);


//canvas touch functions
canvas.addEventListener("pointerdown", startDraw)
canvas.addEventListener("touchmove", e => {
  let XY = {
    offsetX: (e.touches[0].clientX - canvas.offsetLeft),
    offsetY: (e.touches[0].clientY - canvas.offsetTop)
  }
  console.log(e.touches['0'])
  drawing(XY)
});
canvas.addEventListener("pointerup", stopDraw);


// canvas.addEventListener("pointerdown", startDraw);
// canvas.addEventListener("pointermove", drawing);
// canvas.addEventListener("pointerup", stopDraw);


