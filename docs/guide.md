# 安装与配置

## 准备

准备支持 Chat Completions 的服务地址、API Key 和模型 ID，并确认服务商允许该模型使用 API。

安装 [Tampermonkey](https://www.tampermonkey.net/) 和 [OCS 用户脚本](https://cdn.ocsjs.com/ocs.user.js)。原项目曾在 Windows / Edge、OCS 5.2.1 验证；本版本尚无浏览器端实测记录。

## 允许连接服务商

在 Tampermonkey 管理面板中打开 OCS 脚本编辑器，找到脚本开头 `// ==UserScript==` 与 `// ==/UserScript==` 之间的元信息区，在已有 `@connect` 行旁添加服务商域名并保存。例如使用 OpenAI 官方接口时：

```javascript
// @connect      api.openai.com
// @connect      platform.openai.com
```

使用第三方服务时，将域名换成其接口地址的主机名，不要包含协议、端口或路径。根据 OCS 文档，`url` 和 `homepage` 涉及的域名均需添加；不同域名分别添加一行。

更新 OCS 脚本后检查该设置是否保留。

## 填写配置

1. 将 [ocs-openai.json](../ocs-openai.json) 复制为 `ocs-openai.local.json`，使用文本编辑器打开副本。构建命令会覆盖原模板。
2. 修改以下字段，保持文件为合法 JSON：
   - `name`：将 `REPLACE_WITH_YOUR_API_NAME` 替换为题库显示名称。
   - `url`：完整 Chat Completions 地址。若服务商提供的 Base URL 为 `https://example.com/v1`，通常填写 `https://example.com/v1/chat/completions`；以服务商文档为准，完整地址无需重复追加路径。
   - `headers.Authorization`：替换 `REPLACE_WITH_YOUR_API_KEY`，保留 `Bearer ` 前缀及空格。
   - `data.model`：将 `REPLACE_WITH_YOUR_MODEL` 替换为服务商支持的模型 ID。
   - `homepage`：可选，填写服务商主页。
3. 打开 OCS“通用 → 全局设置 → 题库配置”，粘贴副本的完整 JSON，保存并刷新。先选择不保存、不提交，用一道简单文字题测试，确认结果后再调整 OCS 设置。

## 图片题

### 开启与使用

1. 选择支持图片输入的模型，并确认服务商的 Chat Completions 接口支持 `image_url` 数据地址。
2. 在 OCS“通用 → 全局设置 → 高级设置”开启“图片题优化”，然后重新开始自动答题。
3. 使用纯图片题和图文混合题检查识别与答案回填，图片选项也应核对实际选中结果。

OCS 提取的图片会和题目文字一起发送给服务商，可能产生额外费用。

### 验证状态与限制

图片消息构造已有离线测试，但纯图片题、图文混合题及图片选项回填尚未完成真实 OCS 与模型服务的端到端验证。

图片下载或转换失败、平台未向 OCS 提供图片时，模型无法看到缺失的图片；请留意 OCS 的提示并人工核对。图片选项能否自动匹配也取决于平台和 OCS 的识别方式。

部分 OCS 页面处理流程会先检查题干文字；如果纯图片题的题干被提取为空，OCS 可能在调用适配器前跳过该题。

## 参数兼容性

默认配置发送 `stream: false`、`max_tokens: 1024` 和 `response_format: {"type":"json_object"}`。

若服务商不支持 JSON 模式，可删除 `data` 中的 `response_format` 字段及多余逗号；模型仍须按提示返回包含 `answers` 数组的 JSON 对象。如果不支持 `max_tokens`，按服务商文档调整或移除。

### 思考强度

模板在 `data` 中设置 `"reasoning_effort": "medium"`。支持该参数的模型可按服务商文档调整，例如 `low`、`medium` 或 `high`；可用值和效果取决于模型与服务商。

接口不支持此字段，或需要使用服务端默认值时，删除整行 `reasoning_effort` 并保持 JSON 格式正确。

更高强度可能增加延迟和用量；若回答因长度不足被截断，可按服务商文档调整输出长度参数。

### 响应格式

响应需要包含 `choices[0].message.content` 字符串，且第一个 choice 的 `finish_reason` 为 `stop`。空内容和空答案数组不会回填；截断、无效 JSON 或非文字答案会被拒绝。

## 排错与安全

- 请求失败：核对完整 URL、API Key、`Bearer ` 前缀、模型 ID、余额及服务商支持的参数。
- 无法连接：核对 `@connect` 域名、网络和服务商状态；更新脚本后重新检查元信息。
- 有响应但无答案：检查响应格式、结束原因和模型是否返回 `answers` 数组。模型结果应由使用者核对。
- 优先使用 HTTPS。HTTP 会明文传输密钥和题目；使用前确认风险。
