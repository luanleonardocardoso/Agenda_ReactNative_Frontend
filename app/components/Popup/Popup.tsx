import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
} from "react-native";
import styles from "./Styles";
import { PopupProps } from "./Interfaces";
import { API_URL } from "../../Config/Config";

const UPDATE_API_URL = `${API_URL}update-schedule`;
const CREATE_API_URL = `${API_URL}create-schedule`;
const DELETE_API_URL = `${API_URL}delete-schedule`;

// 🔥 Converte "YYYY-MM-DDTHH:mm" → "DD/MM/YYYY HH:mm"
const formatDateTimeForInput = (dateTime: string) => {
  if (!dateTime) return "";
  const [datePart, timePart] = dateTime.split("T");
  if (!datePart || !timePart) return "";
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

// 🔥 Converte "DD/MM/YYYY HH:mm" → "YYYY-MM-DD HH:mm:ss"
const formatDateTimeForAPI = (dateTime: string) => {
  const [day, month, yearHour] = dateTime.split("/");
  const [year, hourMinute] = yearHour.split(" ");
  const [hour, minute] = hourMinute.split(":");
  return `${year}-${month}-${day} ${hour}:${minute}:00`;
};

// 🔥 Máscara de entrada para "DD/MM/YYYY HH:mm"
const applyDateMask = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  let formatted = "";
  if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
  if (cleaned.length > 2) formatted += "/" + cleaned.substring(2, 4);
  if (cleaned.length > 4) formatted += "/" + cleaned.substring(4, 8);
  if (cleaned.length > 8) formatted += " " + cleaned.substring(8, 10);
  if (cleaned.length > 10) formatted += ":" + cleaned.substring(10, 12);
  return formatted;
};

