# OCS OpenAI 兼容接口适配器

将支持 OpenAI Chat Completions 格式的模型服务接入 OCS 自定义题库。适配器把文字题发送给所选服务商，再将模型返回的答案转换为 OCS 可处理的格式。项目基于 [ocs-deepseek-adapter](https://github.com/2488054910/ocs-deepseek-adapter)，是非官方独立项目。

## 快速开始

1. 安装 Tampermonkey 和 OCS，准备支持 Chat Completions 的服务地址、API Key 和模型 ID。
2. 复制 [ocs-openai.json](ocs-openai.json)，在副本中设置完整请求地址、密钥和模型。
3. 在 OCS 用户脚本元信息中允许连接服务商域名，将配置副本导入 OCS。
4. 使用简单文字题测试连通性，并核对答案。

详细操作、示例和故障排查见[使用教程](docs/guide.md)。普通使用无需安装 Node.js 或运行本地服务器。

## 工作方式

适配器将题型、题干和选项整理为模型消息，提示模型返回 `{"answers":["答案"]}`。它支持文字单选、多选、判断和填空，按模型返回顺序保留答案；图片及未提供的材料不会被读取。

默认请求使用非流式 Chat Completions、Bearer 鉴权、`reasoning_effort: "medium"`、`max_tokens: 1024` 和 JSON 对象模式。模型及服务商需要支持所配置的参数；思考强度可调整或移除，详见教程。解析器读取 `choices[0].message.content`，要求 `finish_reason` 为 `stop`。空内容或空答案不产生回填结果，无效 JSON、异常结束和非文字答案会被拦截。

请核对模型答案：格式检查只验证响应结构。题目内容会发送至配置的服务商，并按其规则计费；使用时请遵守课程平台及服务商的规则。

## 文件与开发

- `ocs-openai.json`：导入 OCS 的配置模板，只包含占位密钥和模型名。
- `src/adapter.mjs`：消息构造、响应解析和配置生成。
- `docs/guide.md`：安装、配置和排错步骤。
- `test/adapter.test.mjs`：离线测试。

开发需要 Node.js 20 或更高版本，无第三方 npm 依赖：

```sh
npm run build
npm test
npm run check
```

构建会覆盖 `ocs-openai.json`，请将真实密钥保存在配置副本中。`npm test` 使用模拟数据，`npm run check` 检查配置一致性及部分发布风险；两者均不连接真实模型服务。原项目曾在 Windows / Edge、OCS 5.2.1 验证，本版本的实际服务与浏览器端兼容性需自行测试。

## 许可

本项目采用 [MIT License](LICENSE)，保留原项目版权声明。来源和第三方权利信息见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
