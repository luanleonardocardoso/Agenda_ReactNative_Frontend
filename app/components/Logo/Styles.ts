import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -150, // 🔥 Garante um pequeno espaçamento entre logo e calendário
    zIndex: 2, // 🔥 Mantém a logo sempre acima
  },
  frame: {
    width: 160, // 🔥 Tamanho da moldura (ligeiramente maior que a imagem)
    height: 160,
    borderRadius: 80, // 🔥 Garante que a moldura seja redonda
    borderWidth: 4, // 🔥 Espessura da moldura
    borderColor: "#000000", // 🔥 Cor da moldura (vermelho escuro)
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // 🔥 Garante que a imagem fique dentro da moldura
  },
  logo: {
    width: 150, // 🔥 Tamanho da imagem
    height: 150,
    borderRadius: 75, // 🔥 Arredonda a imagem dentro da moldura
  },
});

export default styles;
