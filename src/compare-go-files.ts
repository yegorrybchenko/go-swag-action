import * as core from '@actions/core'
import fs from 'fs'
import ss from 'string-similarity'

const DEFAULT_GO_FILE_PATH = 'docs/docs.go'

export async function compareGoFiles(generatedFilePath: string): Promise<void> {
  const existingGoFilePath = _getExistingGoFilePath()

  const existingFileBuf = fs.readFileSync(existingGoFilePath)
  const generatedFileBuf = fs.readFileSync(generatedFilePath)

  const raiting = ss.compareTwoStrings(
    existingFileBuf.toString(),
    generatedFileBuf.toString()
  )

  core.debug(raiting.toString())

  if (raiting !== 1) {
    throw new Error(`Go files are not equal`)
  }
}

function _getExistingGoFilePath(): string {
  const baseGoFileToEqual = core.getInput('equalToGoOriginPath')

  return baseGoFileToEqual || DEFAULT_GO_FILE_PATH
}
