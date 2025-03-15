import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home/Home'; // 🔥 Tela principal
import ScheduledDay from '../Screens/ScheduledDay/ScheduledDay'; // 🔥 Tela de detalhes do dia agendado

const Stack = createStackNavigator();

const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="ScheduledDay" component={ScheduledDay} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigation;
