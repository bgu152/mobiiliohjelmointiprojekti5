import React, { useEffect, useState } from 'react';
import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, 
 } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { TouchableOpacity} from 'react-native-gesture-handler'

const tunnusContext = createContext(null);

import { createContext } from "react";

const TunnusTarjoaja = (props) => {
    const [tunnusatlogin,setTunnusatlogin] = useState('');
    const [tunnus, setTunnus] = useState('');
    return (
        <tunnusContext.Provider
            value={{
                tunnus,
                tunnusatlogin,
                setTunnus,
                setTunnusatlogin
            }}
        >
            {props.children}

        </tunnusContext.Provider>
    )
}

export {TunnusTarjoaja, tunnusContext}
