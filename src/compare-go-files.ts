import * as core from '@actions/core'
import * as exec from '@actions/exec'

const DEFAULT_GO_FILE_PATH = 'docs/docs.go'

export async function compareGoFiles(generatedFilePath: string): Promise<void> {
  const existingGoFilePath = _getExistingGoFilePath()
  const returnCode = await exec.exec('diff', [
    existingGoFilePath,
    generatedFilePath
  ])

  if (returnCode !== 0) {
    throw new Error(`diff failed to compare two files`)
  }
}

function _getExistingGoFilePath(): string {
  const baseGoFileToEqual = core.getInput('equalToGoOriginPath')

  return baseGoFileToEqual || DEFAULT_GO_FILE_PATH
}
