import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, 
 } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { TouchableOpacity} from 'react-native-gesture-handler'

import mekko from './assets/mekko.png';
import hakulogo from './assets/HakuLogo.png';
import lisaalogo from './assets/lisaalogo.png';
import children from './assets/children.png';
import styles from './styles';
import addchild from './assets/addchild.png';


export default function Koti({ navigation }) {
  return (
    <View>

      <View style ={{paddingTop:40}}>

      
      <TouchableOpacity onPress={() => navigation.navigate('Haku')} > 
      <Image style = {styles.images} source ={hakulogo}/>  
      </TouchableOpacity>

     <TouchableOpacity  onPress={() => navigation.navigate('Lapset')} >      
      <Image style = {styles.images} source ={children}/>
      </TouchableOpacity> 
    </View>

    </View>
  );
}
