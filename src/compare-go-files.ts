import * as Diff from 'diff'
import * as core from '@actions/core'
import fs from 'fs'

const DEFAULT_GO_FILE_PATH = 'docs/docs.go'

export async function compareGoFiles(generatedFilePath: string): Promise<void> {
  const existingGoFilePath = _getExistingGoFilePath()

  const existingFileBuf = fs.readFileSync(existingGoFilePath)
  const generatedFileBuf = fs.readFileSync(generatedFilePath)

  core.info(`Comparing ${existingGoFilePath} with ${generatedFilePath} ...`)

  const changes = Diff.diffLines(
    existingFileBuf.toString(),
    generatedFileBuf.toString()
  )

  let changedLines = 0

  for (const change of changes) {
    core.debug(
      `Change value: ${change.value}, count: ${change.count}, added: ${change.added}, removed: ${change.removed}`
    )
    if (change.added) {
      const greenColor = '\u001b[32m'
      core.info(`${greenColor}${change.value}`)

      changedLines++
    } else if (change.removed) {
      const redColor = '\u001b[31m'
      core.info(`${redColor}${change.value}`)

      changedLines++
    }
  }

  if (changedLines === 0) {
    core.info('\u001b[32mFiles are equal')
  } else {
    throw new Error(`Go files are not equal`)
  }
}

function _getExistingGoFilePath(): string {
  const baseGoFileToEqual = core.getInput('equalToGoOriginPath')

  return baseGoFileToEqual || DEFAULT_GO_FILE_PATH
}
