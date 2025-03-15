import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarWrapper: {
    width: "90%",
    borderWidth: 4,
    borderColor: "rgba(0, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  calendarSize: {
    width: 300,
    height: 375,
    borderRadius: 20,
  },
  arrow: {
    width: 24,
    height: 24,
  },
  loadingGif: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});

export default styles;
