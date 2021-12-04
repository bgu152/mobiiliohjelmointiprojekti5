import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker'
import { initializeFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Input, Button, ListItem, Header, Avatar, withTheme, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import * as ImagePicker from 'expo-image-picker';


import db from './komponentit/Tietokanta';
import lisaa from './assets/lisaa.png';
import styles from './styles';
import { WhiteBalance } from 'expo-camera/build/Camera.types';

const LisaaVaatekappale = ({ route, navigation }) => {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const kategoriat = [
        { kategoria: 'muu', id: 0 },
        { kategoria: 'housut', id: 1 },
        { kategoria: 'takki', id: 2 },
        { kategoria: 'pusero', id: 5 },
        { kategoria: 'hame', id: 6 },
        { kategoria: 'haalari', id: 7 },
        { kategoria: 'mekko', id: 8 },
        { kategoria: 'paita', id: 9 },
    ];
    const [lapset, setLapset] = useState([]);

    useEffect(() => {
        ListaaLapset()
    }, []);

    async function ListaaLapset() {
        let lista = [];
        const snapshot = await getDocs(collection(db, "lapset"));
        snapshot.forEach((doc) => {
            let uusiLapsi = { nimi: '', spaiva: '' };
            uusiLapsi.nimi = doc.id;
            uusiLapsi.spaiva = doc.data().spaiva;
            lista = [...lista, uusiLapsi];
        });
        setLapset(lista);
    };


    let pvm = new Date();
    let pvmSTR = pvm.getDate() + "." + (pvm.getMonth() + 1) + "." + pvm.getFullYear();

    async function postVaatekappale(data) {
        try {
            data.kuvalinkki = route.params.uri;
          } catch (error) {
            console.error(error);
          }
          
        console.log('posting: ');
        let dataSTR = JSON.stringify(data);
        console.log(dataSTR);
        await addDoc(collection(db, 'vaatekappaleet'), data);
    }

    const formik = useFormik({
        initialValues: {
            kategoria: '',
            lapsi: '',
            pituudelle: '',
            kuvaus: '',
            lisattypvm: '',
            vuodenajalle: ''
        },
        onSubmit: values => {
            console.log(values);
            let pvm = new Date();
            let pvmSTR = pvm.getDate() + "." + (pvm.getMonth() + 1) + "." + pvm.getFullYear();
            console.log(pvmSTR);
            values.lisattypvm = pvmSTR;
            console.log('inside formic');
            console.log(JSON.stringify(values));
            postVaatekappale(values);
        }
    });

    return (
        <View styel={styles.container}>

            <Image source={lisaa} style={styles.bannerImg2} />

            <Text style={styles.selite}>Lisää vaatekappale</Text>

            <View><Text style={styles.pickerTeksti}>Valitse vaatekappalleen tyyppi</Text></View>

            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={formik.handleChange('kategoria')}
                selectedValue={formik.values.kategoria}
            >
                {kategoriat.map((item) => <Picker.Item
                    label={capitalizeFirstLetter(item.kategoria)}
                    value={item.kategoria}
                    key={item.id.toString()} />
                )}
            </Picker>

            <View style={styles.pickertekstiBoksi}><Text style={styles.pickerTeksti}>Kenen vaatekappale?</Text></View>

            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={formik.handleChange('lapsi')}
                selectedValue={formik.values.lapsi}
            >
                {lapset.map((item) => <Picker.Item
                    label={item.nimi}
                    value={item.nimi}
                    key={item.nimi} />
                )}
            </Picker>
            <View>

                <View style={styles.pickertekstiBoksi}><Text style={styles.pickerTeksti}>Mille vuodenajalle?</Text></View>


                <Picker
                    style={styles.picker}
                    enabled={true}
                    mode="dropdown"
                    onValueChange={formik.handleChange('vuodenajalle')}
                    selectedValue={formik.values.vuodenajalle}
                >
                    <Picker.Item label="Kaikille vuodenajoille" value="kaikki" id="1" />
                    <Picker.Item label="Talvi" value="talvi" id="2" />
                    <Picker.Item label="Kesä" value="kesa" id="3" />
                    <Picker.Item label="Syksy ja kevät" value="syksy_kevat" id="4" />
                </Picker>
            </View>
            <View style={styles.pickertekstiBoksi}><Text style={styles.pickerTeksti}>Käyttäjän maksimipituus</Text></View>

            <Input
                placeholder='Maksimipituus (cm)'
                onChangeText={formik.handleChange('pituudelle')}
                keyboardType="numeric"
            />
            <View style={styles.pickertekstiBoksi}><Text style={styles.pickerTeksti}>Kuvaus</Text></View>
            <Input
                placeholder='Kuvaus'
                onChangeText={formik.handleChange('kuvaus')}
            />

            <View style={styles.napitRivissa}>

            <Button
                title='Ota kuva'
                onPress={() => navigation.navigate('Kuvat')}
                icon={
                    <Icon
                      name="camera"
                      size={25}
                      color="white"
                    />}
                buttonStyle={{
                    backgroundColor: '#52738c',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 10,
                }}
                containerStyle={{
                    width: 150,
                    marginRight:10, 
                    marginLeft:10
                }}
            />

            <Button
            icon={
                <Icon
                  name="save"
                  size={25}
                  color="white"
                />}
                title='Tallenna'
                onPress={formik.handleSubmit}
                buttonStyle={{
                    backgroundColor: '#52738c',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 10,
                }}
                containerStyle={{
                    width: 150,
                }}
            />
                        <Button
            icon={
                <Icon
                  name="save"
                  size={25}
                  color="white"
                />}
                title='Route params'
                onPress={() => console.log(route.params.uri)}
                buttonStyle={{
                    backgroundColor: '#52738c',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 10,
                }}
                containerStyle={{
                    width: 150,
                }}
            />
        </View>

        </View>
    )
}
export default LisaaVaatekappale;