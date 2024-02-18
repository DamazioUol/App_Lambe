import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import { setLike } from '../features/Post/PostSlice'
import Comments from './Comments'

export default function Social(props) {

    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false);


    changeLike = (id) => {
        if (user.email) {
            dispatch(setLike(id, user))
        }
    }

    handlerLike = () => {
        const valid =
            props.likes &&
            props.likes.length &&
            props.likes.findIndex(item => item.email == user.email) != -1;


        return valid
            ? < Icon name={'heart'} size={25} color='red' />
            : <Icon name={'heart-o'} size={25} color='black' />
    }

    closeModalComment = () => {
        setModalVisible(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => changeLike(props.id)}>
                        {handlerLike()}
                    </TouchableOpacity>
                    {
                        props.likes &&
                            props.likes.length
                            ? <Text style={styles.likeText}>{props.likes.length} Like(s)</Text>
                            : null
                    }
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                        < Icon name={'comment-o'} size={25} color='black' />
                    </TouchableWithoutFeedback>
                    {
                        props.comments &&
                            props.comments.length
                            ? <Text style={styles.likeText}>{props.comments.length} Comentário(s)</Text>
                            : null
                    }
                </View>
            </View>
            <Comments post={props} modalVisible={modalVisible} close={closeModalComment} />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginTop: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    likeText: {
        fontSize: 12,
    },
   
})