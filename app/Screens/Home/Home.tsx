import React, { useState } from 'react';
import { View, StatusBar, ImageBackground } from 'react-native';
import CustomCalendar from '../../components/Calendar/Calendar';
import Logo from '../../components/Logo/Logo';
import ButtonNewSchedule from '../../components/ButtonNewSchedule/ButtonNewSchedule';
import Popup from '../../components/Popup/Popup'; 
import styles from './Styles';

// Imagem de fundo da tela principal
const backgroundImage = require('../../../assets/images/background.jpg');

const Home = () => {
  // Estado para controlar a visibilidade do popup
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  // Estado para definir a ação do popup (inserção ou edição)
  const [routeToPopup, setRouteToPopup] = useState<string | null>(null);
  // Estado para atualizar o calendário após criar/editar/excluir um agendamento
  const [refreshCalendar, setRefreshCalendar] = useState<boolean>(false);

  // Função chamada ao pressionar o botão de novo agendamento
  const handleNewSchedule = () => {
    setRouteToPopup('insert'); // Define a ação como inserção
    setPopupVisible(true); // Abre o popup
  };

  // Função para fechar o popup e atualizar o calendário
  const handleClosePopup = () => {
    setPopupVisible(false); // Fecha o popup
    setRouteToPopup(null); // Reseta a rota do popup
    setRefreshCalendar((prev) => !prev); // Alterna o estado para forçar atualização do calendário
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      {/* Configuração da barra de status */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.container}>
        {/* Exibição da logo no topo */}
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        {/* Exibição do calendário */}
        <View style={styles.calendarContainer}>
          <CustomCalendar refresh={refreshCalendar} />
        </View>

        {/* Botão para adicionar novo agendamento */}
        <View style={styles.footer}>
          <ButtonNewSchedule onPress={handleNewSchedule} />
        </View>

        {/* Popup para inserção ou edição de agendamentos */}
        <Popup
          visible={popupVisible} // Controla a visibilidade do popup
          onClose={handleClosePopup} // Ação ao fechar o popup
          id={0} // ID do agendamento (0 para novo)
          short_description="" // Descrição curta inicial vazia
          starton="" // Data de início inicial vazia
          finishedon="" // Data de término inicial vazia
          full_description="" // Descrição completa inicial vazia
          routeToPopup={routeToPopup} // Define se o popup será de inserção ou edição
        />
      </View>
    </ImageBackground>
  );
};

export default Home;
