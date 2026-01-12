// 配置外部化 - 便于维护和未来可能的扩展
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

hexo.extend.filter.register('before_post_render', function (data) {
  const lines = data.content.split(/\r?\n/);
  const result = [];

  const { iconMap, defaultTitles } = ADMONITION_CONFIG;

  // 动态生成正则 - 自动从 iconMap 获取类型
  const types = Object.keys(iconMap).join('|');
  const blockRegex = new RegExp(`^(\\s*)!!!\\s*([+\\-])?\\s*(${types})\\s*(?:"(.*?)")?\\s*$`, 'i');

  /**
   * 转义字符串中的特殊正则字符 / Escapes special regex characters in a string
   * @param {string} string - String to escape / 需要转义的字符串
   * @returns {string} Escaped string / 转义后的字符串
   */
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Parses an admonition block and returns HTML
   * 解析提示块并返回 HTML
   * @param {number} startIndex - Starting line index / 起始行索引
   * @param {string} parentIndent - Parent indentation level / 父级缩进级别
   * @returns {{end: number, html: string|null}} Parsing result / 解析结果
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

    // 判断是否可折叠及默认状态 / Determine collapsible state and default status
    const isCollapsible = collapseModifier === '+' || collapseModifier === '-';
    const isDefaultOpen = collapseModifier === '+';

    const contentLines = [];
    let i = startIndex + 1;

    // 构建正则以去除父级缩进 + 可选的4个空格或制表符
    const escIndent = escapeRegExp(indent || '');
    const stripRegex = new RegExp('^' + escIndent + '(?: {4}|\t)?');

    while (i < lines.length) {
      const line = lines[i];
      const nextMatch = line.match(blockRegex);

      // 检查是否为嵌套提示块
      const isNested = nextMatch && nextMatch[1].length > (indent?.length || 0);

      if (isNested) {
        const nested = parseAdmonition(i, nextMatch[1]);
        if (nested.html) contentLines.push(nested.html);
        i = nested.end;
      } else if (nextMatch) {
        break;
      } else if (/^\s*$/.test(line) || line.startsWith((indent || '') + '    ') || line.startsWith((indent || '') + '\t')) {
        contentLines.push(line.replace(stripRegex, ''));
        i++;
      } else {
        break;
      }
    }

    // 保留 Markdown 内容供 Hexo 后续渲染
    const contentMarkdown = contentLines.join('\n');
    const isEmpty = contentMarkdown.trim() === '';

    // 构建内容 HTML（DRY 优化）
    const contentHtml = isEmpty ? '' : `<div class="admonition-content">\n\n${contentMarkdown}\n\n</div>`;

    // 构建最终 HTML（减少重复代码）
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

  // 主解析循环
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