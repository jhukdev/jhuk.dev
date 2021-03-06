const { isValidElement } = require('preact');
const fs = require('fs');
const { render } = require('preact-render-to-string');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdown = require('markdown-it');
const markdownAnchor = require('markdown-it-anchor');

/* -----------------------------------
 *
 * 11ty
 *
 * -------------------------------- */

module.exports = function (config) {
  config.addPassthroughCopy('./src/_js/assets');
  config.addPassthroughCopy('./src/_js/articles/_images');

  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
  });

  config.setUseGitIgnore(false);
  config.setDataDeepMerge(true);

  config.addPlugin(syntaxHighlight);

  config.addTransform('jsx', (content) => {
    if (isValidElement(content)) {
      return `<!doctype html>${render(content)}`;
    }

    return content;
  });

  config.addTransform('hash', (content, path) => {
    if (path.endsWith('.html')) {
      return transformFileHash(content);
    }

    return content;
  });

  config.addJavaScriptFunction('getAssetContents', getAssetContents);

  config.addCollection('articles', (collection) =>
    collection
      .getAllSorted()
      .filter(({ data: { article = false, publish = false } }) => article && publish)
      .reverse()
  );

  config.setLibrary(
    'md',
    markdown({ html: true, breaks: true, linkify: true }).use(markdownAnchor, {
      permalink: true,
      permalinkBefore: true,
      permalinkClass: 'title-anchor',
      permalinkSymbol: '',
      permalinkAttrs: (slug) => ({ 'aria-label': normaliseTitleAnchors(slug) }),
      slugify: slugifyTitleAnchors,
    })
  );

  return {
    passthroughFileCopy: true,
    jsDataFileSuffix: '.data',
    dir: {
      input: 'src/_js',
      output: 'dist',
      data: 'data',
      layouts: 'layouts',
      includes: '_includes',
    },
  };
};

/* -----------------------------------
 *
 * Hashes
 *
 * -------------------------------- */

function transformFileHash(content) {
  let assets = {};

  try {
    assets = require('./src/_js/assets.json');
  } catch {
    // no-op
  }

  const keys = Object.keys(assets);

  return keys.reduce(
    (result, key) =>
      result.replace(
        new RegExp(`(script|link)(.*?)(src|href)="(.*?)${key}"`, 'g'),
        `$1$2$3="$4${assets[key]}"`
      ),
    content
  );
}

/* -----------------------------------
 *
 * Contents
 *
 * -------------------------------- */

function getAssetContents(path) {
  const assets = require('./src/_js/assets.json');

  if (!assets[path]) {
    return;
  }

  const filePath = `./src/_js/assets/${assets[path]}`;

  return fs.readFileSync(filePath).toString();
}

/* -----------------------------------
 *
 * Anchors
 *
 * -------------------------------- */

function slugifyTitleAnchors(value) {
  return encodeURIComponent(
    String(value)
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  );
}

/* -----------------------------------
 *
 * Anchors
 *
 * -------------------------------- */

function normaliseTitleAnchors(value) {
  const result = value.replace(/-/g, ' ');

  return result.charAt(0).toUpperCase() + result.slice(1);
}
