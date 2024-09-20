/**
 * Checks if the current device is a mobile device.
 *
 * This function examines the user agent string to determine if the device
 * is an iOS or Android device.
 *
 * @returns {boolean} Returns true if the device is a mobile device, otherwise false.
 */
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
