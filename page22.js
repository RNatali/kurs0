const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const selectedImage = document.getElementById('selectedImage');
const grayscaleButton = document.getElementById('grayscaleButton');
const saturateButton = document.getElementById('saturateButton');
const clearEffectButton = document.getElementById('clearEffectButton');
const downloadButton = document.getElementById('downloadButton');

let originalCanvas, originalCtx;
let originalImage = new Image(); // Зберігаємо оригінальне зображення

// Встановлення максимальних розмірів для зображення
const MAX_WIDTH = 500; // Максимальна ширина
const MAX_HEIGHT = 400; // Максимальна висота

// Обробка вибору зображення
uploadButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            originalImage.src = e.target.result;

            originalImage.onload = function () {
                // Масштабування зображення для дотримання заданих розмірів
                const ratio = Math.min(MAX_WIDTH / originalImage.width, MAX_HEIGHT / originalImage.height);
                const width = originalImage.width * ratio;
                const height = originalImage.height * ratio;

                // Створюємо canvas для обробки зображення
                originalCanvas = document.createElement('canvas');
                originalCtx = originalCanvas.getContext('2d');

                // Встановлюємо розмір canvas відповідно до масштабованого зображення
                originalCanvas.width = width;
                originalCanvas.height = height;

                // Малюємо зображення на canvas
                originalCtx.drawImage(originalImage, 0, 0, width, height);

                // Встановлюємо джерело зображення
                selectedImage.src = originalCanvas.toDataURL();
                selectedImage.style.display = 'block';

                // Показуємо кнопки
                grayscaleButton.style.display = 'inline-block';
                saturateButton.style.display = 'inline-block';
                clearEffectButton.style.display = 'inline-block';
                downloadButton.style.display = 'inline-block';
            };
        };
        reader.readAsDataURL(file);
    }
});

// Додавання чорно-білого ефекту
grayscaleButton.addEventListener('click', () => {
    originalCtx.filter = 'grayscale(100%)'; // Застосовуємо чорно-білий ефект
    originalCtx.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height); // Перемальовуємо зображення
    selectedImage.src = originalCanvas.toDataURL(); // Оновлюємо джерело зображення
});

// Додавання яскравого ефекту
saturateButton.addEventListener('click', () => {
    originalCtx.filter = 'saturate(200%)'; // Додаємо ефект насиченості
    originalCtx.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height); // Перемальовуємо зображення з ефектом
    selectedImage.src = originalCanvas.toDataURL(); // Оновлюємо джерело зображення
});

// Очищення ефектів
clearEffectButton.addEventListener('click', () => {
    originalCtx.filter = 'none'; // Скидаємо фільтр до значення за замовчуванням
    originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height); // Очищаємо canvas
    originalCtx.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height); // Малюємо оригінальне зображення
    selectedImage.src = originalCanvas.toDataURL(); // Оновлюємо джерело зображення
});


// Завантаження обробленого зображення
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = originalCanvas.toDataURL();
    link.download = 'оброблене-зображення.png';
    link.click();
});

document.getElementById('uploadButton').addEventListener('click', function() {
    // Додати клас для анімації після першого натискання
    this.classList.add('moved');
});

