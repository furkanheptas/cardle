import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ALL_CARS } from "../data/cars";

const getRandomCar = () => {
  const randomIndex = Math.floor(Math.random() * ALL_CARS.length);
  return ALL_CARS[randomIndex];
};

const checkGuess = (guessedCar, targetCar) => {
  const results = [];

  const checkText = (key, guessedValue, targetValue) => {
    results.push({
      key: key,
      value: guessedValue,
      status: guessedValue === targetValue ? "correct" : "incorrect",
    });
  };

  const checkNumeric = (key, guessedValue, targetValue, tolerance = 0) => {
    let status;
    let direction = undefined;

    if (Math.abs(guessedValue - targetValue) <= tolerance) {
      status = "correct";
    } else {
      status = "incorrect";
      if (guessedValue < targetValue) {
        direction = "up";
      } else {
        direction = "down";
      }
    }

    results.push({
      key: key,
      value: guessedValue,
      status: status,
      direction: direction,
    });
  };

  results.push({
    key: "make",
    value: guessedCar.make,
    status: guessedCar.make === targetCar.make ? "correct" : "incorrect",
  });
  results.push({
    key: "model",
    value: guessedCar.model,
    status: guessedCar.model === targetCar.model ? "correct" : "incorrect",
  });

  checkNumeric("year", guessedCar.year, targetCar.year, 0);
  checkText("country", guessedCar.country, targetCar.country);
  checkText("bodyType", guessedCar.bodyType, targetCar.bodyType);
  checkText("fuelType", guessedCar.fuelType, targetCar.fuelType);
  checkNumeric("engineSizeL", guessedCar.engineSizeL, targetCar.engineSizeL, 0);
  checkNumeric("horsepower", guessedCar.horsepower, targetCar.horsepower, 0);
  checkNumeric(
    "zeroToHundredSec",
    guessedCar.zeroToHundredSec,
    targetCar.zeroToHundredSec,
    0
  );
  checkNumeric("weightKg", guessedCar.weightKg, targetCar.weightKg, 0);

  return results;
};

