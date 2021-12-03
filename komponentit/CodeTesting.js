import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc  } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';

import takki from '../assets/takki.png'
import outfit from '../assets/outfit.png'
import housut from '../assets/housut.png'
import mekko from '../assets/mekko.png'

export default function showFlatlist(vaatekappaleet, db){

    function getAvatar(item) {
        if (!item.kategoria) {
            return outfit;
        } else if (item.kategoria == 'housut') {
            return housut;
        } else if (item.kategoria == 'takki') {
            return takki;
        } else if (item.kategoria == 'mekko') {
            return mekko;
        } else {
            return outfit;
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    const renderKaikki = ({ item }) => (
        <ListItem style={styles.listcontainer} bottomDivider>
            <Avatar source={getAvatar(item)} style={{ width: 70, height: 70 }} />
            <ListItem.Content>
                <ListItem.Title style={{ fontSize: 18 }} >{capitalizeFirstLetter(item.kuvaus)} </ListItem.Title>
                <View style={styles.listItemcontainer}>
                    <ListItem.Subtitle>{capitalizeFirstLetter(item.lapsi)}</ListItem.Subtitle>
                </View>
                <View style={styles.listItemcontainer}>
                    <ListItem.Subtitle>Lisätty: {item.lisattypvm}</ListItem.Subtitle>
                </View>
                <View style={styles.listItemcontainer}>
                    <ListItem.Subtitle>Pituudelle: {item.pituudelle} cm</ListItem.Subtitle>
                </View>

                <ListItem>
                    <Button title="Poista" onPress={() => deleteFromDatabase(item.id)} />
                </ListItem>
            </ListItem.Content>
        </ListItem>
    );

    return (
        <View>
        <Image source ={takki}/>
             <FlatList
                 style={{ marginLeft: "5%" }}
                 renderItem={renderKaikki}
                 data={vaattetkappaleet}
             /> 
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
    }
});