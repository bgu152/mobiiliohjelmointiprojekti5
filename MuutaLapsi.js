import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useContext} from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform, ToastAndroid } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar, SearchBar, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { tunnusContext, tunnusTarjoaja } from './komponentit/userContext';

import kukka from './assets/kukka.png';
import asetaKuva from './assets/asetaKuva.png';
import styles from './styles';
import db from './komponentit/Tietokanta';
import { TabRouter } from '@react-navigation/native';

export default function MuutaLapsi({ route, navigation }) {
    const tunnus = useContext(tunnusContext);
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [nimi, setNimi] = useState('');
    const [kuvalinkki, setKuvalinkki] = useState(null);
    const [pituus, setPituus] = useState(null);

        
    const showToast = (message) =>{
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
            50,
            50
        )
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    useEffect(() => {
        setNimi(route.params.nimi);
        setDate(new Date(route.params.spaiva * 1.0));
        setKuvalinkki(route.params.kuvalinkki?route.params.kuvalinkki:null);
        setPituus(route.params.pituus?route.params.pituus:pituus)
    }, []
    );


    const showDatepicker = () => {
        showMode('date');
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    function getKuva(kuvalinkki, defaultkuva) {
        if (kuvalinkki) {
          return { uri: kuvalinkki }
        } else {
          return defaultkuva
        }
      };


    useEffect(() => {//Kuvaoikeudet
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Pääsy kuviin evätty');
                }
            }
        })();
    }, []);

    const pickImage = async () => { //Valitaan kuva, kuvan uri = kuvalinkki
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setKuvalinkki(result.uri);
        }
    };

    function dateToString(pvm) {
        return pvm.getDate().toFixed(0) + "." + (pvm.getMonth() + 1) + "." + pvm.getFullYear();
    }


    async function UpdateLapsi() {
        let tanaan = new Date();
        let kokoelma = "kayttajat/" + tunnus.tunnus + "/lapset";
        const docRef = doc(db, kokoelma, nimi);
        try{
            await updateDoc(docRef, {
                pituus:pituus,
                mittauspvm:tanaan.getTime().toString(),
                kuvalinkki: kuvalinkki,
                spaiva: date.getTime().toFixed(0),
            });
            showToast('Muutokset tallennettu');
            navigation.goBack();

        }catch(error){
            console.error(error);
            showToast('Muutoksia ei tallennettu')
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => pickImage()}>
                <Image source={getKuva(kuvalinkki, asetaKuva)} defaultSource={kukka} style={styles.bannerImg} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showToast('Nimeä ei voi muuttaa')}>
                <Text style={{ paddingTop: 20, marginLeft: 10, fontSize: 20, color: 'black' }} >{nimi}</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={showDatepicker}>
                <Text style={{ paddingTop: 20, marginLeft: 10, fontSize: 20, color: 'grey' }} >{dateToString(date)}</Text>
            </TouchableOpacity>


            <View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
            <Input
                style={{ paddingTop: 20, flex: 1, width: 100 }}
                placeholder='Pituus senttimetreinä '
                onChangeText={(text) => setPituus(text)}
                value={pituus}
                keyboardType="numeric"
            />

            <Button
                title='Tallenna muutokset'
                onPress={() => UpdateLapsi()}
                icon={
                    <Icon
                        name="save"
                        size={25}
                        color="black"
                    />}
                titleStyle={{
                    color: 'grey'
                }}
                buttonStyle={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: 'grey',
                    borderRadius: 5,
                }}
                containerStyle={{
                    marginRight: 10,
                    marginLeft: 10,
                    paddingTop: 10,
                    width: 250
                }}
            />

        </View>
    );
}
