import React from 'react'
import { ImageBackground, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { ActivityIndicator, MD2Colors } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'
import background from '../../../assets/imgs/background-login.png'

export default function ModalConfirm(props) {

    if (props.isLoadingConfirm == null || props.isLoadingConfirm == undefined) {
        props.isLoadingConfirm = false
    }

    closeModal = () => {
        !props.isLoadingConfirm
            ? props.onClose()
            : {}
    }
    return (
        <Modal
            animationType={props.openAnimation || "slide"}
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
                                <Text
                                    style={[styles.messageBase, props.messageStyle,]}
                                >{props.message}</Text>
                                {
                                    props.message2
                                        ? <Text
                                            style={[styles.messageBase, props.message2Style,]}
                                        >{props.message2}</Text>
                                        : null
                                }
                            </View>
                            <View style={styles.buttons}>
                                {
                                    !props.isLoadingConfirm
                                        ? <>
                                            <TouchableWithoutFeedback onPress={() => closeModal()} >
                                                <View style={styles.button}>
                                                    <Icon name="times" color="#555" size={25} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback onPress={() => props.onConfirm()} >
                                                <View style={styles.button}>
                                                    <Icon name="check" color="#555" size={25} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </>
                                        : <ActivityIndicator style={styles.loading} size={30} color={MD2Colors.red800} />
                                }

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
    backgroundHeaderModal: {
        width: "100%",
    },
    headerTitle: {
        textAlign: 'center',
        padding: 15,
        color: "#fff"
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
    modalContainer: {
        height: 100,
        borderRadius: 0,
        borderWidth: 0,
        marginTop: -1,
        margin: 0,
        padding: 10,
        alignItems: 'center',
        borderColor: "#000",
        backgroundColor: "#fff",
        justifyContent: 'center'
    },
    messageBase: {
        textAlign: 'center'
    },
    loading: {
        marginBottom: 15
    }
})