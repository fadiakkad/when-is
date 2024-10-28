const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const websiteURL = "https://maw3eed.com";
const countryCodes = ['sy', 'sa', 'eg', 'ae', 'dz', 'iq', 'jo', 'kw', 'sd'];
const generalFilePath = path.join(__dirname, './src/Excel/Data/General.xlsx');
const sitemapFilePath = path.join(__dirname, 'public/sitemap.xml');

// Manually added URLs with last modified date
const manualUrls = [
  { url: `${websiteURL}/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/عن_مواعيد/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/اتصل_بنا/`, lastmod: '2024-10-28' },
  { url: `${websiteURL}/الخصوصية/`, lastmod: '2024-10-28' },
  { url: `${websiteURL}/مناسبات_عامة/`, lastmod: '2024-10-28' },
  { url: `${websiteURL}/انشاء_عد_تنازلي/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/sy/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/sa/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/eg/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/ae/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/dz/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/iq/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/jo/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/kw/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/sd/جميع_المناسبات/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/sy/العطل_القادمة/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/sa/العطل_القادمة/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/eg/العطل_القادمة/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/ae/العطل_القادمة/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/dz/العطل_القادمة/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/iq/العطل_القادمة/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/jo/العطل_القادمة/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/kw/العطل_القادمة/`, lastmod: '2024-10-28' }, 
  { url: `${websiteURL}/countries/sd/العطل_القادمة/`, lastmod: '2024-10-28' }, 
];

function formatExcelDate(dateString) {
  if (typeof dateString === 'string') {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const ddMmYyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (isoDateRegex.test(dateString)) {
      return dateString;
    } else if (ddMmYyyyRegex.test(dateString)) {
      const parts = dateString.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toISOString().split('T')[0];
    }
  } else if (typeof dateString === 'number') {
    const date = xlsx.SSF.parse_date_code(dateString);
    return new Date(date.y, date.m - 1, date.d).toISOString().split('T')[0];
  }

  console.warn(`Invalid date format: ${dateString}`);
  return new Date().toISOString().split('T')[0];
}

// Function to read data from the country-specific Excel files
function readCountryExcelData(countryCode) {
  const filePath = path.join(__dirname, `./src/Excel/Data/Countries/${countryCode}.xlsx`);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  return jsonData.map(row => ({
    lastUpdated: formatExcelDate(row.LastUpdated),
    url: row.URL,
    countryCode: row.countryCode
  }));
}

// Function to read data from the General Excel file
function readGeneralExcelData() {
  const workbook = xlsx.readFile(generalFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  return jsonData.map(row => ({
    lastUpdated: formatExcelDate(row.LastUpdated),
    url: row.URL // No country code in this case
  }));
}

// Function to generate the sitemap
function generateSitemap() {
  let urls = [];

  // Add manual URLs with last modified date
  manualUrls.forEach(manualUrl => {
    const encodedUrl = encodeURIComponent(manualUrl.url);
    const fullUrl = `${websiteURL}/${encodedUrl}`; // URL-encode the path
    urls.push({
      loc: fullUrl,
      lastmod: manualUrl.lastmod 
    });
  });

  // Process general URLs
  const generalData = readGeneralExcelData();
  generalData.forEach(row => {
    const encodedUrl = encodeURIComponent(row.url);
    const fullUrl = `${websiteURL}/${encodedUrl}/`;
    urls.push({
      loc: fullUrl,
      lastmod: formatExcelDate(row.lastUpdated) || new Date().toISOString() 
    });
  });

  // Process country-specific URLs
  countryCodes.forEach(countryCode => {
    const data = readCountryExcelData(countryCode);
    data.forEach(row => {
      const encodedUrl = encodeURIComponent(row.url);
      const fullUrl = `${websiteURL}/countries/${row.countryCode}/${encodedUrl}/`;
      urls.push({
        loc: fullUrl,
        lastmod: formatExcelDate(row.lastUpdated) || new Date().toISOString() // Use lastUpdated from Excel or current date
      });
    });
  });

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-image/1.1">
    ${urls.map(({ loc, lastmod }) => `
    <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
    </url>`).join('')}
</urlset>`;

  fs.writeFileSync(sitemapFilePath, sitemap);
  console.log(`Sitemap has been generated at ${sitemapFilePath}`);
}

// Run the sitemap generator
generateSitemap();
