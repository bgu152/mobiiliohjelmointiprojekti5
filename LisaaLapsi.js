import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar, SearchBar, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native'


import kukka from './assets/kukka.png';
import styles from './styles';
import db from './komponentit/Tietokanta';

export default function LisaaLapsi({ navigation }) {

  const formik = useFormik({
    initialValues: {
      nimi: '',
      spaiva: '',
      kuvalinkki: ''
    },
    onSubmit: values => {
      console.log('inside formic');
      console.log(values);
      console.log(JSON.stringify(values));
    }
  });






  return (
    <View>
      <Image source={kukka} style={styles.bannerImg} />

      <Input
        style={{ paddingTop: 20, flex: 1, width: 100 }}
        placeholder='Nimi'
        label='Lapsen nimi'
        onChangeText={formik.handleChange('pituudelle')}
        keyboardType="numeric"
      />
      <Input
        style={{ paddingTop: 20, flex: 1, width: 100 }}
        placeholder='Maksimipituus (cm)'
        label='Nimi'
        onChangeText={formik.handleChange('pituudelle')}
        keyboardType="numeric"
      />

    </View>

  );
}
