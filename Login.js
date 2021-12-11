import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker'
import { initializeFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, getDoc, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { Input, Button, ListItem, Header, Avatar, withTheme, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { tunnusContext, tunnusTarjoaja } from './komponentit/userContext';
import db from './komponentit/Tietokanta';
import Rekisteroityminen from './Rekisteroityminen';
import {FIREBASE_KEY} from '@env'


export default function Login({ route, navigation }) {
    const [salasana, setSalasana] = useState('');
    const [tunnusStorage, setTunnusStorage] = useState(null);
    const [kayttajat, setKayttajat] = useState([]);
    const [kayttajatSTR, setKayttajatSTR] = useState('');

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
        console.log(FIREBASE_KEY);
        HandleRedirect();
        HaeKayttajat();
        readData();
    }, [])

    async function HandleLogin() {
        const docRef = doc(db, "kayttajat", tunnus.tunnusatlogin);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (salasana == docSnap.data().salasana) {
                showToast('Kirjutuminen onnistui');
                tunnus.setTunnus(tunnus.tunnusatlogin);
                let tunnusSTR = tunnus.tunnusatlogin;
                try { 
                    await AsyncStorage.setItem('tunnus', tunnusSTR)
                } catch (error) { console.error(error); 
            }
                navigation.navigate('Koti');
            } else {
                showToast('Tarkista salasana');
            }
        } else {
            showToast("Tarkista tunnus");
        }
    }

    readData = async () => {
        try {
            let value = await AsyncStorage.getItem('tunnus');
            if (value!=null){
                setTunnusStorage(value);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function HaeKayttajat() {
        let lista = [];
        let listaSTR = '';
        const snapshot = await getDocs(collection(db, "kayttajat"));
        snapshot.forEach((doc) => {
            let uusiKayttaja = { tunnus: '', salasana: '', nimi: '' };
            uusiKayttaja.nimi = doc.data().nimi;
            uusiKayttaja.salasana = doc.salasana;
            lista = [...lista, uusiKayttaja];
            listaSTR += doc.data().nimi + " : " + doc.data().salasana + " ";
        });
        setKayttajat(lista);
        setKayttajatSTR(listaSTR)
    };

 

    async function HandleRedirect(){
        try{
            let value = await AsyncStorage.getItem('tunnus');
            if(value != null){
                tunnus.setTunnus(value);
                navigation.navigate('Koti');
            }
        }catch(error){
            console.error(error);
        }
    }


    return (

        <View style={styles.container}>

            <View><Text>{}</Text></View>

            <Input
                placeholder='Käyttäjätunnus'
                value={tunnus.tunnusatlogin}
                onChangeText={(text) => tunnus.setTunnusatlogin(text)}
                keyboardType='email-address'
            />

            <Input
                placeholder='Salasana'
                secureTextEntry={true}
                onChangeText={(text) => setSalasana(text)}
                value={salasana}
            />

            <Button
                title='Kirjaudu'
                onPress={() => HandleLogin()}
                titleStyle={styles.buttonTitle}

                buttonStyle={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: 'grey',
                    borderRadius: 5,
                }}
                containerStyle={{
                    marginRight: 10,
                    marginLeft: 5
                }}
            />

            <Button
                title='Reksteröidy uudeksi käyttäjäksi'
                onPress={() => navigation.navigate('Rekisteroityminen')}
                titleStyle={styles.buttonTitle}

                buttonStyle={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: 'grey',
                    borderRadius: 5,
                }}
                containerStyle={{
                    marginRight: 10,
                    marginTop: 15,
                    marginLeft: 5
                }}
            />

        </View>

    );
}