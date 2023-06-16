const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  console.log("Hello!");
});
