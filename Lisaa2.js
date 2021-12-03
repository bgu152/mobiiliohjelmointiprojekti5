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
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';


import db from './komponentit/Tietokanta';

const LisaaVaatekappale = ({ route, navigation }) => {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    const kategoriat = [
        { kategoria: 'housut', id:1},
        { kategoria: 'takki', id:2},
        { kategoria: 'pusero', id:5},
        { kategoria: 'hame', id:6},
        { kategoria: 'haalari', id:7},
        { kategoria: 'mekko', id:8},
        { kategoria: 'paita', id:9},
    ];
    const [lapset, setLapset] = useState([]);

    useEffect(() => {
        ListaaLapset()
      }, []);
    
      async function ListaaLapset() {
        let lista = [];
        const snapshot = await getDocs(collection(db, "lapset"));
        snapshot.forEach((doc) => {
            let uusiLapsi = { nimi: '', spaiva:''};
            uusiLapsi.nimi = doc.id;
            uusiLapsi.spaiva = doc.data().spaiva;    
            lista = [...lista, uusiLapsi];
        });
        setLapset(lista);
    };


    let pvm = new Date();
    let pvmSTR = pvm.getDate() +"."  + (pvm.getMonth()+1)+"." + pvm.getFullYear();
    // console.log(pvmSTR);

    async function postVaatekappale(data){
        console.log('posting: ');        
        let dataSTR = JSON.stringify(data);
        console.log(dataSTR);
       await addDoc(collection(db,'vaatekappaleet'),data);
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
            let pvmSTR = pvm.getDate() +"."  + (pvm.getMonth()+1)+"." + pvm.getFullYear();
            console.log(pvmSTR);
            values.lisattypvm = pvmSTR;
            console.log(JSON.stringify(values));
            postVaatekappale(values);
         }
    });
    return (
        <View>
            <Text>Kategoria</Text>
            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={formik.handleChange('kategoria')}
                selectedValue={formik.values.kategoria}
            >
                {kategoriat.map((item) => <Picker.Item
                        label={capitalizeFirstLetter(item.kategoria)}
                        value={item.kategoria}
                        key={item.id.toString()}/>
                )}
            </Picker>

            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={formik.handleChange('lapsi')}
                selectedValue={formik.values.lapsi}
            >
                {lapset.map((item) => <Picker.Item
                        label={item.nimi}
                        value={item.nimi}
                        key={item.nimi}/>
                )}
            </Picker>

            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={formik.handleChange('vuodenajalle')}
                selectedValue={formik.values.vuodenajalle}
            >
                <Picker.Item label="Kaikki" value="kaikki" id = "1" />
                <Picker.Item label="Talvi" value="talvi"  id = "2" />
                <Picker.Item label="Kesä" value="kesa"  id = "3" />
                <Picker.Item label="Syksy ja kevät" value="syksy_kevat"  id = "4" />
            </Picker>

            <Input
                placeholder='Maksimipituus'
                onChangeText={formik.handleChange('pituudelle')}
            />
            <Input
                placeholder='kuvaus'
                onChangeText={formik.handleChange('kuvaus')}
            />
            
            <Button
                mode="contained"
                title='submit'
                onPress={formik.handleSubmit}
            >
                Enter
            </Button>
        </View>
    )
}
export default LisaaVaatekappale;