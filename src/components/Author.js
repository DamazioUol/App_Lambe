import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import { useDispatch } from 'react-redux';
import { deletePost } from '../features/Post/PostSlice';
import Avatar from './Avatar';
import ModalConfirm from './Modals/ModalConfirm';

export const Author = forwardRef((props, ref) => {

    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [modalVisible, changeModal] = useState(false)

    useImperativeHandle(ref, () => ({
        onScroll: (event) => {
            closeMenu()
        }
    }));

    deletePostModal = () => {
        dispatch(deletePost(props.id))
    }

    return (
        <>
            <View style={styles.rowContainer}>
                <View style={styles.container}>
                    <Avatar photoURL={props.userPhotoURL} />
                    <Text style={styles.nickname}>{props.nickname}</Text>
                </View>
                {
                    props.uidUser == props.user.uid ?
                        < Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            style={styles.menu}

                            anchor={
                                <TouchableWithoutFeedback onPress={openMenu}>
                                    <Icon name="dots-three-vertical" size={20} color='black' />
                                </TouchableWithoutFeedback>
                            }>
                            <Menu.Item
                                leadingIcon="trash-can-outline"
                                onPress={() => {
                                    closeMenu()
                                    changeModal(true)
                                }}
                                title="Excluir"
                                style={styles.menuItem}
                            />
                        </Menu>
                        : null
                }
            </View >
            <ModalConfirm
                openAnimation="none"
                onClose={() => changeModal(false)}
                onConfirm={() => deletePostModal()}
                visible={modalVisible}
                title="Apagar publicação "
                message="Deseja realmente apagar sua publicação?"
            />
        </>

    )
})

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between'
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nickname: {
        color: "#444",
        marginVertical: 10,
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    menu: {
    },
    menuItem: {
        width: 60,
        height: 40
    }
})