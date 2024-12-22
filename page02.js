function showModal(type) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    
    if (type === 'contacts') {
        modalText.innerHTML = "<p>Телефони:</p><p>+380123456789</p> <p>+380145332155</p> <p>+380135871345</p> <p>Email:</p><p>editease@gmail.com</p>";
    } else if (type === 'about') {
        modalText.innerHTML = "<p>Наш сервіс — це зручний онлайн-інструмент для редагування зображень. Ви можете легко обрізати фото, додавати текст, застосовувати ефекти та малювати прямо на зображенні. Простий інтерфейс і широкі можливості допоможуть створити унікальні візуальні матеріали без спеціальних навичок.</p><p>Спробуйте вже зараз!</p>";
    }

    modal.classList.remove('hidden'); // Відкриваємо модальне вікно
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden'); // Закриваємо модальне вікно
}
