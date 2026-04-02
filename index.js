const startButton = document.getElementById('startButton');
const loaderOverlay = document.getElementById('loaderOverlay');

startButton.addEventListener('click', () => {
	loaderOverlay.classList.remove('hidden');
	loaderOverlay.classList.add('flex');

	setTimeout(() => {
		window.location.href = 'main.html';
	}, 2000);
});
