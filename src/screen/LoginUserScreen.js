import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { usernameValidator, passwordValidator } from "../helpers/validator";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../themes/theme";
const uri = "http://192.168.1.3:5000";

export default function LoginUserScreen({ navigation }) {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLoginPressed = async (e) => {
    e.preventDefault();
    const usernameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);
    if (usernameError || passwordError) {
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      setIsLoading(true);
      const loginPayload = {
        username: username.value,
        password: password.value,
      };
      const request = await axios.post(`${uri}/login/user`, loginPayload);
      const response = request.data;

      setIsLoading(false);
      if (response.status) {
        AsyncStorage.setItem("savedEmail", username.value);
        AsyncStorage.setItem("savedPassword", password.value);
        AsyncStorage.setItem("token", response.data.token);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Login Successfully",
          textBody: response.message,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: "NavigatorScreen" }],
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Login Error",
          textBody: response.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Login Failed",
        textBody: `${error.response.data.message}`,
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleGoMainScreen = () => {
    navigation.navigate("NavigatorScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Background>
          <Logo />
          <TextInput
            label="Username"
            returnKeyType="next"
            value={username.value}
            onChangeText={(text) => setUsername({ value: text, error: "" })}
            error={!!username.error}
            errorText={username.error}
            autoCapitalize="none"
            autoCompleteType="username"
            textContentType="username"
            keyboardType="username"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              label="Password"
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: "" })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
              style={styles.eyeIconContainer}
            >
              <Icon
                name={`${showPassword ? "lock-open" : "lock"}`}
                color={theme.colors.error}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={onLoginPressed}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "MASUK"}
          </Button>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Belum Punya Akun ? </Text>
            <TouchableOpacity onPress={handleGoRegister}>
              <Text className="font-bold underline" style={styles.TextStyle}>
                Silahkan Daftar Disini
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleGoMainScreen}
            style={styles.DataLink}
          >
            <Text className="font-bold" style={styles.TextStyle}>
              Lihat Ringkasan Data
            </Text>
          </TouchableOpacity>
        </Background>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  eyeIconContainer: {
    padding: 10,
    paddingTop: 15,
    position: "absolute",
    right: 5,
  },
  TextStyle: {
    color: theme.colors.purple400,
  },
  DataLink: {
    position: "absolute",
    bottom: 10,
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  registerText: {
    color: "gray",
    fontWeight: "bold",
  },
});
