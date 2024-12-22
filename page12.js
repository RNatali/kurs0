const inputImage = document.getElementById('inputImage'); 
const image = document.getElementById('image');
const cropButton = document.getElementById('cropButton');
const downloadButton = document.getElementById('downloadButton');
let cropper;

inputImage.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
            if (cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(image, {
                aspectRatio: NaN, // Вимкнути обмеження на співвідношення сторін
                viewMode: 0, // Вимкнути обмеження на видимість обрізки
                autoCropArea: 1, // Показуємо повне зображення
                movable: true, // Дозволяємо переміщати область обрізки
                cropBoxMovable: true, // Дозволяємо переміщати саму область
                cropBoxResizable: true, // Дозволяємо змінювати розмір області
            });
            downloadButton.style.display = 'none'; // Сховати кнопку завантаження при новому завантаженні зображення
        };
        reader.readAsDataURL(files[0]);
    }
});

cropButton.addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas();
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        downloadButton.style.display = 'block'; // Показати кнопку завантаження
        downloadButton.textContent = 'Завантажити'; // Встановити текст для кнопки завантаження
        downloadButton.onclick = () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cropped_image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a); // Видалити елемент з документа
        };
    });
});