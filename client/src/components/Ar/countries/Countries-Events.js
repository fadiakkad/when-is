import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { read, utils } from "xlsx";
import { importAllImages } from "../../../helpers/importImages.js";
import { websiteURL } from "../../common/constants.js";
import { LoadingSpinner } from "../../common/LoadingSpinner.js";
import { countryNames } from "./CountriesNamesCodes.js";
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
  }, [countryCode, url]);

  useEffect(() => {
  });

  if (!cardData) {
    return <p>المقال غير موجود</p>;
  }
  const OG_URL = `${websiteURL}/countries/${countryCode}/${url}/`;
  const contentType = "article";
  const DescriptionForStructuredData = `من خلال هذه المقالة، يمكنكم معرفة ${cardData.cardTitle} في ${countryNames[countryCode]}. كما تعرض لكم هذه المقالة العد التنازلي لـ ${cardData.EventName} بالأشهر والأسابيع والأيام والساعات. وستجدون أيضاً المصادر التي تم الاعتماد عليها في هذا المقال من أجل معرفة موعد ${cardData.EventName} بالتفصيل.`;
  const FullImageURL = `${websiteURL}${images[cardData.cardImg]}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": cardData.EventName,
    "startDate": cardData.TargetDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "url": OG_URL 
    },
    "image": FullImageURL, // The image of the event
    "description": DescriptionForStructuredData,
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": cardData.Title,
    "image": FullImageURL,
    "description": DescriptionForStructuredData,
    "author": {
      "@type": "Organization",
      "name": "مواعيد"
    },
    "publisher": {
      "@type": "Organization",
      "name": "مواعيد",
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": OG_URL
    }
  };
  const fullStructuredData = [structuredData, articleStructuredData];

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SharedArticlePage
        Title={cardData.cardTitle}
        ImageURL={images[cardData.cardImg]}
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
        taxonomyTerms={cardData.Helmet_Keywords}
        contentType={contentType}
        pageTitle={cardData.cardTitle}
        articleSlug={url}
        where={countryNames[countryCode]}
        structuredData={fullStructuredData}
      />
    </Suspense>
  );
};

export default ArticlePage;
