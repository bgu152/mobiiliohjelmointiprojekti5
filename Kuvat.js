import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View,  Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Input, Button, ListItem, Header, Avatar, withTheme, Icon, } from 'react-native-elements';

import styles from './styles';

export default function Kuvat({ route, navigation }) {
  const [hasCameraPermission, setPermission] = useState(null);
  const [photoName, setPhotoName] = useState('');

  const camera = useRef(null);

  useEffect(() => {
    askCameraPermission();
  }, []);

  const askCameraPermission = async () => {
    const { status } = await Camera.requestMicrophonePermissionsAsync();
    setPermission(status == 'granted');
  }

  const snap = async () => {
    if (camera) {
      const photo = await camera.current.takePictureAsync({ base64: true });
      setPhotoName(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      {hasCameraPermission ?
        (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 4 }} ref={camera} />

            <View style={styles.napitRivissa}>
            <View>
              <Button 
              title="Ota kuva" onPress={snap} 
              
              icon={
                <Icon
                  name="camera"
                  size={25}
                  color="white"
                />}
            buttonStyle={{
                backgroundColor: '#52738c',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 10,
            }}
            containerStyle={{
                width: 170,//'40%'
                marginTop:10,
                marginRight:10, 
                marginLeft:10
            }}/>
            </View>
            <View>
              <Button 
              title="Tallenna kuva" 
              onPress={() => navigation.navigate('Lisaa2',{uri:photoName})} 
              icon={
                <Icon
                  name="camera"
                  size={25}
                  color="white"
                />}
            buttonStyle={{
                backgroundColor: '#52738c',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 10,
            }}
            containerStyle={{
                width: 170,
                marginTop:10,
                marginRight:10, 
                marginLeft:10
            }}/>
            </View>
            </View>
            <View style={{ flex: 4 }}>
              {
                photoName
                  ? <Image style={{ flex: 1 }} source={{ uri: photoName }} />
                  : <Text style={{ flex: 1 }}></Text>
              }
            </View>
          </View>
        ) : (
          <Text>No access to camera</Text>
        )}
    </View>
  );
}