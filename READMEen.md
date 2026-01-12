<div align="center">

English | [简体中文](./README.md)

</div>

---

# Hexo-admonition-new Plugin Installation and Usage Guide

## Introduction

A Hexo content assistance plugin that supports adding admonition blocks similar to [reStructuredText](https://docutils.sourceforge.io/docs/ref/rst/directives.html) into Markdown documents. Supports multiple admonition types (note, warning, error, etc.), and provides collapsible functionality, nesting support, and dark mode. Effect as shown:

![Hexo-admonition-new Example Effect 1](https://s2.loli.net/2026/01/12/A7e54iWoNvcwlRt.png)
![Hexo-admonition-new Example Effect 2](https://s2.loli.net/2026/01/12/DQOCa68dxrlbkJv.png)

**This plugin is an iterative update based on [hexo-admonition](https://github.com/lxl80/hexo-admonition), with improvements to some content**

The motivation for developing this plugin was to make [hexo](https://hexo.io) compatible with admonitions from [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/admonitions/), providing a better reading experience for article series on subsites built with MkDocs.

## Installation

### Install Plugin

```bash
npm install hexo-admonition-new --save
```

### Style Configuration

#### 1. Include Icon Library

Add before the `</head>` tag in your theme:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css">
```

This works with the CSS file below to display icon styles. Icon style configuration is at the beginning of the plugin's index.js file in `ADMONITION_CONFIG`, which can also be modified as needed.

#### 2. Include Stylesheet

Place the provided CSS file in your theme's custom style folder (e.g., `Blog/source/css`), and include it before the `</head>` tag:

```html
<link rel="stylesheet" href="/css/admonition.css">
```

You can customize the CSS file configuration. Please refer to [Custom Configuration](#custom-configuration).

## Usage Guide

### Basic Syntax

Hexo-admonition-new follows a simple syntax: each block starts with `!!!`, followed by a keyword representing the admonition type and a title ("title").

```markdown
!!! info "Custom Title"
    This is an admonition message rendered by the hexo-admonition-new plugin. The type is info, with a custom title set.
    Multiple lines are supported.
```
**Note**: Admonition content needs to be indented by 4 spaces or 1 tab. The admonition block automatically ends when a new line starts without indentation.

Before Hexo rendering, it will be converted to:

```html
<div class="admonition info">
  <p class="admonition-title">
    <span class="mdi mdi-information-outline admonition-icon"></span>
    "Custom Title"
  </p>
  <div class="admonition-content">
    <p>
      "This is an admonition message rendered by the hexo-admonition-new plugin. The type is info, with a custom title set."
      <br>
      "Multiple lines are supported."
    </p>
  </div>
</div>
```

### Collapsible Functionality

#### Collapsible and Expanded by Default

Start with `!!!+`

```markdown
!!!+ warning "Click to Collapse"
    This admonition block is expanded by default and can be collapsed by clicking the title.
    Suitable for important but optional supplementary information.
```

![](https://s2.loli.net/2026/01/12/q6dSuAfN15MTXlV.png)


#### Collapsible and Collapsed by Default

Start with `!!!-`

```markdown
!!!- warning "Click to Expand Warning"
    This warning block is collapsed by default and requires clicking to view the content.
    Suitable for detailed technical information or infrequently used content.
```

![](https://s2.loli.net/2026/01/12/o7JFw5cQ4kCZlys.png)


### Supported Types

The admonition `type` will be used as a CSS class name. Currently supported types include:

- `anote` **"note" is not used to prevent CSS style conflicts**
- `info`, `todo`
- `warning`, `attention`, `caution`
- `error`, `failure`, `missing`, `fail`, `danger`, `bug`
- `success`
- `tip`
- `question`
- `example`
- `quote`

For style effects of each type, refer to: https://s2.loli.net/2025/08/17/po7nrv1CyJlhG8q.png

### Custom Titles

#### Using Default Title

The `title` is optional. When not set, `type` will be used as the default value:

```markdown
!!! warning
    This is a warning message using the default title.
```

![](https://s2.loli.net/2026/01/12/a7SJKUlWDh1PL9s.png)

#### Custom Title

```markdown
!!! warning "Careful!"
    This is a warning message with a custom title.
```

![](https://s2.loli.net/2026/01/12/KtNDYOrg2AbmpLM.png)


#### Hide Title

If you don't want to display a title, set `title` to `""`:

```markdown
!!! warning ""
    This is a warning message without a title.
```

![](https://s2.loli.net/2026/01/12/QWimgGxaMyw9AOn.png)

#### Hide Content

```markdown
!!! warning "This is an admonition with title only"
```

![](https://s2.loli.net/2026/01/12/wTXKWGP6hfdbC9j.png)

### Nesting Support

Supports multiple levels of nesting, blockquotes, code blocks, etc., as shown in the [example images](#introduction).

```markdown
!!! warning "Careful!"
    This is a warning content.

    > Nested blockquote content

    - List item 1
    - List item 2

        ```js
        console.log("Code blocks supported");
        ```
    Hello

    !!! info "Inner Block"
        This is nested inner admonition content
            !!! danger "Inner Block"
                This is nested inner admonition content
```

## CSS File

I didn't bother distinguishing icons and colors for error, danger, etc. You can modify according to your preferences:

```css
/* ==================== CSS Variable Definitions ==================== */
:root {
  /* Base style variables */
  --admonition-bg: #f9f9f9;
  --admonition-title-bg: rgba(0, 0, 0, 0.03);
  --admonition-title-hover-bg: rgba(0, 0, 0, 0.06);
  --admonition-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  --admonition-padding: 0.6rem 1rem;
  --admonition-border-width: 0.3rem;
  --admonition-border-radius: 0.4rem;

  /* Type colors - Light mode */
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

/* Dark mode variables */
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

/* ==================== Base Styles ==================== */
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

/* Content area */
.admonition>.admonition-content {
  margin: var(--admonition-padding);
}

.admonition>*:not(.admonition-title):not(.admonition-collapsible):not(.admonition-content) {
  margin: var(--admonition-padding);
}

/* ==================== Collapsible Functionality ==================== */
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

/* Collapsible content */
.admonition-collapsible .admonition-content {
  padding: var(--admonition-padding);
  animation: slideDown 0.25s ease-out;
}

/* Nested blocks */
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

/* ==================== Type Colors (using variables) ==================== */

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

## Custom Configuration

### Modify Colors

Edit the variables in the CSS file:

```css
:root {
  --color-info: #YOUR_COLOR;
  --color-info-bg: rgba(YOUR_RGB, 0.1);
  --color-info-text: #YOUR_TEXT_COLOR;
}
```

### Modify Icons

Icons are from [Material Design Icons](https://materialdesignicons.com/)

Edit the `iconMap` in the plugin's JavaScript file:

```javascript
const ADMONITION_CONFIG = {
  iconMap: {
    info: 'mdi-your-icon-name',
    // ...
  }
};
```

### Add New Types

1. Add the new type to `iconMap` and `defaultTitles` in JavaScript
2. Add corresponding color styles in CSS

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

## References

- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)
- [Material Design Icons](https://materialdesignicons.com/)
- [hexo-admonition](https://github.com/lxl80/hexo-admonition)