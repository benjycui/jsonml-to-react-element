# jsonml-to-react-component

[![](https://img.shields.io/travis/benjycui/jsonml-to-react-component.svg?style=flat-square)](https://travis-ci.org/benjycui/jsonml-to-react-component)
[![npm package](https://img.shields.io/npm/v/jsonml-to-react-component.svg?style=flat-square)](https://www.npmjs.org/package/jsonml-to-react-component)
[![NPM downloads](http://img.shields.io/npm/dm/jsonml-to-react-component.svg?style=flat-square)](https://npmjs.org/package/jsonml-to-react-component)
[![Dependency Status](https://david-dm.org/benjycui/jsonml-to-react-component.svg?style=flat-square)](https://david-dm.org/benjycui/jsonml-to-react-component)

To convert JsonML to React Component.

## Installation

```bash
npm install --save jsonml-to-react-component
```

## Usage

Basic:

```js
const ReactDOM = require('react-dom');
const toReactComponent = require('jsonml-to-react-component');

const title = [
  'h1',
  'Hello world!',
];

ReactDOM.render(toReactComponent(title), document.getElementById('content'));
```

With converters:

```js
const React = require('react');
const ReactDOM = require('react-dom');
const toReactComponent = require('jsonml-to-react-component');

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
      node.slice(1).map((child) => toReactComponent(child, html5to4))
    )
  ],
  ...
];

ReactDOM.render(
  toReactComponent(website, html5to4),
  document.getElementById('content')
);
```

## API

### toReactComponent(jsonml: Object [, converters: Array]): React.Component

To convert JsonML to React Component with converters.

#### converters: Array[Pair[Function, Function]]

Converters which are passed to `toReactComponent` will concat with [default converters](https://github.com/benjycui/jsonml-to-react-component/blob/master/src/index.js#L47). It works like `switch` sentence.

Each item in converters is a pair of functions. The first function is a prediction, and the second function is a processor which take JsonML node and return React Component.

## Relative

[jsonml.js](https://github.com/benjycui/jsonml.js) A collection of JsonML tools.

## Liscence

MIT
