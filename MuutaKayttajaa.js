import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker'
import { initializeFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, getDoc, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { Input, Button, ListItem, Header, Avatar, withTheme, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { tunnusContext, tunnusTarjoaja } from './komponentit/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import db from './komponentit/Tietokanta';
import lisaa from './assets/lisaa.png';
import styles from './styles';
import { WhiteBalance } from 'expo-camera/build/Camera.types';


export default function MuutaKayttajaa({ route, navigation }) {
    const [nimi, setNimi] = useState('');
    const [uusiNimi, setUusiNimi] = useState('');
    const [uusiSalasana, setUusiSalasana] = useState('');
    const [nykyinenSalasana, setNykyinenSalasana] = useState('');
    const [oikeaSalasana, setOikeaSalasana] = useState('');
    const [dokumentti, setDokumentti] = useState(null);
    const tunnus = useContext(tunnusContext);

    useEffect(() => {
        getKayttaja();
    })

    async function getKayttaja() {
        const docRef = doc(db, "kayttajat", tunnus.tunnus);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setNimi(docSnap.data().nimi);
            setOikeaSalasana(docSnap.data().salasana);
            setDokumentti(docRef);
        }
    }

    const showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
            50,
            50
        )
    }

    async function TarkistaSalasana() {
        if (nykyinenSalasana == oikeaSalasana) {
            showToast('salasana oikein');
        } else {
            showToast('salasana väärin')
        }
        return nykyinenSalasana == oikeaSalasana;
    }

    async function MuutaTiedot() {
        let uudetTiedot = {};

        if (!uusiNimi && !uusiSalasana) {
            showToast('Tietoja ei muutettu');
            return;
        }
        if (uusiNimi) {
            uudetTiedot.nimi = uusiNimi;
        };
        if (uusiSalasana) {
            uudetTiedot.salasana = uusiSalasana;
        }
        if (TarkistaSalasana()) {
            await updateDoc(dokumentti, uudetTiedot);
            showToast('Tiedot päivitetty');
            return;
        };
        showToast('Tietoja ei muutettu');
        return;
    }



    return (
        <View style={styles.container}>
            <Text>{uusiNimi}Täällä voit vaihtaa nimen ja salasanan. {nimi} {uusiSalasana} {oikeaSalasana} </Text>

            <Input
                placeholder='Nimi'
                value={uusiNimi}
                onChangeText={(text) => setUusiNimi(text)}
                keyboardType='email-address'
            />

            <Input
                placeholder='Uusi salasana'
                value={uusiSalasana}
                onChangeText={(text) => setUusiSalasana(text)}
                keyboardType='email-address'
            />

            <Input
                placeholder='Nykyinen salasana'
                value={nykyinenSalasana}
                onChangeText={(text) => setNykyinenSalasana(text)}
                keyboardType='email-address'
            />

            <Button
                title='Muuta tiedot'
                onPress={() => MuutaTiedot()}
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
    )
}