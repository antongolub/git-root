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
  R2 = ReturnType<C>
>(
  value: V,
  cb: C,
): Extends<V, Promise<any>, R1, R2> =>
  isPromiseLike(value) ? (value as any)?.then(cb) : cb(value)

export const gitRoot = <S>(
  cwd?: string,
  sync?: S,
): Extends<S, boolean, Match, Promise<Match>> => {
  const exec = sync ? findUp.sync : findUp
  const readFile = sync ? fs.readFileSync : util.promisify(fs.readFile)

  return exec(
    (directory) => {
      const gitDir = path.join(directory, '.git')

      return effect(exec.exists(gitDir), (exists) => {
        if (!exists) {
          return
        }

        if (fs.lstatSync(gitDir).isDirectory()) {
          return directory
        }

        return effect(readFile(gitDir, { encoding: 'utf-8' }), (gitRef) => {
          const match = /^gitdir: (.*)\.git\s*$/.exec(gitRef)

          return match ? match[1] : undefined
        })
      })
    },
    { type: 'directory', cwd },
  ) as Extends<S, boolean, Match, Promise<Match>>
}

export const gitRootSync = (cwd?: string): Match => gitRoot(cwd, true)

gitRoot.sync = gitRootSync

export default gitRoot
