import * as exec from '@actions/exec'

export async function execTool(tool: string, command: string): Promise<number> {
  return exec.exec(tool, [command])
}
