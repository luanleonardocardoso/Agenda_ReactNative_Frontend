import { registerRootComponent } from 'expo';
import Navigation from './app/Routes/NavigationContainer'; // 🔥 Importando a navegação

// 🔥 Registra o app corretamente para o Expo
registerRootComponent(Navigation);

export default Navigation;
