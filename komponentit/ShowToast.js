import React from 'react';
import { ToastAndroid} from 'react-native';

export default function ShowToast(message){
    const showToast = (message) =>{
        console.log('Toast clicked');
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
            50,
            50
        )
    }
    return(
        ShowToast(message)
    )

}