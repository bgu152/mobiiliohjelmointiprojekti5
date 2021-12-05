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


export default function Lapset({ navigation }) {

  const [lapset, setLapset] = useState([]);
  const [image, setImage] = useState(null);
  useEffect(() => {
    ListaaLapset()
  }, []);

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
          onPress: () => deleteFromDatabase(nimi),
         }
        ]);
    }
  };

  

async function Asetakuva(nimi, uri) {
    console.log(uri);
    const docRef = doc(db, "lapset", nimi);
    await updateDoc(docRef,{
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
    return Math.round(-0.0008*x*x+0.6195 *x + 66.6144);
  }

  function kuukausiIka(dateSTR){
    let tanaan = new Date();
    let vuodet = tanaan.getFullYear()-parseInt(dateSTR.substring(6,10));
    let kuukaudet =12*vuodet +  tanaan.getMonth() + 1 - parseInt(dateSTR.substring(3,5));
    let paivat = tanaan.getDate()-dateSTR.substring(0,2);
    kuukaudet += Math.floor(paivat * 1.0 / 30);
    return kuukaudet;
  }

  function laskeIka(dateSTR){
    let kuukaudet = kuukausiIka(dateSTR);
    let vuodet = Math.floor(kuukaudet/12);
    kuukaudet = kuukaudet%12;
    return vuodet + 'v ' + kuukaudet + 'kk'  ;
  }

  const updateLapset = () => {
    setLapset([]);
    ListaaLapset()
  }

  async function deleteFromDatabase(nimi) {
    console.log('deleteting: ' + nimi);
    await deleteDoc(doc(db, 'lapset', nimi));
    updateLapset();
  }

  function poistaLapsi(nimi){
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
    >
      <ListItem style={styles.listcontainer} bottomDivider>
        <TouchableOpacity onPress = {() => pickImage(item.nimi)}>
        <Avatar rounded source={{ uri: item.kuvalinkki }} defaulSource={lapsilogo} style={{ width: 70, height: 70 }} />
        </TouchableOpacity>         
        
        <View>        
        <ListItem>
        <View>
        <ListItem.Title style={{ fontSize: 18 }} >{item.nimi} </ListItem.Title>
          <Text>Ikä: {laskeIka(item.spaiva)} {""}</Text>
          <Text>Pituus: {arvioituPituus(kuukausiIka(item.spaiva))}cm</Text>
          </View>
        </ListItem>
        
        </View>
      </ListItem>

    </ListItem.Swipeable>
  );

  return (
    <View style = {styles.container}>
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











