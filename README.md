# OCS OpenAI 兼容接口适配器

基于 [ocs-deepseek-adapter](https://github.com/2488054910/ocs-deepseek-adapter) 的非官方 OCS 题库配置，把文字题发送到 OpenAI Chat Completions 兼容接口，并将模型答案转换成 OCS 可处理的格式。无需本地服务器。

## 使用

按[使用教程](docs/guide.md)配置 Tampermonkey 的 `@connect`，复制 [ocs-openai.json](ocs-openai.json)，在副本中填写完整接口地址、API Key 和模型 ID，再导入 OCS。默认 URL 为 `https://api.openai.com/v1/chat/completions`；第三方服务需使用其实际地址。

适配器使用非流式 Chat Completions、Bearer 鉴权和 JSON 对象输出。接口需返回非空的 `choices[0].message.content` 字符串与 `finish_reason: "stop"`；内容为空或非字符串时不会回填。不同服务商对 JSON 模式、参数和模型的支持有所不同，详见教程。

支持文字单选、多选、判断和填空；无法读取图片、OCR 或未提供的材料。解析器检查返回格式，但不保证答案正确，请自行核验。题目会直接发送给选定服务商，调用费用由您的账户承担。不要公开包含真实密钥的配置。

## 开发与验证

需要 Node.js 20 以上，无第三方 npm 依赖：

```sh
npm run build
npm test
npm run check
```

构建生成只含占位密钥的 `ocs-openai.json`。`ocs-deepseek.json` 是保留的原项目配置，不由本版本构建更新。离线测试不访问真实服务，实际接口和 OCS 浏览器端兼容性需自行验证。

原项目作者及第三方来源见 [LICENSE](LICENSE) 和 [第三方声明](THIRD_PARTY_NOTICES.md)。
