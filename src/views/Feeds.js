import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Header'
import Post from '../components/Post'
import { pullRefreshPosts } from '../features/Post/PostSlice'


export default function Feed() {
    let posts = useSelector(state => state.posts);
    const [refreshing, setRefreshing] = useState(false);
    const refresh = useRef()
    const dispatch = useDispatch()

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(pullRefreshPosts)
    }, []);

    const authorRef = useRef()

    useEffect(() => {
        if (!refresh.current) {
            refresh.current = posts.isRefreshing
        }
        if (refresh.current && !posts.isRefreshing) {
            setRefreshing(false);
            refresh.current = false;
            if (!posts.list.length) {
                Toast.show(
                    {
                        type: 'error',
                        text1: "Falha ao carregar posts",
                        visibilityTime: 1000
                    }
                )
            }
        }
    }, [posts])

    scrollEvent = (event) => {
        authorRef.current.onScroll();
    }

    return (
        <View style={styles.container}>
            <Header />
            {
                posts.isLoading
                    ? <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ActivityIndicator size="large" color="#6228d7" />
                        <Text style={{ color: "#000" }}>
                            Carregando publicações
                        </Text>
                    </View>
                    : <ScrollView
                        onScroll={(event) => scrollEvent(event)}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {
                            (
                                posts.list && posts.list.length
                                    ? posts.list.map((item) => {
                                        return <Post key={item.id} {...item} authorRef={authorRef} />
                                    })
                                    : <Text
                                        style={{ color: "#000", marginTop: 100 }}
                                    > Nenhuma publicação disponível no momento
                                    </Text>
                            )
                        }
                    </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#F5FCFF",
    }
})