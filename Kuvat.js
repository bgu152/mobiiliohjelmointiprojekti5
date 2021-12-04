import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, getDoc, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';

import db from './komponentit/Tietokanta';

export default function ImagePickerExample({ route, navigation }) {
  const [image, setImage] = useState(null);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    console.log('Routeparameters', route.params.osoite);
    <Button title="Route parameters" onPress={console.log(route.params.osoite)} />

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


  async function Asetakuva() {

    const docRef = doc(db, "lapset", route.params.nimi);
    await updateDoc(docRef,{
      kuvalinkki: image
    })

  };



  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <Button title="Pick an image from camera roll" onPress={pickImage} />

      <Button title="Takaisin" onPress={() => navigation.navigate(route.params.osoite)} />

      <Button title="Route parameters" onPress={() => { console.log(route.params.nimi) }} />

      <Button title="Route parameters" onPress={() => { console.log(image) }} />

      <Button title="Aseta profiilikuvaksi" onPress={() => Asetakuva()} />

      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

    </View>
  );
}
