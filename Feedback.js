import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Picker } from '@react-native-community/picker'
import { initializeFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, getDoc, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { Input, Button, ListItem, Header, Avatar, withTheme, Icon, } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { tunnusContext, tunnusTarjoaja } from './komponentit/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import db from './komponentit/Tietokanta';
import styles from './styles';
import { WhiteBalance } from 'expo-camera/build/Camera.types';

export default function Feedback({ navigation, route }) {
    const [palaute, setPalaute] = useState('');

    const showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
            50,
            50
        )
    }

    async function PostPalaute() {

        await addDoc(collection(db, 'feedback'), {
            palaute: palaute
        });
        showToast('Palaute tallennettu');
        navigation.goBack();

    }


    return (
        <View style={styles.container}>

            <View>
                <Text
                    style={{
                        paddingTop: 20,
                        marginLeft: 10,
                        fontSize: 20,
                        color: 'black',
                        paddingBottom: 40
                    }}>
                    Olen erittäin kiitollinen kaikista parannusehdotuksista!
                </Text>
            </View>

            <Input
                placeholder='Vaapaamuotoinen palaute'
                value={palaute}
                onChangeText={(text) => setPalaute(text)}
                multiline={true}
                style={{
                    paddingRight: 10,
                    lineHeight: 23,
                    flex: 2,
                    textAlignVertical: 'top',

                }}
            />

            <Button
                title='Anna palautetta'
                onPress={() => PostPalaute()}

                titleStyle={styles.buttonTitle}

                buttonStyle={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: 'grey',
                    borderRadius: 5,
                }}
                containerStyle={{
                    marginRight: 10,
                    marginLeft: 5
                }}
            />
        </View>

    )
}