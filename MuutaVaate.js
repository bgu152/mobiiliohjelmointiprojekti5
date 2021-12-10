import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-community/picker'
import { initializeFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, TextInput, ToastAndroid} from 'react-native';
import { Input, Button, ListItem, Header, Avatar, withTheme, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from "@react-navigation/native";

import db from './komponentit/Tietokanta';
import lisaa from './assets/lisaa.png';
import styles from './styles';
import { WhiteBalance } from 'expo-camera/build/Camera.types';

export default function MuutaVaatekappale({ route, navigation }) {
    const [nimi, setNimi] = useState(route.params.lapsi);
    const [id, setId] = useState(route.params.id);
    const [kategoria, setKategoria] = useState(route.params.kategoria);
    const [kategoriat, setKategoriat] = useState([]);
    const [lapset, setLapset] = useState([]);
    const [kuvalinkki, setKuvalinkki] = useState(null);
    const [merkki, setMerkki] = useState(route.params.merkki);
    const [kuvaus, setKuvaus] = useState(route.params.kuvaus);
    const [pituudelle, setPituudelle] = useState(route.params.pituudelle);
    const isFocused = useIsFocused();
    const [vuodenajalle, setVuodenajalle] = useState(route.params.vuodenajalle);

    
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

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const vuodenajat = [
        { vuodenaika: 'Kaikille vuodenajoille',value:'kaikki', id: 0 },
        { vuodenaika: 'Talvi', value:"talvi", id: 1 },
        { vuodenaika: 'Kesä',value:"kesa", id: 2 },
        { vuodenaika: 'Syksy / kevät',value:"syksy_kevat", id: 5 }
    ];
    useEffect(() => {
        ListaaLapset();
        ListaaKategoriat();
    }, []);

    useEffect(() => {
        if (isFocused) {
            setKuvalinkki(route.params.kuvalinkki?route.params.kuvalinkki:kuvalinkki)
        }
    })

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

    async function updateVaatekappale() {
        const docRef = doc(db,"vaatekappaleet", id);

        try{
            await updateDoc(docRef, {
                kuvalinkki: kuvalinkki,
                kategoria: kategoria,
                lapsi: nimi,
                kuvaus:kuvaus,
                merkki:merkki,
                pituudelle:pituudelle,
                vuodenajalle:vuodenajalle
              })
              showToast('Tallennettu')
              navigation.goBack();
        }catch(error){
            console.error(error),
            showToast('Muutoksia ei tallennettu')
        }


        };


    return (
        <View style={styles.container}>            
            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={(itemValue) => 
                    {if (itemValue!="")
                        setKategoria(itemValue)}}
                selectedValue={kategoria}
            >
                {kategoriat.map((item) => <Picker.Item
                    label={capitalizeFirstLetter(item.kategoria)}
                    value={item.kategoria}
                    key={item.kategoria.toString()} />
                )}
            </Picker>

            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={(itemValue) => 
                    {if (itemValue!="")
                        setNimi(itemValue)}}
                selectedValue={nimi}
            >
                {lapset.map((item) => <Picker.Item
                    label={capitalizeFirstLetter(item.nimi)}
                    value={item.nimi}
                    key={item.nimi} />
                )}
            </Picker>

            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={(itemValue) => 
                    {console.log(itemValue);setVuodenajalle(itemValue)}}
                selectedValue={vuodenajalle}
            >
                {vuodenajat.map((item) => <Picker.Item
                    label={item.vuodenaika}
                    value={item.value}
                    key={item.value} />
                )}
            </Picker>


            <Input
                style={{flex: 1, width: 100 }}
                placeholder='Kuvaus'
                onChangeText={(text) => setKuvaus(text)}
                value={kuvaus}
            />

            <Input
                placeholder='Merkki'
                onChangeText={(text) => setMerkki(text)}
                value={merkki}
            />

            <Input
                placeholder='Pituudelle'
                onChangeText={(text) => setPituudelle(text)}
                value={pituudelle}
            />

            <View style={styles.napitRivissa}>

                <Button
                    title='Ota kuva'
                    onPress={() => navigation.navigate('Kuvat',{goBackDestination: 'MuutaVaatekappale'})}
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
                    title='Tallenna'
                    onPress={ updateVaatekappale}
                    icon={
                        <Icon
                            name="save"
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


            </View>
            <Image source={{ uri: kuvalinkki }} style={{ flex: 1, marginTop: 10,marginLeft: '10%',width:'80%' }} />
        </View>
    )
}