interface RepoInfo {
    id: number;
    name: string;
    languages: string;
    stars: number;
    updateTime: string;
}
export declare function getGithubInfo(author: string): Promise<RepoInfo[] | undefined>;
export {};
//# sourceMappingURL=index.d.ts.map