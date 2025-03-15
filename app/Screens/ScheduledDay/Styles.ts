import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },

  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 10,
  },

  // 🔥 Barra de Navegação
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    backgroundColor: "#000",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    borderStyle: "solid",
  },
  backButton: { padding: 5 },
  backIcon: {
    width: 24,
    height: 24,
    marginTop: 15,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 15,
  },

  // 🔥 Estilização da Tabela
  table: {
    marginTop: 35,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 5,
    overflow: "hidden",
  },

  header: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ffffff",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#ffffff",
    paddingVertical: 8,
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    borderStyle: "dashed",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },

  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#ffffff",
  },

  footer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
});

export default styles;
