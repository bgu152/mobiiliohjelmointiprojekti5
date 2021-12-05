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
import { Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker';



import kukka from './assets/kukka.png';
import styles from './styles';
import db from './komponentit/Tietokanta';

export default function LisaaLapsi({ navigation }) {

  const [vuosi, setVuosi] = useState('');
  const [kuukausi, setKuukausi] = useState(10);
  const [paiva, setPaiva] = useState('');
  const [vuodet, setVuodet] = useState([]);
  const [kuukaudet, setKuukaudet] = useState([]);
  const [paivat, setPaivat] = useState([]);
  const [paivatMax, setPaivatMax] = useState(31);
  const [nimi, setNimi] = useState('');


  const [lapsi, setLapsi] = useState({ spaiva: '', kuvalinkki: '' });

  const [image, setImage] = useState(null);

  useEffect(() => {//kameraoikeudet
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => { //Valitaan kuva, kuvan uri = image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      Alert.alert('Kuva valittu');
      setImage(result.uri);
    }
  };

  function dateInputToString(paiva, kuukausi, vuosi) {
    let paivaINT = parseInt(paiva);
    if (paivaINT < 10) {
      paiva = "0" + paiva;
    };
    let kuuINT = parseInt(kuukausi);
    if (kuuINT < 10) {
      kuukausi = "0" + kuukausi;
    };
    return spaiva = paiva + '.' + kuukausi + '.' + vuosi;

  }

  async function PostLapsi() { //lapsi lähetetään Firebase tietokantaan 

    await setDoc(doc(db, 'lapset', nimi), lapsi);
    Alert.alert('Lapsi tallennettu');
  };

  useEffect(() => {
    console.log('useEffect');
    console.log('nimi: ' + nimi);
    console.log('paiva: ' + paiva);
    console.log('image: ' + image);
    console.log('kuukausi: ' + kuukausi);
    console.log('vuosi: ' + vuosi);
    console.log('dateinput to string: ' + dateInputToString(paiva, kuukausi, vuosi));
    setLapsi({ spaiva: dateInputToString(paiva, kuukausi, vuosi), kuvalinkki: image })
    console.log('lapsi');
    console.log(lapsi);




  }, [nimi, paiva, image, kuukausi, vuosi])

  const kuuPituudet = [{ pituus: '31' }, { pituus: '28' }, { pituus: '31' }, { pituus: '30' }, { pituus: '31' }, { pituus: '30' }, { pituus: '31' }, { pituus: '31' }, { pituus: '30' }, { pituus: '31' }, { pituus: '30' }, { pituus: '31' }];

  useEffect(() => { //vuodet
    let lista = [];
    let tanaan = new Date();
    let tamavuosi = parseInt(tanaan.getFullYear());
    let uusiVuosi = tamavuosi;
    let uusiVuosiSTR = '';
    for (let i = 0; i < 18; i++) {
      uusiVuosi = tamavuosi - i;
      uusiVuosiSTR = uusiVuosi.toString();
      lista = [...lista, { vuosi: uusiVuosiSTR }];

    };
    setVuodet(lista);
  }, [])

  useEffect(() => {//kuukaudet
    let lista = [];
    let kuukausi = 0;
    let kuukausiSTR = '';
    for (let i = 1; i < 13; i++) {
      kuukausi = kuukausi + 1;
      kuukausiSTR = kuukausi.toString();
      lista = [...lista, { kuukausi: kuukausiSTR }];
    };
    setKuukaudet(lista);
  }, [])

  useEffect(() => { //paivat
    let lista = [];
    let paiva = 0;
    let paivaSTR = '';
    let monthLength = parseInt(paivatMax);
    for (let i = 1; i <= monthLength; i++) {
      paiva = paiva + 1;
      paivaSTR = paiva.toString();
      lista = [...lista, { paiva: paivaSTR }];

    };
    setPaivat(lista);

  }, [kuukausi])

  function kuunPaivat(kuu) {
    kuu = parseInt(kuu);
    kuu = kuu - 1;
    return kuuPituudet[kuu].pituus;
  }

  const kuukausiUpdate = (kuukausi) => {
    setKuukausi(kuukausi);
    setPaivatMax(kuunPaivat(kuukausi));
  }

  return (
    <View style={styles.container}>
      <Image source={kukka} style={styles.bannerImg} />
      <View><Text style={styles.sivuotsikko}>Lapsen nimi ja syntymäpäivä</Text></View>

      <Input
        style={{ paddingTop: 20, flex: 1, width: 100 }}
        placeholder='Nimi'
        onChangeText={(text) => setNimi(text)}
        value={nimi}
      />

      <View style={styles.napitRivissa} >
        <View style={styles.pickertekstiBoksiBD}><Text style={styles.pickertekstiBD}>Päviä</Text></View>
        <View style={styles.pickerBoksi}>
          <Picker
            style={styles.Picker}
            enabled={true}
            onValueChange={(paiva) => setPaiva(paiva)}
            selectedValue={paiva}
          >
            {paivat.map((item) => <Picker.Item
              label={item.paiva}
              value={item.paiva}
              key={item.paiva} />
            )}

          </Picker>
        </View>
      </View>



      <View style={styles.napitRivissa} >
        <View style={styles.pickertekstiBoksiBD}><Text style={styles.pickertekstiBD}>Kuukausi</Text></View>
        <View style={styles.pickerBoksi}>
          <Picker
            style={styles.Picker}
            enabled={true}
            onValueChange={(kuukausi) => kuukausiUpdate(kuukausi)}
            selectedValue={kuukausi}
          >
            {kuukaudet.map((item) => <Picker.Item
              label={item.kuukausi}
              value={item.kuukausi}
              key={item.kuukausi} />
            )}

          </Picker>
        </View>
      </View>

      <View style={styles.napitRivissa} >
        <View style={styles.pickertekstiBoksiBD}><Text style={styles.pickertekstiBD}>Vuosi</Text></View>
        <View style={styles.pickerBoksi}>
          <Picker
            style={styles.Picker}
            enabled={true}
            onValueChange={(vuosi) => setVuosi(vuosi)}
            selectedValue={vuosi}
          >
            {vuodet.map((item) => <Picker.Item
              label={item.vuosi}
              value={item.vuosi}
              key={item.vuosi} />
            )}

          </Picker>
        </View>
      </View>

      <View style={styles.napitRivissa}>

        <Button
          title='Valitse kuva'
          onPress={() => pickImage()}
          icon={
            <Icon
              name="image"
              size={25}
              color="black"
            />}
          titleStyle={{
            color: 'grey'
          }}
          buttonStyle={{
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: 'grey',
            borderRadius: 5,
            width: 175,
          }}
          containerStyle={{
            marginRight: 10,
            marginLeft: 10
          }}
        />

        <Button
          title='Tallenna'
          onPress={() => PostLapsi()}
          icon={
            <Icon
              name="save"
              size={25}
              color="black"
            />}
          titleStyle={{
            color: 'grey'
          }}
          buttonStyle={{
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: 'grey',
            borderRadius: 5,
            width: 175,
          }}
          containerStyle={{
            marginRight: 10,
            marginLeft: 5
          }}
        />
      </View>

    </View>
  );
}
