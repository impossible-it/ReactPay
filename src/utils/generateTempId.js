// utils/generateTempId.js

const generateTemporaryId = () => {
    return 'TEMP_' + Math.random().toString(36).substring(2, 15);
};

module.exports = generateTemporaryId;
