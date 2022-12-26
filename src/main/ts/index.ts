import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'

import { Extends, ICallable } from '@qiwi/substrate'
import findUp, { Match } from 'find-up'

export const isPromiseLike = (value: unknown): boolean =>
  typeof (value as any)?.then === 'function'

export const apply = <
  V extends any, // eslint-disable-line
  C extends ICallable,
  R1 = Promise<ReturnType<C>>,
  R2 = ReturnType<C>,
>(
  value: V,
  cb: C,
): Extends<V, Promise<any>, R1, R2> =>
  isPromiseLike(value) ? (value as Promise<any>).then(cb) : cb(value)

export type TGitRootSync = (cwd?: string) => Match

export type TGitRoot = {
  <S>(cwd?: string, sync?: S): Extends<S, boolean, Match, Promise<Match>>
  sync?: TGitRootSync
}

export const gitRoot: TGitRoot = <S>(
  cwd?: string,
  sync?: S,
): Extends<S, boolean, Match, Promise<Match>> => {
  const find = sync ? findUp.sync : findUp
  const readFile = sync ? fs.readFileSync : util.promisify(fs.readFile)
  const lStat = sync ? fs.lstatSync : util.promisify(fs.lstat)

  return find(
    (directory) => {
      const gitDir = path.join(directory, '.git')

      return apply(find.exists(gitDir), (exists) =>
        exists
          ? apply(lStat(gitDir), (stat) =>
              stat.isDirectory()
                ? directory
                : apply(
                    readFile(gitDir, { encoding: 'utf-8' }),
                    (gitRef) => /^gitdir: (.*)\.git\s*$/.exec(gitRef)?.[1],
                  ),
            )
          : undefined
      )
    },
    { type: 'directory', cwd },
  ) as Extends<S, boolean, Match, Promise<Match>>
}

export const gitRootSync = (cwd?: string): Match => gitRoot(cwd, true)

// Workaround for typedoc + TS 4.3
// gitRoot.sync = gitRootSync
Object.assign(gitRoot, { sync: gitRootSync })

export default gitRoot
