const cron = require("node-cron");
const refreshTokenRepository = require("../repositories/refreshTokenRepository");
const tokenBlacklistRepository = require("../repositories/tokenBlacklistRepository");

const runCleanup = () => {
  //jalan tiap hari jam 00:00
  cron.schedule("0 0 * * *", async () => {
    console.log("Running token cleanup...");

    await refreshTokenRepository.deleteExpired();
    await tokenBlacklistRepository.deleteExpired();

    console.log("Token cleanup selesai");
  });
};

module.exports = runCleanup;
