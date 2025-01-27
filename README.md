# Color Match Mania

Color Match Mania is a fun and engaging color matching game built with React Native. The game challenges players to match a target color from a grid of randomly generated colors. The game includes a dark mode feature and sound effects for correct and incorrect matches.

## Features

- **Color Matching Game**: Match the target color from a grid of colors.
- **Dark Mode**: Toggle between light and dark modes.
- **Sound Effects**: Enjoy sound effects for correct and incorrect matches.
- **Animations**: Smooth animations for game transitions.

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/nicatbayram/color-match-mania.git
    cd colormatchmania
    ```

2. **Install dependencies**:
    ```sh
    npm install
    npm install-expo-modules@latest
    ```

3. **Start the application**:
    ```sh
    npx expo start
    ```

## Usage

1. **Start the Game**: Press the "Start Game" button to begin.
2. **Match Colors**: Click on the tile that matches the target color.
3. **Toggle Dark Mode**: Use the toggle button to switch between light and dark modes.
4. **Restart Game**: Press the "Restart Game" button to play again after the game is over.

## Code Overview

### Main Components

- **GameScreen.tsx**: The main game component that handles the game logic, state management, and rendering.
- **DarkModeContext.tsx**: Context API for managing dark mode state.

### Key Functions

- **generateRandomColor**: Generates a random RGB color.
- **generateColorGrid**: Generates a grid of random colors with one tile matching the target color.
- **handleTilePress**: Handles the logic when a tile is pressed, including updating the score and playing sound effects.
- **startGame**: Initializes the game state and starts the game.
- **restartGame**: Resets the game state to start a new game.

### Styles

The styles are dynamically adjusted based on the dark mode state using the [styles](http://_vscodecontentref_/1) function in [GameScreen.tsx](http://_vscodecontentref_/2).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.


## Acknowledgements

- **React Native**: For providing the framework to build this application.
- **Expo**: For providing tools and libraries for React Native development.
- **Animatable**: For providing smooth animations.
- **Audio**: For handling sound effects.

---
Enjoy playing Color Match Mania!

## ScreenShots

https://github.com/user-attachments/assets/c3305eff-8024-4460-a934-074290591ffc




