import express, { Request, Response } from "express";
import cors from "cors";
const app = express();

const donation = {
  user: 0,
  amount: 0,
};

app.use(express.json());
app.use(cors());

app.post("/donate", (req: Request, res: Response) => {
  const amount = req.body.amount || 0;

  if (amount > 0) {
    donation.amount += amount;
    donation.user += 1;
  }

  return res.json({ message: "Thank you ?" });
});

app.listen(4650, () => {
  console.log(`Application started on URL ?`);
});

const SEND_INTERVAL = 2000;

app.get("/dashboard", (req: Request, res: Response) => {
  if (req.headers.accept === "text/event-stream") {
    sendEvent(req, res);
  } else {
    res.json({ message: "Ok" });
  }
});

const sendEvent = (_req: Request, res: Response) => {
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });

  const sseId = new Date().toDateString();

  setInterval(() => {
    writeEvent(res, sseId, JSON.stringify(donation));
  }, SEND_INTERVAL);

  writeEvent(res, sseId, JSON.stringify(donation));
};

const writeEvent = (res: Response, sseId: string, data: string) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};
