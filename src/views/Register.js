import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import backgroundLogin from '../../assets/imgs/background-login.png';
import icon from '../../assets/imgs/icon.png';
import { createUser } from '../features/User/UserSlice';

export default function Register(props) {
    const dispatch = useDispatch()

    const [name, onChangeName] = useState(null);
    const [email, onChangeEmail] = useState(null);
    const [password, onChangePassword] = useState(null);
    const [confirmPassword, onChangeConfirm] = useState(null);

    const userStore = useSelector(state => state.user)
    const creatingRef = useRef(false)

    useEffect(() => {
        if (!creatingRef.current) {
            creatingRef.current = userStore.isCreating
        } if (
            creatingRef.current && !userStore.isCreating
        ) {
            creatingRef.current = false;
            if (!userStore.err) {
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
            } else {
                let msg = "Falha ao registrar usuário";

                if (userStore.err.includes('auth/email-already-in-use')) {
                    msg = "Email já utilizado em outra conta"
                }

                Toast.show(
                    {
                        type: 'error',
                        text1: msg,
                        visibilityTime: 2000
                    }
                )
            }
        }
    }, [userStore])

    register = () => {
        if (this.validForm()) {
            const user = {
                name,
                email,
                password
            }
            dispatch(createUser(user))
        }
    }

    validForm = () => {
        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
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

        if (
            password != confirmPassword
        ) {
            Toast.show(
                {
                    type: 'error',
                    text1: 'Dados inválidos',
                    text2: 'Senha e confirmação de senha são diferentes',
                    visibilityTime: 3000
                }
            )
            return false;
        }

        if (password.length < 6) {
            Toast.show(
                {
                    type: 'error',
                    text1: 'Dados inválidos',
                    text2: 'A senha deve ter no mínimo 6 caracteres',
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
                    disabled={userStore.isCreating}
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
                <TextInput placeholder='Nome *' placeholderTextColor="rgba(0,0,0,0.5)"
                    value={name}
                    onChangeText={(name) => onChangeName(name)}
                    editable={!userStore.isCreating}
                    style={styles.input}
                />
                <TextInput placeholder='Email *' placeholderTextColor="rgba(0,0,0,0.5)"
                    keyboardType='email-address'
                    editable={!userStore.isCreating}
                    value={email}
                    onChangeText={(email) => onChangeEmail(email)}
                    style={styles.input}
                />
                <TextInput placeholder='Senha *' placeholderTextColor="rgba(0,0,0,0.5)"
                    secureTextEntry
                    editable={!userStore.isCreating}
                    value={password}
                    onChangeText={(password) => onChangePassword(password)}
                    style={styles.input}
                />
                <TextInput placeholder='Confirmação Senha *' placeholderTextColor="rgba(0,0,0,0.5)"
                    secureTextEntry
                    editable={!userStore.isCreating}
                    value={confirmPassword}
                    onChangeText={(confirmPassword) => onChangeConfirm(confirmPassword)}
                    style={styles.input}
                />
                {
                    userStore.isCreating
                        ? <ActivityIndicator style={styles.isCreating} size="medium" color="#6228d7" />
                        : <TouchableOpacity
                            style={styles.button}
                            onPress={() => register()}
                        >
                            <Text style={styles.buttonText} >Registrar</Text>
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
    isCreating: {
        marginTop: 30,
    }
})	