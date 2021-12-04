
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
    sivuotsikko: {
      fontSize: 25,
      textAlign: 'center',
      marginTop:10,
      marginBottom:20,

    },
    picker:{
      width: 150,
      height: 44,
      borderColor:'grey',
    }, 
    pickerTeksti:{
      color:'grey',
      fontSize:15,
    },
    pickertekstiBoksi:{
      paddingTop:17,
      flex:1,

    },

    napitRivissa: {
      flexDirection:'row',
      alignContent:'flex-end'
    },
    
    pickerBoksi:{
      flex:1,      
      paddingRight:70,
      marginRight:10,
    }
    

  });
