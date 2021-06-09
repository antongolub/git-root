import { Extends, ICallable } from '@qiwi/substrate'
import findUp, { Match } from 'find-up'
import fs from 'fs'
import path from 'path'
import util from 'util'

export const isPromiseLike = (value: any): boolean =>
  typeof (value as any)?.then === 'function'

export const effect = <
  V extends any,
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
  sync: TGitRootSync
}

// @ts-ignore
export const gitRoot: TGitRoot = <S>(
  cwd?: string,
  sync?: S,
): Extends<S, boolean, Match, Promise<Match>> => {
  const exec = sync ? findUp.sync : findUp
  const readFile = sync ? fs.readFileSync : util.promisify(fs.readFile)
  const lStat = sync ? fs.lstatSync : util.promisify(fs.lstat)

  return exec(
    (directory) => {
      const gitDir = path.join(directory, '.git')

      return effect(exec.exists(gitDir), (exists) =>
        !exists
          ? undefined
          : effect(lStat(gitDir), (stat) =>
              stat.isDirectory()
                ? directory
                : effect(
                    readFile(gitDir, { encoding: 'utf-8' }),
                    (gitRef) => /^gitdir: (.*)\.git\s*$/.exec(gitRef)?.[1],
                  ),
            ),
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
