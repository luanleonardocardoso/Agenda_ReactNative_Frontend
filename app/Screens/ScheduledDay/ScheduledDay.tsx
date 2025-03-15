import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import Popup from "../../components/Popup/Popup";
import ButtonNewSchedule from "../../components/ButtonNewSchedule/ButtonNewSchedule";
import styles from "./Styles";
import { Appointment } from "./Interfaces"; 
import { API_URL } from "../../Config/Config"; 

const Schedule = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { starton, finishedon } = route.params as {
    starton: string;
    finishedon: string;
  };

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [routeToPopup, setRouteToPopup] = useState<string | null>(null);

  useEffect(() => {
    console.log("routeToPopup atualizado:", routeToPopup);
  }, [routeToPopup]);

  const formattedDate = starton.split(" ")[0].split("-").reverse().join("/");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{
        success: boolean;
        data: Appointment[];
      }>(`${API_URL}scheduled-times`, {
        params: { starton, finishedon },
      });

      setAppointments(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar compromissos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [starton, finishedon]);

  const handlePopupClose = () => {
    setPopupVisible(false);
    setRouteToPopup(null);
    fetchAppointments();
  };

  const handleNewSchedule = () => {
    setRouteToPopup("insert");
    setPopupVisible(true);
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    setRouteToPopup("update_delete");
    setSelectedAppointment(appointment);
    setPopupVisible(true);
  };

  return (
    <ImageBackground source={require("../../../assets/images/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require("../../../assets/images/left.png")} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Agenda {formattedDate}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.headerText]}>Horário</Text>
            <Text style={[styles.cell, styles.headerText]}>Atividade</Text>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : appointments.length > 0 ? (
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => handleAppointmentPress(item)}>
                  <View style={[styles.row, index < appointments.length - 1 && styles.separator]}>
                    <Text style={styles.cell}>{`${item.starton.slice(11, 16)} - ${item.finishedon.slice(11, 16)}`}</Text>
                    <Text style={styles.cell}>{item.short_description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>Nenhum compromisso encontrado</Text>
          )}
        </View>

        <Popup
          visible={popupVisible}
          onClose={handlePopupClose}
          id={selectedAppointment?.id ?? 0}
          short_description={selectedAppointment?.short_description ?? ""}
          starton={selectedAppointment?.starton ?? ""}
          finishedon={selectedAppointment?.finishedon ?? ""}
          full_description={selectedAppointment?.full_description ?? ""}
          routeToPopup={routeToPopup}
        />

        <View style={styles.footer}>
          <ButtonNewSchedule onPress={handleNewSchedule} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Schedule;
