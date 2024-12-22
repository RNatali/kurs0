const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const overlayCanvas = document.createElement('canvas');
const overlayCtx = overlayCanvas.getContext('2d');

// Синхронізація розмірів другого полотна
overlayCanvas.width = canvas.width;
overlayCanvas.height = canvas.height;
document.body.appendChild(overlayCanvas);
overlayCanvas.style.position = 'absolute';
overlayCanvas.style.left = canvas.offsetLeft + 'px';
overlayCanvas.style.top = canvas.offsetTop + 'px';
overlayCanvas.style.zIndex = '1';

let drawing = false;
let erasing = false;
let startX, startY;
let actions = [];

const colorPicker = document.getElementById('colorPicker');
const penSize = document.getElementById('penSize');
const drawModeButton = document.getElementById('drawMode');
const eraseModeButton = document.getElementById('eraseMode');
const clearCanvasButton = document.getElementById('clearCanvas');
const downloadButton = document.getElementById('download');
const imageLoader = document.getElementById('imageLoader');

let image = new Image();

// Початок малювання
function startDrawing(e) {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;

    overlayCtx.beginPath();
    overlayCtx.moveTo(startX, startY);
}

// Малювання
function draw(e) {
    if (!drawing) return;

    overlayCtx.lineWidth = penSize.value;
    overlayCtx.strokeStyle = colorPicker.value;

    if (erasing) {
        overlayCtx.globalCompositeOperation = 'destination-out';
        overlayCtx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Використовується для стирання
    } else {
        overlayCtx.globalCompositeOperation = 'source-over';
    }

    overlayCtx.lineTo(e.offsetX, e.offsetY);
    overlayCtx.stroke();
}

// Завершення малювання
function stopDrawing() {
    if (!drawing) return;
    drawing = false;

    // Збереження дії в масив
    actions.push(overlayCtx.getImageData(0, 0, overlayCanvas.width, overlayCanvas.height));
    overlayCtx.beginPath();
}

// Очистка малюнку олівця
function clearOverlay() {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
}

// Завантаження зображення
// Завантаження зображення
imageLoader.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        image.src = event.target.result;
        image.onload = function () {
            // Очистка полотна
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Обчислення масштабу для збереження пропорцій
            const aspectRatio = image.width / image.height;
            let newWidth = canvas.width;
            let newHeight = canvas.height;

            if (aspectRatio > 1) {
                // Горизонтальне зображення
                newHeight = canvas.width / aspectRatio;
            } else {
                // Вертикальне або квадратне зображення
                newWidth = canvas.height * aspectRatio;
            }

            const offsetX = (canvas.width - newWidth) / 2;
            const offsetY = (canvas.height - newHeight) / 2;

            // Малювання зображення з урахуванням пропорцій
            ctx.drawImage(image, offsetX, offsetY, newWidth, newHeight);

            // Очищення накладення
            clearOverlay();
            actions = [];
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});


// Завантаження полотна як зображення
function downloadCanvas() {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalCtx = finalCanvas.getContext('2d');

    // Злиття шарів
    finalCtx.drawImage(canvas, 0, 0);
    finalCtx.drawImage(overlayCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'canvas_image.png';
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
}

// Прив'язка подій
overlayCanvas.addEventListener('mousedown', startDrawing);
overlayCanvas.addEventListener('mousemove', draw);
overlayCanvas.addEventListener('mouseup', stopDrawing);
overlayCanvas.addEventListener('mouseout', stopDrawing);

drawModeButton.addEventListener('click', () => {
    erasing = false;
    overlayCanvas.style.cursor = 'crosshair';
});

eraseModeButton.addEventListener('click', () => {
    erasing = true;
    overlayCanvas.style.cursor = 'not-allowed';
});

clearCanvasButton.addEventListener('click', clearOverlay);
downloadButton.addEventListener('click', downloadCanvas);
