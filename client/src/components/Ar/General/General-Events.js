import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { read, utils } from "xlsx";
import articlesSheet from "../../../Excel/Data/General.xlsx";
import { importAllImages } from "../../../helpers/importImages.js";
import {
  websiteURL
} from "../../common/constants.js";
import { LoadingSpinner } from "../../common/LoadingSpinner.js";
const SharedArticlePage = lazy(() => import("../../common/SharedArticlePage.js"));

const images = importAllImages(
  require.context("../../../images", false, /\.(png|jpe?g|webp)$/)
);
let sheet = "";
const ArticlePage = () => {
  const { articleSlug } = useParams();
  const [article, setArticle] = useState(null);

  const loadExcelData = async () => {
    const response = await fetch(articlesSheet);
    const blob = await response.blob();
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      sheet = utils.sheet_to_json(workbook.Sheets[sheetName]);
      const articleData = sheet.find((row) => row.URL === articleSlug);
      setArticle(articleData);
    };

    fileReader.readAsArrayBuffer(blob);
  };

  useEffect(() => {
    loadExcelData();
  }, [articleSlug]);

  if (!article) {
    return <p>المقال غير موجود</p>;
  }

  const {
    Title,
    ImageURL,
    LastUpdated,
    TextBelowTitle,
    CountDown,
    EventName,
    WhenIs,
    WhatIs,
    Importance,
    Preparation,
    Conclusion,
    TargetDate,
    Helmet_Description,
    Helmet_Keywords,
    link,
    linkTitle,
  } = article;



  const OG_URL = `${websiteURL}/${articleSlug}`;
  const contentType = "article";
  const DescriptionForStructuredData = `من خلال هذه المقالة, يمكنكم معرفة  ${Title} .كما أيضاً تعرض لكم هذه المقالة العد التنازلي ل ${EventName} بالأشهر والأسابيع والأيام والساعات. وستجدون أيضاً المصادر التي تم الاعتماد عليها في هذا المقال من أجل معرفة موعد ${EventName} بالتفصيل.`;
  const FullImageURL = `${websiteURL}${images[ImageURL]}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": EventName,
    "startDate": TargetDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "url": OG_URL
    },
    "image": FullImageURL, 
    "description": DescriptionForStructuredData,
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": Title,
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
        Title={Title}
        ImageURL={images[ImageURL]}
        LastUpdated={LastUpdated}
        TextBelowTitle={TextBelowTitle}
        CountDown={CountDown}
        EventName={EventName}
        WhatIs={WhatIs}
        WhenIs={WhenIs}
        Importance={Importance}
        Preparation={Preparation}
        Conclusion={Conclusion}
        TargetDate={TargetDate}
        Helmet_Description={Helmet_Description}
        Helmet_Keywords={Helmet_Keywords}
        OG_URL={OG_URL}
        images={images}
        LatestArticlesData={sheet}
        link={link}
        linkTitle={linkTitle}
        taxonomyTerms={Helmet_Keywords}
        contentType={contentType}
        pageTitle={Title}
        articleSlug={articleSlug}
        structuredData={fullStructuredData}

      />
    </Suspense>
  );
};

export default ArticlePage;
