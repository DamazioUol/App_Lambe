import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ModalConfirm from '../components/Modals/ModalConfirm';
import { deleteUser, signOut, updateEmail, updateName, updatePassword, updatePhoto } from '../features/User/UserSlice';

export default function Profile() {

    const userStore = useSelector((state) => state.user)
    const user = userStore.user
    const navigation = useNavigation()
    const dispatch = useDispatch();

    const [eventUpdate, changeEvent] = useState(null)

    const [editName, changeEditName] = useState(false)
    const [name, changeName] = useState(null)

    const [editEmail, changeEditEmail] = useState(false)
    const [email, changeEmail] = useState(null)

    const [editPass, changeEditPass] = useState(false)
    const [password, changePassword] = useState(null)
    const [confirmPassword, changeConfirmPass] = useState(null)

    const [modalVisible, changeModal] = useState(false)

    const updatingRef = useRef()

    useEffect(() => {
        if (!updatingRef.current) {
            updatingRef.current = userStore.isUpdating
        } if (
            updatingRef.current && !userStore.isUpdating
        ) {
            updatingRef.current = false;
            if (!userStore.err) {
                Toast.show(
                    {
                        type: 'success',
                        text1: "Dados atualizados",
                        visibilityTime: 2000
                    }
                )
                if (eventUpdate == 'password') {
                    cancelEditPass()
                } else if (eventUpdate == 'name') {
                    cancelEditName()
                } else if (eventUpdate == 'email') {
                    cancelEditEmail()
                }
            } else {
                Toast.show(
                    {
                        type: 'error',
                        text1: "Falha ao atualizar dados",
                        visibilityTime: 2000
                    }
                )
            }
        }
    }, [userStore, user])

    logout = () => {
        dispatch(signOut)
        const login = navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'Login',
                },
            ],
        })

        navigation.dispatch(login)
    }

    pickImage = (source) => {
        if (source == 'library') {
            launchImageLibrary({
                maxWidth: 800,
                maxHeight: 600,
                includeBase64: true,
                selectionLimit: 1
            }).then(res => {
                if (!res.didCancel) {
                    const image = res.assets[0];
                    dispatch(updatePhoto(user, image.base64))
                    changeEvent('photo')
                }
            }).catch(err => {
                Toast.show({ type: 'error', text1: "Falha ao obter imagem" })
                console.log('launchImageLibrary err', err)
            })
        } else {
            launchCamera({
                maxWidth: 800,
                maxHeight: 600,
                includeBase64: true,
                saveToPhotos: true,
                cameraType: 'back'
            }).then(res => {
                if (!res.didCancel) {
                    const image = res.assets[0];
                    dispatch(updatePhoto(user, image.base64))
                    changeEvent('photo')
                }
            }).catch(err => {
                Toast.show({ type: 'error', text1: "Falha ao obter imagem" })
                console.log('launchCamera err', err)
            })
        }

    }

    cancelEditPass = () => {
        changePassword(null)
        changeConfirmPass(null)
        changeEditPass(false)
    }

    cancelEditName = () => {
        changeName(null)
        changeEditName(false)
    }

    cancelEditEmail = () => {
        changeEmail(null)
        changeEditEmail(false)
    }

    setPassword = () => {
        if (validPassword()) {
            changeEvent('password')
            dispatch(updatePassword(password))
        }
    }

    validPassword = () => {
        if (
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            Toast.show({
                type: 'error',
                text1: 'Dados inválidos',
                text2: "Senha e confirmação de senha são inválidas"
            })
            return false;
        }

        if (
            password != confirmPassword
        ) {
            Toast.show({
                type: 'error',
                text1: 'Dados inválidos',
                text2: "Senha e confirmação não são iguais"
            })
            return false;
        }

        if (
            password.length < 6
        ) {
            Toast.show({
                type: 'error',
                text1: 'Dados inválidos',
                text2: "A senha deve conter mais de 6 caracteres"
            })
            return false;
        }

        return true;
    }

    setName = () => {
        if (!name.trim()) {
            return Toast.show(
                {
                    type: 'error',
                    text1: "Nome inválido",
                    visibilityTime: 2000
                }
            )
        }

        changeEvent('name')
        dispatch(updateName(name))
    }

    setEmail = () => {
        if (!email.trim()) {
            return Toast.show(
                {
                    type: 'error',
                    text1: "Email inválido",
                    visibilityTime: 2000
                }
            )
        }

        changeEvent('email')
        dispatch(updateEmail(email))
    }

    deleteAccount = () => {
        dispatch(deleteUser())
        setTimeout(() => {
            const login = navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Login',
                    },
                ],
            })

            navigation.dispatch(login)
        }, 1000)
    }

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <ScrollView>
                <View style={styles.container}>
                    <Avatar  {...user} style={styles.avatar} />
                    {
                        userStore.isUpdating && eventUpdate == 'photo'
                            ? <View style={styles.containerUpdatePhoto} >
                                <ActivityIndicator size="medium" color="#6228d7" />
                                <Text>Atualizando foto</Text>
                            </View>
                            : <View style={styles.selectSourceImage} >
                                <TouchableOpacity
                                    onPress={() => pickImage('camera')}
                                    disabled={userStore.isUpdating}
                                    style={[styles.button, styles.selectPicture]}
                                >
                                    <IconFA name="camera" color="#FFF" size={25} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => pickImage('library')}
                                    disabled={userStore.isUpdating}
                                    style={[styles.button, styles.selectPicture]}
                                >
                                    <IconFA name="image" color="#FFF" size={25} />
                                </TouchableOpacity>
                            </View>
                    }

                    <View style={{ padding: 15 }}>
                        <View style={styles.formSenha}>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 15 }}>Nome</Text>
                            <View style={[styles.inputForm]}>
                                <TextInput
                                    placeholder={user.name} editable={editName}
                                    value={name}
                                    placeholderTextColor="grey"
                                    style={[
                                        styles.input,
                                    ]}
                                    onChangeText={(name) => changeName(name)}
                                />
                            </View>
                            {
                                editName ?
                                    <View style={[styles.buttonsChange]}>
                                        <TouchableOpacity
                                            disabled={userStore.isUpdating}
                                            onPress={() => cancelEditName()}
                                            style={[styles.button, styles.buttonCancel, styles.butonSmall]}>
                                            <Text style={{ color: '#FFF', textAlign: 'center' }}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setName()}
                                            disabled={userStore.isUpdating}
                                            style={[styles.button, styles.butonSmall]}>
                                            {
                                                userStore.isUpdating
                                                    ? <ActivityIndicator size="small" color="#FFF" />
                                                    : <Text style={{ color: '#FFF', textAlign: 'center' }}>Alterar</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    : <TouchableOpacity
                                        disabled={userStore.isUpdating}
                                        onPress={() => {
                                            changeEditName(true)
                                            cancelEditEmail()
                                            cancelEditPass()
                                        }}
                                        style={[styles.button]}>
                                        <Text style={{ color: '#FFF', textAlign: 'center' }}>Editar</Text>
                                    </TouchableOpacity>
                            }

                        </View>
                    </View>

                    {/* <View style={{ padding: 15 }}>
                        <View style={styles.formSenha}>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 15 }}>Email</Text>
                            <View style={[styles.inputForm]}>
                                <TextInput
                                    placeholder={user.email} editable={editEmail}
                                    value={email}
                                    onChangeText={(email) => changeEmail(email)}
                                    placeholderTextColor="grey"
                                    style={[
                                        styles.input,
                                    ]}
                                />
                            </View>
                            {
                                editEmail ?
                                    <View style={[styles.buttonsChange]}>
                                        <TouchableOpacity
                                            disabled={userStore.isUpdating}
                                            onPress={() => cancelEditEmail()}
                                            style={[styles.button, styles.buttonCancel, styles.butonSmall]}>
                                            <Text style={{ color: '#FFF', textAlign: 'center' }}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setEmail()}
                                            disabled={userStore.isUpdating}
                                            style={[styles.button, styles.butonSmall]}>
                                            {
                                                userStore.isUpdating
                                                    ? <ActivityIndicator size="small" color="#FFF" />
                                                    : <Text style={{ color: '#FFF', textAlign: 'center' }}>Alterar</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    : <TouchableOpacity
                                        disabled={userStore.isUpdating}
                                        onPress={() => {
                                            changeEditEmail(true)
                                            cancelEditName()
                                            cancelEditPass()
                                        }}
                                        style={[styles.button]}>
                                        <Text style={{ color: '#FFF', textAlign: 'center' }}>Editar</Text>
                                    </TouchableOpacity>
                            }

                        </View>
                    </View> */}

                    <View style={[{ padding: 15 }]}>
                        <View style={styles.formSenha}>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 15 }}>Trocar senha</Text>

                            <View style={[styles.inputForm]}>
                                <TextInput
                                    placeholder="Senha"
                                    editable={editPass}
                                    value={password}
                                    onChangeText={(password) => changePassword(password)}
                                    placeholderTextColor="grey"
                                    secureTextEntry
                                    style={[
                                        styles.input,
                                    ]}
                                />
                            </View>
                            <View style={[styles.inputForm]}>
                                <TextInput
                                    placeholder="Confirmação senha" editable={editPass}
                                    value={confirmPassword}
                                    onChangeText={(confirmPassword) => changeConfirmPass(confirmPassword)}
                                    placeholderTextColor="grey"
                                    secureTextEntry
                                    style={[
                                        styles.input,
                                    ]}
                                />
                            </View>
                            {
                                editPass ?
                                    <View style={[styles.buttonsChange]}>
                                        <TouchableOpacity
                                            onPress={() => cancelEditPass()}
                                            style={[styles.button, styles.buttonCancel, styles.butonSmall]}>
                                            <Text style={{ color: '#FFF', textAlign: 'center' }}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            disabled={userStore.isUpdating}
                                            onPress={() => setPassword()}
                                            style={[styles.button, styles.butonSmall]}
                                        >
                                            {
                                                userStore.isUpdating
                                                    ? <ActivityIndicator size="small" color="#FFF" />
                                                    : <Text style={{ color: '#FFF', textAlign: 'center' }}>Alterar</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    : <TouchableOpacity
                                        onPress={() => {
                                            cancelEditEmail()
                                            cancelEditName()
                                            changeEditPass(true)
                                        }}
                                        disabled={userStore.isUpdating}
                                        style={[styles.button]}>
                                        <Text style={{ color: '#FFF', textAlign: 'center' }}>Editar</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={[{ padding: 15 }]} >
                        <TouchableWithoutFeedback
                            onPress={() => logout()}
                            disabled={userStore.isUpdating}
                        >
                            <Text style={{ color: 'black', textAlign: 'center' }}>Sair</Text>
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={[{ padding: 15 }]} >
                        <TouchableWithoutFeedback
                            onPress={() => changeModal(true)}
                            disabled={userStore.isUpdating}
                        >
                            <Text style={{ color: 'red', textAlign: 'center' }}>Deletar conta</Text>
                        </TouchableWithoutFeedback>
                    </View>

                </View>
            </ScrollView>
            <ModalConfirm
                onClose={() => changeModal(false)}
                onConfirm={() => deleteAccount()}
                visible={modalVisible}
                title="Deletar Contar"
                message="Deseja realmente apagar sua conta?"
                message2="Apenas sua conta e publicações serão apagadas durante o processo."
                message2Style={{ fontWeight: 'bold' }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 60,
    },
    logouContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-end",
        paddingRight: 15
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 20
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 50,
    },
    nickname: {
        fontSize: 30,
        marginTop: 10,
        fontWeight: 'bold'
    },
    email: {
        fontSize: 25,
        marginTop: 10,
        fontWeight: 'bold'
    },

    formContainer: {
        flexDirection: 'row',
        margin: 10,
    },
    input: {
        flex: 1,
        borderColor: "#000",
        borderWidth: .5,
        borderRadius: 15,
        paddingLeft: 15,
        paddingRight: 15,
        color: "#000"
    },
    selectSourceImage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 100,
        width: "100%"
    },
    containerUpdatePhoto: {
        alignItems: 'center',
        height: 100,
        width: "100%"
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: "#6228d7",
        borderRadius: 10
    },

    buttonCancel: {
        backgroundColor: "#d74a49",
    },
    formSenha: {
        width: "100%",
        padding: 10,
        borderColor: "#000",
        borderWidth: .5,
        borderRadius: 10
    },
    inputForm: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 0,
        marginRight: 0,
    },
    buttonsChange: {
        width: "100%",
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    butonSmall: {
        width: 100
    },


    modalDelete: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        height: 100,
        borderRadius: 0,
        borderWidth: 0,
        marginTop: -1,
        margin: 0,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#000",
        backgroundColor: "#fff",
        justifyContent: 'center'
    },
    modalBackgroung: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backgroundModal: {
        height: 50,
        justifyContent: 'center'
    },
    headerTitle: {
        textAlign: 'center',
        color: "#fff"
    },
    buttonsModal: {
        backgroundColor: "#fff",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }


})