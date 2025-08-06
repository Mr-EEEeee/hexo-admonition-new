# Hexo-admonition-new 插件安装使用指南

## 简介

Hexo 内容辅助插件，支持将类似 [reStructuredText](https://docutils.sourceforge.io/docs/ref/rst/directives.html) 的警告提示块添加到 Markdown 文档中。例如 note、warning、error 等提示块，支持嵌套、夜间模式，效果如图：

![Hexo-admonition-new 示例效果1](https://s2.loli.net/2025/07/30/Gcb7FSoKhm8UiO4.png)
![Hexo-admonition-new 示例效果2](https://s2.loli.net/2025/07/30/NWSekX91RPY73my.png)

**本插件源于 [hexo-admonition](https://github.com/lxl80/hexo-admonition) 迭代更新，完善了部分内容**

开发这个插件的动机，是想让 [hexo](https://hexo.io) 与 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) 的提示信息兼容，让系列文章在基于 MkDocs 搭建的子站中有更好的阅读体验。

## 安装说明

### 安装插件

```bash
npm install hexo-admonition-new --save
```
还需自定义配置 css 文件方可生效，请参考[样式配置](#样式配置)。
## 使用指南

### 语法说明

Hexo-admonition-new 遵循一种简单的语法：每个块都以 `!!!` 开头，然后是代表提示类型的关键字（`type`）及标题（`title`）。例如:

```text
!!! anote Hexo-admonition-new 插件使用示例
    这是基于 hexo-admonition-new 插件渲染的一条提示信息。类型为 anote，并设置了自定义标题。

    提示内容开头留 4 个空格，可以有多行，最后用空行结束此标记。
```

在 Hexo 渲染前，将被转换成如下内容：

```html
<div class="admonition anote ">
  <p class="admonition-title">Hexo-admonition 插件使用示例</p>
  <p>这是基于 hexo-admonition 插件渲染的一条提示信息。类型为 note，并设置了自定义标题。</p>
  <p>提示内容开头留 4 个空格，可以有多行，最后用空行结束此标记。</p>
</div>
```

### 支持的类型

提示类型 `type` 将用作 CSS 类名称，暂支持如下类型：

- `anote` **不使用note为防止受css样式影响**
- `info, todo`
- `warning, attention, caution`
- `error, failure, missing, fail, danger, bug`
- `success`
- `tip`
- `question`
- `example`
- `quote`

各具体样式可参考https://s2.loli.net/2025/08/07/nvY19KgcpSDoyHw.png

### 设置/隐藏标题

标题 `title` 是可选的，当未设置时，将以 `type` 作为默认值:

```text
!!! warning
    这是一条采用默认标题的警告信息。
```

效果如下：

![默认标题警告提示块](https://pic.lixl.cn/2020/image-20200419232137875.png)

如果不想显示标题，可以将 `title` 设置为 `""`：

```text
!!! Warning ""
    这是一条不带标题的警告信息。
```

效果如下：

![无标题警告提示块](https://pic.lixl.cn/2020/image-20200419232337937.png)

### 嵌套支持

在 `hexo-admonition` 内部，支持嵌套多层和引用以及代码块等，由首页[效果图](#简介)可见。

```text
!!! warning "小心！"
    这是一个警告内容。

    > 嵌套引用内容

    - 列表项 1
    - 列表项 2

        ```js
        console.log("支持代码块");
        ```
        
    !!! info "内层块"
      这是内层嵌套的提示内容
```

### 样式配置

插入代码到头部 `</head>` 之前，与下文 .css 文件配合以显示图标样式，图标样式配置在插件 index.js 文件首部 `iconMap`，也可自行修改。
```bash
- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css">
```
新建如下 .css 文件放入 hexo 主题的自定义样式文件夹中 (如: Blog\source\css)，并插入到头部 `</head>` 之前，
```bash
- <link rel="stylesheet" href="/css/admonition.css">
```
我懒得区分 error, danger 等的图标和颜色了，可按自己喜好修改：

```css
.admonition {
  margin: 1.5em 0;
  padding: 0rem;
  border-left: 0.3rem solid;
  border-radius: 0.4rem;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  page-break-inside: avoid;
}

.admonition-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  padding: 0rem 1rem 0.1rem 0.75rem;
  font-size: 1.05em;
  background-color: rgba(0, 0, 0, 0.03);
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  margin: 0 !important;
}

.admonition-icon {
  font-size: 1.2em;
  margin-right: 0.6rem;
  opacity: 0.85;
  margin-top: 0.1rem;
}

/* 内容区域 margin */
.admonition > *:not(.admonition-title) {
  margin: 0.6rem 1rem 0.6rem 1rem;
}

/* NOTE 类型 */
.admonition.anote {
  border-color: #448aff;
}
.admonition.anote > .admonition-title {
  background-color: #448aff1a;
  color: #2962ff;
}

/* INFO / TODO 类型 */
.admonition.info,
.admonition.todo {
  border-color: #00b8d4;
}
.admonition.info > .admonition-title,
.admonition.todo > .admonition-title {
  background-color: rgba(0, 184, 212, 0.1);
  color: #007c91;
}

/* 警告类 */
.admonition.warning,
.admonition.attention,
.admonition.caution {
  border-color: #ff9100;
}
.admonition.warning > .admonition-title,
.admonition.attention > .admonition-title,
.admonition.caution > .admonition-title {
  background-color: rgba(255, 145, 0, 0.1);
  color: #c66900;
}

/* 错误类 */
.admonition.failure,
.admonition.missing,
.admonition.fail,
.admonition.error,
.admonition.danger,
.admonition.bug {
  border-color: #ff5252;
}
.admonition.failure > .admonition-title,
.admonition.missing > .admonition-title,
.admonition.fail > .admonition-title,
.admonition.error > .admonition-title,
.admonition.danger > .admonition-title,
.admonition.bug > .admonition-title {
  background-color: rgba(255, 82, 82, 0.1);
  color: #b71c1c;
}

/* TIP 类型 */
.admonition.tip {
  border-color: #00bfa5;
}
.admonition.tip > .admonition-title {
  background-color: #00bfa51a;
  color: #00796b;
}

/* SUCCESS 类型 */
.admonition.success {
  border-color: #00c853;
}
.admonition.success > .admonition-title {
  background-color: #00c8531a;
  color: #2e7d32;
}

/* QUESTION 类型 */
.admonition.question {
  border-color: #64dd17;
}
.admonition.question > .admonition-title {
  background-color: #64dd171a;
  color: #558b2f;
}

/* EXAMPLE 类型 */
.admonition.example {
  border-color: #7c4dff;
}
.admonition.example > .admonition-title {
  background-color: #7c4dff1a;
  color: #512da8;
}

/* QUOTE 类型 */
.admonition.quote {
  border-color: #9e9e9e;
}
.admonition.quote > .admonition-title {
  background-color: #9e9e9e1a;
  color: #424242;
}

/*黑暗模式*/
/* 夜间模式基础样式 */
[data-theme="dark"] .admonition {
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .admonition-title {
  background-color: rgba(255, 255, 255, 0.05);
}

/* anote */
[data-theme="dark"] .admonition.anote {
  border-color: #82b1ff;
}
[data-theme="dark"] .admonition.anote > .admonition-title {
  background-color: #82b1ff1a;
  color: #bbdefb;
}

/* tip */
[data-theme="dark"] .admonition.tip {
  border-color: #64ffda;
}
[data-theme="dark"] .admonition.tip > .admonition-title {
  background-color: #64ffda1a;
  color: #1de9b6;
}

/* success */
[data-theme="dark"] .admonition.success {
  border-color: #69f0ae;
}
[data-theme="dark"] .admonition.success > .admonition-title {
  background-color: #69f0ae1a;
  color: #00e676;
}

/* question */
[data-theme="dark"] .admonition.question {
  border-color: #b2ff59;
}
[data-theme="dark"] .admonition.question > .admonition-title {
  background-color: #b2ff591a;
  color: #aeea00;
}

/* example */
[data-theme="dark"] .admonition.example {
  border-color: #b388ff;
}
[data-theme="dark"] .admonition.example > .admonition-title {
  background-color: #b388ff1a;
  color: #b39ddb;
}

/* quote */
[data-theme="dark"] .admonition.quote {
  border-color: #bdbdbd;
}
[data-theme="dark"] .admonition.quote > .admonition-title {
  background-color: #bdbdbd1a;
  color: #eeeeee;
}

/* warning / attention / caution */
[data-theme="dark"] .admonition.warning,
[data-theme="dark"] .admonition.attention,
[data-theme="dark"] .admonition.caution {
  border-color: #ffb300;
}
[data-theme="dark"] .admonition.warning > .admonition-title,
[data-theme="dark"] .admonition.attention > .admonition-title,
[data-theme="dark"] .admonition.caution > .admonition-title {
  background-color: #ffb3001a;
  color: #ffe082;
}

/* error / fail / failure / bug / danger / missing */
[data-theme="dark"] .admonition.error,
[data-theme="dark"] .admonition.fail,
[data-theme="dark"] .admonition.failure,
[data-theme="dark"] .admonition.bug,
[data-theme="dark"] .admonition.missing,
[data-theme="dark"] .admonition.danger {
  border-color: #ef5350;
}
[data-theme="dark"] .admonition.error > .admonition-title,
[data-theme="dark"] .admonition.fail > .admonition-title,
[data-theme="dark"] .admonition.failure > .admonition-title,
[data-theme="dark"] .admonition.bug > .admonition-title,
[data-theme="dark"] .admonition.missing > .admonition-title,
[data-theme="dark"] .admonition.danger > .admonition-title {
  background-color: #ef53501a;
  color: #ff8a80;
}
```

## License

MIT

## 参考

- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [hexo-admonition](https://github.com/lxl80/hexo-admonition)