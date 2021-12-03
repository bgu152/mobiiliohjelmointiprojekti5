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



const App = () => {

    const kategoriat = [
        { kategoria: 'housut'},
        { kategoria: 'takki'},
        { kategoria: 'housut'},
        { kategoria: 'kengat'},
        { kategoria: 'pusero'},
        { kategoria: 'hame'},
        { kategoria: 'haalari'},
        { kategoria: 'mekko'},
        { kategoria: 'paita'},
        { kategoria: 'mekko'},
    ];

    const formik = useFormik({
        initialValues: {
            kategoria: '',
            lapsi: '',
            pituudelle: '',
            kuvaus: '',
            lisattypvm: '',
            vuodenajalle: ''
        },
        onSubmit: values => { console.log(values) }
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
                        label={item.kategoria}
                        value={item.kategoria}/>
                )}
            </Picker>

            <Picker
                enabled={true}
                mode="dropdown"
                onValueChange={formik.handleChange('vuodenajalle')}
                selectedValue={formik.values.city_name}
            >
                <Picker.Item label="Kaikki" value="kaikki" />
                <Picker.Item label="Talvi" value="talvi" />
                <Picker.Item label="Kesä" value="kesa" />
                <Picker.Item label="Syksy ja kevät" value="syksy_kevat" />
            </Picker>

            <Input
                placeholder='Lapsen nimi'
                onChangeText={formik.handleChange('lapsi')}
            />
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
export default App;