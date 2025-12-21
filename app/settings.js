import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, Text, View, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetStats } from "./utils/stats";
import { t, LANGUAGE_KEY, setStoredLanguage } from "./utils/i18n";

export default function SettingsModal() {
  const router = useRouter();
  const [lang, setLang] = useState("tr");

  const confirmReset = () => {
    resetStats()
      .then((res) => {
        if (res) {
          Alert.alert(t(lang, "ok"), t(lang, "settings.reset_ok"));
        } else {
          Alert.alert(t(lang, "error"), t(lang, "settings.reset_err"));
        }
      })
      .catch(() => {
        Alert.alert(t(lang, "error"), t(lang, "settings.reset_err"));
      });
  };

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (v) setLang(v);
      } catch (e) {
        //
      }
    })();
  }, []);

  const changeLang = async (l) => {
    try {
      await setStoredLanguage(l);
      setLang(l);
    } catch (e) {
      //
    }
  };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: t(lang, "settings.header") }} />

      <Text style={styles.title}>{t(lang, "settings.title")}</Text>
      <Text style={styles.subtitle}>{t(lang, "settings.subtitle")}</Text>

      <View
        style={{
          flexDirection: "row",
          marginTop: 18,
          justifyContent: "center",
          gap: 10,
        }}
      >
        <TouchableOpacity
          style={[
            styles.langButton,
            lang === "tr" ? styles.langButtonSelected : null,
          ]}
          onPress={() => changeLang("tr")}
        >
          <Text
            style={[
              styles.langText,
              lang === "tr" ? styles.langTextSelected : null,
            ]}
          >
            {t(lang, "settings.lang_tr")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.langButton,
            lang === "en" ? styles.langButtonSelected : null,
          ]}
          onPress={() => changeLang("en")}
        >
          <Text
            style={[
              styles.langText,
              lang === "en" ? styles.langTextSelected : null,
            ]}
          >
            {t(lang, "settings.lang_en")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10, width: "100%", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={confirmReset}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {t(lang, "settings.reset")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#345774",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#AF6000",
    fontFamily: "Kavoon",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 40,
    color: "#AF6000",
    textAlign: "center",
    marginBottom: 5,
    fontWeight: 700,
  },
  primaryButton: {
    width: "70%",
    height: 56,
    backgroundColor: "#AF6000",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Kavoon",
  },
  langButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "transparent",
    marginHorizontal: 6,
    marginBottom: 60,
  },
  langButtonSelected: {
    backgroundColor: "#AF6000",
    borderColor: "#AF6000",
  },
  langText: {
    color: "#AF6000",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Kavoon",
  },
  langTextSelected: {
    color: "#fff",
  },
});
