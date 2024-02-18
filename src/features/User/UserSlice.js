import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

const initialState = {
    user: {
        name: null,
        email: null,
        uid: null,
        photoURL: null,
    },
    isCreating: false,
    err: null,
    isUpdating: false,
    isReseting: false
}


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        Logged: (state, action) => {
            state.user = {
                name: action.payload.name,
                email: action.payload.email,
                uid: action.payload.uid,
                photoURL: action.payload.photoURL,
            }

            state.err = null
            state.isCreating = false
            state.isLoadingLogin = false
            state.isUpdating = false
        },
        reset: (state) => {
            state = initialState
        },
        handlerLogin: (state) => {
            state.isLoadingLogin = !state.isLoadingLogin
        },
        handlerRegister: (state, action) => {
            state.isCreating = !state.isCreating
            state.err = action.payload
        },
        handlerUpdate: (state, action) => {
            state.isUpdating = !state.isUpdating
            state.err = action.payload
        },
        handlerResetPass: (state, action) => {
            state.isReseting = !state.isReseting
            state.err = action.payload
        },
    }
})


export const createUser = user => dispatch => {
    dispatch({ type: 'user/handlerRegister' })

    auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(userAuth => {
            userAuth.user.updateProfile({
                displayName: user.name
            }).then(update => {
                const payload = {
                    name: userAuth.user.displayName,
                    email: userAuth.user.email,
                    photoURL: userAuth.user.photoURL,
                    uid: userAuth.user.uid
                }
                dispatch({ type: 'user/Logged', payload })
            }).catch(err => {
                dispatch({ type: 'user/handlerRegister', payload: err.toString() })
                console.log('Error err auth updateProfile', err);
            })
        }).catch(err => {
            dispatch({ type: 'user/handlerRegister', payload: err.toString() })
            console.log('Error err auth createUserWithEmailAndPassword', err);
        })

}

export function checkCurrentUser(dispatch) {
    const user = auth().currentUser
    if (user && user.uid) {
        const payload = {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
        }

        dispatch({ type: 'user/Logged', payload })
    }
}

export const loginEP = user => dispatch => {
    dispatch({ type: 'user/handlerLogin' })

    auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(userAuth => {
            const payload = {
                name: userAuth.user.displayName,
                email: userAuth.user.email,
                photoURL: userAuth.user.photoURL,
                uid: userAuth.user.uid
            }
            dispatch({ type: 'user/Logged', payload })
        }).catch(err => {
            dispatch({ type: 'user/handlerLogin' })
            console.log('err auth createUserWithEmailAndPassword', err);
        })

}

export function signOut(dispatch) {
    const user = auth().currentUser;
    if (user && user.uid) {
        auth()
            .signOut()
            .then(() => {
                dispatch({ type: 'user/reset' })
            })
            .catch(err => {
                console.log('auth signOut err', err);
            })
    } else {
        dispatch({ type: 'user/reset' })
    }
}


export const updatePhoto = (userAuth, base64) => dispatch => {
    dispatch({ type: 'user/handlerUpdate' })

    storage()
        .ref(`/users/${userAuth.uid}.jpg`)
        .putString(base64, 'base64')
        .then(photoURL => {
            storage()
                .ref(photoURL.metadata.fullPath)
                .getDownloadURL().then(downloadURL => {
                    auth()
                        .currentUser
                        .updateProfile({ photoURL: downloadURL })
                        .then(res => {
                            updatePostByUser(userAuth, 'userPhotoURL', downloadURL).then(async res => {
                                const payload = {
                                    name: userAuth.name,
                                    email: userAuth.email,
                                    photoURL: downloadURL,
                                    uid: userAuth.uid
                                }
                                dispatch({ type: 'user/Logged', payload })
                            }).catch(err => {
                                dispatch({ type: 'user/handlerUpdate', payload: err.toString() })
                                console.log('Error updatePostByUser', err);
                            })
                        }).catch(err => {
                            dispatch({ type: 'user/handlerUpdate', payload: err.toString() })
                            console.log('Error updatePhoto updateProfile user', err);
                        })
                }).catch(err => {
                    dispatch({ type: 'user/handlerUpdate', payload: err.toString() })
                    console.log('Error updatePhoto getDownloadURL user', err);
                })
        })
        .catch(err => {
            dispatch({ type: 'user/handlerUpdate', payload: err.toString() })
            console.log('Error updatePhoto storage user', err);
        })
}

