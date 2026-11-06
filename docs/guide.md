# 使用教程

需要浏览器、Tampermonkey、OCS 和支持 Chat Completions 的 API 服务。原项目曾在 Windows / Edge、OCS 5.2.1 验证；本版本尚未实机验证。

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 和 [OCS](https://cdn.ocsjs.com/ocs.user.js)。
2. 在 Tampermonkey 管理面板打开 OCS 脚本编辑器，在顶部 `// ==UserScript==` 与 `// ==/UserScript==` 之间，和其他 `@connect` 行放在一起，添加 API 地址的域名。例如官方接口使用：

   ```javascript
   // @connect      api.openai.com
   ```

   第三方接口请换成其实际域名，不含协议、端口或路径。保存脚本；OCS 更新后检查该行是否保留。
3. 将 [配置文件](../ocs-openai.json) 复制为 `ocs-openai.local.json`，在本机文本编辑器中修改该副本（`npm run build` 会覆盖原配置文件）：
   - `url`：完整 Chat Completions 地址。例如服务商给出的 Base URL 是 `https://example.com/v1`，则填写 `https://example.com/v1/chat/completions`；若已提供完整地址，不要重复追加路径。
   - `Authorization`：将占位符替换为 API Key，保留前缀 `Bearer `。请确认服务商使用该鉴权方式。
   - `model`：填写服务商提供的实际模型 ID。
   - `homepage`：可选，改成服务商主页。
4. 将副本中的完整 JSON 粘贴到 OCS“通用 → 全局设置 → 题库配置”，保存并刷新。首次测试时选择不保存、不提交，用简单文字题检查能否返回答案。

默认请求 `response_format: {"type":"json_object"}`。如果服务商不支持 JSON 模式，可从 `data` 中删除整个 `response_format` 字段及相邻多余逗号；模型仍须遵循提示词返回 `{"answers":["答案"]}`。如果服务商不支持 `max_tokens`，请按其文档调整或移除。适配器要求非流式响应，且 `choices[0].finish_reason` 为 `stop`。

调用失败时检查完整 URL、模型名、密钥、账户余额和 `@connect`。题目会发送给配置的服务商，产生的费用由您的账户承担；不要把含真实密钥的配置上传或分享。本机备份可命名为 `ocs-openai.local.json`。
