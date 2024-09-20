let player = { x: 1, y: 1 };
let Q = {}; // Q Table
const alpha = 0.1; // Learning rate
const gamma = 0.9; // Discount factor
const directions = ['up', 'down', 'left', 'right'];

// This function calculates the Manhattan distance between two points.
function getManhattanDistance(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Initial drawing of the player
function drawPlayer() {
	ctx.fillStyle = 'blue';
	ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function drawGoal() {
	ctx.fillStyle = 'yellow'; // Goal position in yellow
	ctx.fillRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);
}

// Added display of the current cell's Q table to the player movement process
function movePlayer(direction) {
	let newX = player.x;
	let newY = player.y;

	if (direction === 'up' && maze[player.y - 1][player.x] === 0) newY--;
	if (direction === 'down' && maze[player.y + 1][player.x] === 0) newY++;
	if (direction === 'left' && maze[player.y][player.x - 1] === 0) newX--;
	if (direction === 'right' && maze[player.y][player.x + 1] === 0) newX++;

	if (maze[newY][newX] === 0) {
		const prevState = `${player.x},${player.y}`;
		const newState = `${newX},${newY}`;

		const distanceBefore = getManhattanDistance(player.x, player.y, goal.x, goal.y);
		const distanceAfter = getManhattanDistance(newX, newY, goal.x, goal.y);
		let reward;

		if (newX === goal.x && newY === goal.y) {
			reward = 100; // If the player reaches the goal, the reward is 100.
		} else {
			reward = distanceBefore - distanceAfter; // Reward based on change in distance
			if (reward <= 0) {
				reward = -1; // Penalty for increased distance or no change
			}
		}

		if (!Q[prevState]) Q[prevState] = { up: 0, down: 0, left: 0, right: 0 };
		if (!Q[newState]) Q[newState] = { up: 0, down: 0, left: 0, right: 0 };
		const maxQ = Math.max(...Object.values(Q[newState]));

		Q[prevState][direction] += alpha * (reward + gamma * maxQ - Q[prevState][direction]);

		player.x = newX;
		player.y = newY;
		drawMaze();
		drawPlayer();

		// Display the Q table for the current square in HTML
		displayCurrentQTable(newState);

		// Goal Reach Check
		if (newX === goal.x && newY === goal.y) {
			const regenerateStages = document.getElementById('regenerateStages');

			if (regenerateStages.checked) {
				alert('Cleared!');
				player.x = 1;
				player.y = 1;
				drawPlayer();
				drawGoal();
				displayCurrentQTable(`${player.x},${player.y}`);
				return;
			}

			alert('Cleared! Proceed to the next stage.');
			levelUp();
			displayCurrentQTable(`${player.x},${player.y}`);
		}
	}
}

// Function to display the Q table of the current square in HTML
function displayCurrentQTable(state) {
	const qTableContent = document.getElementById('qTableContent');
	let content = `State ${state}:\n`;

	// Displays information in the Q table for the current square
	if (Q[state]) {
		for (const action in Q[state]) {
			content += `  ${action}: ${Q[state][action].toFixed(2)}\n`;
		}
	} else {
		content += '  There is no Q-value.\n';
	}

	qTableContent.textContent = content; // Display the content in the HTML element
}

// Player keyboard operation
document.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'ArrowUp':
			movePlayer('up');
			break;
		case 'ArrowDown':
			movePlayer('down');
			break;
		case 'ArrowLeft':
			movePlayer('left');
			break;
		case 'ArrowRight':
			movePlayer('right');
			break;
	}
});

// Level up process
function levelUp() {
	player.x = 1;
	player.y = 1;
	let level = parseInt(localStorage.getItem('mazeLevel') || '1');
	localStorage.setItem('mazeLevel', level + 1);
	mazeSize = getMazeSize();
	generateMaze(mazeSize, mazeSize);
	drawPlayer();
}

// Reset the level
function resetLevel() {
	player.x = 1;
	player.y = 1;

	if (localStorage.getItem('mazeLevel') === '1') {
		alert('You are already at the first level.');
		return;
	}

	localStorage.setItem('mazeLevel', 1);
	mazeSize = getMazeSize();
	generateMaze(mazeSize, mazeSize);
	drawPlayer();
}

// Player and goal initial display
generateMaze(mazeSize, mazeSize);
drawPlayer();

// Display the Q table for the initial position of the player
displayCurrentQTable(`${player.x},${player.y}`);

document.getElementById('resetLevel').addEventListener('click', resetLevel);

// Control buttons for smartphones
document.getElementById('left').addEventListener('click', () => movePlayer('left'));
document.getElementById('up').addEventListener('click', () => movePlayer('up'));
document.getElementById('down').addEventListener('click', () => movePlayer('down'));
document.getElementById('right').addEventListener('click', () => movePlayer('right'));

// hidden command
const code = [
	'ArrowUp',
	'ArrowUp',
	'ArrowDown',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'ArrowLeft',
	'ArrowRight',
	'KeyB',
	'KeyA',
];

// Variables for tracking command input
let currentIndex = 0;

// Event listener to be executed when a key is pressed
document.addEventListener('keydown', (event) => {
	if (event.code === code[currentIndex]) {
		currentIndex++; // proceed to next key
		if (currentIndex === code.length) {
			const size = 71;
			generateMaze(size, size);
			document.getElementById('levelDisplay').innerText = `Level: Secret`;
			currentIndex = 0; // Reset
		}
	} else {
		// If the key is wrong, start over from the beginning.
		currentIndex = 0;
	}
});
