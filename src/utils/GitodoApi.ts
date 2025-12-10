export class GitodoApi {
    private baseUrl: string;
    private apiClient: typeof fetch;
    private token: string;

    constructor(token: string) {
        this.baseUrl = 'http://localhost:8000';
        this.apiClient = fetch;
        this.token = token;
    }

    async get(endpoint: string, options?: RequestInit): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`;
        console.log('GET', url);
        const headers = {
            ...options?.headers,
            ...(this.token ? { Authorization: `${this.token}` } : {}),
        };
        return this.apiClient(url, { method: 'GET', headers, ...options });
    }
}
