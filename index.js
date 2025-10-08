const md = require('markdown-it')('commonmark');
const fs = require('fs');
const path = require('path');

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

  // helper: escape regex special chars in indent string
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

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

    // build regex to strip only the parent indent first, then optional 4 spaces or a tab
    const escIndent = escapeRegExp(indent || '');
    const stripRegex = new RegExp('^' + escIndent + '(?: {4}|\t)?');

    while (i < lines.length) {
      const line = lines[i];

      const nextMatch = line.match(blockRegex);
      const isNested = nextMatch && nextMatch[1].length > (indent ? indent.length : 0);

      if (isNested) {
        const nested = parseAdmonition(i, nextMatch[1]);
        if (nested.html) contentLines.push(nested.html);
        i = nested.end;
      } else if (nextMatch) {
        break;
      } else if (/^\s*$/.test(line) || line.startsWith((indent || '') + '    ') || line.startsWith((indent || '') + '\t')) {
        // remove only the detected parent indent + optional one level (4 spaces or tab)
        contentLines.push(line.replace(stripRegex, ''));
        i++;
      } else {
        break;
      }
    }

    const rendered = md.render(contentLines.join('\n'));

    const titleHtml = hasTitle
      ? `<p class="admonition-title"><span class="mdi ${icon} admonition-icon"></span>${title}</p>`
      : '';

    // wrap rendered content in a container so styling applies consistently
    const html = `<div class="admonition ${type}">${titleHtml}<div class="admonition-content">${rendered}</div></div>`;

    // return end index and html (keep a separating newline)
    return { end: i, html: html + '\n' };
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

// Inject CSS styles
hexo.extend.filter.register('after_generate', function() {
  // Check if CSS injection is disabled in config
  const config = hexo.config.admonition || {};
  if (config.inject_css === false) {
    return;
  }
  
  const cssPath = path.join(__dirname, 'admonition.css');
  let css;
  try {
    css = fs.readFileSync(cssPath, 'utf8');
  } catch (error) {
    hexo.log.error(`Admonition: Failed to load CSS file: ${error.message}`);
    return;
  }
  
  const route = hexo.route;
  const routeList = route.list();
  const routes = routeList.filter(hpath => hpath.endsWith('.html'));
  
  const htmls = {};
  return Promise.all(routes.map(hpath => {
    return new Promise((resolve, reject) => {
      const contents = route.get(hpath);
      let htmlTxt = '';
      contents.on('data', (chunk) => (htmlTxt += chunk));
      contents.on('end', () => {
        if (htmlTxt.includes('class="admonition') && !htmlTxt.includes('id="admonition-styles"')) {
          const newContent = htmlTxt.replace('</head>', `<style id="admonition-styles">${css}</style></head>`);
          htmls[hpath] = newContent;
        }
        resolve();
      });
    });
  }))
  .then(() => {
    const htmlPaths = Object.keys(htmls);
    for (const hpath of htmlPaths) {
      route.set(hpath, htmls[hpath]);
    }
  });
});
