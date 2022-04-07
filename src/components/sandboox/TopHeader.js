import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const { Header } = Layout;

function TopHeader(props) {
    const changeCollapsed = () => {
        props.changeCollapsed();
    };

    const {
        role: { roleName },
        username,
    } = JSON.parse(localStorage.getItem("token"));

    const menu = (
        <Menu>
            <Menu.Item>{roleName}</Menu.Item>
            <Menu.Item
                danger
                onClick={() => {
                    localStorage.removeItem("token");
                    props.history.replace("/login");
                }}
            >
                exit
            </Menu.Item>
        </Menu>
    );

    return (
        <Header
            className="site-layout-background"
            style={{ padding: "0 16px", backgroundColor: "white" }}
        >
            {props.isCollapsed ? (
                <MenuUnfoldOutlined onClick={changeCollapsed} />
            ) : (
                <MenuFoldOutlined onClick={changeCollapsed} />
            )}
            <div style={{ float: "right" }}>
                <span>
                    欢迎回来，<span style={{ color: "blue" }}>{username}</span>
                </span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    );
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed,
    };
};

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed",
        };
    },
};

// connect()返回函数,使UI组件的props获取state和dispatch
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(TopHeader));
