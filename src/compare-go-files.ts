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
    if (change.count) {
      core.debug(change.count.toString())
    }

    if (change.added) {
      const greenColor = '\u001b[32m'
      core.info(`${greenColor}${change.value}`)
    } else if (change.removed) {
      const redColor = '\u001b[31m'
      core.info(`${redColor}${change.value}`)
    }
  }

  throw new Error(`Go files are not equal`)
}

function _getExistingGoFilePath(): string {
  const baseGoFileToEqual = core.getInput('equalToGoOriginPath')

  return baseGoFileToEqual || DEFAULT_GO_FILE_PATH
}
