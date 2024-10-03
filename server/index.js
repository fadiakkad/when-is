const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const XLSX = require("xlsx");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const baseExcelPath = path.join("../client/src/Excel/Data");
const countriesPath = path.join("../client/src/Excel/Data/Countries");

const getCountryFiles = async () => {
  const files = await fs.readdir(countriesPath);
  return files.filter((file) => file.endsWith(".xlsx"));
};
const getGeneralFile = async () => {
  const files = await fs.readdir(baseExcelPath);
  return files.filter((file) => file.endsWith(".xlsx"));
};

app.get("/countries", async (req, res) => {
  try {
    const countryFiles = await getCountryFiles();
    const countries = countryFiles.map((file) => path.basename(file, ".xlsx"));

    const countryData = {};

    for (const file of countryFiles) {
      const countryCode = path.basename(file, ".xlsx");
      const fullPath = path.isAbsolute(file)
        ? file
        : path.join(__dirname, countriesPath, file);

      if (fs.existsSync(fullPath)) {
        console.log("File exists. Proceeding to read.");
        const workbook = XLSX.readFile(fullPath);

        const sheets = workbook.SheetNames;
        const data = {};

        sheets.forEach((sheetName) => {
          data[sheetName] = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          );
        });

        countryData[countryCode] = data;
      } else {
        console.log("File does not exist:", fullPath);
        countryData[countryCode] = { error: "File not found" };
      }
    }

    const combinedData = [];

    for (const countryCode in countryData) {
      const sheets = countryData[countryCode];
      for (const sheetName in sheets) {
        combinedData.push(...sheets[sheetName]);
      }
    }

    res.json({ countries, countryData, combinedData });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving country sheets", error });
  }
});

app.get("/general", async (req, res) => {
  try {
    const generalFilePath = await getGeneralFile();
    const fileToRead = generalFilePath.find(
      (file) => file.endsWith(".xlsx") && !file.startsWith("~$")
    );

    if (!fileToRead) {
      return res.status(404).json({ message: "No valid Excel file found" });
    }

    const filePath = path.join(__dirname, baseExcelPath, fileToRead);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    res.json({ data: sheetData });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving general sheet", error });
  }
});

app.post("/general", async (req, res) => {
  try {
    const generalFilePath = path.join(baseExcelPath, "General.xlsx");
    const updatedData = req.body.data;

    if (!fs.existsSync(generalFilePath)) {
      return res.status(404).json({ message: "General file not found" });
    }

    const workbook = XLSX.readFile(generalFilePath);
    const sheetName = workbook.SheetNames[0];

    const newSheet = XLSX.utils.json_to_sheet(updatedData);
    workbook.Sheets[sheetName] = newSheet;
    XLSX.writeFile(workbook, generalFilePath);

    return res.json({ message: "General file updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating the file", error });
  }
});

app.delete("/country_articles", async (req, res) => {
  try {
    const { countryCode, id } = req.body;
    const filePath = path.join(
      __dirname,
      countriesPath,
      `${countryCode.toLowerCase()}.xlsx`
    );
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Country file not found" });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const updatedSheetData = sheetData.filter((row) => row.ID !== id);

    if (updatedSheetData.length === sheetData.length) {
      return res.status(404).json({ message: "Article not found" });
    }

    const newSheet = XLSX.utils.json_to_sheet(updatedSheetData);
    workbook.Sheets[sheetName] = newSheet;

    XLSX.writeFile(workbook, filePath);

    return res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting article", error });
  }
});

