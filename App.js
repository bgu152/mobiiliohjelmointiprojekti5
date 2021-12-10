import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer} from'@react-navigation/native';
import { createStackNavigator} from'@react-navigation/stack';
import { getHeaderTitle } from '@react-navigation/elements';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Lisaa2 from './Lisaa2';
import Haku from './Haku';
import Koti from './Koti';
import Lapset from './Lapset';
import LisaaLapsi from './LisaaLapsi';
import Kuvat from './Kuvat';
import MuutaLapsi from './MuutaLapsi';
import MuutaVaatekappale from './MuutaVaate';
import Login from './Login';
import { UserContext } from './komponentit/userContext';





const Stack = createStackNavigator();

export default function App() {
const [tunnus,setTunnus] = useState('erik');
const [logintiedot,setLogintiedot] = useState(null);


const [appReady, setAppReady] = useState(false);

const checkLoginCredentials = ()=>{
  AsyncStorage.getItem('appCredentials')
  .then((result)=> {
    if (result !== null){
      setLogintiedot(JSON.parse(result))
    }else{
      setLogintiedot(null);
    }
  })
  .catch(error => console.error(error))
}


if (!appReady){
  return <AppLoading
  startAsync = {checkLoginCredentials}
  onFinish = {()=> setAppReady(true)}
  onError = {console.warn}
  />
}

return (
  <UserContext.Provider value={{tunnus:tunnus}}>
    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: 
        { backgroundColor: '#73a657',},
        headerTitleStyle: {
          fontSize: 25,
        },
      }}      
      >
        <Stack.Screen name = 'Koti' component ={Koti}
        options={{
          title: 'Tervetuloa!',
        }}/>
        <Stack.Screen name = 'Haku' component ={Haku}
        options={{
          title: 'Hae vaatteita',
        }}/>
        <Stack.Screen name = 'Lisaa2' component ={Lisaa2}
        options={{
          title: 'Lisää vaatekappale',
        }}
        />
        <Stack.Screen name = 'Lapset' component ={Lapset}
        />
        <Stack.Screen name = 'LisaaLapsi' component ={LisaaLapsi}
        options={{
          title: 'Tallenna lapsen tiedot',
        }}/>
        <Stack.Screen name = 'Kuvat' component ={Kuvat}
        options={{
          title: 'Ota kuva ja tallenna',
        }}/>
        <Stack.Screen name = 'MuutaLapsi' component ={MuutaLapsi}
        options={{
          title: 'Muuta lapsen tiedot',
        }}/>
        <Stack.Screen name = 'MuutaVaatekappale' component ={MuutaVaatekappale}
        options={{
          title: 'Muuta vaatteen tiedot',
        }}/>
         <Stack.Screen name = 'Login' component ={Login}/>
      </Stack.Navigator>
    </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
