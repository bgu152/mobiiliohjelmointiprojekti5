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
import MuutaKayttajaa from './MuutaKayttajaa';
import Login from './Login';
import Feedback from './Feedback';
import {TunnusTarjoaja } from './komponentit/userContext';
import Rekisteroityminen from './Rekisteroityminen';


const Stack = createStackNavigator();

export default function App() {


return (
  <TunnusTarjoaja>
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
         <Stack.Screen name = 'Login' component ={Login}
         options={{
          title: 'Tervetuloa!',
        }}
         />
        <Stack.Screen name = 'Koti' component ={Koti}
        options={{
          title: 'Komero',
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
          title: 'Vaatten tiedot',
        }}/>
        <Stack.Screen name = 'Rekisteroityminen' component ={Rekisteroityminen}
         options={{
          title: 'Rekisteröityminen',
        }}/>
        <Stack.Screen name = 'Feedback' component ={Feedback}
         options={{
          title: 'Palaute',
        }}/>
        <Stack.Screen name = 'MuutaKayttajaa' component ={MuutaKayttajaa}
         options={{
          title: 'Profiiliasetukset',
        }}/>
        
      </Stack.Navigator>
    </NavigationContainer>
    </TunnusTarjoaja>
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
