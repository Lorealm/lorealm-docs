import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import fs from 'node:fs';

// Adjust the path if you place the grammar elsewhere.
const weaverGrammar = JSON.parse(
  fs.readFileSync(new URL('./src/grammars/weaver.tmLanguage.json', import.meta.url), 'utf-8'),
);

const palettes = {
  dark: {
    delimiter: '#8b83a8', // {{ }} {# #} and trim markers — structural, recedes
    bracket: '#d9a441', // @[ ] $[ ] [[ ]] — the warm counterpoint
    keyword: '#c792ea',
    namespace: '#5ccfc0',
    variable: '#e8c98a',
    function: '#9d8cf5',
    string: '#7fd6a8',
    constant: '#e3a566',
    punctuation: '#7d7699',
    tag: '#f07fa0',
  },
  light: {
    delimiter: '#6b6483',
    bracket: '#9a6b12',
    keyword: '#7c3fbf',
    namespace: '#0f7a72',
    variable: '#8a5a10',
    function: '#4f46c9',
    string: '#16794f',
    constant: '#a1560c',
    punctuation: '#6b6483',
    tag: '#c02454',
  },
};

/** Keyed to the grammar's `.weaver` scopes, so these never touch other languages. */
const weaverTokenColors = (c) => [
  // {{ }} and {# #} delimiters  (t.brace)
  {
    scope: [
      'punctuation.definition.interpolation.weaver',
      'punctuation.definition.tag-block.weaver',
    ],
    settings: { foreground: c.delimiter, fontStyle: 'bold' },
  },
  // whitespace trim markers: {#- -#}  {{- -}}  $[- -]  @[- -]
  {
    scope: 'punctuation.definition.trim.weaver',
    settings: { foreground: c.delimiter, fontStyle: 'bold' },
  },
  // @[ ] $[ ] [[ ]] brackets  (t.squareBracket)
  {
    scope: [
      'punctuation.definition.processor.weaver',
      'punctuation.definition.command.weaver',
      'punctuation.definition.document.weaver',
    ],
    settings: { foreground: c.bracket, fontStyle: 'bold' },
  },
  // control keywords  (t.controlKeyword)
  { scope: 'keyword.control.weaver', settings: { foreground: c.keyword, fontStyle: 'bold' } },
  // flow statements: break / continue / return / stop
  {
    scope: 'keyword.control.flow.weaver',
    settings: { foreground: c.keyword, fontStyle: 'bold italic' },
  },
  // scope before colon  (t.namespace)
  { scope: 'entity.name.namespace.weaver', settings: { foreground: c.namespace } },
  // bare identifiers  (t.variableName)
  { scope: 'variable.other.weaver', settings: { foreground: c.variable } },
  // dotted path segments: {{char:alice.stats.hp}}
  { scope: 'variable.other.property.weaver', settings: { foreground: c.variable } },
  // processor / command name  (t.function)
  { scope: 'entity.name.function.weaver', settings: { foreground: c.function } },
  // arg keys + strings  (t.propertyName, t.string)
  {
    scope: ['variable.parameter.weaver', 'string.quoted.double.weaver'],
    settings: { foreground: c.string },
  },
  // numbers, booleans, none, attr values  (t.number / t.bool / t.null / t.attributeName)
  {
    scope: [
      'constant.numeric.weaver',
      'constant.language.boolean.weaver',
      'constant.language.null.weaver',
      'entity.other.attribute-name.weaver',
    ],
    settings: { foreground: c.constant },
  },
  // operators  (t.operator)
  { scope: 'keyword.operator.weaver', settings: { foreground: c.namespace } },
  // punctuation  (t.punctuation)
  {
    scope: [
      'punctuation.separator.weaver',
      'punctuation.accessor.weaver',
      'punctuation.definition.array.weaver',
    ],
    settings: { foreground: c.punctuation },
  },
  // <trigger>  (t.tagName)
  { scope: 'entity.name.tag.weaver', settings: { foreground: c.tag, fontStyle: 'bold' } },
  // [[doc]] ids  (t.labelName)
  {
    scope: 'entity.name.label.weaver',
    settings: { foreground: c.variable, fontStyle: 'underline' },
  },
];

export default defineEcConfig({
  themes: ['material-theme-palenight', 'github-light'],
  shiki: {
    langs: [weaverGrammar],
  },
  styleOverrides: {
    borderRadius: '0',
    borderWidth: '1px',
    borderColor: 'var(--sl-color-hairline-light)',
    codeBackground: 'var(--lr-code-bg)',
    codeFontFamily: 'var(--sl-font-mono)',
    codeFontSize: '0.85rem',
    codeLineHeight: '1.7',
    frames: {
      shadowColor: 'transparent',
      editorTabBarBackground: 'var(--lr-code-chrome)',
      editorTabBarBorderBottomColor: 'var(--sl-color-hairline-light)',
      editorActiveTabBackground: 'var(--lr-code-bg)',
      editorActiveTabBorderColor: 'transparent',
      editorActiveTabIndicatorTopColor: 'var(--sl-color-accent)',
      editorActiveTabIndicatorBottomColor: 'transparent',
      editorBackground: 'var(--lr-code-bg)',
      terminalBackground: 'var(--lr-code-bg)',
      terminalTitlebarBackground: 'var(--lr-code-chrome)',
      terminalTitlebarBorderBottomColor: 'var(--sl-color-hairline-light)',
      inlineButtonBackground: 'var(--sl-color-accent)',
    },
  },
  customizeTheme: (theme) => {
    theme.settings.push(...weaverTokenColors(palettes[theme.type] ?? palettes.dark));
    return theme;
  },
});
