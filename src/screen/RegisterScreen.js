import React, { useState } from "react";
import Background from "../components/Background";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import {
  nameValidator,
  usernameValidator,
  emailValidator,
  numberValidator,
  addressValidator,
  passwordValidator,
} from "../helpers/validator";
import axios from "axios";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { theme } from "../themes/theme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [username, setUsername] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [address, setAddress] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onRegisterPressed = async () => {
    const nameError = nameValidator(name.value);
    const usernameError = usernameValidator(username.value);
    const emailError = emailValidator(email.value);
    const phoneNumberError = numberValidator(phoneNumber.value);
    const addressError = addressValidator(address.value);
    const passwordError = passwordValidator(password.value);
    if (
      nameError ||
      usernameError ||
      emailError ||
      phoneNumberError ||
      addressError ||
      passwordError
    ) {
      setName({ ...name, error: nameError });
      setUsername({ ...username, error: usernameError });
      setEmail({ ...email, error: emailError });
      setPhoneNumber({ ...phoneNumber, error: phoneNumberError });
      setAddress({ ...address, error: addressError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      setIsLoading(true);
      const registerPayload = {
        name: name.value,
        username: username.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        address: address.value,
        password: password.value,
      };
      const request = await axios.post(
        "http://192.168.1.4:1000/register/user",
        registerPayload
      );
      const response = request.data;
      console.log(response);

      setIsLoading(false);
      if (response.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Register Successfully",
          textBody: "Masuk ke akun anda untuk membuat pengaduan.",
        });
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginUserScreen" }],
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Register Error",
          textBody: response.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        // Server responded with a status other than 200 range
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Register Failed",
          textBody: error.message || "Something went wrong",
        });
      } else if (error.request) {
        // Request was made but no response received
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Register Failed",
          textBody: "Network error. Please try again.",
        });
      } else {
        // Something else caused the error
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Register Failed",
          textBody: "An unexpected error occurred.",
        });
      }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Background>
          <BackButton goBack={handleGoBack} />
          <Header>Register</Header>

          <TextInput
            label="Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
            errorText={name.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
          />
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
          />
          <TextInput
            label="Email"
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
          <TextInput
            label="Phone Number"
            returnKeyType="next"
            value={phoneNumber.value}
            onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
            error={!!phoneNumber.error}
            errorText={phoneNumber.error}
            autoCapitalize="none"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
          />
          <TextInput
            label="Address"
            returnKeyType="next"
            value={address.value}
            onChangeText={(text) => setAddress({ value: text, error: "" })}
            error={!!address.error}
            errorText={address.error}
            autoCapitalize="none"
            autoCompleteType="street-address"
            textContentType="fullStreetAddress"
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
            onPress={onRegisterPressed}
            disabled={isLoading}
          >
            {isLoading ? "..." : "DAFTAR"}
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah Punya Akun? </Text>
            <TouchableOpacity onPress={handleGoLogin}>
              <Text style={styles.loginLink}>Masuk Disini</Text>
            </TouchableOpacity>
          </View>
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
  loginContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  loginText: {
    color: theme.colors.secondary,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
