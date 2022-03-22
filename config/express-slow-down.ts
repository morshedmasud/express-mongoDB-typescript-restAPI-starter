import expressSlowDowner from "express-slow-down";

const expressSlowDown = expressSlowDowner({
  windowMs: parseInt(process.env.WINDOW_BLOCK_SECOND || "30000"),
  delayAfter: parseInt(process.env.PER_WINDOW_MAX_REQUEST || "30"),
  delayMs: 500,
});

export default expressSlowDown;
