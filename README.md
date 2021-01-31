# git-dir
Find the closest .git containing path.

[![David](https://img.shields.io/david/dev/antongolub/git-dir?label=deps)](https://david-dm.org/antongolub/git-dir?type=dev)
[![Maintainability](https://api.codeclimate.com/v1/badges/b4e77381057e40c6ac63/maintainability)](https://codeclimate.com/github/antongolub/git-up/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b4e77381057e40c6ac63/test_coverage)](https://codeclimate.com/github/antongolub/git-up/test_coverage)

## Motivation
It's known for certain the best way to find git root:
```shell
git rev-parse --show-toplevel
```
It makes sense to use this tool only if `git` executable or `child_process.exec` are not available for some (security?) reasons.
Inspired by [pkg-dir](https://github.com/sindresorhus/pkg-dir).

## Install
```shell
yarn add git-dir
```

## Usage
```ts
import { gitDir } from 'git-dir'

// async
const gitRoot1 = await gitDir('/optional/cwd/path/')

// sync
const gitRoot2 = gitDir('/defaults/to/process/cwd/', true)
```

## Alternatives

* [find-git-root](https://github.com/banyudu/find-git-root)
* [git-root](https://www.npmjs.com/package/git-root)


