import * as core from '@actions/core'
import {compareGoFiles} from './compare-go-files'
import {execTool} from './command'
import {extractTool} from './extract'

export async function run(): Promise<void> {
  const command = core.getInput('command', {required: true})
  const swagVersion = core.getInput('swagWersion', {required: true})

  const toolPath = await extractTool(swagVersion)
  const returnCode = await execTool(toolPath, command)
  if (returnCode !== 0) {
    throw new Error(`swag tool is failed to exec your command`)
  }

  const equalToGoPath = core.getInput('equalToGo')
  if (equalToGoPath !== '') {
    await compareGoFiles(equalToGoPath)
  }
}
