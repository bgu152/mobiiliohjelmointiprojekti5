import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import * as ImagePicker from 'expo-image-picker';



import db from './komponentit/Tietokanta';
import ImagePickerExample from './Kuvat';

export default function Lapset({ navigation }) {

  const [lapset, setLapset] = useState([]);

  const image = "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540bgu152%252Ffirevaatteet5/ImagePicker/5df339dc-6f81-46e4-a857-46553600bd35.jpg";

  useEffect(() => {
    ListaaLapset()
  }, []);

  async function ListaaLapset() {
    let lista = [];
    const snapshot = await getDocs(collection(db, "lapset"));
    snapshot.forEach((doc) => {
      let uusiLapsi = { nimi: '', spaiva: '', kuvalinkki: '' };
      uusiLapsi.nimi = doc.id;
      uusiLapsi.spaiva = doc.data().spaiva;
      uusiLapsi.kuvalinkki = doc.data().kuvalinkki;
      lista = [...lista, uusiLapsi];
    });
    setLapset(lista);
  };


  const updateLapset = () => {
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
        <Avatar rounded  source={{uri: item.kuvalinkki}} style={{ width: 70, height: 70 }} />
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18 }} >{item.nimi} </ListItem.Title>

          <ListItem>
            <Button title='Uusi kuva' onPress={() => navigation.navigate('Kuvat', { osoite: "Lapset", nimi: item.nimi })} />
          </ListItem>
        </ListItem.Content>
      </ListItem>

    </ListItem.Swipeable>
  );


  return (
    <View>

      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

      {/* <View>
        <Text>Koti</Text>
        <Button title='Koti' onPress={() => navigation.navigate('Koti')} />
        <Text>Haku</Text>
        <Button title='Haku' onPress={() => navigation.navigate('Haku')} />
        <Text>Lisaa</Text>
        <Button title='Lapset' onPress={() => navigation.navigate('Lisaa2')} />
        <Text>LisaaLapsi</Text>
        <Button title='LisaaLapsi' onPress={() => navigation.navigate('LisaaLapsi')} />
        <Text>Kuvat</Text>
        <Button title='Kuvat' onPress={() => navigation.navigate('Kuvat', { osoite: "Lapset" })} />
      </View> */}


      <Text>Lapset</Text>
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={(item) => item.nimi}
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


























