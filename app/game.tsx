import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { ALL_CARS, CarData } from "./data/cars";

interface Guess {
  car: CarData;
  results: GuessResult[];
}

interface GuessResult {
  key: keyof CarData | "make" | "model";
  value: any;
  status: "correct" | "close" | "incorrect";
  direction?: "up" | "down";
}

const getRandomCar = (): CarData => {
  const randomIndex = Math.floor(Math.random() * ALL_CARS.length);
  return ALL_CARS[randomIndex];
};

const checkGuess = (guessedCar: CarData, targetCar: CarData): GuessResult[] => {
  const results: GuessResult[] = [];

  const checkText = (
    key: keyof CarData,
    guessedValue: any,
    targetValue: any
  ) => {
    results.push({
      key: key,
      value: guessedValue,
      status: guessedValue === targetValue ? "correct" : "incorrect",
    });
  };

  const checkNumeric = (
    key: keyof CarData,
    guessedValue: number,
    targetValue: number,
    tolerance = 0
  ) => {
    let status: GuessResult["status"];
    let direction: GuessResult["direction"] | undefined = undefined;

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
  const [targetCar, setTargetCar] = useState<CarData>(getRandomCar());
  const [guessInput, setGuessInput] = useState("");
  const [suggestions, setSuggestions] = useState<CarData[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
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
    
    if (
      selectedCar &&
      guessInput !== `${selectedCar.make} ${selectedCar.model}`
    ) {
      setSelectedCar(null);
    }

    const filteredSuggestions = ALL_CARS.filter(
      (car) =>
        car.model.toLowerCase().includes(normalizedInput) ||
        car.make.toLowerCase().includes(normalizedInput)
    ).slice(0, 10);

    setSuggestions(filteredSuggestions);
  }, [guessInput, selectedCar]);

  const handleGuess = () => {
    if (!selectedCar || isGameOver) {
      return;
    }
    
    const results = checkGuess(selectedCar, targetCar);
    const newGuess: Guess = { car: selectedCar, results: results };
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

  const renderIcon = (
    status: GuessResult["status"],
    direction?: GuessResult["direction"]
  ) => {
    if (status === "correct") {
      return (
        <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
      );
    }

    if (direction === "up") {
      return (
        <MaterialCommunityIcons
          name="arrow-up-bold"
          size={20}
          color="#FFC107"
        />
      );
    }
    if (direction === "down") {
      return (
        <MaterialCommunityIcons
          name="arrow-down-bold"
          size={20}
          color="#FFC107"
        />
      );
    }

    return null;
  };

  const getBackgroundColor = (status: GuessResult["status"]) => {
    switch (status) {
      case "correct":
        return "#4CAF50";
      case "close":
        return "#FFC107";
      case "incorrect":
        return "#F44336";
      default:
        return "#333333";
    }
  };

  const formatValue = (key: string, value: any) => {
    if (key === "engineSizeL") return `${value}L`;
    if (key === "horsepower") return `${value}HP`;
    if (key === "weightKg") return `${value}kg`;
    if (key === "zeroToHundredSec") return `${value}s`;
    if (key === "year") return value;
    return value;
  };

  const columnHeaders = [
    { key: "year", label: "Yıl" },
    { key: "country", label: "Ülke" },
    { key: "bodyType", label: "Kasa" },
    { key: "fuelType", label: "Yakıt" },
    { key: "engineSizeL", label: "Motor" },
    { key: "horsepower", label: "HP" },
    { key: "zeroToHundredSec", label: "0-100" },
    { key: "weightKg", label: "Ağırlık" },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerTitle: "Araba Tahmin Oyunu" }} />

      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.logoText}>CARDLE</Text>
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: "#aaa", fontSize: 12 }}>
              Araba Resmi
            </Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.headerRow}>
            <View style={styles.guessHeaderCell}>
              <Text style={[styles.cellText, styles.headerText]}>
                Tahmin
              </Text>
            </View>
            <View style={styles.hintsHeaderContainer}>
              {columnHeaders.map((col) => (
                <View key={col.key} style={styles.hintHeaderCell}>
                  <Text style={[styles.cellText, styles.headerText, styles.hintHeaderText]}>
                    {col.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <ScrollView style={styles.guessesContainer}>
            {guesses.map((guess, index) => (
              <View key={index} style={styles.guessRow}>
                <View
                  style={[
                    styles.guessCell,
                    {
                      backgroundColor: getBackgroundColor(
                        guess.results.find((r) => r.key === "model")?.status ||
                          "incorrect"
                      ),
                    },
                  ]}
                >
                  <Text style={[styles.cellText, styles.guessCellText]}>
                    {guess.car.make}
                  </Text>
                  <Text style={[styles.cellText, styles.guessCellText]}>
                    {guess.car.model}
                  </Text>
                </View>

                <View style={styles.hintsCellContainer}>
                  {columnHeaders.map((col) => {
                    const result = guess.results.find((r) => r.key === col.key);

                    return (
                      <View
                        key={col.key}
                        style={[
                          styles.hintCell,
                          {
                            backgroundColor: result
                              ? getBackgroundColor(result.status)
                              : "#333333",
                          },
                        ]}
                      >
                        {result ? (
                          <View style={styles.hintCellContent}>
                            <Text style={[styles.cellText, styles.hintCellText]}>
                              {formatValue(col.key, result.value)}
                            </Text>
                            {result.direction && result.status !== "correct" && (
                              <View style={styles.directionIcon}>
                                {renderIcon(result.status, result.direction)}
                              </View>
                            )}
                          </View>
                        ) : (
                          <Text style={styles.cellText}>-</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputSection}>
          {suggestions.length > 0 && !selectedCar && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => {
                      setSelectedCar(item);
                      setGuessInput(`${item.make} ${item.model}`);
                      setSuggestions([]);
                    }}
                  >
                    <Text style={styles.suggestionText}>
                      {item.make} {item.model} ({item.year})
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {isGameOver ? (
            <View>
              <Text style={styles.gameOverText}>
                {isGameWon
                  ? `TEBRİKLER! ${targetCar.make} ${targetCar.model} doğru cevap!`
                  : `Oyun Bitti! Cevap: ${targetCar.make} ${targetCar.model}`}
              </Text>
              <TouchableOpacity
                style={styles.newGameButton}
                onPress={startNewGame}
              >
                <Text style={styles.submitButtonText}>YENİ OYUN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, selectedCar && styles.inputSelected]}
                placeholder="Araba modelini tahmin et..."
                placeholderTextColor="#A0A0A0"
                value={guessInput}
                onChangeText={setGuessInput}
                onSubmitEditing={handleGuess}
                editable={!selectedCar}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !selectedCar && styles.submitButtonDisabled,
                ]}
                onPress={handleGuess}
                disabled={!selectedCar}
              >
                <Text style={styles.submitButtonText}>TAHMİN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    topSection: {
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    imagePlaceholder: {
        width: "100%",
        height: 120,
        backgroundColor: "#333333",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    tableContainer: {
        flex: 1,
        marginTop: 10,
    },
    guessesContainer: {
        flex: 1,
    },
    
    headerRow: {
        flexDirection: "row",
        paddingVertical: 8,
        backgroundColor: "#282828",
        borderRadius: 6,
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    guessHeaderCell: {
        flex: 2,
        justifyContent: "center",
        paddingLeft: 8,
    },
    headerText: {
        fontWeight: "bold",
        color: "#B0B0B0",
        fontSize: 11,
    },
    hintsHeaderContainer: {
        flex: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 4,
    },
    hintHeaderCell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 1,
    },
    hintHeaderText: {
        fontSize: 10,
        textAlign: "center",
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
    cellText: {
        fontSize: 12,
        color: "#FFFFFF",
        textAlign: "center",
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