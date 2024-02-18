import React, { useState } from 'react'
import { ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import background from '../../../assets/imgs/background-login.png'

export default function ModalInput(props) {
    const [text, onChangeText] = useState(null)

    closeModal = () => {
        onChangeText(null)
        props.onClose()
    }

    confirm = () => {
        onChangeText(null)
        props.onConfirm(text)
    }
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => closeModal()}
        >
            <TouchableWithoutFeedback
                onPress={() => closeModal()}
            >
                <View style={styles.modal}>
                    <TouchableWithoutFeedback>
                        <View style={{ marginLeft: 10, marginRight: 10 }} >
                            <ImageBackground
                                borderTopLeftRadius={20}
                                borderTopRightRadius={20}
                                source={background}
                                style={styles.backgroundHeaderModal}
                            >
                                <Text style={styles.headerTitle}>{props.title}</Text>
                            </ImageBackground>
                            <View style={[styles.modalContainer]}>
                                <TextInput placeholder={props.placeholder}
                                    style={styles.input}
                                    value={text} autoFocus
                                    onChangeText={(text) => onChangeText(text)}
                                    multiline
                                />
                            </View>
                            <View style={styles.buttons}>
                                <TouchableWithoutFeedback onPress={() => closeModal()} >
                                    <View style={styles.button}>
                                        <Icon name="times" color="#555" size={25} />
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => confirm()} >
                                    <View style={styles.button}>
                                        <Icon name="check" color="#555" size={25} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
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
    backgroundHeaderModal: {
        width: "100%",
    },
    headerTitle: {
        textAlign: 'center',
        padding: 15,
        color: "#fff"
    },
    input: {
        width: "100%",
        color: "#000",
    },
    buttons: {
        backgroundColor: "#fff",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: "50%",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
})