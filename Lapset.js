import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useContext } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, Platform, ToastAndroid } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, getDoc, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import * as ImagePicker from 'expo-image-picker';

import styles from './styles';
import addchild from './assets/addchild.png';
import mekko from './assets/mekko.png';
import kukka from './assets/kukka.png';
import lapsilogo from './assets/lapsilogo.png';
import db from './komponentit/Tietokanta';
import { findFocusedRoute } from '@react-navigation/core';
import { useIsFocused } from "@react-navigation/native";

import { tunnusContext, tunnusTarjoaja } from './komponentit/userContext';

export default function Lapset({ navigation }) {

  const [lapset, setLapset] = useState([]);
  const [image, setImage] = useState(null);
  const isFocused = useIsFocused();
  const tunnus = useContext(tunnusContext);

  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.BOTTOM,
      ToastAndroid.SHORT,
      50,
      50
    )
  }

  useEffect(() => {
    if (isFocused) { ListaaLapset() }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Kameraoikeudet evätty');
        }
      }
    })(); const showToast = (message) => {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.BOTTOM,
        ToastAndroid.SHORT,
        50,
        50
      )
    }
  }, []);

  const pickImage = async (nimi) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {

      Alert.alert('', 'Haluatko varmasti muuttaa kuvan?', [
        {
          text: "Ei",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "Kyllä",
          onPress: () => Asetakuva(nimi, result.uri),
        }
      ]);
      setImage(result.uri);
    }
  };

  async function Asetakuva(nimi, uri) {
    let kokoelma = "kayttajat/" + tunnus.tunnus + "/lapset";
    const docRef = doc(db, kokoelma, nimi);
    await updateDoc(docRef, {
      kuvalinkki: uri
    });
    showToast('Kuva muutettu')
  };

  async function ListaaLapset() {
    let kokoelma = "kayttajat/" + tunnus.tunnus + "/lapset";
    let lista = [];
    const snapshot = await getDocs(collection(db, kokoelma));
    snapshot.forEach((doc) => {
      let uusiLapsi = { nimi: '', spaiva: '', kuvalinkki: '' };
      uusiLapsi.nimi = doc.id;
      uusiLapsi.spaiva = doc.data().spaiva;
      uusiLapsi.kuvalinkki = doc.data().kuvalinkki;
      uusiLapsi.mittauspvm = doc.data().mittauspvm;
      uusiLapsi.pituus = doc.data().pituus;
      lista = [...lista, uusiLapsi];
    });
    setLapset(lista);
  };
  function kuukausia(spaivaUnix) {//unix time to kuukausia
    let unixIka = spaivaUnix * 1.0;
    let kuukaudet = unixIka * 1.0 / (1000 * 60 * 60 * 24 * 30.437);
    return kuukaudet;
  }

  function f(x) { //f on keskimääräinen pituuskäyrä, regressioanalyysin avulla
    return (-8.2171346347567728 / 1000000 * x * x * x + 1.8053364311030897 / 1000 * x * x + 0.4248 * x + 7.7219732064616053 * 10);
  };

  function g(x) {
    if (x > 210) {
      return (f(210));
    } else { return f(x) };
  }

  function arvioituPituus(pituus, mittauspvm, spaiva) {
    let tanaan = new Date();
    let x = kuukausia(tanaan.getTime() * 1.0); //tänään kuukausisas unix time
    let x_0 = kuukausia(spaiva); //mittauspvm unix time
    if (pituus) {
      let x_1 = kuukausia(mittauspvm); //mittauspvm unix time
      return (g(x - x_0) - g(x_1 - x_0) + pituus * 1.0).toFixed(0);
    } else {
      return g(x - x_0).toFixed(0);
    }

  }

  function laskeIka(spaivaUnix) {//koodi lähteestä https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
    var tanaan = new Date();
    var spaiva = new Date(spaivaUnix);
    var ika = tanaan.getFullYear() - spaiva.getFullYear();
    var m = tanaan.getMonth() - spaiva.getMonth();
    if (m < 0 || (m === 0 && tanaan.getDate() < spaiva.getDate())) {
      ika--;
    }
    return ika;
  }


  const updateLapset = () => {
    setLapset([]);
    ListaaLapset()
  }

  async function deleteFromDatabase(id) {
    let kokoelma = "kayttajat/" + tunnus.tunnus + "/lapset";
    await deleteDoc(doc(db, kokoelma, id));
    updateLapset();
    showToast('Lapsi poistettu');
  }

  function poistaLapsi(nimi) {
    Alert.alert('', 'Haluatko varmasti muuttaa lapsen?', [
      {
        text: "Ei",
        onPress: () => null,
        style: "cancel"
      },
      {
        text: "Kyllä",
        onPress: () => deleteFromDatabase(nimi),
      }
    ]);
  };

  const renderKaikki = ({ item }) => (
    <ListItem.Swipeable

      rightContent={

        <Button
          onPress={() => poistaLapsi(item.nimi)}
          title="Poista"
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
        />
      }
    ><TouchableOpacity onPress={() => navigation.navigate('MuutaLapsi', { nimi: item.nimi, spaiva: item.spaiva, kuvalinkki: item.kuvalinkki })}>
        <ListItem bottomDivider>

          <Avatar rounded source={{ uri: item.kuvalinkki }} defaultSource={lapsilogo} style={{ width: 70, height: 70 }} />

          <View>
            <View>
              <ListItem.Title style={{ fontSize: 18 }} >{item.nimi} </ListItem.Title>
              <ListItem.Subtitle>{laskeIka(item.spaiva * 1.0)}v,  pituus noin {arvioituPituus(item.pituus, item.mittauspvm, item.spaiva)}cm</ListItem.Subtitle>
            </View>
          </View>


        </ListItem>
      </TouchableOpacity>

    </ListItem.Swipeable>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('LisaaLapsi')}>
        <Image
          source={addchild}
          style={styles.imgNarrow}

        />
      </TouchableOpacity>
      <FlatList

        keyExtractor={(item) => item.nimi}
        renderItem={renderKaikki}
        data={lapset}
      />
    </View>
  );
}