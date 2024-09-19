const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
let mazeSize = getMazeSize();
let cellSize = canvas.width / mazeSize;
let maze = [];
let goal = { x: mazeSize - 2, y: mazeSize - 2 }; // Goal position set to lower right
let hidden = true; // Show / Hide the best route
let optimalRoute = []; // Array holding the best route

function generateMaze(width, height) {
	mazeSize = width;
	cellSize = canvas.width / mazeSize;
	goal = { x: mazeSize - 2, y: mazeSize - 2 };

	maze = Array.from({ length: height }, () => Array(width).fill(1));

	const stack = [{ x: 1, y: 1 }];
	maze[1][1] = 0; // Start point

	while (stack.length > 0) {
		const { x, y } = stack.pop();
		const directions = shuffle([
			{ x: 0, y: -2 }, // Up
			{ x: 0, y: 2 }, // Down
			{ x: -2, y: 0 }, // Left
			{ x: 2, y: 0 }, // Right
		]);

		for (const dir of directions) {
			const nx = x + dir.x;
			const ny = y + dir.y;
			if (nx > 0 && nx < width && ny > 0 && ny < height && maze[ny][nx] === 1) {
				maze[ny - dir.y / 2][nx - dir.x / 2] = 0; // scrape off the wall
				maze[ny][nx] = 0; // make way
				stack.push({ x: nx, y: ny });
			}
		}
	}

	checkForExit();
	optimalRoute = findShortestPath({ x: 1, y: 1 }, goal); // Calculate the shortest route
	drawMaze();
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// Maze Drawing
function drawMaze() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let y = 0; y < maze.length; y++) {
		for (let x = 0; x < maze[y].length; x++) {
			if (maze[y][x] === 1) {
				ctx.fillStyle = 'black';
				ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
			} else if (x === goal.x && y === goal.y) {
				ctx.fillStyle = 'yellow'; // Goal position in yellow
				ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
			} else if (player.x === x && player.y === y) {
				ctx.fillStyle = 'blue'; // Player position in blue
				ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
			} else if (!hidden && optimalRoute.some((pos) => pos.x === x && pos.y === y)) {
				ctx.fillStyle = 'lightpink'; // Optimal route in light pink
				ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
	}
}

// Exit availability check
function checkForExit() {
	const exitPossible = maze[goal.y][goal.x] === 0;
	if (!exitPossible) {
		alert('No exit! Regenerate the maze.');
		generateMaze(mazeSize, mazeSize);
	}
}

// Obtaining maze size according to difficulty level
function getMazeSize() {
	const level = parseInt(localStorage.getItem('mazeLevel') ?? '1');
	document.getElementById('levelDisplay').innerText = `Level: ${level}`;
	return Math.min(21 + level * 2, 41); // Max size: 41
}

// Maze generation at the push of a button
document.getElementById('generateMaze').addEventListener('click', () => {
	mazeSize = getMazeSize();
	generateMaze(mazeSize, mazeSize);
});

// Restart button
document.getElementById('restartLevel').addEventListener('click', () => {
	player.x = 1;
	player.y = 1;
	drawMaze();
	drawPlayer();
});

// Showing and hiding the best route
function toggleRoute() {
	hidden = !hidden;
	drawMaze(); // Redraw the maze and update the route display
}

// Function to set the optimal route
function setOptimalRoute(route) {
	optimalRoute = route;
}

// Function to calculate the best route (width-first search)
function findShortestPath(start, end) {
	const queue = [];
	const visited = Array.from({ length: maze.length }, () => Array(maze[0].length).fill(false));
	const predecessor = Array.from({ length: maze.length }, () => Array(maze[0].length).fill(null));

	queue.push(start);
	visited[start.y][start.x] = true;

	const directions = [
		{ x: 0, y: -1 }, // Up
		{ x: 0, y: 1 }, // Down
		{ x: -1, y: 0 }, // Left
		{ x: 1, y: 0 }, // Right
	];

	while (queue.length > 0) {
		const current = queue.shift();

		if (current.x === end.x && current.y === end.y) {
			// Restore the path once the goal is reached
			const path = [];
			let step = current;
			while (step) {
				path.push(step);
				step = predecessor[step.y][step.x];
			}
			return path.reverse(); // Arrange in order from start to finish.
		}

		for (const dir of directions) {
			const nx = current.x + dir.x;
			const ny = current.y + dir.y;

			if (
				nx >= 0 &&
				nx < maze[0].length &&
				ny >= 0 &&
				ny < maze.length &&
				maze[ny][nx] === 0 &&
				!visited[ny][nx]
			) {
				queue.push({ x: nx, y: ny });
				visited[ny][nx] = true;
				predecessor[ny][nx] = current;
			}
		}
	}

	// If the goal cannot be reached
	return [];
}

// Button to toggle the optimal route display
document.getElementById('routeToggle').addEventListener('click', toggleRoute);

// Generate the initial maze
generateMaze(mazeSize, mazeSize);
