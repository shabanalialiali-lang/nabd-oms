import { Text } from "react-native";

export default function TabIcon({ icon, focused }) {
  return <Text style={{ fontSize: 18, lineHeight: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>;
}
