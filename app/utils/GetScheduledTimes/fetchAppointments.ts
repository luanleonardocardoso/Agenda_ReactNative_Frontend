import axios from "axios";
import { API_URL } from "../../Config/Config"; // ✅ Importando API_URL centralizada
import { Appointment, ApiResponse } from "./Interfaces"; // ✅ Importando as interfaces separadas

// Função para formatar as datas no formato correto para MySQL (sem UTC +3)
const formatDateTime = (date: Date): string => {
  return date.toISOString().split("T")[0] + " 00:00:00"; // Mantendo HH:mm:ss fixo em 00:00:00
};

// Função para buscar compromissos do mês atual mostrado no calendário
export const fetchAppointments = async (year: number, month: number): Promise<Appointment[]> => {
  try {
    // 🔹 Primeiro e último dia do mês atual (sem conversão de fuso horário)
    const startDate = `${year}-${String(month).padStart(2, "0")}-01 00:00:00`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()} 23:59:59`;

    // 🔥 Fazer a requisição GET para a API com tipagem explícita
    const response = await axios.get<ApiResponse>(`${API_URL}scheduled-times`, {
      params: { starton: startDate, finishedon: endDate },
    });

    return response.data.data; // ✅ Retornando os compromissos diretamente
  } catch (error) {
    console.error("❌ Erro ao buscar compromissos:", error);
    return [];
  }
};
