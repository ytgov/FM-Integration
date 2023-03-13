import { IntegrationJob } from ".";

export class VrooziJob implements IntegrationJob {
  constructor() {}

  async runJob(payload: any) {
    console.log("VrooziJob:runJob", payload);
  }
}
