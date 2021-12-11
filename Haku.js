import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useContext } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator, Touchable, ToastAndroid } from 'react-native';
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
import pusero from './assets/pusero.png';
import hame from './assets/hame.png';
import haalari from './assets/haalari.png';
import paita from './assets/paita.png';
import myyntiin from './assets/myyntiin.png';
import { tunnusContext, tunnusTarjoaja } from './komponentit/userContext';


export default function Haku({ route, navigation }) {
  const tunnus = useContext(tunnusContext);
  const [nimiinput, setNimiinput] = useState('');
  const [kategoriainput, setKategoriainput] = useState('');
  const [kategoriat, setKategoriat] = useState([]);
  const [lapset, setLapset] = useState([]);
  const isFocused = useIsFocused();
  const [vaatekappaleet, setVaatekappaleet] = useState([]);

  const showToast = (message) =>{
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.BOTTOM,
        ToastAndroid.SHORT,
        50,
        50
    )
}

  useEffect(() => {
    if (isFocused) {
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
    let kokoelma = "kayttajat/" + tunnus.tunnus + "/lapset";
    const snapshot = await getDocs(collection(db, kokoelma));
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
    let kokoelma = "kayttajat/" + tunnus.tunnus + "/vaatekappaleet";
    const vaattetRef = collection(db, kokoelma);
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
      let uusiVaatekappale = { id: '', lapsi: '', pituudelle: '', kuvaus: '', kategoria: '', lisattypvm: '', kuvalinkki: '', merkki: '', vuodenajalle:''};
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
      if (doc.data()?.merkki) {
        uusiVaatekappale.merkki = doc.data().merkki;
      }
      if (doc.data()?.vuodenajalle) {
        uusiVaatekappale.vuodenajalle = doc.data().vuodenajalle;
      }

      lista = [...lista, uusiVaatekappale];
    });
    setVaatekappaleet(lista);
  };

  // kommer att behöva i nästa MuutaVaatekappale


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
      <TouchableOpacity onPress={() => navigation.navigate('MuutaVaatekappale', item)}>
        <ListItem style={styles.listcontainer} bottomDivider>
          <Avatar source={getAvatarKuvalla(item)} style={{ width: 70, height: 70 }} />
          <ListItem.Content>
            <ListItem.Title style={{ fontSize: 18 }} >{capitalizeFirstLetter(item.kuvaus)} </ListItem.Title>
            {(item.merkki) ? (<View style={styles.listItemcontainer}>
              <ListItem.Subtitle>{capitalizeFirstLetter(item.merkki)}</ListItem.Subtitle>
            </View>) : null}

            <View style={styles.listItemcontainer}>
              <ListItem.Subtitle>Käyttäjä: {capitalizeFirstLetter(item.lapsi)}</ListItem.Subtitle>
            </View>

            <View style={styles.listItemcontainer}>
              <ListItem.Subtitle>Pituudelle: {item.pituudelle} cm</ListItem.Subtitle>
            </View>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
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
    }else if (item.kategoria == 'pusero') {
      return pusero;
    }else if (item.kategoria == 'paita') {
      return paita;
    }else if (item.kategoria == 'hame') {
      return hame;
    } else if (item.kategoria == 'haalari') {
      return haalari;
    }else if (item.kategoria == 'neule') {
      return pusero;
    }else {
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
    let kokoelma = "kayttajat/" + tunnus.tunnus + "/vaatekappaleet";
    await deleteDoc(doc(db, kokoelma, id));
    updateVaatekappaleet();
    showToast('Poistettu');
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
          onValueChange={(itemValue) => setKategoriainput(itemValue)}
          selectedValue={kategoriainput}
        >
          {kategoriat.map((item) => <Picker.Item
            label={capitalizeFirstLetter(item.kategoria)}
            value={item.kategoria}
            key={item.kategoria.toString()} />
          )}
          <Picker.Item label="Vaatekategoria" value="" id="1" />
        </Picker>

        <Picker
          enabled={true}
          mode="dropdown"
          onValueChange={(itemValue) => {setNimiinput(itemValue) }}
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
          onPress={() => navigation.navigate('Lisaa2', { uri: null })}
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