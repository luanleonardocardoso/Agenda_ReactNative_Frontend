import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
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

// Define URLs das APIs para criar, atualizar e excluir agendamentos
const UPDATE_API_URL = `${API_URL}update-schedule`;
const CREATE_API_URL = `${API_URL}create-schedule`;
const DELETE_API_URL = `${API_URL}delete-schedule`;

// Função para formatar a data para exibição no input
const formatDateTimeForInput = (dateTime: string) => {
  if (!dateTime) return "";
  const [datePart, timePart] = dateTime.split("T");
  if (!datePart || !timePart) return "";
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

// Função para converter a data do formato do input para formato de API
const formatDateTimeForAPI = (dateTime: string) => {
  const [day, month, yearHour] = dateTime.split("/");
  const [year, hourMinute] = yearHour.split(" ");
  const [hour, minute] = hourMinute.split(":");
  return `${year}-${month}-${day} ${hour}:${minute}:00`;
};

// Função para aplicar máscara de data no input
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
  // Estados para armazenar os valores dos campos do formulário
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [popupRoute, setPopupRoute] = useState<string | null>(null);
  const [errors, setErrors] = useState({ title: false, start: false, end: false });

  // Efeito que carrega os valores no modal quando ele for aberto
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
  }, [visible, short_description, starton, finishedon, full_description, routeToPopup]);

  // Validação dos campos antes do envio
  const validateFields = () => {
    let hasError = false;
    const newErrors = { title: false, start: false, end: false };

    if (!title.trim()) newErrors.title = hasError = true;
    if (start.length < 16) newErrors.start = hasError = true;
    if (end.length < 16) newErrors.end = hasError = true;

    setErrors(newErrors);

    if (hasError) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios corretamente.");
      return false;
    }

    return true;
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.popupContainer}>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Image source={require("../../../assets/images/close.png")} style={styles.closeImage} />
            </TouchableOpacity>

            <TextInput
              style={[styles.titleInput, errors.title && styles.errorInput]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setIsModified(true);
              }}
              placeholder={popupRoute === "insert" ? "Digite um título" : ""}
            />

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

            <Text style={styles.subtitle}>Descrição:</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setIsModified(true);
              }}
              placeholder={popupRoute === "insert" ? "Insira uma descrição (opcional)" : ""}
              multiline
            />

            <View style={styles.buttonContainer}>
              {popupRoute === "update_delete" && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert("Excluir", "Confirmar exclusão?") }>
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: isModified ? "#007bff" : "#ccc" }]}
                disabled={!isModified}
                onPress={() => Alert.alert("Salvar", "Confirmar salvamento?")}
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
