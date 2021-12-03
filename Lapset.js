import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button  } from  'react-native-elements';

export default function Lapset({navigation}) {
return (
    <View>
      <Text>Koti</Text>
      <Button title='Koti' onPress={() => navigation.navigate('Koti')} />
      <Text>Haku</Text>
      <Button title='Haku' onPress={() => navigation.navigate('Haku')} />
      <Text>Lisaa</Text>
      <Button title='Lapset' onPress={() => navigation.navigate('Lisaa')} />
      <Text>LisaaLapsi</Text>
      <Button title='LisaaLapsi' onPress={() => navigation.navigate('LisaaLapsi')} />
    </View>
  );
}
