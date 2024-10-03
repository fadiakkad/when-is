import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { read, utils } from "xlsx";
import { importAllImages } from "../../../helpers/importImages.js";
import { websiteURL, countriesURL, locale } from "../../common/constants.js";
import { LoadingSpinner } from "../../common/LoadingSpinner.js";

const SharedArticlePage = lazy(() =>
  import("../../common/SharedArticlePage.js")
);

const images = importAllImages(
  require.context("../../../images", false, /\.(png|jpe?g|webp)$/)
);
let jsonData = "";
const ArticlePage = () => {
  const { countryCode, url } = useParams();
  const [cardData, setCardData] = useState(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        if (countryCode) {
          const excelFile = await import(
            `../../../Excel/Data/Countries/${countryCode}.xlsx`
          );
          const response = await fetch(excelFile.default);
          const arrayBuffer = await response.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);
          const workbook = read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonData = utils.sheet_to_json(sheet);
          const matchedRow = jsonData.find((row) => row.URL === url);

          if (matchedRow) {
            const parsedData = {
              cardTitle: matchedRow.Title,
              cardImg: matchedRow.ImageURL,
              url: matchedRow.URL,
              intro: matchedRow.Intro,
              whatIs: matchedRow.WhatIs,
              importance: matchedRow.Importance,
              preparation: matchedRow.Preparation,
              conclusion: matchedRow.Conclusion,
              targetDate: matchedRow.TargetDate,
              LastUpdated: matchedRow.LastUpdated,
              BelowTitle: matchedRow.TextBelowTitle,
              CountDown: matchedRow.CountDown,
              Helmet_Description: matchedRow.Helmet_Description,
              Helmet_Keywords: matchedRow.Helmet_Keywords,
              EventName: matchedRow.EventName,
              link: matchedRow.link,
              linkTitle: matchedRow.linkTitle,
            };
            setCardData(parsedData);
          } else {
            console.error("No matching article found.");
          }
        } else {
          console.error("Country code is not defined.");
        }
      } catch (error) {
        console.error("Error loading card data:", error);
      }
    };

    fetchCardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode, url]);

  useEffect(() => {
    console.log("cardData: ", cardData);
  });

  if (!cardData) {
    return <p>المقال غير موجود</p>;
  }
  const OG_URL = `${websiteURL}/${locale}/${countriesURL}/${countryCode}/${url}`;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SharedArticlePage
        Title={cardData.cardTitle}
        ImageURL={cardData.cardImg}
        LastUpdated={cardData.LastUpdated}
        TextBelowTitle={cardData.BelowTitle}
        CountDown={cardData.CountDown}
        EventName={cardData.EventName}
        Intro={cardData.intro}
        WhatIs={cardData.whatIs}
        Importance={cardData.importance}
        Preparation={cardData.preparation}
        Conclusion={cardData.conclusion}
        TargetDate={cardData.targetDate}
        Helmet_Description={cardData.Helmet_Description}
        Helmet_Keywords={cardData.Helmet_Keywords}
        OG_URL={OG_URL}
        images={images}
        LatestArticlesData={jsonData}
        countryCode={countryCode}
        link={cardData.link}
        linkTitle={cardData.linkTitle}
      />
    </Suspense>
  );
};

export default ArticlePage;
