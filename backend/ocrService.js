const tesseract = require('node-tesseract-ocr');

const config = {
    lang: 'eng+fra',
    oem: 1,
    psm: 6,
};

async function extractTextFromImage(imagePath) {
    try {
        const text = await tesseract.recognize(imagePath, config);
        return text.toLowerCase();
    } catch (err) {
        console.log('OCR Error:', err);
        return '';
    }
}

function extractNumbers(text) {
    // Kuramo imibare yose iri ku ifoto
    const numbers = text.replace(/\s/g, '').match(/\d{6,}/g) || [];
    return numbers;
}

function checkIfMatches(ocrText, userInfo) {
    const results = {
        id_card_found: false,
        full_name_found: false,
        matchCount: 0,
        totalChecks: 2
    };

    // Genzura nimero y'indangamuntu (16 digits)
    const cleanOcr = ocrText.replace(/\s/g, '').replace(/[^0-9a-z]/g, '');
    const idCard = userInfo.id_card.trim();

    // Genzura niba nimero yose iri muri OCR text
    if (cleanOcr.includes(idCard)) {
        results.id_card_found = true;
        results.matchCount++;
    }

    // Genzura niba igice cy'indangamuntu (nibura imibare 8 ya mbere) iri muri OCR
    const idPart = idCard.substring(0, 8);
    if (cleanOcr.includes(idPart)) {
        results.id_card_found = true;
        if (results.matchCount === 0) results.matchCount++;
    }

    // Genzura amazina
    const nameParts = userInfo.full_name.toLowerCase().split(' ');
    const nameFound = nameParts.some(part => part.length > 2 && ocrText.includes(part));
    if (nameFound) {
        results.full_name_found = true;
        results.matchCount++;
    }

    return results;
}

module.exports = { extractTextFromImage, checkIfMatches };
