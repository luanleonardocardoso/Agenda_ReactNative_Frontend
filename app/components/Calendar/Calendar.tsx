import React, { useState, useEffect, useCallback } from "react";
import { View, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Calendar, DateData } from "react-native-calendars";
import moment from "moment";
import "moment/locale/pt-br";
import { fetchAppointments } from "../../utils/GetScheduledTimes/fetchAppointments";
import styles from "./Styles";
import { NavigationProps } from "../../Config/NavigationTypes";
import { CustomCalendarProps } from "./Interfaces";
import "./calendarLocaleConfig";

// Importação das imagens para navegação no calendário e indicador de carregamento
const leftArrow = require("../../../assets/images/left.png");
const rightArrow = require("../../../assets/images/right.png");
const loadingGif = require("../../../assets/images/loading.gif");

// Define o idioma do moment como português
moment.locale("pt-br");

const CustomCalendar: React.FC<CustomCalendarProps> = ({ refresh }) => {
  const navigation = useNavigation<NavigationProps>();
  const today = new Date();
  
  // Estado para armazenar o dia selecionado
  const [selected, setSelected] = useState<string>(today.toISOString().split("T")[0]);
  
  // Estados para armazenar o mês e o ano atuais
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  
  // Estado para armazenar os compromissos marcados no calendário
  const [appointments, setAppointments] = useState<Record<string, any>>({});
  
  // Estado para controlar a exibição do indicador de carregamento
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para obter o último dia de um mês específico
  const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Função assíncrona para carregar os compromissos do mês e ano selecionados
  const loadAppointments = async (year: number, month: number) => {
    try {
      setIsLoading(true); // Ativa o estado de carregamento
      const data = await fetchAppointments(year, month); // Busca os compromissos na API
      const todayDate = new Date();
      const todayDay = todayDate.getDate();

      let markedDates: Record<string, any> = {};

      // Se houver compromissos, marca os dias no calendário
      if (data && data.length > 0) {
        markedDates = data.reduce(
          (acc: Record<string, any>, appointment: any) => {
            if (appointment.starton) {
              const dateKey = new Date(appointment.starton).toISOString().split("T")[0];
              acc[dateKey] = {
                customStyles: {
                  text: {
                    color: "#00FF00", // Destaca os dias com compromissos em verde
                    fontWeight: "bold",
                  },
                },
              };
            }
            return acc;
          },
          {}
        );
      }

      // Desabilita dias passados do mês atual
      if (year === todayDate.getFullYear() && month === todayDate.getMonth() + 1) {
        for (let day = 1; day < todayDay; day++) {
          const pastDay = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          markedDates[pastDay] = {
            disabled: true,
            textColor: "#f08080", // Exibe dias passados em vermelho
          };
        }
      }

      setAppointments(markedDates); // Atualiza os compromissos no estado
    } catch (error) {
      console.error("Erro ao carregar compromissos:", error);
      setAppointments({}); // Em caso de erro, define um objeto vazio
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  // Atualiza o estado ao mudar o mês no calendário
  const handleMonthChange = (month: { month: number; year: number }) => {
    setCurrentMonth(month.month);
    setCurrentYear(month.year);
  };

  // Manipula a seleção de um dia no calendário
  const handleDayPress = (day: DateData) => {
    // Se o dia estiver desativado, a ação não deve continuar
    if (!day || !day.dateString || appointments[day.dateString]?.disabled) return;

    setSelected(day.dateString); // Atualiza o estado do dia selecionado

    // Define o intervalo de tempo para o dia selecionado
    const starton = `${day.dateString} 00:00:00`;
    const finishedon = `${day.dateString} 23:59:59`;

    // Navega para a tela de compromissos do dia
    navigation.navigate("ScheduledDay", { starton, finishedon });
  };

  // Carrega os compromissos ao montar o componente ou quando o mês/ano mudam
  useEffect(() => {
    loadAppointments(currentYear, currentMonth);
  }, [currentYear, currentMonth, refresh]);

  // Recarrega os compromissos ao voltar para a tela
  useFocusEffect(
    useCallback(() => {
      loadAppointments(currentYear, currentMonth);
    }, [currentYear, currentMonth])
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        {isLoading ? (
          // Exibe o GIF de carregamento enquanto os compromissos estão sendo carregados
          <Image source={loadingGif} style={styles.loadingGif} />
        ) : (
          <Calendar
            locale="pt-br" // Define o idioma para português
            current={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
            minDate={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
            maxDate={`${currentYear}-${String(currentMonth).padStart(2, "0")}-${getLastDayOfMonth(currentYear, currentMonth)}`}
            onDayPress={handleDayPress} // Define a função ao clicar em um dia
            onMonthChange={handleMonthChange} // Atualiza o estado ao mudar o mês
            markingType="custom" // Usa marcação personalizada para os dias
            markedDates={appointments} // Aplica os compromissos carregados
            renderArrow={(direction: "left" | "right") => (
              <Image source={direction === "left" ? leftArrow : rightArrow} style={styles.arrow} />
            )}
            style={[styles.calendarSize, { borderRadius: 10, overflow: "hidden" }]}
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "rgba(0, 0, 0, 0.5)",
              textSectionTitleColor: "#ffffff",
              todayTextColor: "#ffcc00",
              dayTextColor: "#ffffff",
              textDisabledColor: "#f08080",
              monthTextColor: "#ffffff",
              textDayFontWeight: "bold",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
              textDayFontSize: 20,
              textMonthFontSize: 22,
              textDayHeaderFontSize: 14,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default CustomCalendar;