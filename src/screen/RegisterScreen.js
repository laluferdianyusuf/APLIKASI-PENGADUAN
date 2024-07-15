import React, { useState } from "react";
import Background from "../components/Background";
import Header from "../components/Header";
import Logo from "../components/Logo";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { theme } from "../themes/theme";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      setIsLoading(true);
      const loginPayload = {
        email: email.value,
        password: password.value,
      };
      const request = await axios.post(
        "https://pln-backend.vercel.app/...",
        loginPayload
      );
      const response = request.data;

      setIsLoading(false);
      if (response.status_info) {
        AsyncStorage.setItem("savedEmail", email.value);
        AsyncStorage.setItem("savedPassword", password.value);
        AsyncStorage.setItem("token", response.data.token);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Login Successfully",
          textBody: "Make Your Report Quickly.",
          autoClose: 1,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      }
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Login Failed",
        textBody: `${error.response.data.message}`,
        autoClose: 1,
      });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoLogin = () => {
    navigation.navigate("LoginUserScreen");
  };

  const handleGoMainScreen = () => {
    navigation.navigate("NavigatorScreen");
  };

  return (
    <Background>
      <BackButton goBack={handleGoBack} />

      <Logo />

      <TextInput
        label="Username"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
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

      <Button mode="contained" onPress={onLoginPressed} disabled={isLoading}>
        {isLoading ? "..." : "DAFTAR"}
      </Button>

      <View className="flex flex-row gap-2">
        <Text className="text-gray-400 font-bold">Sudah Punya Akun ? </Text>
        <TouchableOpacity onPress={handleGoLogin}>
          <Text className="font-bold underline" style={styles.TextStyle}>
            Masuk Disini
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex flex-row gap-2" style={styles.DataLink}>
        <TouchableOpacity onPress={handleGoMainScreen}>
          <Text className="font-bold underline" style={styles.TextStyle}>
            Lihat Ringkasan Data
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
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
    bottom: 15 + getStatusBarHeight(),
  },
});
