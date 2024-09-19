function isMobile() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;

	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return true;
	}

	if (/android/i.test(userAgent)) {
		return true;
	}

	return false;
}

if (isMobile()) {
	console.log('Possibly a smart phone.');
	document.getElementById('controls-arrow').style.display = 'block';

	// Set the canvas size to 300px x 300px
	document.getElementById('mazeCanvas').style.height = '300px';
	document.getElementById('mazeCanvas').style.width = '300px';
	document.getElementById('maze-container').style.height = '300px';
	document.getElementById('maze-container').style.width = '300px';
} else {
	console.log('Not a smart phone.');
}
