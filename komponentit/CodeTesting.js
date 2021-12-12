import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar, SearchBar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { useFormik } from 'formik';

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
    ListaaKategoriat()
  }, []);

  async function ListaaKategoriat() {
    let lista = [];
    const snapshot = await getDocs(collection(db, "lapset"));
    snapshot.forEach((doc) => {
      let uusiKategoria = { kategoria: '' };
      uusiKategoria.kategoria = doc.id;
      lista = [...lista, uusiKategoria];
    });
    setKategoriat(lista);
  };

  async function ListaaLapset() {
    let lista = [];
    const snapshot = await getDocs(collection(db, "vaatekategoriat"));
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
      const snapshot = awaitcollection(db, "vaatekappaleet");
      snapshot.forEach((doc) => {
        let uusiVaatekappale = { id: '', lapsi: '', pituudelle: '', kuvaus: '', kategoria: '', lisattypvm: '' };
        uusiVaatekappale.id = doc.id;
        if (doc.data()) {
          uusiVaatekappale.lapsi = doc.data().lapsi;
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

        lista = [...lista, uusiVaatekappale];
      });
      setVaatekappaleet(lista);
    };
  }


    const updateVaatekappaleet = () => {
      setVaatekappaleet([]);
      ListaaVaatteet()
    }


    const renderKaikki = ({ item }) => (
      <ListItem style={styles.listcontainer} bottomDivider>
        <Avatar source={getAvatar(item)} style={{ width: 70, height: 70 }} />
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18 }} >{capitalizeFirstLetter(item.kuvaus)} </ListItem.Title>
          <View style={styles.listItemcontainer}>
            <ListItem.Subtitle>{capitalizeFirstLetter(item.lapsi)}</ListItem.Subtitle>
          </View>
          <View style={styles.listItemcontainer}>
            <ListItem.Subtitle>Lisätty: {item.lisattypvm}</ListItem.Subtitle>
          </View>
          <View style={styles.listItemcontainer}>
            <ListItem.Subtitle>Pituudelle: {item.pituudelle} cm</ListItem.Subtitle>
          </View>

          <View style={styles.listItemcontainer}>
            <ListItem.Subtitle>ID: {item.id} </ListItem.Subtitle>
          </View>

          <ListItem>
            <Button title="Poista" onPress={() => deleteFromDatabase(item.id)} />
          </ListItem>
        </ListItem.Content>
      </ListItem>
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

    async function deleteFromDatabase(id) {
      console.log('deleteting: ' + id);
      await deleteDoc(doc(db, 'vaatekappaleet', id));
      updateVaatekappaleet();
    }

    const formik = useFormik({
      initialValues: {
        kategoria: '',
        lapsi: '',
      },
      onSubmit: values => {
        console.log(values);
        setKategoriainput(values.kategoria);
        setNimiinput(values.lapsi);
      }
    });


    return (
      <SafeAreaView >

        <Text>vaatekappaleet</Text>
        <Picker
          enabled={true}
          mode="dropdown"
          onValueChange={formik.handleChange('kategoria')}
          selectedValue={formik.values.kategoria}
        >
          {kategoriat.map((item) => <Picker.Item
            label={capitalizeFirstLetter(item.kategoria)}
            value={item.kategoria}
            key={item.kategoria.toString()} />
          )}
        </Picker>




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