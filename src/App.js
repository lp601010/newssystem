// import React from "react";
import IndexRouter from "./router/IndexRouter"
import { Provider } from "react-redux"
import store from "./redux/store"
import "./App.css"

export default function App() {
    return (
        // IndexRouter组件被包裹后，所有子组件都可以得到state数据
        <Provider store={store}>
            <IndexRouter></IndexRouter>
        </Provider>
    )
}
