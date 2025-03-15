import { StyleSheet, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight || 20, 
  },
  logoContainer: {
    marginBottom: 10,
    marginTop: 20,
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footer: {
    position: 'absolute', 
    bottom: 20, 
    width: '100%', 
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default styles;
