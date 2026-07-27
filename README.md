# Iberia

中西 / 葡汉词典检索 · DELE B2–C2 背单词 · DELE B2/C1 例题练习。

## 在线访问

部署到 GitHub Pages 后，地址一般为：

`https://<你的用户名>.github.io/iberia-study/`

## 本地使用

```bash
cd ~/iberia-study
python3 -m http.server 5173
```

浏览器打开：http://localhost:5173

## 功能

- **词典**：完整西汉 / 葡汉检索；阴阳性与单复数；西/葡动词变位识别与变位表
- **背单词**：B2 / C1 / C2 分级词库 + 本地间隔复习
- **DELE 备考**：阅读、语法词汇、写作与口语提示

## 重新导入 MDX 词典

```bash
python3 scripts/convert_mdx.py
```

默认读取：

- `~/Downloads/简明西汉汉西词典.mdx`
- `~/Downloads/红葡汉词典[69950](100410).mdx`

> 公开仓库会包含转换后的词典 JSON。若仅私密使用，创建仓库时请选 **Private**。
