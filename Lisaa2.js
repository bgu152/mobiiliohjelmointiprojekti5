import { initializeFirestore } from '@firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, FlatList, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, getDocs, onSnapshot, itemsSnapshot, itemsCol, addDoc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { Input, Button, ListItem, Header, Avatar } from 'react-native-elements';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { Formik } from 'formik';





 export default function Lisaa2(){
  
    return (
        <Formik
        initialValues={{
            kategoria: '',
            lapsi: '',
            pituudelle:'',
            kuvaus:'',
            lisattypvm:''
        }}
        onSubmit={values => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <Input
              onChangeText={handleChange('kategoria')}
              placeholder='kategoria'
              onBlur={handleBlur('kategoria')}
              value={values.kategoria}
            />
             <Input
              onChangeText={handleChange('lapsi')}
              placeholder='kuka käyttää?'
              onBlur={handleBlur('kategoria')}
              value={values.lapsi}
            />
            <Input
              onChangeText={handleChange('pituudelle')}
              placeholder='pituudelle?'
              onBlur={handleBlur('kategoria')}
              value={values.pituudelle}
            />
            <Input
              onChangeText={handleChange('kuvaus')}
              placeholder='kuvaus?'
              onBlur={handleBlur('kuvaus')}
              value={values.kuvaus}
            />
            <Input
              onChangeText={handleChange('lisattypvm')}
              placeholder='lisattypvm?'
              onBlur={handleBlur('lisattypvm')}
              value={values.lisattypvm}
            />
            <Button onPress={handleSubmit} title="Submit" />

          </View>
        )}
      </Formik>
    );
}
  