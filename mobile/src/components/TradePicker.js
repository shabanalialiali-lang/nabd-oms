import { StyleSheet, View } from "react-native";
import { CATEGORIES } from "../constants/categories";
import { Chip } from "./ui";

// اختيار متعدد للمهن (للفنيين)
export default function TradePicker({ value, onChange }) {
  function toggle(id) {
    onChange(value.includes(id) ? value.filter((t) => t !== id) : [...value, id]);
  }
  return (
    <View style={styles.wrap}>
      {CATEGORIES.map((c) => (
        <Chip key={c.id} icon={c.icon} label={c.label} selected={value.includes(c.id)} onPress={() => toggle(c.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
});
