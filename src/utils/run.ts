import { exec, ExecOptions } from 'child_process';

export async function run(command: string, options: ExecOptions = {}) {
  return new Promise<string>((resolve, reject) => {
    exec(`/bin/bash -c "${command}" 2>&1`, options, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout.toString());
    });
  });
}
