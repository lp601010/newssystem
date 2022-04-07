import React, { useEffect, useState } from "react"
import { Layout, Menu } from "antd"
import "./index.css"
import { withRouter } from "react-router-dom"
import axios from "axios"
import { connect } from "react-redux"
const { Sider } = Layout
const { SubMenu } = Menu

function SideMenu(props) {
    const [menu, setMenu] = useState([])
    useEffect(() => {
        axios.get("/rights?_embed=children").then((res) => {
            setMenu(res.data)
        })
    }, [])

    const {
        role: { rights },
    } = JSON.parse(localStorage.getItem("token"))

    const checkPagePermission = (item) => {
        return item.pagepermission === 1 && rights.includes(item.key)
    }

    const renderMenu = (menuList) => {
        return menuList.map((item) => {
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {renderMenu(item.children)}
                    </SubMenu>
                )
            }

            return (
                checkPagePermission(item) && (
                    <Menu.Item
                        key={item.key}
                        icon={item.icon}
                        onClick={() => {
                            props.history.push(item.key)
                        }}>
                        {item.title}
                    </Menu.Item>
                )
            )
        })
    }

    const selectKyes = [props.location.pathname]
    const openKeys = ["/" + props.location.pathname.split("/")[1]]

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div
                style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                }}>
                <div className='logo'>全球新闻发布系统</div>
                <div style={{ flex: 1, overflow: "auto" }}>
                    <Menu theme='dark' mode='inline' selectedKeys={selectKyes} defaultOpenKeys={openKeys}>
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return { isCollapsed }
}

export default connect(mapStateToProps)(withRouter(SideMenu))
