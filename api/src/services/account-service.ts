import { db } from "../data";
import { Account } from "../data/models";
import { GenericService } from "./generic-service";
import { parseString } from "@fast-csv/parse";

const SCHEMA = "dbo";
const TABLE = "accounts";

export class AccountService implements GenericService<Account> {
  async getAll(): Promise<Account[]> {
    return await db.withSchema(SCHEMA).from(TABLE);
  }

  async get(account: string): Promise<Account> {
    return await db.withSchema(SCHEMA).from(TABLE).where({ account }).first();
  }

  async parseAndGet(accountSearchString: string): Promise<Account[]> {
    accountSearchString = accountSearchString.replace(/_/g, "%");
    accountSearchString = accountSearchString.replace(/x/g, "_");

    const result = await db.withSchema(SCHEMA).from(TABLE).where("account", "like", accountSearchString);
    return result;
  }

  async parseFile(file: any): Promise<any> {
    const buffer = file.data as Buffer;
    const str = buffer.toString("utf8");

    return new Promise((resolve, reject) => {
      let data: any[] = [];
      parseString(str, { headers: true })
        .on("error", reject)
        .on("data", row => {
          Object.keys(row).forEach(key => {
            let newKey = key.toLowerCase().trim();
            row[newKey] = row[key];
            delete row[key];
          });
          data.push(row);
        })
        .on("end", async () => {
          resolve(data);
        });
    });
  }

  async insertParsedData(data: []): Promise<any> {
    const chunks = [];
    const chunkSize = 200;
    let lineCount = 0;
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    const results = [];
    for (let i = 0; i < chunks.length; i++) {
      const result = await db(TABLE).withSchema(SCHEMA).insert(chunks[i]);
      lineCount += chunks[i].length;
      results.push(result);
    }
    return lineCount;
  }

  async diff(data: Account[]): Promise<any> {
    console.log(`${data.length} rows to compare`);
    data = data.map(row => {
      this.lowerCaseKeys(row);
      return row;
    });

    //either new account, change description, or changed status
    for (let i = 0; i < data.length; i++) {
      const result = await db(TABLE).select("*").where({ account: data[i].account }).first();
      if (result) {
        if (
          result.org !== data[i].org ||
          result.notes !== data[i].notes ||
          result.type !== data[i].type ||
          result.status !== data[i].status
        ) {
          //TODO add to an array of entries to update
          console.log(data[i].account + " has a difference");
        }
      } else {
        //TODO add to an array of entries to insert
        console.log(data[i].account + " does not exist");
      }
    }
  }

  async insert(data: Account[]): Promise<any> {
    console.log(`${data.length} rows to insert`);
    data = data.map(row => {
      this.lowerCaseKeys(row);
      return row;
    });

    for (let i = 0; i < data.length; i++) {
      const result = await db(TABLE).select("*").where({ account: data[i].account }).first();
      if (!result) {
        await db(TABLE).insert({
          account: data[i].account,
          org: data[i].org,
          notes: data[i].notes,
          type: data[i].type,
          status: data[i].status
        });
      }
    }
  }

  async update(data: Account[]): Promise<any> {
    console.log(`${data.length} rows to update`);
    data = data.map(row => {
      this.lowerCaseKeys(row);
      return row;
    });

    for (let i = 0; i < data.length; i++) {
      await db(TABLE).where({ account: data[i].account }).update({
        org: data[i].org,
        notes: data[i].notes,
        type: data[i].type,
        status: data[i].status
      });
    }
  }

  lowerCaseKeys(obj: any) {
    Object.keys(obj).forEach(key => {
      let newKey = key.toLowerCase().trim();
      obj[newKey] = obj[key];
      if (newKey !== key) delete obj[key];
    });
  }
}
