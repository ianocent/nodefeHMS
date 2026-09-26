import PQueue from "p-queue";

export const fetchQueue = new PQueue({
    concurrency: 4,
    interval: 500,    
    intervalCap: 4       
});