import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { store } from '../../Store';


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

const initialState = {
    list: [],
    isLoading: false,
    isRefreshing: false,
    isCreating: false,
    isDeleting: false,
    err: null
}

export const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state = {
                ...state,
                list: action.payload
            };

            state.err = null
            state.isRefreshing = false;
            state.isLoading = false;
            state.isCreating = false;
            return state
        },
        handlerRefresh: (state, action) => {
            state.isRefreshing = !state.isRefreshing;
            state.err = action.payload || null
        },
        handlerLoading: (state, action) => {
            state.isLoading = !state.isLoading
            state.err = action.payload || null
        },
        handlerCreatePost: (state, action) => {
            state.isCreating = !state.isCreating;
            state.err = action.payload || null
        },
        handlerDeletePost: (state, action) => {
            state.isDeleting = !state.isDeleting;
            state.err = action.payload || null
        }
    }
})


function fetchPosts(event, dispatch) {
    database()
        .ref('/posts')
        .orderByChild('createAt')
        .once('value')
        .then(response => {
            if (response.exists()) {
                let data = []
                response.forEach(post => data.push(post.toJSON()))
                dispatch({ type: 'posts/setPosts', payload: data.reverse() })
            } else {
                dispatch({ type: 'posts/setPosts', payload: [] })
            }
        }).catch(err => {
            dispatch({ type: `posts/${event}`, payload: err.toString() })
            console.log('Error err database get posts', err);
        })
}

export function pullRefreshPosts(dispatch) {
    dispatch({ type: 'posts/handlerRefresh' })
    fetchPosts('handlerRefresh', dispatch)
}

export const saveNewPost = post => dispatch => {
    dispatch({ type: 'posts/handlerCreatePost' })

    const postNew = {
        ...post,
        imagePathFB: null,
        likes: [],
        id: uuidv4(),
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
    }
    const refImageStorage = `imagesPost/Lambe_${postNew.id}.jpg`;
    storage()
        .ref(refImageStorage)
        .putString(postNew.image.base64, 'base64')
        .then(res => {
            delete postNew.image;
            storage()
                .ref(res.metadata.fullPath)
                .getDownloadURL()
                .then(urlDownload => {
                    postNew.imagePathFB = res.metadata.fullPath;
                    postNew.imageUrlFB = urlDownload;

                    database()
                        .ref(`/posts/${postNew.id}`)
                        .set(postNew)
                        .then(response => {
                            dispatch({ type: 'posts/handlerCreatePost' })
                        })
                        .catch(err => {
                            dispatch({ type: 'posts/handlerCreatePost', payload: err.toString() })
                            console.log('Error err database set', err);
                        })
                }).catch(err => {
                    dispatch({ type: 'posts/handlerCreatePost', payload: err.toString() })
                    console.log('Error get url image create post', err);
                })
        }).catch(err => {
            dispatch({ type: 'posts/handlerCreatePost', payload: err.toString() })
            console.log('Error err upload storage', err);
        })
}

export const setLike = (id, user) => dispatch => {
    const posts = store.getState().posts.list;
    let model = posts.find(item => item.id == id);

    const newLike = {
        email: user.email,
        createAt: new Date().toISOString()
    };

    if (!model.likes) {
        model = { ...model, likes: [newLike] };
    } else {
        const indexLike = model.likes.findIndex(item => item.email == user.email);

        if (indexLike == -1) {
            model = {
                ...model,
                likes: [...model.likes, newLike]
            };
        } else {
            model = {
                ...model,
                likes: model.likes.filter(item => item.email != user.email)
            };
        }
        model = {
            ...model,
            likes: orderByDescCreateAt(model.likes)
        };
    }
    model.updateAt = new Date().toISOString();

    database()
        .ref(`/posts/${model.id}`)
        .update(model).catch(err => {
            console.log('Error err database set', err.toString());
        })
}

export const setComment = (postUpdate, comment) => dispatch => {

    let model = {
        ...postUpdate
    }

    if (!model.comments) {
        comment.id = uuidv4()
        model = { ...model, comments: [comment] };
    } else {
        if (comment.id) {
            model = {
                ...model,
                comments: model.comments.filter(item => item.id != comment.id)
            };
        } else {
            comment.id = uuidv4()
            model = {
                ...model,
                comments: [...model.comments, comment]
            };
        }

        model = {
            ...model,
            comments: orderByDescCreateAt(model.comments)
        }
    }
    model.updateAt = new Date().toISOString();

    database()
        .ref(`/posts/${model.id}`)
        .update(model)
        .catch(err => {
            console.log('Error err database set', err.toString());
        })
}

export function getPosts(dispatch) {
    dispatch({ type: 'posts/handlerLoading' })
    fetchPosts('handlerLoading', dispatch)
}

export const deletePost = id => dispatch => {
    dispatch({ type: 'posts/handlerDeletePost' })

    const refImageStorage = `imagesPost/Lambe_${id}.jpg`;
    storage()
        .ref(refImageStorage)
        .delete()
        .then(res => {
            database()
                .ref(`/posts/${id}`)
                .remove()
                .then(response => {
                    Toast.show({
                        type: 'success',
                        text1: 'Publicação apagada',
                        visibilityTime: 2000
                    })
                    dispatch({ type: 'posts/handlerDeletePost' })
                })
                .catch(err => {
                    Toast.show({
                        type: 'error',
                        text1: 'Falha ao apagar publicação',
                        visibilityTime: 2000
                    })
                    dispatch({ type: 'posts/handlerDeletePost', payload: err.toString() })
                    console.log('Error deletePost database', err);
                })
        }).catch(err => {
            Toast.show({
                type: 'error',
                text1: 'Falha ao apagar publicação',
                visibilityTime: 2000
            })
            dispatch({ type: 'posts/handlerDeletePost', payload: err.toString() })
            console.log('Error deletePost storage', err);
        })
}



function orderByDescCreateAt(data) {
    data = data.sort((a, b) => {
        return new Date(a.createAt) - new Date(b.createAt);
    })

    return data;
}

let isOnValueChange = false;
function onValueChange() {
    isOnValueChange = true
    database()
        .ref('/posts')
        .on('value', snapshot => {
            if (snapshot.exists()) {
                let data = []
                snapshot.forEach(post => data.push(post.toJSON()))
                data = orderByDescCreateAt(data);

                store.dispatch({ type: 'posts/setPosts', payload: data.reverse() })
            } else {
                store.dispatch({ type: 'posts/setPosts', payload: [] })
            }
        })
}

auth().onAuthStateChanged((user) => {
    if (!user) {
        isOnValueChange = false
        database()
            .ref('/posts')
            .off('value', onValueChange)
    } else {
        if (!isOnValueChange) {
            store.dispatch({ type: 'posts/handlerLoading' })
            onValueChange()
        }
    }
})


export const postReducer = postSlice.reducer