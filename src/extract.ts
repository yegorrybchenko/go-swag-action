import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'

const downloadPath = 'https://github.com/swaggo/swag/releases/download/'

export async function extractTool(version: string): Promise<string> {
  const fullDownloadPath = getFullDownloadPath(version)
  core.info(`Installing tool ${version}...`)
  const toolPathZip = await tc.downloadTool(fullDownloadPath)

  const homeBinPath = `${process.env.HOME}/bin`
  const toolPath = await tc.extractTar(toolPathZip, homeBinPath)

  core.addPath(toolPath)

  return toolPath
}

function getFullDownloadPath(version: string): string {
  let platform: string
  if (process.platform === 'linux') {
    platform = 'Linux'
  } else if (process.platform === 'darwin') {
    platform = 'Darwin'
  } else {
    throw new Error(`Platform ${process.platform} is not supported`)
  }

  return `${downloadPath}v${version}/swag_${version}_${platform}_x86_64.tar.gz`
}
