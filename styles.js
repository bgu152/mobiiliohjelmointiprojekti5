
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    listcontainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'center'
    },
    listItemcontainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    }, 
    picker:{
        backgroundColor: '#abafb1',
    }
  });