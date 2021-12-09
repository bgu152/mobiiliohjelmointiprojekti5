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
        { kategoria: 'Valitse vaatekategoria', id: 0 },
        { kategoria: 'housut', id: 1 },
        { kategoria: 'takki', id: 2 },
        { kategoria: 'pusero', id: 5 },
        { kategoria: 'hame', id: 6 },
        { kategoria: 'haalari', id: 7 },
        { kategoria: 'mekko', id: 8 },
        { kategoria: 'paita', id: 9 },
        
        { kategoria: 'muu', id: 10 },
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
        if (route.params.uri) {
            data.kuvalinkki = route.params.uri;
        }

        console.log('posting: ');
        let dataSTR = JSON.stringify(data);
        console.log(dataSTR);
        await addDoc(collection(db, 'vaatekappaleet'), data);
        Alert.alert('Vaatekappale tallennettu');
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
        <View style={styles.container}>


            <Text style={styles.sivuotsikko}>Tallenna vaatekappale</Text>



            <Picker
                enabled={true}
                onValueChange={formik.handleChange('kategoria')}
                selectedValue={formik.values.kategoria}
            >
                {kategoriat.map((item) => <Picker.Item
                    label={capitalizeFirstLetter(item.kategoria)}
                    value={item.kategoria}
                    key={item.id.toString()} />
                )}
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
                    <Picker.Item label="Valitse vaatteen käyttäjä" value="" id="1" />
                </Picker>

                <Picker
                    enabled={true}
                    onValueChange={formik.handleChange('vuodenajalle')}
                    selectedValue={formik.values.vuodenajalle}
                >
                    <Picker.Item label="Kaikille vuodenajoille" value="kaikki" id="1" />
                    <Picker.Item label="Valitse mille vuodenajalle" value="kaikki" id="2" />
                    <Picker.Item label="Talvi" value="talvi" id="3" />
                    <Picker.Item label="Kesä" value="kesa" id="4" />
                    <Picker.Item label="Syksy / kevät" value="syksy_kevat" id="5" />
                </Picker>

            <View>
            
            <Input
            style = {{paddingTop:20}}
                placeholder='Maksimipituus (cm)'
                onChangeText={formik.handleChange('pituudelle')}
                keyboardType="numeric"
            />
            </View>
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
                            color="black"
                        />}
                        titleStyle={styles.buttonTitle}

                    buttonStyle={{
                        backgroundColor: 'white',
                        borderWidth: 2,
                        borderColor: 'grey',
                        borderRadius: 5,
                        width:170,
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
                        width:170,
                    }}
                    containerStyle={{
                        width: 170,
                        marginRight: 10,
                        marginLeft: 5
                    }}
                />

            </View>

        </View>
    )
}
export default LisaaVaatekappale;