import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform, ToastAndroid} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar, SearchBar, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';

import kukka from './assets/kukka.png';
import styles from './styles';
import db from './komponentit/Tietokanta';
import asetaKuva from './assets/asetaKuva.png';

export default function LisaaLapsi({ navigation }) {

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [lapsi, setLapsi] = useState({ spaiva: '', kuvalinkki: '' });
  const [kuvalinkki, setKuvalinkki] = useState(null);
  const [pituus,setPituus] = useState('');
  const [nimi, setNimi] = useState('');


  const showToast = (message) =>{
    console.log('Toast clicked');
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.BOTTOM,
        ToastAndroid.SHORT,
        50,
        50
    )
}

function getKuva(kuvalinkki, defaultkuva) {
  if (kuvalinkki) {
    return { uri: kuvalinkki }
  } else {
    return defaultkuva
  }
};


  const onChange = (event, selectedDate) => {
    console.log('inside onChange');
    console.log(date);
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const testPvm = new Date(2020,1,1);

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };



  useEffect(() => {//Kuvaoikeudet
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Kameroikeudet evätty');
        }
      }
    })();
  }, []);

  const pickImage = async () => { //Valitaan kuva, kuvan uri = kuvalinkki
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setKuvalinkki(result.uri);
    }
  };

  async function PostLapsi() { //lapsi lähetetään Firebase tietokantaan 
    try{
      await setDoc(doc(db, 'lapset', nimi), lapsi);
      showToast('Lapsi tallennettu');
      navigation.goBack();
    }catch(error){
      console.error(error);
      showToast('Lasta ei tallennettu')
    }
    
    
  };

  function dateToUnixTime(pvm) {
    return pvm.getTime().toFixed(0);
  }

  useEffect(() => {
    console.log('useEffect');
    console.log('nimi: ' + nimi);
    console.log('kuvalinkki: ' + kuvalinkki);
    console.log('spaiva: ' + date);
    setLapsi({
      spaiva: dateToUnixTime(date),
      mittauspvm: dateToUnixTime(testPvm),
      kuvalinkki: kuvalinkki,
      pituus: pituus
    })
    console.log('lapsi');
    console.log(lapsi);

  }, [nimi, kuvalinkki, date])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => pickImage()}>
      <Image source={getKuva(kuvalinkki, asetaKuva)} style={{height:240, width:400}} />
</TouchableOpacity>
      <Input
        style={{ paddingTop: 20, flex: 1, width: 100 }}
        placeholder='Nimi'
        onChangeText={(text) => setNimi(text)}
        value={nimi}
      />
      <Input
        style={{ paddingTop: 20, flex: 1, width: 100 }}
        placeholder='Pituus senttimetreinä '
        onChangeText={(text) => setPituus(text)}
        value={pituus}
        keyboardType="numeric"
      />

      <View>
        <View>

          <Button onPress={showDatepicker} title="Syntymäpäivä"
            icon={
              <AntDesign name="calendar" size={24} color="black" />}
            titleStyle={{
              color: 'grey',
              textAlign: 'left'
            }}
            buttonStyle={{
              backgroundColor: 'white',
              borderWidth: 2,
              borderColor: 'grey',
              borderRadius: 5,
            }}
            containerStyle={{
              marginRight: 10,
              marginLeft: 10,
              paddingTop: 10
            }}
          />

        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>

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
        }}
        containerStyle={{
          marginRight: 10,
          marginLeft: 10,
          paddingTop: 10
        }}
      />

    </View>
  );
}
