const fs = require('fs');
const path = require('path');

const __dirname_manual = __dirname; // CommonJS has __dirname

const sizes = [16, 48, 128];
const assetsDir = path.join(__dirname_manual, 'src/assets');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Simple transparent PNG with a dot (base64)
const png1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

sizes.forEach(size => {
    fs.writeFileSync(path.join(assetsDir, `icon${size}.png`), png1x1);
});

console.log('Generated placeholder icons in src/assets.');
