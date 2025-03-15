import React, { useState } from 'react';
import { View, StatusBar, ImageBackground } from 'react-native';
import CustomCalendar from '../../components/Calendar/Calendar'; 
import Logo from '../../components/Logo/Logo'; 
import ButtonNewSchedule from '../../components/ButtonNewSchedule/ButtonNewSchedule'; 
import Popup from '../../components/Popup/Popup'; 
import styles from './Styles';

const backgroundImage = require('../../../assets/images/background.jpg');

const Home = () => {
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [routeToPopup, setRouteToPopup] = useState<string | null>(null);
  const [refreshCalendar, setRefreshCalendar] = useState<boolean>(false);

  const handleNewSchedule = () => {
    setRouteToPopup('insert');
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setRouteToPopup(null);
    setRefreshCalendar((prev) => !prev);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        <View style={styles.calendarContainer}>
          <CustomCalendar refresh={refreshCalendar} />
        </View>

        <View style={styles.footer}>
          <ButtonNewSchedule onPress={handleNewSchedule} />
        </View>

        <Popup
          visible={popupVisible}
          onClose={handleClosePopup} 
          id={0} 
          short_description=""
          starton=""
          finishedon=""
          full_description=""
          routeToPopup={routeToPopup} 
        />
      </View>
    </ImageBackground>
  );
};

export default Home;
