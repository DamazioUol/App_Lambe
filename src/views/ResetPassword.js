import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import backgroundLogin from '../../assets/imgs/background-login.png';
import icon from '../../assets/imgs/icon.png';
import { sendResetPassToEmail } from '../features/User/UserSlice';

export default function ResetPassword(props) {
    const dispatch = useDispatch()

    const [email, onChangeEmail] = useState(null);

    const userStore = useSelector(state => state.user)
    const resetingRef = useRef(false)

    useEffect(() => {
        if (!resetingRef.current) {
            resetingRef.current = userStore.isReseting
        } if (
            resetingRef.current && !userStore.isReseting
        ) {
            resetingRef.current = false;
            if (!userStore.err) {
                props.navigation.goBack()
            }
        }
    }, [userStore])

    sendEmail = () => {
        if (validStepEmail()) {
            dispatch(sendResetPassToEmail(email))
        }
    }

    validStepEmail = () => {
        if (
            !email.trim()
        ) {
            Toast.show(
                {
                    type: 'error',
                    text1: 'Dados inválidos',
                    text2: 'Campo(s) obrigatório(s) não preenchido(s)',
                    visibilityTime: 3000
                }
            )
            return false;
        }

        return true;
    }

    return (
        <ImageBackground source={backgroundLogin} style={styles.background}>
            <View style={styles.header}>
                <TouchableOpacity
                    disabled={userStore.isReseting}
                    onPress={() => {
                        props.navigation.goBack()
                    }} style={styles.logout}
                >
                    <Icon name="arrow-back" color="#000" size={25} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View >
                    <Image source={icon} style={styles.image} />
                </View>
                <TextInput placeholder='Email da conta' placeholderTextColor="rgba(0,0,0,0.5)"
                    keyboardType='email-address'
                    value={email}
                    onChangeText={(email) => onChangeEmail(email)}
                    editable={!userStore.isReseting}
                    style={styles.input}
                />
                {
                    userStore.isReseting
                        ? <ActivityIndicator style={styles.isReseting} size="medium" color="#6228d7" />
                        : <TouchableOpacity
                            style={styles.button}
                            onPress={() => sendEmail()}
                        >
                            <Text style={styles.buttonText} >Enviar</Text>
                        </TouchableOpacity>
                }
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-start",
        marginBottom: 30,
        paddingLeft: 15
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
    },
    button: {
        marginTop: 30,
        padding: 10,
        backgroundColor: "#6228d7",
        borderRadius: 20,
        marginBottom: 50
    },
    buttonText: {
        fontSize: 20,
        color: "#FFF"
    },
    input: {
        marginTop: 20,
        width: "90%",
        backgroundColor: "#EEE",
        height: 40,
        borderWidth: 1,
        borderColor: "#333",
        color: "#000",
        borderRadius: 20,
        paddingLeft: 15
    },
    image: {
        height: 200,
        width: 200,
        resizeMode: 'contain',
    },
    loginText: {
        color: "#fff",
        textDecorationLine: "underline"
    },
    isReseting: {
        marginTop: 30,
    }
})	