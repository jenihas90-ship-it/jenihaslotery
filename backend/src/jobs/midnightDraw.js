const cron = require('node-cron');
const { runDraw } = require('../services/drawService');

// Schedule draw to run every midnight (00:00)
// Format: minute hour day-of-month month day-of-week
const initCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Running midnight lottery draw...');
        try {
            await runDraw();
        } catch (err) {
            console.error('[CRON] Draw failed:', err.message);
        }
    });

    console.log('[CRON] Draw scheduler initialized (Runs at 00:00 daily)');
};

module.exports = initCronJobs;
