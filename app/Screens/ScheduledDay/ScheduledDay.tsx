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
  
  // Obtendo os parâmetros passados para a tela (datas)
  const { starton, finishedon } = route.params as {
    starton: string;
    finishedon: string;
  };

  // Estado para armazenar compromissos
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado para indicar carregamento dos compromissos
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para controlar a exibição do popup
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  // Estado para armazenar o compromisso selecionado
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  // Estado para definir se o popup será para inserção ou edição/exclusão
  const [routeToPopup, setRouteToPopup] = useState<string | null>(null);

  // Formata a data para exibição no cabeçalho (DD/MM/YYYY)
  const formattedDate = starton.split(" ")[0].split("-").reverse().join("/");

  // Função para buscar compromissos na API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ success: boolean; data: Appointment[] }>(
        `${API_URL}scheduled-times`,
        { params: { starton, finishedon } }
      );

      setAppointments(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar compromissos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chama a função para buscar compromissos sempre que as datas mudam
  useEffect(() => {
    fetchAppointments();
  }, [starton, finishedon]);

  // Fecha o popup e atualiza a lista de compromissos
  const handlePopupClose = () => {
    setPopupVisible(false);
    setRouteToPopup(null);
    fetchAppointments();
  };

  // Abre o popup para inserir um novo compromisso
  const handleNewSchedule = () => {
    setRouteToPopup("insert");
    setPopupVisible(true);
  };

  // Abre o popup para editar/excluir um compromisso existente
  const handleAppointmentPress = (appointment: Appointment) => {
    setRouteToPopup("update_delete");
    setSelectedAppointment(appointment);
    setPopupVisible(true);
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Barra de navegação com botão de voltar e título da agenda */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={require("../../../assets/images/left.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Agenda {formattedDate}</Text>
        </View>

        {/* Tabela de compromissos */}
        <View style={styles.table}>
          {/* Cabeçalho da tabela */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.headerText]}>Horário</Text>
            <Text style={[styles.cell, styles.headerText]}>Atividade</Text>
          </View>

          {/* Exibição dos compromissos */}
          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : appointments.length > 0 ? (
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => handleAppointmentPress(item)}>
                  <View
                    style={[
                      styles.row,
                      index < appointments.length - 1 && styles.separator,
                    ]}
                  >
                    <Text style={styles.cell}>{`${item.starton.slice(
                      11,
                      16
                    )} - ${item.finishedon.slice(11, 16)}`}</Text>
                    <Text style={styles.cell}>{item.short_description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>Nenhum compromisso encontrado</Text>
          )}
        </View>

        {/* Popup para edição/adição de compromissos */}
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

        {/* Botão para adicionar um novo compromisso */}
        <View style={styles.footer}>
          <ButtonNewSchedule onPress={handleNewSchedule} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Schedule;