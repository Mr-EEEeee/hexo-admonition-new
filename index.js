// 配置外部化 - 便于维护和扩展 / Configuration externalized for easy maintenance
const ADMONITION_CONFIG = {
  iconMap: {
    anote: 'mdi-note-outline',
    info: 'mdi-information-outline',
    todo: 'mdi-format-list-checkbox',
    warning: 'mdi-alert-outline',
    attention: 'mdi-alert-circle-outline',
    caution: 'mdi-alert-decagram-outline',
    failure: 'mdi-close-octagon-outline',
    missing: 'mdi-close-octagon-outline',
    fail: 'mdi-close-octagon-outline',
    error: 'mdi-alert-circle-outline',
    danger: 'mdi-alert-circle-outline',
    bug: 'mdi-bug-outline',
    tip: 'mdi-lightbulb-on-outline',
    success: 'mdi-check-circle-outline',
    question: 'mdi-comment-question-outline',
    example: 'mdi-file-code-outline',
    quote: 'mdi-format-quote-close'
  },
  defaultTitles: {
    anote: 'Note',
    info: 'Info',
    todo: 'To Do',
    warning: 'Warning',
    attention: 'Attention',
    caution: 'Caution',
    failure: 'Failure',
    missing: 'Missing',
    fail: 'Fail',
    error: 'Error',
    danger: 'Danger',
    bug: 'Bug',
    tip: 'Tip',
    success: 'Success',
    question: 'Question',
    example: 'Example',
    quote: 'Quote'
  }
};

// 自动注入图标库 / Auto-inject icon library
hexo.extend.filter.register('after_render:html', function (str) {
  // 检查是否已注入，避免重复 / Check if already injected to avoid duplication
  if (str.includes('materialdesignicons.min.css') || str.includes('hexo-admonition-icon-injected')) {
    return str;
  }

  // 注入图标库到 <head> / Inject icon library into <head>
  const iconLibrary = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" id="hexo-admonition-icon-injected">\n  ';

  return str.replace('</head>', iconLibrary + '</head>');
});

// 解析提示块 / Parse admonition blocks
hexo.extend.filter.register('before_post_render', function (data) {
  const lines = data.content.split(/\r?\n/);
  const result = [];

  const { iconMap, defaultTitles } = ADMONITION_CONFIG;

  // 动态生成正则，自动从 iconMap 获取类型 / Dynamically generate regex from iconMap
  const types = Object.keys(iconMap).join('|');
  const blockRegex = new RegExp(`^(\\s*)!!!\\s*([+\\-])?\\s*(${types})\\s*(?:"(.*?)")?\\s*$`, 'i');

  /**
   * 转义正则特殊字符 / Escape special regex characters
   */
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 解析提示块并返回 HTML / Parse admonition block and return HTML
   * @param {number} startIndex - 起始行索引 / Starting line index
   * @param {string} parentIndent - 父级缩进 / Parent indentation level
   * @returns {{end: number, html: string|null}} 解析结果 / Parsing result
   */
  function parseAdmonition(startIndex, parentIndent = '') {
    const match = lines[startIndex].match(blockRegex);
    if (!match) return { end: startIndex, html: null };

    const [, indent, collapseModifier, typeRaw, titleRaw] = match;
    const type = typeRaw.toLowerCase();
    const isTitleExplicitlyEmpty = titleRaw === "";
    const hasTitle = !isTitleExplicitlyEmpty;
    const title = titleRaw?.trim() || defaultTitles[type];
    const icon = iconMap[type] || 'mdi-alert-circle-outline';

    // 判断折叠状态 / Determine collapsible state
    // !!! = 不可折叠 / non-collapsible
    // !!!+ = 可折叠，默认展开 / collapsible, default open
    // !!!- = 可折叠，默认折叠 / collapsible, default closed
    const isCollapsible = collapseModifier === '+' || collapseModifier === '-';
    const isDefaultOpen = collapseModifier === '+';

    const contentLines = [];
    let i = startIndex + 1;

    // 构建正则以去除缩进 / Build regex to strip indentation
    const escIndent = escapeRegExp(indent || '');
    const stripRegex = new RegExp('^' + escIndent + '(?: {4}|\t)?');

    // 收集内容行 / Collect content lines
    while (i < lines.length) {
      const line = lines[i];
      const nextMatch = line.match(blockRegex);
      const isNested = nextMatch && nextMatch[1].length > (indent?.length || 0);

      if (isNested) {
        // 处理嵌套块 / Handle nested blocks
        const nested = parseAdmonition(i, nextMatch[1]);
        if (nested.html) contentLines.push(nested.html);
        i = nested.end;
      } else if (nextMatch) {
        // 遇到同级或更低级别的块，停止 / Stop at same or lower level block
        break;
      } else if (/^\s*$/.test(line) || line.startsWith((indent || '') + '    ') || line.startsWith((indent || '') + '\t')) {
        // 内容行 / Content line
        contentLines.push(line.replace(stripRegex, ''));
        i++;
      } else {
        // 不匹配的行，停止 / Stop at non-matching line
        break;
      }
    }

    // 保留 Markdown 原始内容供 Hexo 渲染 / Keep raw Markdown for Hexo to render
    const contentMarkdown = contentLines.join('\n');
    const isEmpty = contentMarkdown.trim() === '';
    const contentHtml = isEmpty ? '' : `<div class="admonition-content">\n\n${contentMarkdown}\n\n</div>`;

    // 构建 HTML / Build HTML
    let html;
    if (isCollapsible) {
      const collapsibleClass = isDefaultOpen ? 'collapsible-open' : 'collapsible-closed';
      const openAttr = isDefaultOpen ? 'open' : '';

      html = `<div class="admonition ${type} admonition-collapsible-wrapper">
        <details class="admonition-collapsible ${collapsibleClass}" ${openAttr}>
          <summary class="admonition-title">
            <span class="mdi ${icon} admonition-icon"></span>${hasTitle ? `<span class="admonition-title-text">${title}</span>` : ''}<span class="mdi mdi-chevron-down admonition-chevron"></span>
          </summary>${contentHtml}
        </details>
      </div>`;
    } else {
      const titleHtml = hasTitle
        ? `<p class="admonition-title"><span class="mdi ${icon} admonition-icon"></span>${title}</p>`
        : '';

      html = `<div class="admonition ${type}">${titleHtml}${contentHtml}</div>`;
    }

    return { end: i, html: html + '\n' };
  }

  // 主解析循环 / Main parsing loop
  let i = 0;
  while (i < lines.length) {
    const match = lines[i].match(blockRegex);
    if (match) {
      const parsed = parseAdmonition(i);
      if (parsed.html) result.push(parsed.html);
      i = parsed.end;
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  data.content = result.join('\n');
  return data;
});