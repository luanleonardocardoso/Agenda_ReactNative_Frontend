import React from "react";
import { Image, View } from "react-native";
import styles from "./Styles";

// Componente que exibe a logo da aplicação
const Logo = () => {
  return (
    <View style={styles.container}>  // Contêiner principal para centralizar a logo
      <View style={styles.frame}>  // Moldura ao redor da imagem
        <Image
          source={require("../../../assets/images/logo.jpg")} // Importa a imagem da logo
          style={styles.logo} // Aplica estilos específicos à imagem
          resizeMode="cover" // Ajusta a imagem para cobrir o espaço sem distorção
        />
      </View>
    </View>
  );
};

export default Logo;
