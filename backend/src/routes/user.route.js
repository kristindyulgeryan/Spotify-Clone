import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("User rout with GET method");
});

export default router;
