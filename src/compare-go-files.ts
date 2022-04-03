import * as exec from '@actions/exec'

export async function compareGoFiles(filePath: string): Promise<void> {
  const defaultFilePath = 'docs/docs.go'
  const returnCode = await exec.exec('diff', [filePath, defaultFilePath])
  if (returnCode !== 0) {
    throw new Error(`swag tool is failed to exec your command`)
  }
}
