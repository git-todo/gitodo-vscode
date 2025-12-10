import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

export interface GitBlameInfo {
    commitHash: string;
    commitMessage: string;
}

async function getGitBlameInfo(
    filePath: string,
    lineNumber: number,
): Promise<GitBlameInfo | undefined> {
    // Get the directory of the file
    const repoDir = path.dirname(filePath);

    try {
        // Run git blame command
        const { stdout } = await execPromise(
            `git blame -L ${lineNumber + 1},${lineNumber + 1} "${filePath}"`,
            {
                cwd: repoDir, // Set the current working directory to the repo
            },
        );

        const lines = stdout.split('\n');
        if (lines.length > 0) {
            const commitHash = lines[0].split(' ')[0];
            const commitMessage = lines[0].split(')')[1].trim();
            return { commitHash, commitMessage };
        }
    } catch (error) {
        console.error('Error running git blame:', error);
        throw new Error('Failed to get Git blame info');
    }
    return undefined;
}
export { getGitBlameInfo };
