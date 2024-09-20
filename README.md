# Self-Learning Maze Generator and Player

Click [here](https://gist.github.com/minagishl/881590a47d440cce01ed76bfbf45505d) for the Japanese version

<!-- Please note that this code was created out of curiosity and may not be similar to the actual Q learning. -->

## Overview

**Self-Learning Maze Generator and Player** is an interactive web game that features automatically generated mazes and a self-learning mechanism. The player moves within the maze while using Q-learning to learn the optimal route. Since the maze is randomly generated each time, new challenges await with every playthrough.

## Features

- **Automatically Generated Mazes**: Each time the game starts or the "Generate Maze" button is pressed, a new maze is generated, offering endless fun and variety.
- **Optimal Route Display**: The "Show / Hide Optimal Route" button allows players to visually display or hide the shortest path in the current maze, providing valuable hints for solving it.
- **Q-learning**: Player movements are optimized using a Q-learning algorithm. As the player progresses through the maze, learning continues, allowing for more efficient route selection over time.
- **Level-Up System**: Once the player reaches the goal, the level increases and the maze size expands, providing a progressively challenging gameplay experience.
- **Q-table Visualization**: The Q-table for the current cell is displayed on the screen, allowing players to visually track the learning process and gain a deeper understanding of Q-learning.

## How to Play

1. **Maze Generation**:

   - A maze is automatically generated at the beginning of the game.
   - You can manually generate a new maze by pressing the "Generate Maze" button.

2. **Player Movement**:

   - Use the arrow keys (↑, ↓, ←, →) to move the blue player character around the maze.
   - Once you reach the yellow goal point, you will level up and a new maze will be generated.

3. **Displaying the Optimal Route**:

   - Press the "Show / Hide Optimal Route" button to display or hide the shortest path in pink. This can be toggled on or off as needed.

4. **Viewing the Q-table**:
   - The Q-table for the current cell is displayed at the bottom of the screen. You can check the Q-values for each action (up, down, left, right) and observe the learning process.

## Technical Highlights

### Maze Generation

The maze is generated using the **depth-first search (DFS)** algorithm. By randomly choosing directions and carving paths through a stack-based system, the maze structure is different each time. A special check ensures that an exit always exists in the maze.

### Optimal Route Display

The shortest path within the maze is calculated using **breadth-first search (BFS)**. After calculating the path, it is visually displayed on the maze, helping the player navigate towards the goal.

### Q-learning

Player movements are controlled using a **Q-learning** algorithm. Each cell holds Q-values for the possible actions (up, down, left, right), and these values are updated as the player moves. This allows the player to learn and optimize their movements over time.

- **Learning Rate (α)**: 0.1
- **Discount Factor (γ)**: 0.9

The update formula is as follows:

```
Q(state, action) += α * (reward + γ * max(Q(next_state, all actions)) - Q(state, action))
```

### User Interface

The interface is designed to be simple and intuitive, making it easy to interact with and visualize the maze. The maze is drawn using HTML5's `<canvas>`, allowing real-time updates and rendering.

## Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/minagishl/self-learning-maze.git
   ```
2. **Navigate to the Directory**:
   ```
   cd self-learning-maze
   ```
3. **Run the Local Server**:

   - **Option 1: Use VSCode's Live Server Extension**:

     1. Install [Visual Studio Code](https://code.visualstudio.com/).
     2. Open VSCode and install the "Live Server" extension from the Extensions tab.
     3. Open the project directory in VSCode.
     4. Right-click on the `index.html` file and select "Open with Live Server."
     5. The browser will automatically open with the game running.

   - **Option 2: Open the HTML File Directly in a Browser**:

     1. Double-click the `index.html` file within the project directory.
     2. The game will open in your default browser.

## Usage

- **Generating a Maze**: Click the "Generate Maze" button to create a new maze.
- **Restarting the Game**: Click the "Restart" button to restart the current level.
- **Toggling the Optimal Route**: Click the "Show / Hide Optimal Route" button to toggle the display of the shortest path.
- **Moving the Player**: Use the arrow keys to move the player around the maze.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests.

1. **Fork** the repository.
2. **Create a new branch** (`git checkout -b feature/YourFeature`).
3. **Commit** your changes (`git commit -m 'Add some feature'`).
4. **Push** the branch to your fork (`git push origin feature/YourFeature`).
5. Open a **Pull Request**.

## Author

- Minagishl ([@minagishl](https://github.com/minagishl))

## References

- [Q-learning Overview](https://en.wikipedia.org/wiki/Q-learning)
- [Depth-First Search (DFS)](https://en.wikipedia.org/wiki/Depth-first_search)
- [Breadth-First Search (BFS)](https://en.wikipedia.org/wiki/Breadth-first_search)
