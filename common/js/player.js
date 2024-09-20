let player = { x: 1, y: 1 };
let Q = {}; // Q Table
const alpha = 0.1; // Learning rate
const gamma = 0.9; // Discount factor
const directions = ['up', 'down', 'left', 'right'];
const epsilon = 0.2; // search rate (Maybe too expensive)
let automaticInterval = null;
let lastAction = null; // Record the last action taken
let automationLowLevel = false; // Flag for automatic operation at low level
let lastState = null;

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

		// Detect backtracking
		const isBacktracking = lastState === newState;

		if (newX === goal.x && newY === goal.y) {
			reward = 100; // Reward for reaching the goal
		} else if (isBacktracking) {
			reward = -5; // Penalty for backtracking
		} else if (distanceAfter < distanceBefore) {
			reward = 1; // Reward for getting closer to the goal
		} else {
			reward = -1; // Penalty for moving away from the goal
		}

		// Initialize the Q table
		if (!Q[prevState]) Q[prevState] = { up: 0, down: 0, left: 0, right: 0 };
		if (!Q[newState]) Q[newState] = { up: 0, down: 0, left: 0, right: 0 };
		const maxQ = Math.max(...Object.values(Q[newState]));

		// Update the Q value
		Q[prevState][direction] += alpha * (reward + gamma * maxQ - Q[prevState][direction]);

		// Update the player's position
		player.x = newX;
		player.y = newY;
		drawMaze();
		drawPlayer();

		// Display the current Q table in HTML
		displayCurrentQTable(newState);

		// Check for goal arrival
		if (newX === goal.x && newY === goal.y) {
			const regenerateStages = document.getElementById('regenerateStages');

			if (regenerateStages.checked) {
				alert('Cleared!');
				player.x = 1;
				player.y = 1;
				drawPlayer();
				drawGoal();
				displayCurrentQTable(`${player.x},${player.y}`);
				lastState = null; // Reset
				return;
			}

			alert('Cleared! Proceed to the next stage.');
			levelUp();
			displayCurrentQTable(`${player.x},${player.y}`);
			lastState = null; // Reset
		} else {
			// Update the last action and state
			lastState = prevState;
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

const oppositeActions = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left',
};

// Q Use a table and actually move it around.
function automatic() {
	if (automaticInterval !== null) {
		clearInterval(automaticInterval);
		automaticInterval = null;
		return;
	}

	if (automationLowLevel === false) {
		const result = window.confirm(
			'If the maze is too large, do you want to make it smaller because it will take longer?'
		);

		if (result) {
			mazeSize = 9;
			generateMaze(mazeSize, mazeSize);
			drawPlayer();
			automationLowLevel = true;
		}
	}

	automaticInterval = setInterval(() => {
		const state = `${player.x},${player.y}`;

		if (!Q[state]) {
			Q[state] = { up: 1, down: 1, left: 1, right: 1 };
		}

		let availableActions = [...directions]; // Copy all actions

		// If the previous action exists, exclude the opposite action
		if (lastAction) {
			const opposite = oppositeActions[lastAction];
			availableActions = availableActions.filter((action) => action !== opposite);
		}

		let action;

		if (Math.random() < epsilon && availableActions.length > 0) {
			// Select a random action with a probability of ε
			action = availableActions[Math.floor(Math.random() * availableActions.length)];
		} else {
			if (availableActions.length === 0) {
				// If there are no available actions, allow backtracking
				action = directions.reduce((a, b) => (Q[state][a] > Q[state][b] ? a : b));
			} else {
				// Select the action with the maximum Q value
				action = availableActions.reduce((a, b) => (Q[state][a] > Q[state][b] ? a : b));
			}
		}

		movePlayer(action);
	}, 100);
}

// Make it actually work automatically
document.getElementById('automatic').addEventListener('click', () => automatic());
