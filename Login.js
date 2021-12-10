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
import { useIsFocused } from "@react-navigation/native";

import db from './komponentit/Tietokanta';
import { UserContext } from './komponentit/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ route, navigation }) => {
    const [tunnus, setTunnus] = useState('');
    const [salasana, setSalasana] = useState('');
    const [kayttajat, setKayttajat] = useState([]);
    const [kayttajatSTR, setKayttajatSTR] = useState('');

    const contextvalue = useContext(UserContext);
    //  const {contextvalue, setUser} =useContext(UserContext);

    const showToast = (message) => {
        console.log('Toast clicked');
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
            50,
            50
        )
    }

    useEffect(() => {
        HaeKayttajat();
 
    }, [])

    async function HandleLogin() {
        console.log(tunnus)
        const docRef = doc(db, "kayttajat", tunnus);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            if (salasana == docSnap.data().salasana) {
                showToast('Kirjutuminen onnistui');
                navigation.navigate('Koti', {tunnus:tunnus});
            } else {
                showToast('Tarkista salasana');
            }
        } else {
            Alert.alert("Tarkista tunnus");
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


    return (
        <View style={styles.container}>

            <View><Text>{contextvalue.tunnus}</Text></View>

            <Input
                placeholder='Käyttäjätunnus'
                value={tunnus}
                onChangeText={(text) => setTunnus(text)}
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
                    width: 170,
                }}
                containerStyle={{
                    width: 170,
                    marginRight: 10,
                    marginLeft: 5
                }}
            />

        </View>

    );

    const MyTextInput = ({ label, ...props }) => {
        return (
            <View>
                <Text>Hello</Text>
                {isPassword && (
                    <Text>Hello again</Text>
                )}
            </View>
        )
    };
}

export default Login;