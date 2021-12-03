import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';

import db from './komponentit/Tietokanta';

export default function Lapset({navigation}) {

  const [lapset, setLapset] = useState([]);

  useEffect(() => {
    ListaaLapset()
  }, []);

  async function ListaaLapset() {
    let lista = [];
    const snapshot = await getDocs(collection(db, "lapset"));
    snapshot.forEach((doc) => {
        let uusiLapsi = { nimi: '', spaiva:''};
        uusiLapsi.nimi = doc.id;
        uusiLapsi.spaiva = doc.data().spaiva;    
        lista = [...lista, uusiLapsi];
    });
    setLapset(lista);
};


const updateLapset = () =>{
  setLapset([]);
  ListaaLapset()
}

async function deleteFromDatabase(id) {
  console.log('deleteting: ' + id);
  await deleteDoc(doc(db, 'lapset', id));
  updateLapset();
}

const renderKaikki = ({ item }) => (
  <ListItem.Swipeable
  leftContent={
    <Button
      title="Muuta"
      icon={{ name: 'update', color: 'white' }}
      buttonStyle={{ minHeight: '100%' }}
    />
  }
  rightContent={
    
    <Button
    onPress={() => deleteFromDatabase(item.id)} 
      title="Poista"
      icon={{ name: 'delete', color: 'white' }}
      buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
    />
  }
>
  <ListItem style={styles.listcontainer} bottomDivider>
    {/* <Avatar source={getAvatar(item)} style={{ width: 70, height: 70 }}/> */}
    <ListItem.Content>
      <ListItem.Title style={{ fontSize: 18 }} >{item.nimi} </ListItem.Title>

      <ListItem>
        <Button title="Kuva" />
      </ListItem>
    </ListItem.Content>
  </ListItem>
  
  </ListItem.Swipeable>
);


return (
  <View>
        <View>
      <Text>Koti</Text>
      <Button title='Koti' onPress={() => navigation.navigate('Koti')} />
      <Text>Haku</Text>
      <Button title='Haku' onPress={() => navigation.navigate('Haku')} />
      <Text>Lisaa</Text>
      <Button title='Lapset' onPress={() => navigation.navigate('Lisaa2')} />
      <Text>LisaaLapsi</Text>
      <Button title='LisaaLapsi' onPress={() => navigation.navigate('LisaaLapsi')} />
    </View>



    <Text>Lapset</Text>
    <FlatList
      style={{ marginLeft: "5%" }}
      keyExtractor = {(item) => item.nimi}
      renderItem={renderKaikki}
      data={lapset}
    />
  </View>
);
}



const styles = StyleSheet.create({
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
  }
});


























