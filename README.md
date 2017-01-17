# jsonml-to-react-element

[![](https://img.shields.io/travis/benjycui/jsonml-to-react-element.svg?style=flat-square)](https://travis-ci.org/benjycui/jsonml-to-react-element)
[![npm package](https://img.shields.io/npm/v/jsonml-to-react-element.svg?style=flat-square)](https://www.npmjs.org/package/jsonml-to-react-element)
[![NPM downloads](http://img.shields.io/npm/dm/jsonml-to-react-element.svg?style=flat-square)](https://npmjs.org/package/jsonml-to-react-element)
[![Dependency Status](https://david-dm.org/benjycui/jsonml-to-react-element.svg?style=flat-square)](https://david-dm.org/benjycui/jsonml-to-react-element)

To convert JsonML to React Component.

## Installation

```bash
npm install --save jsonml-to-react-element
```

## Usage

Basic:

```js
const ReactDOM = require('react-dom');
const toReactElement = require('jsonml-to-react-element');

const title = [
  'h1',
  'Hello world!',
];

ReactDOM.render(toReactElement(title), document.getElementById('content'));
```

With converters:

```js
const React = require('react');
const ReactDOM = require('react-dom');
const toReactElement = require('jsonml-to-react-element');

const website = [
  'section',
  [
    'header',
    ...
  ],
  [
    'article',
    [
      'h1',
      'Hello world!',
    ],
  ],
  [
    'footer',
    ...
  ]
];

const html5to4 = [
  [
    (node) => ['section', 'header', 'article', 'footer'].indexOf(node[0]) > -1,
    (node, index) => React.createElement(
      'div',
      { key: index },
      node.slice(1).map((child) => toReactElement(child, html5to4))
    )
  ],
  ...
];

ReactDOM.render(
  toReactElement(website, html5to4),
  document.getElementById('content')
);
```

## API

### toReactElement(jsonml: Object [, converters: Array]): React.Component

To convert JsonML to React Component with converters.

#### converters: Array[Pair[Function, Function]]

Converters which are passed to `toReactElement` will concat with [default converters](https://github.com/benjycui/jsonml-to-react-element/blob/master/src/index.js#L47). It works like `switch` sentence.

Each item in converters is a pair of functions. The first function is a prediction, and the second function is a processor which take JsonML node and return React Component.

## Relative

[jsonml.js](https://github.com/benjycui/jsonml.js) A collection of JsonML tools.

## Liscence

MIT
