import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'

type Extends<T, E, R1, R2> = T extends E ? R1 : R2

type ICallable<A extends any[] = any[], R = any> = (...args: A) => R

type Match = string | undefined

const isPromiseLike = (value: unknown): boolean =>
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
  isPromiseLike(value) ? (value as Promise<any>).then(cb, () => cb()) : cb(value)

export type TGitRootSync = (cwd?: string) => Match

export type TGitRoot = {
  (cwd: string | undefined, sync: true): Match
  (cwd?: string): Promise<Match>
  sync: TGitRootSync
}

export const gitRoot: TGitRoot = <S>(
  cwd: string = process.cwd(),
  sync?: S,
) => {
  const readFile = sync ? fs.readFileSync : util.promisify(fs.readFile)
  const lStat = sync ? fs.lstatSync : fs.promises.lstat

  const cb = (dir?: string): any => {
    if (!dir) {
      return
    }

    const gitDir = path.join(dir, '.git')

    return apply(lStat(gitDir, { throwIfNoEntry: false }), (stat: ReturnType<typeof fs.lstatSync>) => {
      if (!stat) {
        const next = path.dirname(dir)

        if (next === dir) {
          return
        }

        return cb(next)
      }

      return stat.isDirectory()
        ? dir
        : apply(
          readFile(gitDir, { encoding: 'utf-8' }),
          (gitRef: string) => cb(/^gitdir: (.*)\.git\s*$/.exec(gitRef)?.[1]),
        )
    })
  }

  return cb(cwd)
}

export const gitRootSync = (cwd?: string): Match => gitRoot(cwd, true)

gitRoot.sync = gitRootSync
