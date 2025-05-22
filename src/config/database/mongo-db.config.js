const mongoose = require('mongoose');
const logger = require('../../log');
async function connectDBMida(uri, options) {
    try {
        if (!uri) {
            logger.info(__filename, '', 'MongoDB-MIDA: No URI specified');
            return;
        }

        await mongoose.connect(uri, options);
        logger.info(__filename, '', '🚀 MongoDB-MIDA - Connected 🚀');
    } catch (error) {
        logger.error(__filename, '', `Error: ${error.toString()}`);
    }
}

module.exports = {
    connectDBMida,
};
