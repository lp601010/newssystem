import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'
//自定义hook，根据publishState返回表格数据 和 三个不同按钮的回调函数
export default function usePublish(publishState) {
    const { username } = JSON.parse(localStorage.getItem("token"))

    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios(`/news?author=${username}&publishState=${publishState}&_expand=category`).then(res => {
            // console.log(res.data)
            setdataSource(res.data)
        })
    }, [username, publishState])

    const handlePublish = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))

        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已经发布】中查看您的新闻`,
                placement: "bottomRight"
            });
        })
    }

    const handleSunset = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))

        axios.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已下线】中查看您的新闻`,
                placement: "bottomRight"
            });
        })
    }

    const handleDelete = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))

        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您已经删除了已下线的新闻`,
                placement: "bottomRight"
            });
        })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}