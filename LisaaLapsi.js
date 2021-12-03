import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button  } from  'react-native-elements';

export default function LisaaLapsi({navigation}) {
return (
    <View>
      <Text>Koti</Text>
      <Button title='Koti' onPress={() => navigation.navigate('Koti')} />
      <Text>Haku</Text>
      <Button title='Haku' onPress={() => navigation.navigate('Haku')} />
      <Text>Lisaa</Text>
      <Button title='Lisaa' onPress={() => navigation.navigate('Lisaa')} />
      <Text>Lapset</Text>
      <Button title='Lapset' onPress={() => navigation.navigate('Lapset')} />
    </View>
  );
}
