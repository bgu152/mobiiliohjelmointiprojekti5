import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar, SearchBar, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native';
import { useIsFocused } from "@react-navigation/native";



import styles from './styles';
import db from './komponentit/Tietokanta';
import takki from './assets/takki.png';
import outfit from './assets/outfit.png';
import housut from './assets/housut.png';
import mekko from './assets/mekko.png';

export default function Haku({ route, navigation }) {
  const uri = "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540bgu152%252Ffirevaatteet5/Camera/bbe4f2c7-57e3-4cac-afab-b8e3fe27af99.jpg";
  const soossi = { uri: uri };

  const [nimiinput, setNimiinput] = useState('');
  const [kategoriainput, setKategoriainput] = useState('');
  const [kategoriat, setKategoriat] = useState([]);
  const [lapset, setLapset] = useState([]);
  const isFocused = useIsFocused();

  const [vaatekappaleet, setVaatekappaleet] = useState([]);

  useEffect(() => {
    if(isFocused){
      ListaaVaatteet();
      ListaaLapset();
      ListaaKategoriat()
    }
  }, [isFocused, nimiinput, kategoriainput]);

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
      let uusiVaatekappale = { id: '', lapsi: '', pituudelle: '', kuvaus: '', kategoria: '', lisattypvm: '', kuvalinkki: '' };
      uusiVaatekappale.id = doc.id;
      if (doc.data()) {
        uusiVaatekappale.lapsi = doc.data().lapsi;
      } else {
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
        uusiVaatekappale.kuvalinkki = doc.data().kuvalinkki;
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
      rightContent={

        <Button
          onPress={() => poistoVarmistuksella(item.id)}
          title="Poista"
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
        />
      }
    >
      <ListItem style={styles.listcontainer} bottomDivider>
        <Avatar source={getAvatarKuvalla(item)} style={{ width: 70, height: 70 }} />
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
    if (item.kuvalinkki) {
      return { uri: item.kuvalinkki }
    } else {
      return getAvatar(item)
    }
  };


  async function deleteFromDatabase(id) {
    await deleteDoc(doc(db, 'vaatekappaleet', id));
    updateVaatekappaleet();
  }

  const poistoVarmistuksella = (id) =>
    Alert.alert(
      "Vaatteen poisto",
      "Haluatko varmasti poistaa vaatekappaleen?",
      [
        {
          text: "Kyllä",
          onPress: () => deleteFromDatabase(id),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );


  return (
    <View style={styles.container}>

      <View>

        <Picker
          enabled={true}
          mode="dropdown"
          onValueChange={(itemValue) => setKategoriainput(itemValue) }
          selectedValue={kategoriainput}
        >
          {kategoriat.map((item) => <Picker.Item
            label={capitalizeFirstLetter(item.kategoria)}
            value={item.kategoria}
            key={item.kategoria.toString()} />
          )}
          <Picker.Item label="Kaikki vaatekategoriat" value="" id="1" />
        </Picker>


        <Picker
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
          <Picker.Item label="Kaikkien vaatteet" value="" id="1" />
        </Picker>

      </View>
      <View style={styles.napitRivissa}>

        <Button

          title='Uusi'
          icon={
            <Icon
              name="add"
              size={25}
              color="black"
            />}
          titleStyle={styles.buttonTitle}

          buttonStyle={{
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: 'grey',
            borderRadius: 5,
            
            width: 370,
          }}

          containerStyle={{
            marginRight: 10,
            marginLeft: 5
          }}
          mode="contained"
          onPress={() => navigation.navigate('Lisaa2')}
        >
          Enter
        </Button>
      </View>
      <FlatList
        renderItem={renderKaikki}
        data={vaatekappaleet}
      />


    </View>
  );
}
