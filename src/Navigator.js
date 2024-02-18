import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import moment from 'moment';
import React from 'react';
import { Appearance } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Provider, useSelector } from 'react-redux';
import { store } from './Store';
import Avatar from './components/Avatar';
import { checkCurrentUser } from './features/User/UserSlice';
import AddPhoto from './views/AddPhoto';
import Feed from './views/Feeds';
import Login from './views/Login';
import Profile from './views/Profile';
import Register from './views/Register';
import ResetPassword from './views/ResetPassword';
import Splash from './views/Splash';
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

store.dispatch(checkCurrentUser)

moment.locale('pt-br')

Appearance.setColorScheme('light')

export default function Root() {
    return (
        <Provider store={store}>
            <PaperProvider>
                <NavigationContainer >
                    <Stack.Navigator
                        initialRouteName="Splash"
                        screenOptions={{
                            headerShown: false,
                            headerBackVisible: false,
                        }}
                    >
                        <Stack.Screen name="Splash" component={Splash} />
                        <Stack.Screen name="Tabs" component={TabBarNavigator} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="ResetPassword" component={ResetPassword} />
                    </Stack.Navigator>
                    <Toast />
                </NavigationContainer>
            </PaperProvider>
        </Provider>
    )
}

function TabBarNavigator() {
    const user = useSelector(state => state.user.user);
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveTintColor: "white",
                tabBarStyle: {
                    backgroundColor: "#ee2a7b",
                }
            }}
        >
            <Tab.Screen name="Home" component={Feed} options={{
                tabBarIcon: ({ color }) => (
                    <Icon name='home' size={35} color={color} />
                ),
            }} />
            <Tab.Screen name="AddPhoto" component={AddPhoto} options={{
                tabBarIcon: ({ color }) =>
                    <Icon name='camera' size={30} color={color} />
            }} />
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarIcon: ({ color }) =>
                    <Avatar
                        {...user}
                        style={
                            {
                                width: 35,
                                height: 35,
                                borderRadius: 17.5,
                                borderColor: color,
                                borderWidth: 2
                            }
                        }
                    />
            }} />
        </Tab.Navigator>
    );
}

