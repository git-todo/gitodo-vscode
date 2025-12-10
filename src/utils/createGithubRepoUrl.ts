function createGithubRepoUrl(repoRemote: string): string | undefined {
    const split = repoRemote.split('github.com:');
    if (split.length === 2) {
        return `https://github.com/${split[1].slice(0, -4)}`;
    }
    return undefined;
}

export { createGithubRepoUrl };
