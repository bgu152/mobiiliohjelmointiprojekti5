import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useContext } from 'react';
import {
  Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, ToastAndroid,
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { tunnusContext, tunnusTarjoaja } from './komponentit/userContext';

import mekko from './assets/mekko.png';
import hakulogo from './assets/HakuLogo.png';
import lisaalogo from './assets/lisaalogo.png';
import children from './assets/children.png';
import styles from './styles';
import addchild from './assets/addchild.png';
import login from './assets/login.png';
import feedback from './assets/feedback.png';
import kauppa from './assets/kauppa.png';
import kayttaja from './assets/kayttaja.png';

export default function Koti({ route, navigation }) {
  const tunnus = useContext(tunnusContext);

  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.BOTTOM,
      ToastAndroid.SHORT,
      50,
      50
    )
  }

  return (

    <View style={styles.container}>

      <View style={{ paddingTop: 40 }}>

        <View style={styles.imageFlex}>

          <TouchableOpacity onPress={() => navigation.navigate('Haku')} >
            <Image style={styles.images} source={hakulogo} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Lapset')} >
            <Image style={styles.images} source={children} />
          </TouchableOpacity>

        </View>
        <View style={styles.imageFlex}>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} >
            <Image style={styles.images} source={login} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MuutaKayttajaa')} >
            <Image style={styles.images} source={kayttaja} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageFlex}>

        <TouchableOpacity onPress={() => Alert.alert('Tämä osa on työn alla.')} >
          <Image style={styles.images} source={kauppa} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Feedback')} >
          <Image style={styles.images} source={feedback} />
        </TouchableOpacity>
      </View>
    </View>
  );
}