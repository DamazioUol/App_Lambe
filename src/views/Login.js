import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useDispatch, useSelector } from 'react-redux'
import backgroundLogin from '../../assets/imgs/background-login.png'
import icon from '../../assets/imgs/icon.png'
import { loginEP } from '../features/User/UserSlice'

export default function Login() {
    const userStore = useSelector(state => state.user);
    const [email, onChangeEmail] = useState(null)
    const [password, onChangePassword] = useState(null)

    const dispacth = useDispatch()
    const navigation = useNavigation()
    const loadingRef = useRef()


    useEffect(() => {
        if (!loadingRef.current) {
            loadingRef.current = userStore.isLoadingLogin
        } if (
            loadingRef.current && !userStore.isLoadingLogin
        ) {
            loadingRef.current = false;
            if (userStore.err) {
                Toast.show(
                    {
                        type: 'error',
                        text1: "Usuário ou senha inválido",
                        visibilityTime: 1000
                    }
                )
            }
            else {
                goToFeed()
            }
        }
    }, [userStore])


    function goToFeed() {
        const home = navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'Tabs',
                    screen: "Home"
                },
            ],
        })
        navigation.dispatch(home)
    }

    function login() {
        if (
            !email.trim() ||
            !password.trim()
        ) {
            return Toast.show({
                type: "error",
                text1: "Dados inválidos",
                visibilityTime: 1000
            })
        }

        dispacth(loginEP({ email, password }))
    }

    function register() {

    }

    return (
        <ImageBackground source={backgroundLogin} style={styles.background} >
            <View style={styles.container}>
                <View >
                    <Image source={icon} style={styles.image} />
                </View>
                <TextInput placeholder='Email' placeholderTextColor="rgba(0,0,0,0.5)"
                    keyboardType='email-address'
                    value={email} onChangeText={(email) => onChangeEmail(email)}
                    style={styles.input}
                    editable={!userStore.isLoadingLogin}
                />
                <TextInput placeholder='Senha' placeholderTextColor="rgba(0,0,0,0.5)"
                    secureTextEntry
                    value={password} onChangeText={(password) => onChangePassword(password)}
                    style={styles.input}
                    editable={!userStore.isLoadingLogin}
                />

                <TouchableOpacity
                    disabled={userStore.isLoadingLogin}
                    style={styles.resetButton}
                    onPress={() => navigation.navigate('ResetPassword')}
                >
                    <Text style={styles.resetText} >Esqueci minha senha</Text>
                </TouchableOpacity>

                {
                    userStore.isLoadingLogin
                        ?
                        <ActivityIndicator style={styles.isLoadingLogin} size="medium" color="#6228d7" />
                        : <TouchableOpacity
                            style={styles.button}
                            onPress={() => login()}
                        >
                            <Text style={styles.buttonText} >Login</Text>
                        </TouchableOpacity>
                }

                <TouchableWithoutFeedback
                    disabled={userStore.isLoadingLogin}
                    style={styles.register}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerText} >Ainda não tem conta? Se registre agora!</Text>
                </TouchableWithoutFeedback>
            </View>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
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
    resetButton: {
        marginTop: 20,
    },
    registerText: {
        color: "#fff",
        textDecorationLine: "underline"
    },
    resetText: {
        color: "#fff",
        textDecorationLine: "underline"
    },
    image: {
        height: 200,
        width: 200,
        resizeMode: 'contain',
    },
    isLoadingLogin: {
        margin: 39.5
    }
})