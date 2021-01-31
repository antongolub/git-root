import { Extends, ICallable } from '@qiwi/substrate'
import findUp, { Match } from 'find-up'
import fs from 'fs'
import path from 'path'

export const isPromiseLike = (value: any): boolean =>
  typeof (value as any)?.then === 'function'

export const effect = <
  V extends any,
  C extends ICallable,
  R1 = Promise<ReturnType<C>>,
  R2 = ReturnType<C>
>(
  value: V,
  cb: C,
): Extends<V, Promise<any>, R1, R2> =>
  isPromiseLike(value) ? (value as any)?.then(cb) : cb(value)

export const gitDir = <S>(
  cwd?: string,
  sync?: S,
): Extends<S, boolean, Match, Promise<Match>> => {
  const exec = sync ? findUp.sync : findUp

  return exec(
    (directory) => {
      const gitDir = path.join(directory, '.git')

      return effect(exec.exists(gitDir), (exists) => {
        if (!exists) {
          return
        }

        const isDirectory = fs.lstatSync(gitDir).isDirectory()
        if (isDirectory) {
          return directory
        }

        const gitRef = fs.readFileSync(gitDir, { encoding: 'utf-8' })
        const match = /^gitdir: (.*)\.git\s*$/.exec(gitRef)

        return match ? match[1] : undefined
      })
    },
    { type: 'directory', cwd },
  ) as Extends<S, boolean, Match, Promise<Match>>
}

const gitDirSync = (cwd?: string): Match => gitDir(cwd, true)

gitDir.sync = gitDirSync
