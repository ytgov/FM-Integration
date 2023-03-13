import { VrooziJob } from "./vroozi-job";

export class IntegrationJob {
  async runJob(payload: any) {
    //.throw error "Not Implemented"
  }
}

export class IntegartionHub {
  jobs: IntegrationJob[];

  constructor() {
    this.jobs = new Array<IntegrationJob>();
  }

  addJob(job: IntegrationJob) {
    this.jobs.push(job);
  }

  notify(payload: any) {
    for (let job of this.jobs) {
      job.runJob(payload);
    }
  }
}

export const JobsHub = new IntegartionHub();
JobsHub.addJob(new VrooziJob());
