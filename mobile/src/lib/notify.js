import { Alert, Platform } from "react-native";

// Alert لا يعمل على نسخة الويب، لذلك نستخدم نوافذ المتصفح هناك
export function notify(title, message = "") {
  if (Platform.OS === "web") window.alert(message ? `${title}\n${message}` : title);
  else Alert.alert(title, message);
}

export function confirm(title, message, confirmText = "تأكيد") {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${title}\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "رجوع", style: "cancel", onPress: () => resolve(false) },
      { text: confirmText, style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}
