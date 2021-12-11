
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
      width : 100,
      height : 100,
    },
    imgNarrow:{
      height:150,
      width:300,
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
    pickertekstiBoksiBD:{
      paddingTop:12,
      flex:1,

    },

    pickertekstiBD:{
      color:'grey',
      fontSize:18,
    },

    napitRivissa: {
      flexDirection:'row',
      alignContent:'flex-end'
    },
    
    pickerBoksi:{
      flex:1,      
      paddingRight:70,
      marginRight:10,
    },
    bdaypickerBoksi:{
      flex:1,      
      paddingRight:10,
      marginRight:10,
    },

    //Kotisivun stylit
    kuvarivi:{
      flex:1,
      flexDirection:'row',
      width : 500,
      height : 500
    },
    touchable:{
      flex:1,
       zIndex: 1,
       height:500,
      width:500
    },
    body: {
      backgroundColor: 'yellow',
      padding:20
    },
    images:{
      width :  180,
      height: 130
    },
  
    kuvateksti:{
      fontSize:20,
    },

    imageFlex:{
      flexDirection:'row',
      marginLeft:10,
      marginBottom:50,
      marginTop: 25,
    },
    buttonTitle :{
      color: 'grey',
    },
    buttonBackground:{
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: 'grey',
      borderRadius: 5,
      width:200,
  }
    


    

  });
