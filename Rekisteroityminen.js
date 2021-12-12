import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker'
import { initializeFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, getDoc, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
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


export default function Rekisteroityminen({ route, navigation }) {
    const [nimi, setNimi] = useState('');
    const [uusiTunnus, setUusiTunnus] = useState('');
    const [salasana, setSalasana] = useState('');
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


    async function setKayttaja() {
        await setDoc(doc(db, 'kayttajat', uusiTunnus), {
            nimi: nimi,
            salasana: salasana
        });
    }

    useEffect(() => {
        Alert.alert('Lue varoitusteksti huolella!');
    }, [])

    async function HandleLogin() {
        const docRef = doc(db, "kayttajat", uusiTunnus);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (salasana == docSnap.data().salasana) {
                showToast('Kirjutuminen onnistui');
                tunnus.setTunnus(uusiTunnus);
                let tunnusSTR = uusiTunnus;
                try {
                    await AsyncStorage.setItem('tunnus', tunnusSTR)
                } catch (error) {
                    console.error(error);
                }
                navigation.navigate('Koti');

            } else {
                navigation.navigate('Login');
                showToast('Kirjutuminen epäonnistui, kokeilu kirjautua tunnuksillasi');
            }
        } else {
            navigation.navigate('Login');
            showToast('Kirjutuminen epäonnistui, kokeilu kirjautua tunnuksillasi');
        }
    }

    async function Rekisteroidy() {

        const docRef = doc(db, 'kayttajat', uusiTunnus);

        await getDoc(docRef)
            .then((doc) => {
                if (doc.data()) {
                    showToast('Tunnus on jo olemassa');
                } else {
                    setKayttaja();
                    HandleLogin();
                }
            })
    }


    return (
        <View style={styles.container}>
            <View>
                <Text
                    style={{
                        paddingTop: 20,
                        marginLeft: 10,
                        fontSize: 20,
                        color: 'black',
                        paddingBottom: 40
                    }}
                >Varoitus: Tämä appi on vielä vain demoversio eikä tietoturvallisuutta ole kehitetty. Salasanat varastoidaan selkotekstinä joten älä käytä sellaista salasanaa jota käytät missään toisessa palvelussa. Älä myöskään tallenna apille mitään henkilökohtaisia tietoja!
                </Text>
            </View>

            <Input
                placeholder='Nimi'
                value={nimi}
                onChangeText={(text) => setNimi(text)}
                keyboardType='email-address'
            />

            <Input
                placeholder='Salasana'
                secureTextEntry={true}
                onChangeText={(text) => setSalasana(text)}
                value={salasana}
            />

            <Input
                placeholder='Käyttäjätunnus'
                value={uusiTunnus}
                onChangeText={(text) => setUusiTunnus(text)}
                keyboardType='email-address'
            />

            <Button
                title='Reksteröidy uudeksi käyttäjäksi'
                onPress={() => Rekisteroidy()}
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