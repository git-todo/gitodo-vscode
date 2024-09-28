import type * as vscode from 'vscode';

interface Branch {
    name?: string;
    commit?: string;
}

interface RepositoryState {
    HEAD: Branch | undefined;
}

interface Repository {
    state: RepositoryState;
}

export interface GitAPI {
    repositories: Repository[];
    getRepository(uri: vscode.Uri): Repository | null;
}

export interface GitExtensionAPI {
    getAPI(version: number): GitAPI;
}
