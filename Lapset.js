import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
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


export default function Lapset({ navigation }) {

  const [lapset, setLapset] = useState([]);
  const [image, setImage] = useState(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {ListaaLapset()}
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
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
    console.log(uri);
    const docRef = doc(db, "lapset", nimi);
    await updateDoc(docRef, {
      kuvalinkki: uri
    })
  };

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

  function arvioituPituus(x) {
    return Math.round(-0.0008 * x * x + 0.6195 * x + 66.6144);
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


  function kuukausiIka(spaivaUnix) {
    let tanaan = new Date();
    let unixIka = tanaan.getTime().toFixed(0) - spaivaUnix*1.0;
    let kuukaudet = unixIka * 1.0 / (1000 * 60 * 60 * 24 * 30.437);
    return kuukaudet;

  }

  // function laskeIka(spaivaUnix) {
  //   let tanaan = new Date();
  //   let spaiva = new Date(spaivaUnix);
    
  //   let vuodet = tanaan.getFullYear() - spaiva.getFullYear();
    
  //   let kuukaudet = tanaan.getMonth() - spaiva.getMonth();
    
  //   if (kuukaudet > 0) {
  //     return vuodet + 'v ' + kuukaudet + 'kk';
  //   } else {
  //     return (vuodet - 1) + 'v ' + (12 + kuukaudet) + 'kk';
  //   }
  // }

  const updateLapset = () => {
    setLapset([]);
    ListaaLapset()
  }

  async function deleteFromDatabase(id) {
    console.log('deleteting: ' + id);
    await deleteDoc(doc(db, 'lapset', id));
    updateLapset();
  }

  function poistaLapsi(nimi) {
    Alert.alert('', 'Haluatko varmasti muuttaa lapset?', [
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
    ><TouchableOpacity onPress={() => navigation.navigate('MuutaLapsi', {nimi:item.nimi, spaiva:item.spaiva, kuvalinkki:item.kuvalinkki})}>
      <ListItem bottomDivider>
        
          <Avatar rounded source={{ uri: item.kuvalinkki }} defaultSource={lapsilogo} style={{ width: 70, height: 70 }} />
 
        <View>
            <View>
              <ListItem.Title style={{ fontSize: 18 }} >{item.nimi} </ListItem.Title>
              <ListItem.Subtitle>{laskeIka(item.spaiva * 1.0)}v,  pituus noin {arvioituPituus(kuukausiIka(item.spaiva))}cm</ListItem.Subtitle>
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