const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  id,
  short_description,
  starton,
  finishedon,
  full_description,
  routeToPopup,
}) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [popupRoute, setPopupRoute] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    title: false,
    start: false,
    end: false,
  });

  useEffect(() => {
    if (visible) {
      setPopupRoute(routeToPopup);

      if (routeToPopup === "update_delete") {
        setTitle(short_description);
        setStart(formatDateTimeForInput(starton));
        setEnd(formatDateTimeForInput(finishedon));
        setDescription(full_description);
      } else {
        setTitle("");
        setStart("");
        setEnd("");
        setDescription("");
      }

      setIsModified(false);
      setErrors({ title: false, start: false, end: false });
    }
  }, [
    visible,
    short_description,
    starton,
    finishedon,
    full_description,
    routeToPopup,
  ]);

  const validateFields = () => {
    let hasError = false;
    const newErrors = { title: false, start: false, end: false };

    if (!title.trim()) {
      newErrors.title = true;
      hasError = true;
    }
    if (start.length < 16) {
      newErrors.start = true;
      hasError = true;
    }
    if (end.length < 16) {
      newErrors.end = true;
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos obrigatórios corretamente."
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    const formattedStart = formatDateTimeForAPI(start);
    const formattedEnd = formatDateTimeForAPI(end);

    if (popupRoute === "update_delete") {
      const updatedData = {
        id,
        short_description: title,
        full_description: description,
        starton: formattedStart,
        finishedon: formattedEnd,
      };

      try {
        const response = await fetch(UPDATE_API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        const result = await response.json();

        if (response.ok) {
          Alert.alert("Sucesso", "Agendamento atualizado com sucesso!");
          onClose();
        } else {
          Alert.alert(
            "Erro",
            result.message || "Falha ao atualizar o agendamento."
          );
        }
      } catch (error) {
        console.error("❌ Erro ao conectar com a API:", error);
        Alert.alert(
          "Erro",
          "Não foi possível atualizar o agendamento. Verifique sua conexão."
        );
      }
    } else {
      const newSchedule = {
        short_description: title,
        full_description: description,
        starton: formattedStart,
        finishedon: formattedEnd,
      };

      try {
        const response = await fetch(CREATE_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSchedule),
        });

        const result = await response.json();

        if (response.ok) {
          Alert.alert("Sucesso", "Novo agendamento criado com sucesso!");
          onClose();
        } else {
          Alert.alert(
            "Erro",
            result.message || "Falha ao criar o agendamento."
          );
        }
      } catch (error) {
        console.error("❌ Erro ao conectar com a API:", error);
        Alert.alert(
          "Erro",
          "Não foi possível criar o agendamento. Verifique sua conexão."
        );
      }
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Atenção",
      "Você está prestes a excluir este compromisso da sua agenda. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await fetch(`${DELETE_API_URL}?id=${id}`, {
                method: "DELETE",
              });

              const result = await response.json();

              if (response.ok) {
                Alert.alert("Sucesso", "Compromisso excluído com sucesso.");
                onClose(); // 🔥 Fecha o popup após excluir
              } else {
                Alert.alert(
                  "Erro",
                  result.message || "Erro ao excluir compromisso."
                );
              }
            } catch (error) {
              console.error("❌ Erro ao conectar com a API:", error);
              Alert.alert("Erro", "Falha ao se comunicar com o servidor.");
            }
          },
        },
      ]
    );
  };

  const handleInsert = async () => {
    if (!validateFields()) return;

    const newSchedule = {
      short_description: title,
      full_description: description,
      starton: formatDateTimeForAPI(start),
      finishedon: formatDateTimeForAPI(end),
    };

    try {
      const response = await fetch(CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Novo agendamento criado com sucesso!");
        onClose();
      } else {
        Alert.alert("Erro", result.message || "Falha ao criar o agendamento.");
      }
    } catch (error) {
      console.error("❌ Erro ao conectar com a API:", error);
      Alert.alert(
        "Erro",
        "Não foi possível criar o agendamento. Verifique sua conexão."
      );
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.popupContainer}>
            {/* 🔥 Botão de Fechar */}
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Image
                source={require("../../../assets/images/close.png")}
                style={styles.closeImage}
              />
            </TouchableOpacity>

            {/* 🔥 Campo Título */}
            <TextInput
              style={[styles.titleInput, errors.title && styles.errorInput]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setIsModified(true);
              }}
              placeholder={popupRoute === "insert" ? "Digite um título" : ""}
            />

            {/* 🔥 Campo Início */}
            <Text style={styles.subtitle}>Início:</Text>
            <TextInput
              style={[styles.textInput, errors.start && styles.errorInput]}
              value={start}
              onChangeText={(text) => {
                setStart(applyDateMask(text));
                setIsModified(true);
              }}
              placeholder={popupRoute === "insert" ? "dd/mm/aaaa hh:mm" : ""}
              maxLength={16}
              keyboardType="numeric"
            />

            {/* 🔥 Campo Término */}
            <Text style={styles.subtitle}>Término:</Text>
            <TextInput
              style={[styles.textInput, errors.end && styles.errorInput]}
              value={end}
              onChangeText={(text) => {
                setEnd(applyDateMask(text));
                setIsModified(true);
              }}
              placeholder={popupRoute === "insert" ? "dd/mm/aaaa hh:mm" : ""}
              maxLength={16}
              keyboardType="numeric"
            />

            {/* 🔥 Campo Descrição */}
            <Text style={styles.subtitle}>Descrição:</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setIsModified(true);
              }}
              placeholder={
                popupRoute === "insert" ? "Insira uma descrição (opcional)" : ""
              }
              multiline
            />

            {/* 🔥 Botões */}
            <View style={styles.buttonContainer}>
              {/* 🔥 Exibir botão "Excluir" apenas se for update_delete */}
              {popupRoute === "update_delete" && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              )}

              {/* 🔥 Botão "Salvar" - Faz UPDATE ou INSERT dependendo da rota */}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: isModified ? "#007bff" : "#ccc" },
                ]}
                disabled={!isModified}
                onPress={
                  popupRoute === "update_delete" ? handleSave : handleInsert
                }
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Popup;
