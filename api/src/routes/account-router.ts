import express, { Request, Response } from "express";
import { JobsHub } from "../jobs";
import { AccountService } from "../services/account-service";

export const accountRouter = express.Router();
const accountService = new AccountService();

accountRouter.get("/:accountSearchString", async (req: Request, res: Response) => {
  try {
    const result = await accountService.parseAndGet(req.params.accountSearchString);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Make sure file key is file
accountRouter.post("/parsePost", async (req: Request, res: Response) => {
  if (!req.files?.file) {
    res.status(500).json({ message: "No file found." });
  } else {
    try {
      const result = await accountService.parseFile(req.files?.file);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
});

accountRouter.post("/insertPost", async (req: Request, res: Response) => {
  if (!req.files?.file) {
    res.status(500).json({ message: "No file found." });
  } else {
    try {
      const result = await accountService.parseFile(req.files?.file);
      const lineCount = await accountService.insertParsedData(result);
      res.status(200).json({ message: `Inserted ${lineCount} lines` });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
});

accountRouter.post("/diffFile", async (req: Request, res: Response) => {
  if (!req.files?.file) {
    res.status(500).json({ message: "No file found." });
  } else {
    try {
      const result = await accountService.parseFile(req.files?.file);
      const diff = await accountService.diff(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  }
});

accountRouter.post("/diffData", async (req: Request, res: Response) => {
  try {
    const result = await accountService.diff(req.body.data);

    JobsHub.notify(result);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});
