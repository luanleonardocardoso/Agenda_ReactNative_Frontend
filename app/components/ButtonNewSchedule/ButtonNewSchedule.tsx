import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./Styles";

interface ButtonNewScheduleProps {
  onPress: () => void;
}

const ButtonNewSchedule: React.FC<ButtonNewScheduleProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Agendar Novo Horário</Text>
    </TouchableOpacity>
  );
};

export default ButtonNewSchedule;
