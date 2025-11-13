import sharp from "sharp";
import exifr from "exifr";
import fs from "fs";

export async function extractMetadata(path) {
    // Read raw image buffer BEFORE any processing
    let buffer;

    try {
        buffer = fs.readFileSync(path);
    } catch (err) {
        console.error("Error reading file buffer:", err);
        return { exif: {}, sharp: {} };
    }

    // ---------------------
    // EXIF METADATA SECTION
    // ---------------------
    let exif = {};
    try {
        exif = await exifr.parse(buffer) || {};
    } catch (err) {
        console.warn("EXIF parse failed:", err);
        exif = {};
    }

    // -----------------------
    // SHARP METADATA SECTION
    // -----------------------
    let sharpMeta = {};
    try {
        sharpMeta = await sharp(buffer).metadata();
    } catch (err) {
        console.warn("Sharp metadata failed:", err);
        sharpMeta = {};
    }

    return {
        exif,
        sharp: sharpMeta
    };
}
