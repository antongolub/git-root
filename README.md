# @antongolub/git-root
Find the closest .git containing path — the git root.

[![CI](https://github.com/antongolub/git-root/workflows/CI/badge.svg)](https://github.com/antongolub/git-root/actions)
[![David](https://img.shields.io/david/dev/antongolub/git-root?label=deps)](https://david-dm.org/antongolub/git-root?type=dev)
[![Maintainability](https://api.codeclimate.com/v1/badges/b4e77381057e40c6ac63/maintainability)](https://codeclimate.com/github/antongolub/git-up/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b4e77381057e40c6ac63/test_coverage)](https://codeclimate.com/github/antongolub/git-up/test_coverage)

## Motivation
It's known for certain the best way to find git root:
```shell
git rev-parse --show-toplevel
```
However, if `git` executable or `child_process.exec` are not available for some (security?) reasons, it's  advisable to use tools like this one.
Inspired by [pkg-dir](https://github.com/sindresorhus/pkg-dir).

## Features
* Searches for `.git` up the dir tree
* Handles `gitdir: </some/path.git>` redirects 
* TS and Flow typings out of box
* Sync/async methods

## Install
```shell
yarn add @antongolub/git-root
```

## Usage
```ts
import { gitRoot, gitRootSync } from '@antongolub/git-root'

// async
const gitRoot1 = await gitRoot('/optional/cwd/path/')

// sync
const gitRoot2 = gitRoot('/defaults/to/process/cwd/', true)

// sync too
const gitRoot3 = gitRoot.sync()

// `gitRootSync` is alias for `gitRoot.sync`
const gitRoot4 = gitRootSync()
```

## Alternatives

* [find-git-root](https://github.com/banyudu/find-git-root)
* [git-root](https://github.com/JPeer264/node-git-root)
* [git-toplevel](https://github.com/royriojas/git-toplevel)
* [git-root-path](https://github.com/VishnuTSuresh/git-root-path)
