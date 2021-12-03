import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer} from'@react-navigation/native';
import { createStackNavigator} from'@react-navigation/stack';



import Lisaa from './Lisaa';
import Haku from './Haku';
import Koti from './Koti';
import Lapset from './Lapset';
import LisaaLapsi from './LisaaLapsi';
import Lisaa2 from './Lisaa2'


const Stack = createStackNavigator();


export default function App() {
return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name = 'Koti' component ={Koti}/>
        <Stack.Screen name = 'Haku' component ={Haku}/>
        <Stack.Screen name = 'Lisaa' component ={Lisaa}/>
        <Stack.Screen name = 'Lisaa2' component ={Lisaa2}/>
        <Stack.Screen name = 'Lapset' component ={Lapset}/>
        <Stack.Screen name = 'LisaaLapsi' component ={LisaaLapsi}/>
      </Stack.Navigator>
    </NavigationContainer>
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