app.put("/country_articles", async (req, res) => {
  try {
    const { countryCode, id, data } = req.body;
    const filePath = path.join(
      __dirname,
      countriesPath,
      `${countryCode.toLowerCase()}.xlsx`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Country file not found" });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let articleFound = false;
    const updatedSheetData = sheetData.map((row) => {
      if (row.ID === id) {
        articleFound = true;
        return { ...row, ...data };
      }
      return row;
    });

    if (!articleFound) {
      return res.status(404).json({ message: "Article not found" });
    }

    const newSheet = XLSX.utils.json_to_sheet(updatedSheetData);
    workbook.Sheets[sheetName] = newSheet;

    XLSX.writeFile(workbook, filePath);

    return res.json({ message: "Article updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating article", error });
  }
});

app.put("/general_articles", async (req, res) => {
  try {
    const { id, data } = req.body;
    const generalFilePath = await getGeneralFile();
    const fileToRead = generalFilePath.find(
      (file) => file.endsWith(".xlsx") && !file.startsWith("~$")
    );

    if (!fileToRead) {
      return res.status(404).json({ message: "No valid Excel file found" });
    }

    const filePath = path.join(__dirname, baseExcelPath, fileToRead);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let articleFound = false;
    const updatedSheetData = sheetData.map((row) => {
      if (row.ID === id) {
        articleFound = true;
        return { ...row, ...data };
      }
      return row;
    });

    if (!articleFound) {
      return res.status(404).json({ message: "Article not found" });
    }

    const newSheet = XLSX.utils.json_to_sheet(updatedSheetData);
    workbook.Sheets[sheetName] = newSheet;

    XLSX.writeFile(workbook, filePath);

    return res.json({ message: "Article updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating article", error });
  }
});

app.delete("/general_articles", async (req, res) => {
  try {
    const { id } = req.body;
    const generalFilePath = await getGeneralFile();
    const fileToRead = generalFilePath.find(
      (file) => file.endsWith(".xlsx") && !file.startsWith("~$")
    );

    if (!fileToRead) {
      return res.status(404).json({ message: "No valid Excel file found" });
    }

    const filePath = path.join(__dirname, baseExcelPath, fileToRead);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const updatedSheetData = sheetData.filter((row) => row.ID !== id);

    if (updatedSheetData.length === sheetData.length) {
      return res.status(404).json({ message: "Article not found" });
    }

    const newSheet = XLSX.utils.json_to_sheet(updatedSheetData);
    workbook.Sheets[sheetName] = newSheet;

    XLSX.writeFile(workbook, filePath);

    return res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting article", error });
  }
});

app.post("/country_articles", async (req, res) => {
  try {
    const { countryCode, article } = req.body;

    const filePath = path.join(
      __dirname,
      countriesPath,
      `${countryCode.toLowerCase()}.xlsx`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Country file not found" });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const excelDate = Math.floor(
      (new Date(article.LastUpdated).getTime() -
        new Date("1900-12-30").getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const newArticle = {
      ID: sheetData.length ? sheetData[sheetData.length - 1].ID + 1 : 1,
      TitleInternal: article.TitleInternal || "",
      Title: article.Title || "",
      ImageURL: article.ImageURL || "",
      LastUpdated: excelDate,
      Date: article.Date || "",
      URL: article.URL || "",
      EventName: article.EventName || "",
      TargetDate: article.TargetDate || "",
      TextBelowTitle: article.TextBelowTitle || "",
      CountDown: article.CountDown || "",
      WhatIs: article.WhatIs || "",
      Importance: article.Importance || "",
      Preparation: article.Preparation || "",
      Conclusion: article.Conclusion || "",
      Helmet_Description: article.Helmet_Description || "",
      Helmet_Keywords: article.Helmet_Keywords || "",
      countryCode: countryCode || "",
      isHoliday: article.isHoliday || false,
      link: article.link || "",
      linkTitle: article.linkTitle || "",
    };

    sheetData.push(newArticle);

    const newSheet = XLSX.utils.json_to_sheet(sheetData);
    workbook.Sheets[sheetName] = newSheet;

    XLSX.writeFile(workbook, filePath);

    return res.json({
      message: "Country article created successfully",
      article,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating country article", error });
  }
});

app.post("/general_articles", async (req, res) => {
  try {
    const generalFilePath = await getGeneralFile();
    const fileToRead = generalFilePath.find(
      (file) => file.endsWith(".xlsx") && !file.startsWith("~$")
    );

    if (!fileToRead) {
      return res.status(404).json({ message: "No valid Excel file found" });
    }

    const filePath = path.join(__dirname, baseExcelPath, fileToRead);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const article = req.body.article;
    const excelDate = Math.floor(
      (new Date(article.LastUpdated).getTime() -
        new Date("1900-12-30").getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const newArticle = {
      ID: sheetData.length ? sheetData[sheetData.length - 1].ID + 1 : 1,
      TitleInternal: article.TitleInternal || "",
      Title: article.Title || "",
      ImageURL: article.ImageURL || "",
      LastUpdated: excelDate,
      Date: article.Date || "",
      URL: article.URL || "",
      EventName: article.EventName || "",
      TargetDate: article.TargetDate || "",
      TextBelowTitle: article.TextBelowTitle || "",
      CountDown: article.CountDown || "",
      WhatIs: article.WhatIs || "",
      Importance: article.Importance || "",
      Preparation: article.Preparation || "",
      Conclusion: article.Conclusion || "",
      Helmet_Description: article.Helmet_Description || "",
      Helmet_Keywords: article.Helmet_Keywords || "",
      isHoliday: article.isHoliday || false,
      link: article.link || "",
      linkTitle: article.linkTitle || "",
    };

    sheetData.push(newArticle);

    const newSheet = XLSX.utils.json_to_sheet(sheetData);
    workbook.Sheets[sheetName] = newSheet;

    XLSX.writeFile(workbook, filePath);

    return res.json({
      message: "General article created successfully",
      article: newArticle,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating general article", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
