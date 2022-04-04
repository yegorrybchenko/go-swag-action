import * as Diff from 'diff'
import * as core from '@actions/core'
import fs from 'fs'

const DEFAULT_GO_FILE_PATH = 'docs/docs.go'

export async function compareGoFiles(generatedFilePath: string): Promise<void> {
  const existingGoFilePath = _getExistingGoFilePath()

  const existingFileBuf = fs.readFileSync(existingGoFilePath)
  const generatedFileBuf = fs.readFileSync(generatedFilePath)

  const changes = Diff.diffLines(
    existingFileBuf.toString(),
    generatedFileBuf.toString()
  )

  if (changes.length === 0) {
    core.info('Files are equal')
    return
  }

  for (const change of changes) {
    const color = change.added
      ? '\u001b[32m'
      : change.removed
      ? '\u001b[31m'
      : '\u001b[90m'

    core.info(`${color}${change.value}`)
  }

  throw new Error(`Go files are not equal`)
}

function _getExistingGoFilePath(): string {
  const baseGoFileToEqual = core.getInput('equalToGoOriginPath')

  return baseGoFileToEqual || DEFAULT_GO_FILE_PATH
}
