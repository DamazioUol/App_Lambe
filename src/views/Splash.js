import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import backgroundLogin from '../../assets/imgs/background-login.png';
import icon from '../../assets/imgs/icon.png';

export default function Splash() {
    const navigation = useNavigation()
    const currentUser = auth().currentUser;

    setTimeout(() => {
        if (currentUser) {
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Tabs',
                        screen: "Home"
                    },
                ],
            })
        } else {
            navigation.navigate('Login')
        }
    }, 2000)

    return (
        <ImageBackground source={backgroundLogin} style={styles.background} >
            <View style={styles.container}>
                <Image source={icon} style={styles.image} />
                <Text style={styles.title} >
                    Lambe Lambe
                </Text>
            </View >
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        marginBottom: 10
    },
    title: {
        fontFamily: 'shelter',
        color: "#000",
        height: 50,
        fontSize: 50
    }
})