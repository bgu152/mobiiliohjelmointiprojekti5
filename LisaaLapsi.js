import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button  } from  'react-native-elements';
import { Image, Platform } from 'react-native';

export default function LisaaLapsi({navigation}) {
return (
    <View>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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
