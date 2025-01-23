import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';

const generateRandomColor = () =>
  `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;

const generateColorGrid = (size: number, targetColor: string) => {
  const colors = Array(size * size)
    .fill(null)
    .map(() => generateRandomColor());
  const randomIndex = Math.floor(Math.random() * colors.length);
  colors[randomIndex] = targetColor;
  return colors;
};

export default function GameScreen() {
  const gridSize = 4;
  const [gameState, setGameState] = useState<"start" | "playing" | "gameOver">("start");
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [colorGrid, setColorGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [darkMode, setDarkMode] = useState(false); // Default to light mode
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [incorrectSound, setIncorrectSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: correct } = await Audio.Sound.createAsync(require('../assets/audio/right.mp3'));
        const { sound: incorrect } = await Audio.Sound.createAsync(require('../assets/audio/wrong.mp3'));
        setCorrectSound(correct);
        setIncorrectSound(incorrect);
      } catch (error) {
        console.error("Error loading sounds:", error);
      }
    };
    loadSounds();

    return () => {
      if (correctSound) correctSound.unloadAsync();
      if (incorrectSound) incorrectSound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (gameState === "playing") {
      setColorGrid(generateColorGrid(gridSize, targetColor));
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState("gameOver"); // Game Over
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, targetColor]);

  const handleTilePress = async (color: string) => {
    if (!correctSound || !incorrectSound) {
      console.warn("Sounds are not loaded yet.");
      return;
    }

    if (color === targetColor) {
      try {
        await correctSound.replayAsync();
      } catch (error) {
        console.error("Error playing correct sound:", error);
      }
      setScore(score + 1);
      setTimeLeft((prev) => prev + 1); // Add 1 second to the timer
      const newTargetColor = generateRandomColor();
      setTargetColor(newTargetColor);
      setColorGrid(generateColorGrid(gridSize, newTargetColor));
    } else {
      try {
        await incorrectSound.replayAsync();
      } catch (error) {
        console.error("Error playing incorrect sound:", error);
      }
      setScore(score - 1);
    }
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(30);
    setTargetColor(generateRandomColor());
  };

  const restartGame = () => {
    setGameState("start");
  };

  if (gameState === "start") {
    return (
      <View style={styles(darkMode).container}>
        
        <Animatable.View animation="zoomInUp">
          <Text style={styles(darkMode).title}> Color Match Mania </Text>
        </Animatable.View>
        <Animatable.View animation="shake" easing="ease-out" iterationCount={2}>
          <TouchableOpacity style={styles(darkMode).button} onPress={startGame}>
            <Text style={styles(darkMode).buttonText}>Start Game</Text>
          </TouchableOpacity>
        </Animatable.View>
        <View style={styles(darkMode).switchContainer}>
          <Text style={styles(darkMode).switchLabel}>
            {darkMode ? "Dark Mode" : "Light Mode"}
          </Text>
          <TouchableOpacity
            style={styles(darkMode).toggleButton}
            onPress={() => setDarkMode(!darkMode)}
          >
            <Text style={styles(darkMode).toggleButtonText}>
              {darkMode ? "🌙" : "☀️"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (gameState === "gameOver") {
    return (
      <View style={styles(darkMode).container}>
         <Animatable.View animation="zoomInUp">
            <Text style={styles(darkMode).title}>Game Over</Text>
        </Animatable.View>
        <Animatable.View animation="zoomInUp">
            <Text style={styles(darkMode).score}>Final Score: {score}</Text>
        </Animatable.View>  
        <Animatable.View animation="rubberBand" easing="ease-out" iterationCount={10}>      
            <TouchableOpacity style={styles(darkMode).button} onPress={restartGame}>
                <Text style={styles(darkMode).buttonText}>Restart Game</Text>
            </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  }

  return (
    <View style={styles(darkMode).container}>
      <Text style={styles(darkMode).title}>Color Match Mania</Text>
      <Text style={styles(darkMode).subtitle}>Match this color:</Text>
      <View
        style={[styles(darkMode).targetColorBox, { backgroundColor: targetColor }]}
      />
      <Text style={styles(darkMode).timer}>Time Left: {timeLeft} s</Text>
      <Text style={styles(darkMode).score}>Score: {score}</Text>
      <FlatList
        data={colorGrid}
        keyExtractor={(item, index) => index.toString()}
        numColumns={gridSize}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles(darkMode).tile, { backgroundColor: item }]}
            onPress={() => handleTilePress(item)}
          />
        )}
        contentContainerStyle={styles(darkMode).grid}
      />
    </View>
  );
}

const styles = (darkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: darkMode ? "#021526" : "#f4f4f4",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: darkMode ? "#fff" : "#333",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: darkMode ? "#fff" : "#333",
  },
  targetColorBox: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: darkMode ? '#fff' : '#5C636E',
    elevation: 5,
    shadowColor:  darkMode ? '#F4CE14' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5
  },
  timer: {
    fontWeight: "bold",
    fontSize: 20,
    color: darkMode ? "#fff" : "#333",
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: darkMode ? "#fff" : "#333",
  },
  grid: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 50,
  },
  tile: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 50,
    borderWidth: 0.5, 
    borderColor: darkMode ? '#fff' : '#929AAB',
    elevation: 5,
    shadowColor:  darkMode ? '#F4CE14' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5
  },
  button: {
    backgroundColor: darkMode ? '#F4CE14' : '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: 220,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor:  darkMode ? '#F4CE14' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: darkMode ? '#000' : '#fff',
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleButton: {
    backgroundColor: darkMode ? '#FFFAE7' : '#495664',
    padding: 10,
    borderRadius: 100,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  switchContainer: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: darkMode ? "#fff" : "#333",
    marginRight: 10,
  },
});