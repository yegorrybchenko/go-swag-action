import * as Diff from 'diff'
import * as core from '@actions/core'
import fs from 'fs'
import styles from 'ansi-styles'

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
    if (change.added) {
      _printDiffMessage(change.value, true)

      changedLines++
    } else if (change.removed) {
      _printDiffMessage(change.value, false)

      changedLines++
    }
  }

  if (changedLines === 0) {
    core.info(`${styles.color.green.open}Files are equal`)
  } else {
    throw new Error(`Go files are not equal`)
  }
}

function _getExistingGoFilePath(): string {
  const baseGoFileToEqual = core.getInput('equalToGoOriginPath')

  return baseGoFileToEqual || DEFAULT_GO_FILE_PATH
}

function _printDiffMessage(value: string, added: boolean): void {
  const insertValue = added
    ? `${styles.color.green.open}+`
    : `${styles.color.red.open}-`

  const replacedString = insertValue + value.replace(/\n/gm, `\n${insertValue}`)

  for (const str of replacedString.split('\n')) {
    core.info(str)
  }
}
