import fs from "fs";

export function readData(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf8");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`❌ Read file error (${filePath}):`, err);
    return [];
  }
}

export function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`❌ Write file error (${filePath}):`, err);
  }
}
