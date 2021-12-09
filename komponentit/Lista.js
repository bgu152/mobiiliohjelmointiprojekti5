import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';

export default function docToArrayElement(doc) {
    let uusiVaatekappale = { id: '', lapsi: '', pituudelle: '', kuvaus: '', kategoria: '', lisattypvm: '' };
    if (doc.data()) {
        uusiVaatekappale.lapsi = doc.data().lapsi;
    } else {
        console.log("Ei löydy dokumenttia");
    }

    if (doc.data()?.pituudelle) {
        uusiVaatekappale.pituudelle = doc.data().pituudelle;
    }
    if (doc.data()?.kuvaus) {
        uusiVaatekappale.kuvaus = doc.data().kuvaus;
    }
    if (doc.data()?.kategoria) {
        uusiVaatekappale.kategoria = doc.data().kategoria;
    }
    if (doc.data()?.lisattypvm) {
        uusiVaatekappale.lisattypvm = doc.data().lisattypvm;
    }
    return uusiVaatekappale;
    }