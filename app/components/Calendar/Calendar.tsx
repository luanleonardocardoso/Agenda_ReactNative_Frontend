import React, { useState, useEffect, useCallback } from "react";
import { View, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Calendar, DateData } from "react-native-calendars";
import moment from "moment";
import "moment/locale/pt-br"; // Garante que moment está no idioma PT-BR
import { fetchAppointments } from "../../utils/GetScheduledTimes/fetchAppointments";
import styles from "./Styles";
import { NavigationProps } from "../../Config/NavigationTypes";
import { CustomCalendarProps } from "./Interfaces";
import "./calendarLocaleConfig"; 

const leftArrow = require("../../../assets/images/left.png");
const rightArrow = require("../../../assets/images/right.png");
const loadingGif = require("../../../assets/images/loading.gif");

moment.locale("pt-br"); // Garante que moment usa PT-BR

const CustomCalendar: React.FC<CustomCalendarProps> = ({ refresh }) => {
  const navigation = useNavigation<NavigationProps>();
  const today = new Date();
  const [selected, setSelected] = useState<string>(today.toISOString().split("T")[0]);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [appointments, setAppointments] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const loadAppointments = async (year: number, month: number) => {
    try {
      setIsLoading(true);
      const data = await fetchAppointments(year, month);
      const todayDate = new Date();
      const todayDay = todayDate.getDate();

      let markedDates: Record<string, any> = {};

      if (data && data.length > 0) {
        markedDates = data.reduce(
          (acc: Record<string, any>, appointment: any) => {
            if (appointment.starton) {
              const dateKey = new Date(appointment.starton)
                .toISOString()
                .split("T")[0];

              acc[dateKey] = {
                customStyles: {
                  text: {
                    color: "#00FF00",
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

      if (year === todayDate.getFullYear() && month === todayDate.getMonth() + 1) {
        for (let day = 1; day < todayDay; day++) {
          const pastDay = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          markedDates[pastDay] = {
            disabled: true,
            textColor: "#f08080",
          };
        }
      }

      setAppointments(markedDates);
    } catch (error) {
      console.error("Erro ao carregar compromissos:", error);
      setAppointments({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (month: { month: number; year: number }) => {
    setCurrentMonth(month.month);
    setCurrentYear(month.year);
  };

  const handleDayPress = (day: DateData) => {
    if (!day || !day.dateString || appointments[day.dateString]?.disabled) return;

    setSelected(day.dateString);

    const starton = `${day.dateString} 00:00:00`;
    const finishedon = `${day.dateString} 23:59:59`;

    navigation.navigate("ScheduledDay", { starton, finishedon });
  };

  useEffect(() => {
    loadAppointments(currentYear, currentMonth);
  }, [currentYear, currentMonth, refresh]);

  useFocusEffect(
    useCallback(() => {
      loadAppointments(currentYear, currentMonth);
    }, [currentYear, currentMonth])
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        {isLoading ? (
          <Image source={loadingGif} style={styles.loadingGif} />
        ) : (
          <Calendar
            locale="pt-br" // Define o idioma corretamente
            current={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
            minDate={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
            maxDate={`${currentYear}-${String(currentMonth).padStart(2, "0")}-${getLastDayOfMonth(currentYear, currentMonth)}`}
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            markingType="custom"
            markedDates={appointments}
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
