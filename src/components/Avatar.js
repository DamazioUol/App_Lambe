import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Gravatar } from 'react-native-gravatar'
export default function Avatar(props) {
    return (
        <>
            {
                props.photoURL
                    ? <Image
                        source={{ uri: props.photoURL }}
                        style={[styles.avatar, props.style]}
                    />
                    : <Gravatar
                        options={{ parameters: { "size": "50", "d": "mm" }, }}
                        style={[styles.avatar, props.style]}
                    />
            }
        </>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
})