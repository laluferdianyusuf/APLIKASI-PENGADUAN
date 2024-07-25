import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { theme } from "../themes/theme";

const ConsultationScreen = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);
  const route = useRoute();
  const uri = "http://192.168.1.3:5000";
  const { userId, chatWithId } = route.params;
  const pollingInterval = 3000;

  useEffect(() => {
    const initialize = async () => {
      await validateLogin();
      await loadMessages();
    };

    initialize();

    const interval = setInterval(() => {
      loadMessages();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [userId, chatWithId]);

  const validateLogin = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${uri}/current/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status) {
          setUser(response.data.data.user);
        }
      }
    } catch (error) {
      console.error("Error", error.message);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${uri}/api/message`, {
        params: { senderId: userId, receiverId: chatWithId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data.data.message);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, chatWithId]);

  const handleSend = async () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        senderId: user?.id,
        receiverId: chatWithId,
      };
      try {
        const token = await AsyncStorage.getItem("token");
        await axios.post(`${uri}/api/create/message`, newMessage, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now().toString(), ...newMessage },
        ]);
        setMessage("");
        flatListRef.current?.scrollToEnd({ animated: true });
      } catch (error) {
        console.error("Failed to send message:", error);
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  }

  const renderItem = ({ item }) => {
    const isCurrentUser = item.senderId === user?.id;
    return (
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      sc
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ketik pesan di sini..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: "80%",
  },
  senderBubble: {
    backgroundColor: theme.colors.purple400,
    alignSelf: "flex-end",
  },
  receiverBubble: {
    backgroundColor: "grey",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: theme.colors.purple400,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});

export default ConsultationScreen;
