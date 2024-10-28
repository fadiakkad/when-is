import { read, utils } from "xlsx";
import { countryNames } from "../components/Ar/countries/CountriesNamesCodes.js";
import { importAllImages } from "./importImages.js";

const images = importAllImages(
  require.context("../images", false, /\.(png|jpe?g|webp)$/)
);

export const fetchGeneralData = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(sheet);
    const parsedData = jsonData.map((row, index) => ({
      cardNumber: index + 1,
      cardTitle: row.Title,
      cardImg: images[row.ImageURL],
      url: row.URL,
      targetDate: row.TargetDate,
      lastmod: row.LastUpdated,
    }));
    return { parsedData };
  } catch (error) {
    console.error("Error loading general data:", error);
    return [];
  }
};
console.log("you are in readExcel.js");
export const fetchCountryFlags = async () => {
  const allCountriesData = [];
  const combinedJsonData = [];
  for (const countryCode in countryNames) {
    if (countryNames.hasOwnProperty(countryCode)) {
      try {
        const excelFile = await import(
          `../Excel/Data/Countries/${countryCode}.xlsx`
        );
        const response = await fetch(excelFile.default);
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(sheet);
        combinedJsonData.push(...jsonData);

        jsonData.forEach(() => {
          const parsedCountryData = {
            name: countryNames[countryCode],
            countryCode: countryCode,
            url: countryCode,
          };
          const existingCountry = allCountriesData.find(
            (data) => data.countryCode === parsedCountryData.countryCode
          );

          if (!existingCountry) {
            allCountriesData.push(parsedCountryData);
          }
        });
      } catch (error) {
        console.error(
          `Error loading data for ${countryNames[countryCode]}:`,
          error
        );
      }
    }
  }
  return {
    allCountriesData,
    combinedJsonData,
  };
};

export const fetchAllData = async (filePath) => {
  try {
    const [generalData, countryFlags] = await Promise.all([
      fetchGeneralData(filePath, images),
      fetchCountryFlags(),
    ]);
    const combinedData = {
      generalData,
      countryFlags,
    };

    return combinedData;
  } catch (error) {
    console.error("Error fetching all data:", error);
    return { generalData: [], countryFlags: [] };
  }
};
