import PQueue from "p-queue";

export const fetchQueue = new PQueue({
    concurrency: 3,
    interval: 1000,    
    intervalCap: 3       
});