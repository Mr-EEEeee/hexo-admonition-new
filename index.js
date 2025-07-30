const md = require('markdown-it')('commonmark');

hexo.extend.filter.register('before_post_render', function (data) {
  const lines = data.content.split(/\r?\n/);
  const result = [];

  const iconMap = {
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
  };

  const defaultTitles = {
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
  };

  const blockRegex = /^(\s*)!!!\s*(anote|info|todo|warning|attention|caution|failure|missing|fail|error|danger|bug|tip|success|question|example|quote)\s*(?:"(.*?)")?\s*$/i;

  function parseAdmonition(startIndex, parentIndent = '') {
    const match = lines[startIndex].match(blockRegex);
    if (!match) return { end: startIndex, html: null };

    const [_, indent, typeRaw, titleRaw] = match;
    const type = typeRaw.toLowerCase();
    const isTitleExplicitlyEmpty = titleRaw === "";
    const hasTitle = !isTitleExplicitlyEmpty;
    const title = titleRaw?.trim() || defaultTitles[type];
    const icon = iconMap[type] || 'mdi-alert-circle-outline';

    let contentLines = [];
    let i = startIndex + 1;

    while (i < lines.length) {
      const line = lines[i];

      const nextMatch = line.match(blockRegex);
      const isNested = nextMatch && nextMatch[1].length > indent.length;

      if (isNested) {
        const nested = parseAdmonition(i, nextMatch[1]);
        if (nested.html) contentLines.push(nested.html);
        i = nested.end;
      } else if (nextMatch) {
        break;
      } else if (/^\s*$/.test(line) || line.startsWith(indent + '    ') || line.startsWith(indent + '\t')) {
        contentLines.push(line.replace(new RegExp(`^${indent}( {4}|\t)`), ''));
        i++;
      } else {
        break;
      }
    }

    const rendered = md.render(contentLines.join('\n'));

    const titleHtml = hasTitle
      ? `<p class="admonition-title"><span class="mdi ${icon} admonition-icon"></span>${title}</p>`
      : '';

    const html = `<div class="admonition ${type}">
${titleHtml}
${rendered}
</div>`;

    return { end: i, html };
  }

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
