import moment from 'moment';
import React from 'react';
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import backgroundLogin from '../../assets/imgs/background-login.png';
import { setComment } from '../features/Post/PostSlice';
import AddComment from './AddComment';

export default function Comments(props) {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch()
    
    getPermissionDelete = (comment) => {
        return comment.email == user.email
            ? <TouchableWithoutFeedback
                onPress={() => dispatch(setComment(props.post, item))}
            >
                < Icon name={'trash'} size={15} color='red' />
            </TouchableWithoutFeedback>
            : null
    }

    getListComments = () => {
        return (
            <View style={styles.container}>
                <ScrollView scrollsToTop>
                    {props.post.comments
                        ? props.post.comments.map((item, index) => {
                            return (
                                <View style={styles.columnContainer} key={index}>
                                    <View style={styles.rowContainer} key={index}>
                                        <View style={styles.user} >
                                            <Text style={styles.nickname}>{item.nickname}</Text>
                                            <Text style={styles.createAt}> - {moment(item.createAt).fromNow()}</Text>
                                        </View>
                                        {getPermissionDelete(item)}
                                    </View>
                                    <Text style={styles.comment}>{item.comment}</Text>
                                </View>
                            )
                        })
                        : null}
                </ScrollView>
            </View>

        )
    }



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.close();
            }}
        >
            <TouchableWithoutFeedback
                onPress={() => props.close()}
            >
                <View style={styles.modal}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalComments}>
                            <ImageBackground
                                borderTopLeftRadius={20}
                                borderTopRightRadius={20}
                                source={backgroundLogin}
                                style={styles.background}
                            >
                                <Text style={styles.headerTitle}>Comentários</Text>
                                <TouchableWithoutFeedback onPress={() => props.close()} >
                                    < Icon name={'close'} size={25} color='black' />
                                </TouchableWithoutFeedback>
                            </ImageBackground>
                            <View style={styles.commentList}>
                                {getListComments()}
                            </View>
                            <AddComment {...props.post} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        maxHeight: '100%',
    },
    columnContainer: {
        flex: 1,
        borderBottomColor: "grey",
        borderBottomWidth: .5,
        padding: 10
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    nickname: {
        fontWeight: 'bold',
        color: "#444",
        fontSize: 13
    },
    comment: {
        color: "#555",
        flexWrap: 'wrap',
        flex: 1,
        fontSize: 12,
        marginTop: 10,
        marginLeft: 2
    },
    createAt: {
        color: "grey",
        fontSize: 8,
    },
    avatar: {
        width: 25,
        height: 25,
        borderRadius: 15,
        marginRight: 10
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    modal: {
        flex: 1,
        paddingTop: "20%",
    },
    modalComments: {
        flex: 10,
        height: "80%",
        backgroundColor: "#fff",
    },
    headerTitle: {
        textAlign: 'center',
        color: "#fff"
    },
    commentList: {
        flex: 9,
    },
    addComment: {
        flex: 1
    },
    background: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})