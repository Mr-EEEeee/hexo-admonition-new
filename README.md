<div align="center">

[English](./README_EN.md) | 简体中文

</div>

---

# Hexo-admonition-new 插件安装使用指南

## 简介

Hexo 内容辅助插件，支持将类似 [reStructuredText](https://docutils.sourceforge.io/docs/ref/rst/directives.html) 的警告提示块添加到 Markdown 文档中。支持多种提示类型（note、warning、error 等），并提供折叠功能、嵌套支持和夜间模式。效果如图：

![Hexo-admonition-new 示例效果1](https://s2.loli.net/2026/01/12/A7e54iWoNvcwlRt.png)
![Hexo-admonition-new 示例效果2](https://s2.loli.net/2026/01/12/DQOCa68dxrlbkJv.png)

**本插件源于 [hexo-admonition](https://github.com/lxl80/hexo-admonition) 迭代更新，完善了部分内容**

开发这个插件的动机，是想让 [hexo](https://hexo.io) 与 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) 的提示信息兼容，让系列文章在基于 MkDocs 搭建的子站中有更好的阅读体验。

## 安装说明

### 安装插件

```bash
npm install hexo-admonition-new --save
```

### 样式配置

将提供的 CSS 文件放入主题的自定义样式文件夹（如 `Blog/source/css`），并在 `</head>` 标签之前引入：

```html
<link rel="stylesheet" href="/css/admonition.css">
```

可自定义配置 CSS 文件，请参考[自定义配置](#自定义配置)。

## 使用指南

### 基础语法

Hexo-admonition-new 遵循一种简单的语法：每个块都以 `!!!` 开头，然后是代表提示类型的关键字（type）及标题（"title"）。

```markdown
!!! info "自定义标题"
    这是基于 hexo-admonition-new 插件渲染的一条提示信息。类型为 info，并设置了自定义标题。
    支持多行内容。
```
**注意**：提示内容需要缩进 4 个空格或 1 个制表符，换行行首不留空后自动结束提示块。

在 Hexo 渲染前，将被转换成如下内容：

```CSS
<div class="admonition info">
  <p class="admonition-title">
    <span class="mdi mdi-information-outline admonition-icon"></span>
    "自定义标题"
  </p>
  <div class="admonition-content">
    <p>
      "这是基于 hexo-admonition-new 插件渲染的一条提示信息。类型为 info，并设置了自定义标题。"
      <br>
      "支持多行内容。"
    </p>
  </div>
</div>
```

### 折叠功能

#### 可折叠且默认展开

以 `!!!+` 开头

```markdown
!!!+ warning "点击可折叠"
    这个提示块默认展开，可以点击标题折叠它。
    适合包含重要但可选的补充信息。
```

![](https://s2.loli.net/2026/01/12/q6dSuAfN15MTXlV.png)


#### 可折叠且默认折叠

以 `!!!-` 开头

```markdown
!!!- warning "点击展开查看警告"
    这个警告块默认折叠，需要点击才能看到内容。
    适合包含详细的技术细节或不常用的信息。
```

![](https://s2.loli.net/2026/01/12/o7JFw5cQ4kCZlys.png)


### 支持的类型

提示类型 `type` 将用作 CSS 类名称，暂支持如下类型：

- `anote` **不使用 "note" 为防止受 CSS 样式影响**
- `info`, `todo`
- `warning`, `attention`, `caution`
- `error`, `failure`, `missing`, `fail`, `danger`, `bug`
- `success`
- `tip`
- `question`
- `example`
- `quote`

各类型样式效果可参考：https://s2.loli.net/2025/08/17/po7nrv1CyJlhG8q.png

### 自定义标题

#### 使用默认标题

标题 `title` 是可选的，当未设置时，将以 `type` 作为默认值:

```text
!!! warning
    这是一条采用默认标题的警告信息。
```

![](https://s2.loli.net/2026/01/12/a7SJKUlWDh1PL9s.png)

#### 自定义标题

```markdown
!!! warning "小心！"
    这是自定义标题的警告信息。
```

![](https://s2.loli.net/2026/01/12/KtNDYOrg2AbmpLM.png)


#### 隐藏标题

如果不想显示标题，可以将 `title` 设置为 `""`：

```markdown
!!! warning ""
    这是不带标题的警告信息。
```

![](https://s2.loli.net/2026/01/12/QWimgGxaMyw9AOn.png)

#### 隐藏正文

```markdown
!!! warning "这是只有标题的提示信息"
```

![](https://s2.loli.net/2026/01/12/wTXKWGP6hfdbC9j.png)

### 嵌套支持

支持嵌套多层和引用以及代码块等，由首页[效果图](#简介)可见。

```markdown
!!! warning "小心！"
    这是一个警告内容。

    > 嵌套引用内容

    - 列表项 1
    - 列表项 2

        ```js
        console.log("支持代码块");
        ```
    你好

    !!! info "内层块"
        这是内层嵌套的提示内容
            !!! danger "内层块"
                这是内层嵌套的提示内容
```

## CSS 文件

我懒得区分 error, danger 等的图标和颜色了，可按自己喜好修改：

```css
/* ==================== CSS 变量定义 ==================== */
:root {
  /* 基础样式变量 */
  --admonition-bg: #f9f9f9;
  --admonition-title-bg: rgba(0, 0, 0, 0.03);
  --admonition-title-hover-bg: rgba(0, 0, 0, 0.06);
  --admonition-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  --admonition-padding: 0.6rem 1rem;
  --admonition-border-width: 0.3rem;
  --admonition-border-radius: 0.4rem;

  /* 类型颜色 - 浅色模式 */
  --color-anote: #448aff;
  --color-anote-bg: #448aff1a;
  --color-anote-text: #2962ff;

  --color-info: #00b8d4;
  --color-info-bg: rgba(0, 184, 212, 0.1);
  --color-info-text: #007c91;

  --color-warning: #ff9100;
  --color-warning-bg: rgba(255, 145, 0, 0.1);
  --color-warning-text: #c66900;

  --color-error: #ff5252;
  --color-error-bg: rgba(255, 82, 82, 0.1);
  --color-error-text: #b71c1c;

  --color-tip: #00bfa5;
  --color-tip-bg: #00bfa51a;
  --color-tip-text: #00796b;

  --color-success: #00c853;
  --color-success-bg: #00c8531a;
  --color-success-text: #2e7d32;

  --color-question: #64dd17;
  --color-question-bg: #64dd171a;
  --color-question-text: #558b2f;

  --color-example: #7c4dff;
  --color-example-bg: #7c4dff1a;
  --color-example-text: #512da8;

  --color-quote: #9e9e9e;
  --color-quote-bg: #9e9e9e1a;
  --color-quote-text: #424242;
}

/* 深色模式变量 */
[data-theme="dark"] {
  --admonition-bg: #1e1e1e;
  --admonition-title-bg: rgba(255, 255, 255, 0.05);
  --admonition-title-hover-bg: rgba(255, 255, 255, 0.08);
  --admonition-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);

  --color-anote: #82b1ff;
  --color-anote-bg: #82b1ff1a;
  --color-anote-text: #bbdefb;

  --color-warning: #ffb300;
  --color-warning-bg: #ffb3001a;
  --color-warning-text: #ffe082;

  --color-error: #ef5350;
  --color-error-bg: #ef53501a;
  --color-error-text: #ff8a80;

  --color-tip: #64ffda;
  --color-tip-bg: #64ffda1a;
  --color-tip-text: #1de9b6;

  --color-success: #69f0ae;
  --color-success-bg: #69f0ae1a;
  --color-success-text: #00e676;

  --color-question: #b2ff59;
  --color-question-bg: #b2ff591a;
  --color-question-text: #aeea00;

  --color-example: #b388ff;
  --color-example-bg: #b388ff1a;
  --color-example-text: #b39ddb;

  --color-quote: #bdbdbd;
  --color-quote-bg: #bdbdbd1a;
  --color-quote-text: #eeeeee;
}

/* ==================== 基础样式 ==================== */
.admonition {
  margin: 1em 0;
  padding: 0;
  border-left: var(--admonition-border-width) solid;
  border-radius: var(--admonition-border-radius);
  background-color: var(--admonition-bg);
  box-shadow: var(--admonition-shadow);
  overflow: hidden;
  page-break-inside: avoid;
}

.admonition-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  padding: 0 1rem 0.1rem 0.75rem;
  font-size: 1.05em;
  background-color: var(--admonition-title-bg);
  border-top-left-radius: var(--admonition-border-radius);
  border-top-right-radius: var(--admonition-border-radius);
  margin: 0 !important;
}

.admonition-icon {
  font-size: 1.2em;
  margin-right: 0.6rem;
  opacity: 0.85;
  margin-top: 0.1rem;
}

/* 内容区域 */
.admonition>.admonition-content {
  margin: var(--admonition-padding);
}

.admonition>*:not(.admonition-title):not(.admonition-collapsible):not(.admonition-content) {
  margin: var(--admonition-padding);
}

/* ==================== 折叠功能 ==================== */
.admonition-collapsible-wrapper {
  padding: 0;
  overflow: visible;
}

.admonition>.admonition-collapsible {
  margin: 0 !important;
  width: 100%;
}

.admonition-collapsible>summary.admonition-title {
  cursor: pointer;
  list-style: none;
  user-select: none;
  position: relative;
  transition: background-color 0.2s ease;
  padding-right: 2.5rem;
}

.admonition-collapsible>summary::-webkit-details-marker,
.admonition-collapsible>summary::marker {
  display: none;
}

.admonition-collapsible>summary.admonition-title:hover {
  background-color: var(--admonition-title-hover-bg);
}

.admonition-title-text {
  flex: 1;
}

.admonition-chevron {
  position: absolute;
  right: 0.75rem;
  font-size: 1.2em;
  transition: transform 0.25s ease;
  opacity: 0.7;
}

.admonition-collapsible[open]>summary .admonition-chevron {
  transform: rotate(180deg);
}

/* 折叠内容 */
.admonition-collapsible .admonition-content {
  padding: var(--admonition-padding);
  animation: slideDown 0.25s ease-out;
}

/* 嵌套块 */
.admonition-collapsible .admonition-content>.admonition {
  margin: 0.6rem 0;
}

.admonition-collapsible .admonition-content>.admonition:first-child {
  margin-top: 0;
}

.admonition-collapsible .admonition-content>.admonition:last-child {
  margin-bottom: 0;
}

.admonition-collapsible .admonition-content>*:not(.admonition):first-child {
  margin-top: 0 !important;
}

.admonition-collapsible .admonition-content>*:not(.admonition):last-child {
  margin-bottom: 0 !important;
}

.admonition-collapsible .admonition-content>.admonition>.admonition-content {
  margin: var(--admonition-padding);
  padding: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== 类型颜色（使用变量） ==================== */

/* Note */
.admonition.anote {
  border-color: var(--color-anote);
}

.admonition.anote>.admonition-title,
.admonition.anote>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-anote-bg);
  color: var(--color-anote-text);
}

/* Info / Todo */
.admonition.info,
.admonition.todo {
  border-color: var(--color-info);
}

.admonition.info>.admonition-title,
.admonition.todo>.admonition-title,
.admonition.info>.admonition-collapsible>summary.admonition-title,
.admonition.todo>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-info-bg);
  color: var(--color-info-text);
}

/* Warning / Attention / Caution */
.admonition.warning,
.admonition.attention,
.admonition.caution {
  border-color: var(--color-warning);
}

.admonition.warning>.admonition-title,
.admonition.attention>.admonition-title,
.admonition.caution>.admonition-title,
.admonition.warning>.admonition-collapsible>summary.admonition-title,
.admonition.attention>.admonition-collapsible>summary.admonition-title,
.admonition.caution>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-text);
}

/* Error / Failure / Fail / Danger / Bug / Missing */
.admonition.failure,
.admonition.missing,
.admonition.fail,
.admonition.error,
.admonition.danger,
.admonition.bug {
  border-color: var(--color-error);
}

.admonition.failure>.admonition-title,
.admonition.missing>.admonition-title,
.admonition.fail>.admonition-title,
.admonition.error>.admonition-title,
.admonition.danger>.admonition-title,
.admonition.bug>.admonition-title,
.admonition.failure>.admonition-collapsible>summary.admonition-title,
.admonition.missing>.admonition-collapsible>summary.admonition-title,
.admonition.fail>.admonition-collapsible>summary.admonition-title,
.admonition.error>.admonition-collapsible>summary.admonition-title,
.admonition.danger>.admonition-collapsible>summary.admonition-title,
.admonition.bug>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-error-bg);
  color: var(--color-error-text);
}

/* Tip */
.admonition.tip {
  border-color: var(--color-tip);
}

.admonition.tip>.admonition-title,
.admonition.tip>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-tip-bg);
  color: var(--color-tip-text);
}

/* Success */
.admonition.success {
  border-color: var(--color-success);
}

.admonition.success>.admonition-title,
.admonition.success>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-success-bg);
  color: var(--color-success-text);
}

/* Question */
.admonition.question {
  border-color: var(--color-question);
}

.admonition.question>.admonition-title,
.admonition.question>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-question-bg);
  color: var(--color-question-text);
}

/* Example */
.admonition.example {
  border-color: var(--color-example);
}

.admonition.example>.admonition-title,
.admonition.example>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-example-bg);
  color: var(--color-example-text);
}

/* Quote */
.admonition.quote {
  border-color: var(--color-quote);
}

.admonition.quote>.admonition-title,
.admonition.quote>.admonition-collapsible>summary.admonition-title {
  background-color: var(--color-quote-bg);
  color: var(--color-quote-text);
}
```

## 自定义配置

### 修改颜色

编辑 CSS 文件中的变量：

```css
:root {
  --color-info: #YOUR_COLOR;
  --color-info-bg: rgba(YOUR_RGB, 0.1);
  --color-info-text: #YOUR_TEXT_COLOR;
}
```

### 修改图标

已在主题的 `</head>` 标签之前自动注入了图标库，如需修改库，可在 index.js 文件中修改 `iconLibrary` 。

与 CSS 文件配合以显示图标样式，图标样式配置在插件 index.js 文件首部 `ADMONITION_CONFIG`，也可自行修改。

图标来自 [Material Design Icons](https://materialdesignicons.com/)

编辑插件 JavaScript 文件中的 `iconMap`：

```javascript
const ADMONITION_CONFIG = {
  iconMap: {
    info: 'mdi-your-icon-name',
    // ...
  }
};
```

### 添加新类型

1. 在 JavaScript 的 `iconMap` 和 `defaultTitles` 中添加新类型
2. 在 CSS 中添加对应的颜色样式

```javascript
// JavaScript
const ADMONITION_CONFIG = {
  iconMap: {
    custom: 'mdi-star',
    // ...
  },
  defaultTitles: {
    custom: 'Custom',
    // ...
  }
};
```

```css
/* CSS */
.admonition.custom {
  border-color: #YOUR_COLOR;
}
.admonition.custom > .admonition-title {
  background-color: rgba(YOUR_RGB, 0.1);
  color: #YOUR_TEXT_COLOR;
}
```

## License

MIT

## 参考

- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)
- [Material Design Icons](https://materialdesignicons.com/)
- [hexo-admonition](https://github.com/lxl80/hexo-admonition)