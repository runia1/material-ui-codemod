## Installation

```
npm install @mrunia/material-ui-codemod
npm install -g jscodeshift
```

## Usage

`jscodeshift -t <path to transformer you'd like to run> <path to src code you'd like to transform>`

#### Example

`jscodeshift -t ./src/imports.js ~/code/my-app/src`

