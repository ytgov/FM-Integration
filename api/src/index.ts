import express from "express";
import cors from "cors";
import helmet from "helmet";
import { API_PORT, APPLICATION_NAME } from "./config";
import { migrationRouter, accountRouter } from "./routes";
import fileUpload from "express-fileupload";

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(fileUpload());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "block-all-mixed-content": [],
      "font-src": ["'self'", "https:", "data:"],
      "frame-ancestors": ["'self'"],
      "img-src": ["'self'", "data:", "https:"],
      "object-src": ["'none'"],
      "script-src": ["'self'", "'unsafe-eval'"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "worker-src": ["'self'", "blob:"],
      "connect-src": ["'self'"]
    }
  })
);

// very basic CORS setup
app.use(
  cors({
    origin: "*", //TODO: upadte this to a specific domain later
    optionsSuccessStatus: 200,
    credentials: true
  })
);

app.use("/api/accounts", accountRouter);
app.use("/api/migrate", migrationRouter);

app.use("/api/healthCheck", (req, res) => {
  res.send("OK");
});

const PORT: number = parseInt(API_PORT as string);

app.listen(PORT, async () => {
  console.log(`${APPLICATION_NAME} API listenting on port ${PORT}`);
});
