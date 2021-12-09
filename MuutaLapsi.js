import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where, updateDoc} from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar, SearchBar, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';

import kukka from './assets/kukka.png';
import styles from './styles';
import db from './komponentit/Tietokanta';
import { TabRouter } from '@react-navigation/native';

export default function MuutaLapsi({ route, navigation }) {

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [nimi, setNimi] = useState('');
    const [image, setImage] = useState(null);

    const onChange = (event, selectedDate) => {
        console.log('inside onChange');
        console.log(date);
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    useEffect(() => {
        setNimi(route.params.nimi);
        setDate(new Date(route.params.spaiva * 1.0));
        setImage(route.params.kuvalinkki);
    }, []
    );


    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };


    useEffect(() => {//Kuvaoikeudet
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => { //Valitaan kuva, kuvan uri = image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    function dateToString(pvm) {
        return pvm.getDate().toFixed(0) + "." + (pvm.getMonth() + 1) + "." + pvm.getFullYear();
    }
    function dateToUnixTime(pvm) {
        return pvm.getTime().toFixed(0);
    }
    useEffect(() => {
        console.log('useEffect');
        console.log('nimi: ' + nimi);
        console.log('Spaiva: ' + date);
        console.log('kuvalinkki: ' + image);

    }, [nimi, date, image])


    async function UpdateLapsi() {
        const docRef = doc(db, "lapset", nimi);
        await updateDoc(docRef, {
          kuvalinkki: image,
          spaiva:date.getTime().toFixed(0),
        })
      };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => pickImage()}>
                <Image source={{ uri: image }} defaultSource={kukka} style={styles.bannerImg} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Nimeä ei voi muuttaa')}>
            <Text style={{paddingTop:20, marginLeft: 10, fontSize: 20, color: 'black' }} >{nimi}</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={showDatepicker}>
                <Text style={{paddingTop:20, marginLeft: 10, fontSize: 20, color: 'grey' }} >{dateToString(date)}</Text>
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
                    width:250
                }}
            />

        </View>
    );
}
