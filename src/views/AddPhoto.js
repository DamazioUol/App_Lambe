import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Header'
import { saveNewPost } from '../features/Post/PostSlice'

export default function AddPhoto() {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const post = useSelector(state => state.posts)

    const navigation = useNavigation()
    const [description, onChangeDescription] = useState(null)
    const [image, onChangeImage] = useState({ uri: null, base64: null })
    const creatingPost = useRef()

    pickImage = (source) => {
        if (source == 'library') {
            launchImageLibrary({
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 600,
                includeBase64: true,
                selectionLimit: 1
            }).then(res => {
                if (!res.didCancel) {
                    const image = res.assets[0];
                    onChangeImage({ uri: image.uri, base64: image.base64 })
                }
            }).catch(err => console.error(err))
        } else {
            launchCamera({
                maxWidth: 800,
                maxHeight: 600,
                includeBase64: true,
                saveToPhotos: true,
                cameraType: 'back',
                mediaType: 'photo'
            }).then(res => {
                if (!res.didCancel) {
                    const image = res.assets[0];
                    onChangeImage({ uri: image.uri, base64: image.base64 })
                }
            }).catch(err => console.error(err))
        }

    }

    useEffect(() => {

        if (!creatingPost.current) {
            creatingPost.current = post.isCreating
        }

        if (
            creatingPost.current && !post.isCreating
        ) {
            creatingPost.current = false
            if (!post.err) {
                onChangeDescription(null)
                onChangeImage({ uri: null, base64: null })
                navigation.navigate("Home")
            } else {
                Toast.show(
                    {
                        type: 'error',
                        text1: "Falha ao criar publicação",
                        visibilityTime: 1000
                    }
                )
            }
        }

    }, [post])

    save = () => {
        if (!image.uri) {
            return Toast.show({
                type: 'error',
                text1: 'Imagem é obrigatório!',
                visibilityTime: 2000
            })
        }

        const post = {
            nickname: user.name,
            email: user.email,
            uidUser: user.uid,
            userPhotoURL: user.photoURL,
            image: image,
            description
        }

        dispatch(saveNewPost(post))
    }

    return (
        <>
            <Header />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        {image.uri && <Image source={image} style={styles.image} />}
                    </View>
                    <View style={styles.selectSourceImage} >
                        <TouchableOpacity
                            disabled={post.isCreating} onPress={() => pickImage('camera')}
                            style={[styles.button, styles.selectPicture]}
                        >
                            <Icon name="camera" color="#FFF" size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={post.isCreating} onPress={() => pickImage('library')}
                            style={[styles.button, styles.selectPicture]}
                        >
                            <Icon name="image" color="#FFF" size={25} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.commentContainer}>
                        <TextInput
                            editable={!post.isCreating}
                            placeholder='Descrição para foto' placeholderTextColor="rgba(0,0,0,0.7)"
                            value={description} onChangeText={description => onChangeDescription(description)}
                            style={styles.description} multiline
                        />
                    </View>
                    {
                        post.isCreating
                            ?
                            <ActivityIndicator size="medium" color="#0000ff" />
                            :
                            <TouchableOpacity onPress={() => save()} style={[styles.button, styles.buttonSave]}>
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                    }
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        height: Dimensions.get('window').width * 1.71
    },
    title: {
        fontSize: 20,
        marginTop: Platform.OS == 'ios' ? 30 : 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    imageContainer: {
        width: '95%',
        height: Dimensions.get('window').width / 2,
        backgroundColor: "rgba(189, 195, 199, 1)",
        margin: 10
    },
    image: {
        width: "100%",
        height: Dimensions.get('window').width / 2,
        resizeMode: 'contain'
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: "#6228d7",
        borderRadius: 10
    },
    buttonText: {
        fontSize: 20,
        color: "#FFF",
        textAlign: 'center'
    },
    input: {
        marginTop: 20,
        width: "90%",
        color: "#000"
    },
    buttonSave: {
        backgroundColor: "#6228d7",
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 10,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
    },
    description: {
        color: "#000",
        flexWrap: 'nowrap'
    },
    selectSourceImage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
})