export declare enum JobStatus {
    notStarted = 0,
    queued = 1,
    errored = 2,
    done = 3
}
export declare class API {
    static createJob(jobType: string, body: unknown): Promise<import("axios").AxiosResponse<any>>;
    static jobStatus(reqId: string): Promise<JobStatus>;
}
