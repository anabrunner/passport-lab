import express from "express";
const router = express.Router();
const session = require('express-session');
const store = session.Store;
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAuthenticated, (req, res) => {
  let currentSessions: Array<any> = [];
  // This gives a TypeError: store.all is not a function
  // I could not get this to work any further
  store.all(function(err: any, sessions: any) {
    if(err) {
      console.log(err);
    } else {
      sessions.forEach((ses: any) => currentSessions.push(ses));
    }
  })
  if(req.user?.role === "admin") {
    res.render("admin", {
      user: req.user,
      sessions: currentSessions,
    })
  } else {
    res.redirect("/dashboard");
  }
});

export default router;
