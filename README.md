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

[Template example]

Then, build template like below.

```bash
$ cftemplate srcdir > template.yml
```

## Command reference

```
Usage: cftemplate [options] <dir>

Options:
  --version     Show version number                                    [boolean]
  -e, --entry   entry point file name            [string] [default: "index.yml"]
  -o, --output  output file name                                        [string]
  --help, -h    Show help                                              [boolean]
```

## Writing templates

Make `index.yml` (default entry point) like below.

> If you want to change it, use `--entry` option.

You can use `$ref` to refer another template. (See [json-refs] for more information)

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Your project template

Mappings:
  $ref: mappings.yml

Outputs:
  $ref: outputs.yml

Parameters:
  $ref: parameters.yml

Resources:
  $ref: .resources.yml
```

If the template name starts with `.` (like `.resources.yml`), cftemplate try to merge all templates under the same directory (like `resources`).

So you can create yaml files separately for each AWS resource type like `resources/CloudFront.yml`, `resources/S3.yml`, etc.

Directory tree example:

```
cf/
├── index.yml
├── mappings.yml
├── outputs.yml
├── parameters.yml
└── resources/
    ├── CloudFront.yml
    ├── Lambda.yml
    └── S3.yml
```

[travis-img]: https://img.shields.io/travis/u-minor/cftemplate/master.svg
[travis-url]: https://travis-ci.org/u-minor/cftemplate
[coveralls-img]: https://img.shields.io/coveralls/u-minor/cftemplate/master.svg
[coveralls-url]: https://coveralls.io/r/u-minor/cftemplate?branch=master
[AWS CloudFormation]: https://aws.amazon.com/cloudformation/
[json-refs]: https://www.npmjs.com/package/json-refs
[Template example]: https://github.com/u-minor/cftemplate/tree/master/test/fixture/tpl1
