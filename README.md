# eslint-plugin-modules-newline

Eslint plugin to enforce placing import and export variables on separate lines

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```
or 
```
$ yarn add eslint --dev
```

Next, install `eslint-plugin-modules-newline`:

```
$ npm install eslint-plugin-modules-newline --save-dev
```
or
```
$ yarn add eslint-plugin-modules-newline --dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-modules-newline` globally.

## Usage

Add `eslint-plugin-modules-newline` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "modules-newline"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "modules-newline/import-declaration-newline": "warn",
        "modules-newline/export-declaration-newline": "warn"
    }
}
```

## Supported Rules

* Enforce placing import variables on separate lines (import-declaration-newline)
* Enforce placing export variables on separate lines (export-declaration-newline)