export const updateName = name => dispatch => {
    dispatch({ type: 'user/handlerUpdate' })
    auth()
        .currentUser
        .updateProfile({ displayName: name })
        .then(res => {
            const user = auth().currentUser;
            updatePostByUser(user, 'nickname', name)
                .then(() => {
                    const payload = {
                        name,
                        email: user.email,
                        photoURL: user.photoURL,
                        uid: user.uid
                    }
                    dispatch({ type: 'user/Logged', payload })
                })
                .catch(err => {
                    dispatch({ type: 'user/handlerUpdate', payload: err.toString() })
                    console.log('Error updatePostByUser user', err);
                })

        })
        .catch(err => {
            dispatch({ type: 'user/handlerUpdate', payload: err.toString() })
            console.log('Error updateName user', err);
        })
}

export const updateEmail = email => dispatch => {
    dispatch({ type: 'user/handlerUpdate' })

    auth()
        .currentUser
        .updateEmail(email)
        .then(res => {
            const user = auth().currentUser;
            const payload = {
                name: name,
                email,
                photoURL: user.photoURL,
                uid: user.uid
            }
            dispatch({ type: 'user/Logged', payload })
        })
        .catch(err => {
            dispatch({ type: 'user/handlerUpdate', payload: err.toString() })
            console.log('Error updateEmail user', err);
        })
}

export const updatePassword = password => dispatch => {
    dispatch({ type: 'user/handlerUpdate' })
    auth()
        .currentUser
        .updatePassword(password)
        .then(res => {
            dispatch({ type: 'user/handlerUpdate' })
        })
        .catch(err => {
            dispatch({ type: 'user/handlerUpdate', payload: err.toString() })
            console.log('Error updatePassword user', err);
        })
}

export const deleteUser = () => dispatch => {
    const currentUser = auth().currentUser;
    currentUser
        .delete()
        .then(res => {
            database()
                .ref('/posts')
                .orderByChild('uidUser')
                .equalTo(currentUser.uid)
                .once('value')
                .then(response => {
                    if (response.exists()) {
                        response.forEach(async item => {
                            await item.ref.remove()
                        })
                    }
                })
        })
        .catch(err => {
            if (err.toString().includes('auth/requires-recent-login')) {
                signOut(dispatch)
                Toast.show({
                    type: 'error',
                    text1: "Realize o login novamente e repita o processo",
                    visibilityTime: 3000
                })
            }
        })
}

export const sendResetPassToEmail = (email) => dispatch => {
    dispatch({ type: 'user/handlerResetPass' })
    auth()
        .sendPasswordResetEmail(email)
        .then(res => {
            Toast.show({
                type: 'success',
                text1: "Email de recuperação enviado",
                text1Style: { flexWrap: 'nowrap' },
                visibilityTime: 3000
            })
            dispatch({ type: 'user/handlerResetPass' })
        })
        .catch(err => {
            let msg = "Falha no envio de email de reset"
            if (err.toString().includes('auth/invalid-email')) {
                msg = "Email inválido"
            }
            Toast.show({
                type: 'error',
                text1: "Falha no envio de email de reset",
                visibilityTime: 3000
            })
            console.log('sendResetPassToEmail err', err);
            dispatch({ type: 'user/handlerResetPass', err })
        })
}

export const confirmResetPass = (code, newPassword) => dispatch => {
    dispatch({ type: 'user/handlerResetPass' })
    auth()
        .confirmPasswordReset(code, newPassword)
        .then(res => {
            Toast.show({
                type: 'success',
                text1: "Senha alterada!",
                visibilityTime: 3000
            })
            dispatch({ type: 'user/handlerResetPass' })
        })
        .catch(err => {
            let msg = "Falha no alteração da senha";

            if (err.toString().includes('auth/expired-action-code')) {
                msg = "Código expirado"
            } else
                if (err.toString().includes('auth/invalid-action-code')) {
                    msg = "Código inválido"
                } else
                    if (err.toString().includes('auth/user-disabled')) {
                        msg = "Usuário bloqueado"
                    } else
                        if (err.toString().includes('auth/user-not-found')) {
                            msg = "Usuário não encontrado"
                        } else
                            if (err.toString().includes(' auth/weak-password')) {
                                msg = "Senha inválida"
                            }

            Toast.show({
                type: 'error',
                text1: msg,
                visibilityTime: 3000
            })
            console.log('confirmResetPass err', err);
            dispatch({ type: 'user/handlerResetPass', err })
        })
}


async function updatePostByUser(userAuth, field, value) {
    return new Promise((resolve, reject) => {
        database()
            .ref('/posts')
            .orderByChild('uidUser')
            .equalTo(userAuth.uid)
            .once('value').then(async response => {
                if (response.exists()) {
                    response.forEach(async item => {
                        await item.ref.update({ [field]: value });
                    })
                }
                resolve()
            }).catch(err => {
                reject(err)
            })
    })
}


export const { Logged, Logout } = userSlice.actions;
export const userReducer = userSlice.reducer