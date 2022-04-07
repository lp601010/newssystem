import React, { useState, useEffect, useRef } from "react";
import { Button, PageHeader, Input, Form, Select, message, Steps } from "antd";
import style from "./News.module.css";

import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";

const { Option } = Select;
const { Step } = Steps;

export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [formInfo, setformInfo] = useState({});
    const [content, setContent] = useState("");

    const User = JSON.parse(localStorage.getItem("token"));

    const handleNext = () => {
        if (current === 0) {
            NewsForm.current
                .validateFields()
                .then((res) => {
                    setCurrent(current + 1);
                    // console.log(res)
                    setformInfo(res);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("内容不能为空");
            } else {
                setCurrent(current + 1);
            }
        }
    };

    const handlePrevious = () => {
        setCurrent(current - 1);
    };

    const handleSave = (auditState) => {
        axios
            .post(`/news`, {
                ...formInfo,
                content: content,
                region: User.region ? User.region : "全球",
                author: User.username,
                roleId: User.roleId,
                auditState: auditState,
                publishState: 0,
                createTime: Date.now(),
                star: 0,
                view: 0,
                // "publishTime": 0
            })
            .then((res) => {
                props.history.push(
                    auditState === 0
                        ? "/news-manage/draft"
                        : "/audit-manage/list"
                );
                message.success(auditState === 0 ? "保存草稿成功" : "提交成功");
            });
    };

    useEffect(() => {
        axios.get("/categories").then((res) => {
            setCategoryList(res.data);
        });
    }, []);

    const NewsForm = useRef(null);

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="撰写新闻"
                subTitle="This is a subtitle"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题,新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>

            <div style={{ marginTop: "50px" }}>
                {/* 第一步 */}
                <div className={current === 0 ? "" : style.active}>
                    <Form {...layout} name="basic" ref={NewsForm}>
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your title!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your category!",
                                },
                            ]}
                        >
                            <Select>
                                {categoryList.map((item) => {
                                    return (
                                        <Option value={item.id} key={item.id}>
                                            {item.title}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                {/* 第2步 */}
                <div className={current === 1 ? "" : style.active}>
                    <NewsEditor
                        getContent={(value) => {
                            setContent(value);
                        }}
                    />
                </div>
                {/* 第3步 */}
                <div className={current === 2 ? "" : style.active}> </div>
            </div>

            <div style={{ marginTop: "50px" }}>
                {current > 0 && (
                    <Button onClick={handlePrevious}>上一步</Button>
                )}
                {current < 2 && (
                    <Button type="primary" onClick={handleNext}>
                        下一步
                    </Button>
                )}
                {current === 2 && (
                    <span>
                        <Button type="primary" onClick={() => handleSave(0)}>
                            保存草稿箱
                        </Button>

                        <Button danger onClick={() => handleSave(1)}>
                            提交审核
                        </Button>
                    </span>
                )}
            </div>
        </div>
    );
}
