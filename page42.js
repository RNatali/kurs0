let canvas = document.getElementById('imageCanvas');
let ctx = canvas.getContext('2d');
let imageLoader = document.getElementById('imageLoader');
let textColor = document.getElementById('textColor');
let textSize = document.getElementById('textSize');
let currentImage = null;
let textEntries = [];

let textInput = document.createElement('input');
textInput.type = 'text';
textInput.id = 'textInput';
document.body.appendChild(textInput);

imageLoader.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const maxWidth = 600; // Максимальна ширина полотна
            const maxHeight = 400; // Максимальна висота полотна

            let width = img.width;
            let height = img.height;

            const aspectRatio = img.width / img.height;

            // Збільшуємо маленькі фото, але зберігаємо пропорції
            if (width < maxWidth && height < maxHeight) {
                if (aspectRatio > 1) {
                    // Горизонтальне зображення
                    width = maxWidth;
                    height = maxWidth / aspectRatio;
                } else {
                    // Вертикальне або квадратне зображення
                    height = maxHeight;
                    width = maxHeight * aspectRatio;
                }
            } else if (width > maxWidth || height > maxHeight) {
                // Зменшуємо великі зображення
                const scale = Math.min(maxWidth / width, maxHeight / height);
                width *= scale;
                height *= scale;
            }

            // Оновлення розмірів полотна
            canvas.width = maxWidth;
            canvas.height = maxHeight;

            // Центрування зображення
            const offsetX = (canvas.width - width) / 2;
            const offsetY = (canvas.height - height) / 2;

            // Малюємо зображення
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, width, height);
            currentImage = { img, offsetX, offsetY, width, height };

            // Перемальовуємо текст, якщо він є
            redrawCanvas();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});


canvas.addEventListener('click', function(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    textInput.style.left = `${e.clientX}px`;
    textInput.style.top = `${e.clientY}px`;
    textInput.style.fontSize = textSize.value + 'px';
    textInput.style.color = textColor.value;
    textInput.style.display = 'block';
    textInput.focus();

    textInput.dataset.x = x;
    textInput.dataset.y = y;
});

function saveText() {
    let text = textInput.value;
    let x = textInput.dataset.x;
    let y = textInput.dataset.y;

    if (text) {
        // Зберігаємо текстові дані
        textEntries.push({
            text,
            x: parseInt(x),
            y: parseInt(y),
            size: textSize.value,
            color: textColor.value
        });

        // Оновлюємо полотно
        redrawCanvas();
    }

    // Ховаємо текстове поле
    textInput.style.display = 'none';
    textInput.value = '';
}


function removeLastText() {
    if (textEntries.length > 0) {
        textEntries.pop();
        redrawCanvas();
    }
}

function redrawCanvas() {
    // Очищаємо полотно
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Перемальовуємо зображення
    if (currentImage) {
        const { img, offsetX, offsetY, width, height } = currentImage;
        ctx.drawImage(img, offsetX, offsetY, width, height);
    }

    // Додаємо всі текстові записи
    textEntries.forEach(entry => {
        ctx.font = `${entry.size}px Arial`;
        ctx.fillStyle = entry.color;
        ctx.fillText(entry.text, entry.x, entry.y);
    });
}

// Undo last text
undoButton.addEventListener('click', () => {
    textEntries.pop();
    redrawCanvas();
});

// Save image
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'canvas_image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
function downloadImage() {
    let link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
}
