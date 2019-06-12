# cftemplate

[AWS CloudFormation] YAML template generator.

**Write separated YAMLs, build them into one CF template!**

[![Build Status][travis-img]][travis-url]
[![Coverage Status][coveralls-img]][coveralls-url]

## Installation

Global install

```bash
$ npm install cftemplate -g
```

or install and add to current package.

```bash
$ npm install cftemplate --save-dev
```

## Quick start

Make separated YAMLs by using [json-refs], and put them info your source directory.

> You must make `index.yml` for entry point.

[Template example]

Then, build template like below.

```bash
$ cftemplate src > template.yml
```

[travis-img]: https://img.shields.io/travis/u-minor/cftemplate/master.svg
[travis-url]: https://travis-ci.org/u-minor/cftemplate
[coveralls-img]: https://img.shields.io/coveralls/u-minor/cftemplate/master.svg
[coveralls-url]: https://coveralls.io/r/u-minor/cftemplate?branch=master
[AWS CloudFormation]: https://aws.amazon.com/cloudformation/
[json-refs]: https://www.npmjs.com/package/json-refs
[Template example]: https://github.com/u-minor/cftemplate/tree/master/test/fixture/tpl1
