import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";

import { ALL_CARS } from "./data/cars";
import { recordGameResult } from "./utils/stats";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/400x200.png?text=Resim+Bulunamadi";

const getRandomCar = () => {
  const randomIndex = Math.floor(Math.random() * ALL_CARS.length);
  return ALL_CARS[randomIndex];
};

const checkGuess = (guessedCar, targetCar) => {
  const results = [];

  const checkText = (label, key, guessedValue, targetValue) => {
    results.push({
      label: label,
      key: key,
      value: guessedValue,
      status: guessedValue === targetValue ? "correct" : "incorrect",
    });
  };

  const checkNumeric = (
    label,
    key,
    guessedValue,
    targetValue,
    tolerance = 0
  ) => {
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
      label: label,
      key: key,
      value: guessedValue,
      status: status,
      direction: direction,
    });
  };

  checkText("Marka", "make", guessedCar.make, targetCar.make);
  checkText("Model", "model", guessedCar.model, targetCar.model);
  checkNumeric("Yıl", "year", guessedCar.year, targetCar.year, 0);
  checkText("Ülke", "country", guessedCar.country, targetCar.country);
  checkText("Gövde", "bodyType", guessedCar.bodyType, targetCar.bodyType);
  checkText("Yakıt", "fuelType", guessedCar.fuelType, targetCar.fuelType);
  checkNumeric(
    "Motor",
    "engineSizeL",
    guessedCar.engineSizeL,
    targetCar.engineSizeL,
    0
  );
  checkNumeric(
    "Güç",
    "horsepower",
    guessedCar.horsepower,
    targetCar.horsepower,
    0
  );
  checkNumeric(
    "0-100",
    "zeroToHundredSec",
    guessedCar.zeroToHundredSec,
    targetCar.zeroToHundredSec,
    0
  );
  checkNumeric(
    "Ağırlık",
    "weightKg",
    guessedCar.weightKg,
    targetCar.weightKg,
    0
  );

  return results;
};

