import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { postReducer } from "./features/Post/PostSlice";
import { userReducer } from "./features/User/UserSlice";

function loggerMiddlewareTest(store) {
    return function (next) {
        return function (action) {
            console.log('loggerMiddlewareTest', action.type);
            next(action)
        }
    }
}

export const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk).concat(loggerMiddlewareTest)
})