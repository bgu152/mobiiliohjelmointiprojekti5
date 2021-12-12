import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Imag, Alert, Image, ToastAndroid } from 'react-native';
import { Camera } from 'expo-camera';
import { Input, Button, ListItem, Header, Avatar, withTheme, Icon, } from 'react-native-elements';

import styles from './styles';

export default function Kuvat({ route, navigation }) {
  const [hasCameraPermission, setPermission] = useState(null);
  const [kuvalinkki, setKuvalinkki] = useState('');
  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.TOP,
      ToastAndroid.SHORT,
      50,
      50
    )
  }

  const camera = useRef(null);

  useEffect(() => {
    askCameraPermission();
  }, []);

  const askCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission(status == 'granted');
  }

  const snap = async () => {
    if (camera) {
      const photo = await camera.current.takePictureAsync({ base64: true });
      setKuvalinkki(photo.uri);
    }
  };

  function handleReturn() {
    if (kuvalinkki) {
      showToast('Kuva tallennettu, muista tallentaa vaatekappale');
      navigation.navigate(route.params.goBackDestination);
    } else {
      showToast('Kuvaa ei otettu');
    }
    navigation.navigate(route.params.goBackDestination, { kuvalinkki: kuvalinkki });
  }

  return (
    <View style={styles.container}>
      {hasCameraPermission ?
        (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 4 }} ref={camera} />

            <View style={styles.napitRivissa}>
              <View style={{ paddingTop: 10 }}>
                <Button
                  title="Ota kuva" onPress={snap}

                  icon={
                    <Icon
                      name="camera"
                      size={25}
                      color="black"
                    />}
                  titleStyle={styles.buttonTitle}

                  buttonStyle={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: 'grey',
                    borderRadius: 5,
                    width: 175,
                  }}

                  containerStyle={{
                    marginRight: 5,
                    marginLeft: 10
                  }} />
              </View>
              <View style={{ paddingTop: 10 }}>
                <Button
                  title="Tallenna kuva"
                  onPress={() => handleReturn()}
                  icon={
                    <Icon
                      name="save"
                      size={25}
                      color="black"
                    />}
                  titleStyle={styles.buttonTitle}

                  buttonStyle={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: 'grey',
                    borderRadius: 5,
                    width: 175,
                  }}

                  containerStyle={{
                    marginRight: 10,
                    marginLeft: 5

                  }} />
              </View>
            </View>
            <View style={{ flex: 4 }}>
              {
                kuvalinkki
                  ? <Image style={{ flex: 1 }} source={{ uri: kuvalinkki }} />
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