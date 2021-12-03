import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, Text, View, Alert, FlatList, SafeAreaView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { useForm, Controller } from "react-hook-form";
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import db from './komponentit/Tietokanta';


export default function Lisaa({ route, navigation }) {

  function LisaaVaatekappale() {
    let pvm = new Date();
    let pvmSTR = pvm.getDate() +"."  + (pvm.getMonth()+1)+"." + pvm.getFullYear();
    console.log(pvmSTR);

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            kategoria: '',
            lapsi: '',
            pituudelle:'',
            kuvaus:'',
            lisattypvm:''
        }
    });

    async function postVaatekappale(data){
        console.log('posting');
        
        let dataSTR = JSON.stringify(data);
        console.log(dataSTR);
       await addDoc(collection(db,'vaatekappaleet'),data);
    }

    const onSubmit = data => {
        let pvm = new Date();
        let pvmSTR = pvm.getDate() +"."  + (pvm.getMonth()+1)+"." + pvm.getFullYear();
        console.log(pvmSTR);
        data.lisattypvm = pvmSTR;
        console.log(JSON.stringify(data));
        postVaatekappale(data);
        reset()
    }

    return (
        <View>
            <Controller
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyle={styles.input}
                        placeholder='valitse'
                        label='VAATETYYPPI'
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="kategoria"
            />
            {errors.kategoria && <Text>Valitse tyyppi.</Text>}

            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyle={styles.input}
                        placeholder='valitse'
                        label='LAPSI'
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="lapsi"
            />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyle={styles.input}
                        placeholder='valitse'
                        label='PITUUDELLE'
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="pituudelle"
            />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        containerStyle={styles.input}
                        placeholder='valitse'
                        label='KUVAUS'
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="kuvaus"
            />

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    input: {
        width: 170,
    },

});




  return (
    <View>    
      <LisaaVaatekappale/>
    </View>
  );
}