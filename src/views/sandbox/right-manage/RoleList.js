import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal
export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
    const [rightList, setrightList] = useState([])
    const [currentRights, setcurrentRights] = useState([])
    const [isModalVisible, setisModalVisible] = useState(false)
    const [currentId, setcurrentId] = useState(0)
    useEffect(() => {
        axios.get("/roles").then(res => {
            setdataSource(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setrightList(res.data)
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
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />}
                        onClick={() => {
                            setisModalVisible(true)
                            setcurrentRights(item.rights)
                            setcurrentId(item.id)
                        }} />
                </div>

            }
        }
    ]

    const deleteMethod = (item) => {
        // 删除前端
        setdataSource(dataSource.filter(data => data.id !== item.id))
        // 同步后端
        axios.delete(`/rights/${item.id}`)
    }

    const confirmMethod = (item) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const onCheck = (CheckedKeys) => {
        // console.log(CheckedKeys)
        setcurrentRights(CheckedKeys.checked)
    }

    const handleOk = () => {
        setisModalVisible(false)
        setdataSource(
            dataSource.map(item => {
                if (item.id === currentId) {
                    return {
                        ...item,
                        rights: currentRights
                    }
                }
                return item
            })
        )

        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    }

    const handleCancel = () => { setisModalVisible(false) }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    treeData={rightList}
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly={true}
                />
            </Modal>
        </div>
    )
}
