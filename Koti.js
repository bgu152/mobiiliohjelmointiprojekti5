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


export default function Koti({ navigation }) {
  return (
    <View>

      <View>
        <View>
        <Text style={styles.kuvateksti}>Uusi vaatekappale</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Lisaa')} >      
      <Image style = {styles.images} source ={lisaalogo}/>
      </TouchableOpacity>
      </View>


      
      <View>
        <Text style={styles.kuvateksti}>Uusi vaatekappale2</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Lisaa2')} >      
      <Image style = {styles.images} source ={lisaalogo}/>
      </TouchableOpacity>
      </View>

      <Text style={styles.kuvateksti}>Selaa vaatteita</Text>
      <TouchableOpacity  onPress={() => navigation.navigate('Haku')} >
      <Image style = {styles.images} source ={hakulogo}/>
      </TouchableOpacity>


      <TouchableOpacity  onPress={() => navigation.navigate('Lapset')} >
      <Image style = {styles.images} source ={children}/>
      </TouchableOpacity>

      </View>

      {/* <Button title='Haku' onPress={() => navigation.navigate('Haku')} />
      <Text>Lisaa</Text>
      <Button title='Lisaa' onPress={() => navigation.navigate('Lisaa')} />
      <Text>Lapset</Text>
      <Button title='Lapset' onPress={() => navigation.navigate('Lapset')} />
      <Text>LisaaLapsi</Text>
      <Button title='LisaaLapsi' onPress={() => navigation.navigate('LisaaLapsi')} /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  listcontainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  listItemcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }, 
  body: {
    backgroundColor: 'yellow',
    padding:20
  },
  images:{
    width : 200,
    height : 200
  },

  kuvateksti:{
    fontSize:20,
  },

  kuvarivi:{
    flex:1,
    flexDirection:'row',
    width : 500,
    height : 500
  },
  touchable:{
    flex:1,
     zIndex: 1,
     height:500,
    width:500

  }
});