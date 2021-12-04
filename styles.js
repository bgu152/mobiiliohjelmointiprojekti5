
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
    },
    images:{
      width : 200,
      height : 200
    },
    bannerImg:{      
      width : 500,
      height : 300,      
    },
    bannerImg2:{//Lisaa använder      
      width : 500,
      height : 100,      
    },
    //for Lisaa text
    selite: {
      fontSize: 25,
      textAlign: 'center',
      marginTop:10,
      marginBottom:20,

    },
    picker:{
      width: 250,
      height: 44,
      borderColor:'grey',
      borderEndColor:1,
      marginBottom:5,
    }, 
    pickerTeksti:{
      color:'grey',
      fontSize:20,
    },
    pickertekstiBoksi:{
      borderRightWidth:1,
      borderRightColor:'#dadde1',
      borderStyle:'solid',
      borderTopColor:'#989ba0',
      borderBottomWidth:0,
      borderWidth:0

    },

    napitRivissa: {
      flexDirection:'row',

    }
  });