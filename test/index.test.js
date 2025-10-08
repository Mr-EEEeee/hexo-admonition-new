const assert = require('assert');
const md = require('markdown-it')('commonmark');

// Mock hexo object
global.hexo = {
  extend: {
    filter: {
      register: () => {}
    }
  },
  config: {},
  log: {
    error: () => {}
  }
};

// Extract the core parsing logic for testing
function parseAdmonition(content) {
  const lines = content.split(/\r?\n/);
  const result = [];

  const iconMap = {
    anote: 'mdi-note-outline',
    info: 'mdi-information-outline',
    warning: 'mdi-alert-outline',
    tip: 'mdi-lightbulb-on-outline'
  };

  const defaultTitles = {
    anote: 'Note',
    info: 'Info',
    warning: 'Warning',
    tip: 'Tip'
  };

  const blockRegex = /^(\s*)!!!\s*(anote|info|todo|warning|attention|caution|failure|missing|fail|error|danger|bug|tip|success|question|example|quote)\s*(?:"(.*?)")?\s*$/i;

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function parseBlock(startIndex) {
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

    const escIndent = escapeRegExp(indent || '');
    const stripRegex = new RegExp('^' + escIndent + '(?: {4}|\t)?');

    while (i < lines.length) {
      const line = lines[i];
      const nextMatch = line.match(blockRegex);
      
      if (nextMatch) break;
      if (/^\s*$/.test(line) || line.startsWith((indent || '') + '    ') || line.startsWith((indent || '') + '\t')) {
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

    const html = `<div class="admonition ${type}">${titleHtml}<div class="admonition-content">${rendered}</div></div>`;
    return { end: i, html: html + '\n' };
  }

  let i = 0;
  while (i < lines.length) {
    const match = lines[i].match(blockRegex);
    if (match) {
      const parsed = parseBlock(i);
      if (parsed.html) result.push(parsed.html);
      i = parsed.end;
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  return result.join('\n');
}

describe('Hexo Admonition Plugin', () => {
  it('should parse basic note block', () => {
    const input = `!!!anote "Test Note"
    This is a test note.`;
    
    const result = parseAdmonition(input);
    
    assert(result.includes('<div class="admonition anote">'));
    assert(result.includes('<span class="mdi mdi-note-outline admonition-icon"></span>Test Note'));
    assert(result.includes('This is a test note.'));
  });

  it('should use default title when none provided', () => {
    const input = `!!!warning
    This is a warning.`;
    
    const result = parseAdmonition(input);
    
    assert(result.includes('<div class="admonition warning">'));
    assert(result.includes('Warning'));
  });

  it('should hide title when empty string provided', () => {
    const input = `!!!info ""
    This has no title.`;
    
    const result = parseAdmonition(input);
    
    assert(result.includes('<div class="admonition info">'));
    assert(!result.includes('<p class="admonition-title">'));
  });

  it('should handle multiple blocks', () => {
    const input = `!!!anote "First"
    First note.

!!!warning "Second"
    Second warning.`;
    
    const result = parseAdmonition(input);
    
    assert(result.includes('<div class="admonition anote">'));
    assert(result.includes('<div class="admonition warning">'));
    assert(result.includes('First note.'));
    assert(result.includes('Second warning.'));
  });

  it('should preserve non-admonition content', () => {
    const input = `Regular text

!!!tip "Tip"
    This is a tip.

More regular text`;
    
    const result = parseAdmonition(input);
    
    assert(result.includes('Regular text'));
    assert(result.includes('More regular text'));
    assert(result.includes('<div class="admonition tip">'));
  });
});