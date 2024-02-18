import React, { useState } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import { setComment } from '../features/Post/PostSlice'
import ModalInput from './Modals/ModalInput'

export default function AddComment(props) {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const [modalVisible, setModalVisible] = useState(false);


    handlerAddComment = (comment) => {
        if (comment && comment.trim()) {
            const commentNew = {
                nickname: user.name,
                email: user.email,
                comment: comment,
                createAt: new Date().toISOString()
            }
            dispatch(setComment(props, commentNew))
        }
        handlerCloseEditMode()
    }


    handlerCloseEditMode = () => {
        setModalVisible(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)} >
                <View style={styles.container}>
                    <Icon name="comment-o" color="#555" size={25} />
                    <Text style={styles.caption}>Adicione um comentário...</Text>
                </View>
            </TouchableWithoutFeedback >
            <ModalInput
                onClose={() => setModalVisible(false)}
                onConfirm={(text) => handlerAddComment(text)}
                visible={modalVisible}
                title="Comentar"
                placeholder="Comente aqui..."
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#fff",
        height: 50,
        margin: 10
    },
    containerModal: {
        height: 100,
        borderRadius: 0,
        borderWidth: 0,
        marginTop: -1,
        margin: 0,
        padding: 10
    },
    caption: {
        marginLeft: 10,
        fontSize: 12,
        color: "#CCC"
    },
    input: {
        width: "100%",
        color: "#000",
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backgroundHeaderModal: {
        width: "90%",
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
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }
})