export default function GameScreen() {
  const [targetCar, setTargetCar] = useState(getRandomCar());
  const [guessInput, setGuessInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  const startNewGame = useCallback(() => {
    setTargetCar(getRandomCar());
    setGuesses([]);
    setGuessInput("");
    setSelectedCar(null);
    setSuggestions([]);
    setIsGameOver(false);
    setIsGameWon(false);
  }, []);

  useEffect(() => {
    if (!guessInput.trim()) {
      setSuggestions([]);
      setSelectedCar(null);
      return;
    }

    const normalizedInput = guessInput.trim().toLowerCase();

    if (selectedCar && guessInput !== `${selectedCar.make} ${selectedCar.model}`) {
      setSelectedCar(null);
    }

    const filteredSuggestions = ALL_CARS.filter((car) =>
      `${car.make} ${car.model}`.toLowerCase().includes(normalizedInput) ||
      car.make.toLowerCase().includes(normalizedInput) ||
      car.model.toLowerCase().includes(normalizedInput)
    ).slice(0, 10);

    setSuggestions(filteredSuggestions);
  }, [guessInput, selectedCar]);

  const handleGuess = () => {
    if (!selectedCar || isGameOver) {
      return;
    }

    const results = checkGuess(selectedCar, targetCar);
    const newGuess = { car: selectedCar, results: results };
    setGuesses([newGuess, ...guesses]);

    const isCorrect = results.some(
      (r) => r.key === "model" && r.status === "correct"
    );

    if (isCorrect) {
      setIsGameOver(true);
      setIsGameWon(true);
    }

    setGuessInput("");
    setSelectedCar(null);
    setSuggestions([]);
  };

  const renderIcon = (status, direction) => {
    if (status === "correct") {
      return <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />;
    }

    if (direction === "up") {
      return <MaterialCommunityIcons name="arrow-up" size={16} color="#FFFFFF" />;
    }
    if (direction === "down") {
      return <MaterialCommunityIcons name="arrow-down" size={16} color="#FFFFFF" />;
    }

    return null;
  };

  const getBackgroundColor = (status) => {
    switch (status) {
      case "correct":
        return "#4CAF50";
      case "incorrect":
        return "#444444";
      default:
        return "#444444";
    }
  };

  const formatValue = (key, value) => {
    if (key === "engineSizeL") return `${value}L`;
    if (key === "horsepower") return `${value}HP`;
    if (key === "weightKg") return `${value}kg`;
    if (key === "zeroToHundredSec") return `${value}s`;
    if (key === "year") return value;
    return value;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#1E1E1E' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerTitle: 'Tahmin Et' }} />

      <View style={styles.container}>
        <Text style={styles.logoText}>Cardle</Text>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, selectedCar ? styles.inputSelected : null]}
              placeholder="Bir araba yazın (ör. Tesla Model 3)"
              placeholderTextColor="#777"
              value={guessInput}
              onChangeText={setGuessInput}
            />
            <TouchableOpacity
              style={[styles.submitButton, (!selectedCar || isGameOver) && styles.submitButtonDisabled]}
              onPress={handleGuess}
              disabled={!selectedCar || isGameOver}
            >
              <Text style={styles.submitButtonText}>Tahmin Et</Text>
            </TouchableOpacity>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSelectedCar(s);
                    setGuessInput(`${s.make} ${s.model}`);
                    setSuggestions([]);
                  }}
                >
                  <Text style={styles.suggestionText}>{s.make} {s.model}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.tableContainer}>
          <FlatList
            data={guesses}
            keyExtractor={(item, idx) => `${idx}-${item.car.id}`}
            renderItem={({ item }) => (
              <View style={styles.guessRow}>
                <View style={[styles.guessCell, { backgroundColor: '#282828' }]}>
                  <Text style={styles.guessCellText}>{item.car.make} {item.car.model}</Text>
                </View>
                <View style={styles.hintsCellContainer}>
                  {item.results.map((r, i) => (
                    <View key={i} style={[styles.hintCell, { backgroundColor: getBackgroundColor(r.status) }]}> 
                      <View style={styles.hintCellContent}>
                        <Text style={styles.hintCellText}>{formatValue(r.key, r.value)}</Text>
                        {renderIcon(r.status, r.direction) && (
                          <View style={styles.directionIcon}>{renderIcon(r.status, r.direction)}</View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          />
        </View>

        {isGameOver && (
          <View style={{ padding: 12 }}>
            <Text style={styles.gameOverText}>{isGameWon ? 'Tebrikler! Doğru tahmin.' : 'Oyun bitti'}</Text>
            <TouchableOpacity style={styles.newGameButton} onPress={startNewGame}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Yeni Oyun</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#1E1E1E",
      paddingHorizontal: 10,
  },
  logoText: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#FF6F00",
      alignSelf: "center",
      marginVertical: 10,
      letterSpacing: 2,
  },
  tableContainer: {
      flex: 1,
      marginTop: 10,
  },
  guessRow: {
      flexDirection: "row",
      alignItems: "stretch",
      marginBottom: 8,
      borderRadius: 6,
      overflow: "hidden",
      minHeight: 60,
  },
  guessCell: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
      borderRadius: 6,
      marginRight: 4,
  },
  guessCellText: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#FFFFFF",
      textAlign: "center",
  },
  hintsCellContainer: {
      flex: 8,
      flexDirection: "row",
      justifyContent: "space-between",
  },
  hintCell: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 4,
      marginHorizontal: 1,
      borderRadius: 4,
      position: "relative",
  },
  hintCellContent: {
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      width: "100%",
  },
  hintCellText: {
      fontSize: 11,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
  },
  directionIcon: {
      marginTop: 2,
  },
  inputSection: {
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: "#333",
      zIndex: 10,
  },
  inputRow: {
      flexDirection: "row",
      alignItems: "center",
  },
  input: {
      flex: 1,
      height: 50,
      backgroundColor: "#333333",
      borderRadius: 8,
      paddingHorizontal: 15,
      color: "#FFFFFF",
      fontSize: 16,
      marginRight: 10,
      borderWidth: 2,
      borderColor: "transparent",
  },
  inputSelected: {
      borderColor: "#4CAF50",
  },
  submitButton: {
      backgroundColor: "#FF6F00",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      height: 50,
      justifyContent: "center",
  },
  submitButtonDisabled: {
      backgroundColor: "#555555",
  },
  submitButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 16,
  },
  gameOverText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#4CAF50",
      textAlign: "center",
      padding: 15,
      backgroundColor: "#282828",
      borderRadius: 8,
  },
  newGameButton: {
      backgroundColor: "#007AFF",
      paddingVertical: 15,
      borderRadius: 8,
      marginTop: 10,
      alignItems: "center",
  },
  suggestionsContainer: {
      position: "absolute",
      bottom: 70,
      left: 0,
      right: 0,
      backgroundColor: "#282828",
      borderRadius: 8,
      maxHeight: 200,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#555",
      zIndex: 1000,
  },
  suggestionItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#444",
  },
  suggestionText: {
      color: "#FFFFFF",
      fontSize: 16,
  },
});
