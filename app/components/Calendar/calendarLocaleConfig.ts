import { LocaleConfig } from "react-native-calendars";

// 🔹 Definição manual dos textos para PT-BR
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ],
  monthNamesShort: [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ],
  dayNames: [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje"
};

// Define o idioma padrão como PT-BR
LocaleConfig.defaultLocale = "pt-br";

export default LocaleConfig;
