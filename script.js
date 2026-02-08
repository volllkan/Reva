// script.js

function getCurrentDateTime() {
    const now = new Date();
    const utcDateTime = now.toISOString().replace('T', ' ').substring(0, 19);
    return utcDateTime;
}

console.log('Current Date and Time (UTC):', getCurrentDateTime());