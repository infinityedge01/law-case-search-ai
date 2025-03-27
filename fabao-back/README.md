# fabao-back

这是一个基于Flask的项目，旨在提供一个API接口用于类案检索工具。

## 项目结构

```
fabao-back
├── app
│   ├── __init__.py          # 初始化Flask应用程序
│   ├── api
│   │   ├── __init__.py      # 初始化API模块
│   │   └── search.py        # 定义/api/search接口
│   ├── models
│   │   └── __init__.py      # 初始化模型模块
│   └── utils
│       └── __init__.py      # 初始化工具模块
├── config.py                # 应用配置设置
├── requirements.txt         # 项目依赖包
├── main.py                  # 应用入口点
└── README.md                # 项目文档和说明
```

## 安装依赖

在项目根目录下运行以下命令以安装所需的依赖：

```
pip install -r requirements.txt
```

## 运行项目

在项目根目录下运行以下命令以启动Flask服务器：

```
python main.py
```

## API接口

- **POST /api/search**: 接收和返回JSON格式的数据。当前不需要实现具体功能。