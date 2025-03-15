import React from "react";
import { Image, View } from "react-native";
import styles from "./Styles"; // ✅ Importando os estilos separados

const Logo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image
          source={require("../../../assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default Logo;
