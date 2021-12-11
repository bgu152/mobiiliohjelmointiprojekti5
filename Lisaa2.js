import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker'
import { initializeFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { Input, Button, ListItem, Header, Avatar, withTheme, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from "@react-navigation/native";
import { tunnusContext, tunnusTarjoaja } from './komponentit/userContext';

import db from './komponentit/Tietokanta';
import lisaa from './assets/lisaa.png';
import styles from './styles';
import { WhiteBalance } from 'expo-camera/build/Camera.types';

const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.BOTTOM,
        ToastAndroid.SHORT,
        50,
        50
    )
}

export default function Kirjautuminen({ route, navigation }) {
    const tunnus = useContext(tunnusContext);
    const [lapset, setLapset] = useState([]);
    const [kuvalinkki, setKuvalinkki] = useState(null);
    const [merkki, setMerkki] = useState('');
    const isFocused = useIsFocused();
    const [kategoriat, setKategoriat] = useState([]);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function ListaaKategoriat() {
        let lista = [];
        const snapshot = await getDocs(collection(db, "vaatekategoriat"));
        snapshot.forEach((doc) => {
            let uusiKategoria = { kategoria: '' };
            uusiKategoria.kategoria = doc.id;
            lista = [...lista, uusiKategoria];
        });
        setKategoriat(lista);
    };


    useEffect(() => {
        ListaaLapset();
        ListaaKategoriat()
    }, []);

    useEffect(() => {
        if (isFocused) {
            setKuvalinkki(route.params.kuvalinkki ? route.params.kuvalinkki : null)
        }
    })


    async function ListaaLapset() {
        let lista = [];
        let kokoelma = "kayttajat/" + tunnus.tunnus + "/lapset";
        const snapshot = await getDocs(collection(db, kokoelma));
        snapshot.forEach((doc) => {
            let uusiLapsi = { nimi: '', spaiva: '' };
            uusiLapsi.nimi = doc.id;
            uusiLapsi.spaiva = doc.data().spaiva;
            lista = [...lista, uusiLapsi];
        });
        setLapset(lista);
    };



    async function postVaatekappale(data) {

        data.kuvalinkki = kuvalinkki;
        let kokoelma = "kayttajat/" + tunnus.tunnus + "/vaatekappaleet";
        console.log('posting: ');
        let dataSTR = JSON.stringify(data);
        console.log(dataSTR);
        await addDoc(collection(db, kokoelma), data);
        showToast('Vaatekappale tallennettu');
    }

    const formik = useFormik({
        initialValues: {
            kategoria: '',
            lapsi: '',
            pituudelle: '',
            merkki: '',
            kuvaus: '',
            lisattypvm: '',
            vuodenajalle: ''
        },
        onSubmit: values => {
            console.log(values);
            let pvm = new Date();
            let pvmSTR = pvm.getTime().toFixed(0);
            console.log(pvmSTR);
            values.lisattypvm = pvmSTR;
            console.log('inside formic');
            console.log(JSON.stringify(values));
            postVaatekappale(values);
            navigation.navigate('Haku');
        }
    });

    return (
        <View style={styles.container}>

            <Picker
                enabled={true}
                onValueChange={formik.handleChange('kategoria')}
                selectedValue={formik.values.kategoria}
            >
                {kategoriat.map((item) => <Picker.Item
                    label={capitalizeFirstLetter(item.kategoria)}
                    value={item.kategoria}
                    key={item.kategoria} />
                )}
                <Picker.Item label="Kategoria" value="" id="1" />
            </Picker>

            <Picker
                enabled={true}
                onValueChange={formik.handleChange('lapsi')}
                selectedValue={formik.values.lapsi}
            >
                {lapset.map((item) => <Picker.Item
                    label={item.nimi}
                    value={item.nimi}
                    key={item.nimi} />
                )}
                <Picker.Item label="Käyttäjä" value="" id="1" />
            </Picker>

            <Picker
                enabled={true}
                onValueChange={formik.handleChange('vuodenajalle')}
                selectedValue={formik.values.vuodenajalle}
            >
                <Picker.Item label="Kaikille vuodenajoille" value="kaikki" id="1" />
                <Picker.Item label="Vuodenajalle" value="kaikki" id="2" />
                <Picker.Item label="Talvi" value="talvi" id="3" />
                <Picker.Item label="Kesä" value="kesa" id="4" />
                <Picker.Item label="Syksy / kevät" value="syksy_kevat" id="5" />
            </Picker>

            <View>

                <Input
                    style={{ paddingTop: 20 }}
                    placeholder='Maksimipituus (cm)'
                    onChangeText={formik.handleChange('pituudelle')}
                    keyboardType="numeric"
                />
            </View>

            <Input
                style={{ paddingTop: 20 }}
                placeholder='Merkki'
                onChangeText={formik.handleChange('merkki')}
            />
            <Input
                placeholder='Kuvaus'
                onChangeText={formik.handleChange('kuvaus')}
            />

            <View style={styles.napitRivissa}>

                <Button
                    title='Ota kuva'
                    onPress={() => navigation.navigate('Kuvat', { goBackDestination: 'Lisaa2' })}
                    icon={
                        <Icon
                            name="camera"
                            size={25}
                            color="black"
                        />}
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


                <Button
                    icon={
                        <Icon
                            name="save"
                            size={25}
                            color="black"
                        />}
                    title='Tallenna'
                    onPress={formik.handleSubmit}
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
            <Image source={{ uri: kuvalinkki }} style={{ flex: 1, marginTop: 10 }} />
        </View>
    )
}