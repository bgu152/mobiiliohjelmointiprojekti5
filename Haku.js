import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar, SearchBar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker';
import {Dimensions} from 'react-native'



import styles from './styles';
import db from './komponentit/Tietokanta';
import takki from './assets/takki.png';
import outfit from './assets/outfit.png';
import housut from './assets/housut.png';
import mekko from './assets/mekko.png';

export default function Haku({ route, navigation }) {

  const [nimiinput, setNimiinput] = useState('');
  const [kategoriainput, setKategoriainput] = useState('');
  const [kategoriat, setKategoriat] = useState([]);
  const [lapset, setLapset] = useState([]);

  const [vaatekappaleet, setVaatekappaleet] = useState([]);

  useEffect(() => {
    ListaaVaatteet();
    ListaaLapset();
    ListaaKategoriat()
  }, []);

  async function ListaaKategoriat() {
    let lista = [];
    const snapshot = await getDocs(collection(db, "vaatekategoriat"));
    snapshot.forEach((doc) => {
      let uusiKategoria = { kategoria: '' };
      uusiKategoria.kategoria = doc.id;
      lista = [...lista, uusiKategoria];
    });
    setKategoriat(lista);
  };

  async function ListaaLapset() {
    let lista = [];
    const snapshot = await getDocs(collection(db, "lapset"));
    snapshot.forEach((doc) => {
      let uusiLapsi = { nimi: '', spaiva: '' };
      uusiLapsi.nimi = doc.id;
      uusiLapsi.spaiva = doc.data().spaiva;
      lista = [...lista, uusiLapsi];
    });
    setLapset(lista);
  };


  async function ListaaVaatteet() {
    let lista = [];
    const vaattetRef = collection(db, "vaatekappaleet");
    var q;
    q = query(vaattetRef);


    if (nimiinput && kategoriainput) {
      q = query(vaattetRef, where("lapsi", "==", nimiinput), where("kategoria", "==", kategoriainput));
    } else if (nimiinput) {
      q = query(vaattetRef, where("lapsi", "==", nimiinput));
    } else if (kategoriainput) {
      q = query(vaattetRef, where("kategoria", "==", kategoriainput));
    }
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      let uusiVaatekappale = { id: '', lapsi: '', pituudelle: '', kuvaus: '', kategoria: '', lisattypvm: '', kuvalinkki:'' };
      uusiVaatekappale.id = doc.id;
      if (doc.data()) {
        uusiVaatekappale.lapsi = doc.data().lapsi;
        console.log(doc.data.kategoria);
      } else {
        console.log("Ei löydy dokumenttia");
      }

      if (doc.data()?.pituudelle) {
        uusiVaatekappale.pituudelle = doc.data().pituudelle;
      }
      if (doc.data()?.kuvaus) {
        uusiVaatekappale.kuvaus = doc.data().kuvaus;
      }
      if (doc.data()?.kategoria) {
        uusiVaatekappale.kategoria = doc.data().kategoria;
      }
      if (doc.data()?.lisattypvm) {
        uusiVaatekappale.lisattypvm = doc.data().lisattypvm;
      }
      if (doc.data()?.kuvalinkki) {
        console.log('Olemassa kuvalinkki');
        uusiVaatekappale.lisattypvm = doc.data().kuvalinkki;
      }

      lista = [...lista, uusiVaatekappale];
    });
    setVaatekappaleet(lista);
  };


  const updateVaatekappaleet = () => {
    setVaatekappaleet([]);
    ListaaVaatteet()
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
      <Avatar source={{ uri: item.kuvalinkki }} style={{ width: 70, height: 70 }} />
      <ListItem.Content>
        <ListItem.Title style={{ fontSize: 18 }} >{capitalizeFirstLetter(item.kuvaus)} </ListItem.Title>
        <View style={styles.listItemcontainer}>
          <ListItem.Subtitle>Käyttäjä: {capitalizeFirstLetter(item.lapsi)}</ListItem.Subtitle>
        </View>
        <View style={styles.listItemcontainer}>
          <ListItem.Subtitle>Lisätty: {item.lisattypvm}</ListItem.Subtitle>
        </View>
        <View style={styles.listItemcontainer}>
          <ListItem.Subtitle>Pituudelle: {item.pituudelle} cm</ListItem.Subtitle>
        </View>
        <View style={styles.listItemcontainer}>
          <ListItem.Subtitle>kuvalinkki: {item.kuvalinkki} </ListItem.Subtitle>
        </View>
      </ListItem.Content>
    </ListItem>
    </ListItem.Swipeable>
  );



  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getAvatar(item) {
    if (!item.kategoria) {
      return outfit;
    } else if (item.kategoria == 'housut') {
      return housut;
    } else if (item.kategoria == 'takki') {
      return takki;
    } else if (item.kategoria == 'mekko') {
      return mekko;
    } else {
      return outfit;
    }
  }
function getAvatarKuvalla(item) {
  console.log('getAvatarKuvalla');
  console.log(item.kuvalinkki);
  if(!item.kuvalinkki){
    return getAvatar(item);
  }else{
    return { uri: item.kuvalinkki };
  }
  
}


  async function deleteFromDatabase(id) {
    console.log('deleteting: ' + id);
    await deleteDoc(doc(db, 'vaatekappaleet', id));
    updateVaatekappaleet();
  }

  return (
    <SafeAreaView >
      
      <View>
        <View >
          <Picker
            enabled={true}
            mode="dropdown"
            onValueChange={(itemValue) => { setKategoriainput(itemValue) }}
            selectedValue={kategoriainput}
          >
            {kategoriat.map((item) => <Picker.Item
              label={capitalizeFirstLetter(item.kategoria)}
              value={item.kategoria}
              key={item.kategoria.toString()} />
            )}
            <Picker.Item label="Kaikki" value="" id="1" />
          </Picker>
        </View>

        <View>
          <Picker
            style={styles.picker}          
            enabled={true}
            mode="dropdown"
            onValueChange={(itemValue) => { setNimiinput(itemValue) }}
            selectedValue={nimiinput}
          >
            {lapset.map((item) => <Picker.Item
              label={capitalizeFirstLetter(item.nimi)}
              value={item.nimi}
              key={item.nimi} />
            )}
            <Picker.Item label="Kaikki" value="" id="1" />
          </Picker>
        </View>
      </View>
      <Button
        mode="contained"
        title='Hae'
        onPress={updateVaatekappaleet}
      >
        Enter
      </Button>




      {/* <Button title='Hae vaatekappaleet' onPress={() => navigation.navigate('Koti')} />
      <Text>Koti</Text>
      <Button title='Koti' onPress={() => navigation.navigate('Koti')} />
      <Text>Lisaa2</Text>
      <Button title='Lisaa2' onPress={() => navigation.navigate('Lisaa2')} />
      <Text>Lapset</Text>
      <Button title='Lapset' onPress={() => navigation.navigate('Lapset')} />
      <Text>LisaaLapsi</Text>
      <Button title='LisaaLapsi' onPress={() => navigation.navigate('LisaaLapsi')} /> */}
      <FlatList
        style={{ marginLeft: "5%" }}
        renderItem={renderKaikki}
        data={vaatekappaleet}
      />

    </SafeAreaView>
  );
}
