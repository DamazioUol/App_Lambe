import React from 'react';
import { Image, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import backgroundLogin from '../../assets/imgs/background-login.png';
import icon from '../../assets/imgs/icon.png';
export default function Header() {
    return (
        <ImageBackground source={backgroundLogin} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Image source={icon} style={styles.image} />
                    <Text style={styles.title} >
                        Lambe Lambe
                    </Text>
                </View >
            </View >
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        justifyContent: 'center',
    },
    container: {
        margin: Platform.OS == 'ios' ? 20 : 0,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#BBB",
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: 'center',
    },
    image: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
    },
    title: {
        fontFamily: 'shelter',
        color: "#000",
        height: 30,
        fontSize: 28
    },
    useContainer: {
        flexDirection: "row",
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 5
    },
    user: {
        fontSize: 15,
        color: "#FFF",
        marginRight: 5
    }
})