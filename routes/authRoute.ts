import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

// Fixes the typing of the messages.
declare module 'express-session' {
  interface SessionData {
    messages: Array<string>
  }
}

// These are the GitHub strategy routes
router.get(
  '/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  }
);

// These are the local strategy routes
router.get("/login", forwardAuthenticated, (req, res) => {
  /* 
  This ensures the messages clear with every session and that 
  only the latest error is printed (in case user has multiple 
  incorrect attempts).
  */
  const messages = req.session.messages || [];
  req.session.messages = [];
  res.render("login", {messages: messages});
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    /* (FIXED) 😭 failureMsg needed when login fails */
    failureMessage: true
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
