import moment from 'moment'
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setLike } from '../features/Post/PostSlice'
import { Author } from './Author'
import Social from './Social'

export default function Post(props) {
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()

    changeLike = (id) => {
        if (user.email) {
            dispatch(setLike(id, user))
        }
    }

    props = { ...props, user }
    return (
        <View style={styles.container}>
            <Author key={props.id} {...props} ref={props.authorRef} />
            <TouchableWithoutFeedback onPress={() => changeLike(props.id)}>
                <Image source={{ uri: props.imageUrlFB }} style={styles.image} />
            </TouchableWithoutFeedback>
            <Social {...props} />
            {
                props.description
                    ?
                    <View style={styles.containerDescription}>
                        <Text style={styles.description}>{props.description}</Text>
                    </View>
                    : null
            }
            <Text style={styles.timePost}>{moment(new Date(props.createAt)).format('DD/MM/yyyy HH:mm')}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        paddingBottom: 15,
        borderBottomColor: '#AAA',
        borderBottomWidth: 1
    },
    image: {
        width: Dimensions.get('window').width,
        height: 300,
        resizeMode: 'contain',
        backgroundColor: "rgba(189, 195, 199, 1)",
        marginTop: 10
    },
    timePost: {
        fontSize: 12,
        color: 'grey',
        textAlign: 'left',
        marginLeft: 10,
        marginTop: 15
    },
    containerDescription: {
        margin: 10,
    },
    userDescription: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 12,
    }

})