export default function GameScreen() {
  const router = useRouter();
  const [targetCar, setTargetCar] = useState(getRandomCar());
  const [guessInput, setGuessInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [statsRecorded, setStatsRecorded] = useState(false);

  const startNewGame = useCallback(() => {
    setTargetCar(getRandomCar());
    setGuesses([]);
    setGuessInput("");
    setSelectedCar(null);
    setSuggestions([]);
    setIsGameOver(false);
    setIsGameWon(false);
    setStatsRecorded(false);
  }, []);

  useEffect(() => {
    if (!guessInput.trim()) {
      setSuggestions([]);
      setSelectedCar(null);
      return;
    }

    const normalizedInput = guessInput.trim().toLowerCase();

    const filteredSuggestions = ALL_CARS.filter((car) => {
      const isAlreadyGuessed = guesses.some((g) => g.car.id === car.id);
      const matchesSearch =
        `${car.make} ${car.model}`.toLowerCase().includes(normalizedInput) ||
        car.make.toLowerCase().includes(normalizedInput) ||
        car.model.toLowerCase().includes(normalizedInput);

      return matchesSearch && !isAlreadyGuessed;
    });

    setSuggestions(filteredSuggestions);
  }, [guessInput, guesses]);

  useEffect(() => {
    let mounted = true;
    if (isGameOver && !statsRecorded) {
      (async () => {
        try {
          await recordGameResult(isGameWon);
          if (mounted) setStatsRecorded(true);
        } catch (e) {
          console.log("İstatistikler Kaydedilemedi", e);
        }
      })();
    }
    return () => {
      mounted = false;
    };
  }, [isGameOver, isGameWon, statsRecorded]);

  const handleGuess = () => {
    if (!selectedCar || isGameOver) return;

    const alreadyGuessed = guesses.some((g) => g.car.id === selectedCar.id);
    if (alreadyGuessed) {
      alert("Bu aracı zaten tahmin ettiniz!");
      setGuessInput("");
      setSelectedCar(null);
      return;
    }

    const results = checkGuess(selectedCar, targetCar);
    const newGuess = { car: selectedCar, results: results };
    setGuesses([newGuess, ...guesses]);

    const isCorrect = selectedCar.id === targetCar.id;

    if (isCorrect) {
      setIsGameOver(true);
      setIsGameWon(true);
    }

    setGuessInput("");
    setSelectedCar(null);
    setSuggestions([]);
  };

  const renderIcon = (status, direction) => {
    if (status === "correct")
      return <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />;
    if (direction === "up")
      return (
        <MaterialCommunityIcons name="arrow-up" size={16} color="#FFFFFF" />
      );
    if (direction === "down")
      return (
        <MaterialCommunityIcons name="arrow-down" size={16} color="#FFFFFF" />
      );
    return null;
  };

  const getBackgroundColor = (status) => {
    return status === "correct" ? "#4CAF50" : "#444444";
  };

  const formatValue = (key, value) => {
    if (key === "engineSizeL") return `${value}L`;
    if (key === "horsepower") return `${value}HP`;
    if (key === "weightKg") return `${value}kg`;
    if (key === "zeroToHundredSec") return `${value}s`;
    return value;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#345774" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{
          headerTitle: "Tahmin Et",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 8 }}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={32}
                color="#FFFFFF"
                onPress={() => router.push('/')}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        <Text style={styles.logoText}>Cardle</Text>

        <View style={styles.carImageContainer}>
          <Image
            source={{ uri: targetCar?.image || PLACEHOLDER_IMAGE }}
            style={styles.carImage}
            resizeMode="cover"
            defaultSource={{ uri: PLACEHOLDER_IMAGE }}
          />
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, selectedCar ? styles.inputSelected : null]}
              placeholder="Bir araba yazın..."
              placeholderTextColor="#AAA"
              value={guessInput}
              onChangeText={setGuessInput}
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!selectedCar || isGameOver) && styles.submitButtonDisabled,
              ]}
              onPress={handleGuess}
              disabled={!selectedCar || isGameOver}
            >
              <Text style={styles.submitButtonText}>Tahmin Et</Text>
            </TouchableOpacity>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView keyboardShouldPersistTaps="handled">
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
                    <Text style={styles.suggestionText}>
                      {s.make} {s.model}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.tableContainer}>
          <FlatList
            data={guesses}
            keyExtractor={(item) => item.car.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.guessRow}>
                <View style={styles.carNameFixed}>
                  <Text style={styles.guessCellText}>{item.car.make}</Text>
                  <Text
                    style={[
                      styles.guessCellText,
                      { fontSize: 11, opacity: 0.8 },
                    ]}
                  >
                    {item.car.model}
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {item.results.map((r, i) => (
                    <View
                      key={i}
                      style={[
                        styles.hintCell,
                        { backgroundColor: getBackgroundColor(r.status) },
                      ]}
                    >
                      <Text style={styles.hintLabelText}>{r.label}</Text>
                      <View style={styles.hintCellContent}>
                        <Text style={styles.hintCellText}>
                          {formatValue(r.key, r.value)}
                        </Text>
                        {renderIcon(r.status, r.direction)}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          />
        </View>

        {isGameOver && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>
              {isGameWon ? "Tebrikler! Bildiniz 🏎️" : "Oyun Bitti"}
            </Text>
            <TouchableOpacity
              style={styles.newGameButton}
              onPress={startNewGame}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Yeni Oyun
              </Text>
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
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#AF6000",
    alignSelf: "center",
    marginVertical: 8,
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 4,
  },
  carImageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  carImage: {
    width: "92%",
    height: 140,
    borderRadius: 12,
    backgroundColor: "#1f2b30",
  },
  tableContainer: {
    flex: 1,
    marginTop: 10,
  },
  guessRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#243a46",
    height: 85,
  },
  carNameFixed: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#1a2c36",
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#2b4752",
  },
  horizontalScroll: {
    flex: 1,
  },
  hintCell: {
    width: 85,
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    marginTop: 6,
    borderRadius: 8,
  },
  hintLabelText: {
    fontSize: 9,
    color: "#DDD",
    marginBottom: 2,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  hintCellContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  guessCellText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  hintCellText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  inputSection: {
    paddingVertical: 12,
    zIndex: 100,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: "#2b3b45",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 10,
    fontWeight: "600",
  },
  inputSelected: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  submitButton: {
    backgroundColor: "#AF6000",
    paddingHorizontal: 18,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#555555",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  gameOverContainer: {
    padding: 16,
    backgroundColor: "#243a46",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gameOverText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 10,
  },
  newGameButton: {
    backgroundColor: "#AF6000",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#243a46",
    borderRadius: 10,
    maxHeight: 250,
    zIndex: 1000,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#2b4752",
    overflow: "hidden",
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#29434e",
    height: 50,
    justifyContent: "center",
  },
  suggestionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
