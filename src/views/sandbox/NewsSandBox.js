import React from "react"
import SideMenu from "../../components/sandboox/SideMenu"
import TopHeader from "../../components/sandboox/TopHeader"
import NewsRouter from "../../components/sandboox/NewsRouter"
//css
import "./NewsSandBox.css"
//antd
import { Layout } from "antd"
const { Content } = Layout

export default function NewsSandBox() {
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className='site-layout'>
                <TopHeader></TopHeader>
                <Content
                    className='site-layout-background'
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto",
                    }}>
                    <NewsRouter></NewsRouter>
                </Content>
            </Layout>
        </Layout>
    )
}
