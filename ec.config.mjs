import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import fs from 'node:fs';

// Adjust the path if you place the grammar elsewhere.
const weaverGrammar = JSON.parse(
  fs.readFileSync(new URL('./src/grammars/weaver.tmLanguage.json', import.meta.url), 'utf-8'),
);

// Mirrors your CodeMirror HighlightStyle, keyed to the grammar's `.weaver` scopes.
// Because every scope is weaver-specific, these rules never touch your other languages.
const weaverTokenColors = [
  // {{ }} and {# #} delimiters  (t.brace)
  {
    scope: [
      'punctuation.definition.interpolation.weaver',
      'punctuation.definition.tag-block.weaver',
    ],
    settings: { foreground: '#7c8a9e', fontStyle: 'bold' },
  },
  // @[ ] $[ ] [[ ]] brackets  (t.squareBracket)
  {
    scope: [
      'punctuation.definition.processor.weaver',
      'punctuation.definition.command.weaver',
      'punctuation.definition.document.weaver',
    ],
    settings: { foreground: '#c98a3a', fontStyle: 'bold' },
  },
  // control keywords  (t.controlKeyword)
  { scope: 'keyword.control.weaver', settings: { foreground: '#c678dd', fontStyle: 'bold' } },
  // scope before colon  (t.namespace)
  { scope: 'entity.name.namespace.weaver', settings: { foreground: '#56b6c2' } },
  // bare identifiers  (t.variableName)
  { scope: 'variable.other.weaver', settings: { foreground: '#e5c07b' } },
  // processor / command name  (t.function)
  { scope: 'entity.name.function.weaver', settings: { foreground: '#61afef' } },
  // arg keys + strings  (t.propertyName, t.string)
  {
    scope: ['variable.parameter.weaver', 'string.quoted.double.weaver'],
    settings: { foreground: '#98c379' },
  },
  // numbers, booleans, none, attr values  (t.number / t.bool / t.null / t.attributeName)
  {
    scope: [
      'constant.numeric.weaver',
      'constant.language.boolean.weaver',
      'constant.language.null.weaver',
      'entity.other.attribute-name.weaver',
    ],
    settings: { foreground: '#d19a66' },
  },
  // operators  (t.operator)
  { scope: 'keyword.operator.weaver', settings: { foreground: '#56b6c2' } },
  // punctuation  (t.punctuation)
  { scope: 'punctuation.separator.weaver', settings: { foreground: '#828a99' } },
  // <trigger>  (t.tagName)
  { scope: 'entity.name.tag.weaver', settings: { foreground: '#e06c75', fontStyle: 'bold' } },
  // [[doc]] ids  (t.labelName)
  { scope: 'entity.name.label.weaver', settings: { foreground: '#e5c07b', fontStyle: 'underline' } },
];

export default defineEcConfig({
  // Your normal theme(s) for every other language stay as-is.
  // themes: ['github-dark', 'github-light'],
  shiki: {
    langs: [weaverGrammar],
  },
  // Called once per active theme; we append the weaver rules so they apply
  // regardless of which base theme (light/dark) is in use.
  customizeTheme: (theme) => {
    theme.settings.push(...weaverTokenColors);
    return theme;
  },
});
