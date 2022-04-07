import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal;
export default function RightList() {
    const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            const list = res.data
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = '';
                };
            });
            setdataSource(list)
        })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="magenta">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => { confirmMethod(item) }} />
                    <Popover
                        content={
                            <div style={{ textAlign: "center" }}>
                                <Switch checked={item.pagepermission} onChange={() => {
                                    switchMethod(item)
                                }}></Switch>
                            </div>}
                        title="是否关闭" trigger={item.pagepermission === undefined ? "" : "click"}>

                        <Button type="primary" shape="circle" icon={<EditOutlined />}
                            disabled={item.pagepermission === undefined}
                        />
                    </Popover>
                </div>
            }
        }
    ];

    const switchMethod = (item) => {
        item.pagepermission = item.pagepermission === 1 ? 0 : 1
        setdataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(
                `/rights/${item.id}`, {
                pagepermission: item.pagepermission
            })
        } else {
            axios.patch(
                `/children/${item.id}`, {
                pagepermission: item.pagepermission
            })
        }
    }


    const confirmMethod = (item) => {
        confirm({
            title: '确认删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const deleteMethod = (item) => {
        if (item.grade === 1) {
            // 删除前端
            setdataSource(dataSource.filter(data => data.id !== item.id))
            // 同步后端
            axios.delete(`/rights/${item.id}`)
        } else {
            // list浅拷贝dataSource，所以改变list的对象，也可以改变dataSorce对象
            let list = dataSource.filter(data => data.id === item.rightId)
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            // console.log(dataSource, [...dataSource])
            setdataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
