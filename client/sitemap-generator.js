const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const { read, utils } = require("xlsx");
const path = require("path");

const countryNames = {
  sy: "سوريا",
  sa: "السعودية",
  eg: "مصر",
  // ae: "الإمارات",
  // bh: "البحرين",
  // dz: "الجزائر",
  // iq: "العراق",
  // jq: "الأردن",
  // kw: "الكويت",
  // lb: "لبنان",
  // ly: "ليبيا",
  // ma: "المغرب",
  // om: "عمان",
  // ps: "فلسطين",
  // qa: "قطر",
  // sd: "السودان",
  // tn: "تونس",
  // ye: "اليمن",
};

const websiteURL = "https://when-is.com";

const parseExcelDate = (serial) => {
  const excelEpoch = new Date(1899, 11, 30);
  const daysOffset = serial - 1;
  const date = new Date(
    excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000
  );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const fullDate = `${year}-${month}-${day}`.split("T")[0];
  return fullDate;
};

const fetchGeneralData = (filePath) => {
  const workbook = read(filePath, { type: "file" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = utils.sheet_to_json(sheet);
  return jsonData.map((row) => ({
    url: row.URL || row.url,
    lastmod: parseExcelDate(row.LastUpdated),
  }));
};

const fetchCountryFlags = () => {
  const allCountriesData = [];
  const combinedJsonData = [];

  const countryCodes = Object.keys(countryNames);
  return Promise.all(
    countryCodes.map(async (countryCode) => {
      try {
        const excelFilePath = path.join(
          __dirname,
          `./src/Excel/Data/Countries/${countryCode}.xlsx`
        );
        const workbook = read(excelFilePath, { type: "file" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(sheet);
        combinedJsonData.push(...jsonData);

        jsonData.forEach(() => {
          const parsedCountryData = {
            name: countryNames[countryCode],
            countryCode: countryCode,
            url: countryCode,
          };
          if (
            !allCountriesData.find(
              (data) => data.countryCode === parsedCountryData.countryCode
            )
          ) {
            allCountriesData.push(parsedCountryData);
          }
        });
      } catch (error) {
        console.error(
          `Error loading data for ${countryNames[countryCode]}:`,
          error
        );
      }
    })
  ).then(() => ({
    allCountriesData,
    combinedJsonData,
  }));
};

async function generateSitemap() {
  const generalDataFilePath = path.join(
    __dirname,
    "./src/Excel/Data/General.xlsx"
  );
  const generalRoutes = fetchGeneralData(generalDataFilePath);

  const { combinedJsonData } = await fetchCountryFlags();

  const routes = [
    ...generalRoutes,
    ...combinedJsonData.map((row) => ({
      url: row.URL || row.url,
      lastmod: parseExcelDate(row.LastUpdated),
    })),
  ];
  console.log("routes: ", routes);

  const sitemapPath = path.join(__dirname, "public", "sitemap.xml");
  const writeStream = createWriteStream(sitemapPath);

  const smStream = new SitemapStream({ hostname: websiteURL });

  smStream.pipe(writeStream);

  routes.forEach((route) => {
    smStream.write({
      url: route.url,
      lastmod: route.lastmod,
    });
  });

  smStream.end();

  await streamToPromise(smStream);

  console.log("Sitemap successfully generated at public/sitemap.xml");
}

generateSitemap().catch(console.error);
