import React, { useState, useEffect, lazy } from "react";
import { useParams } from "react-router-dom";
import { read, utils } from "xlsx";
import articlesSheet from "../../../Excel/Data/General.xlsx";
import { importAllImages } from "../../../helpers/importImages";
import {
  websiteURL,
  countriesURL,
  locale,
  generalURL,
} from "../../common/constants";

const SharedArticlePage = lazy(() => import("../../common/SharedArticlePage"));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  } = article;
  const OG_URL = `${websiteURL}/${locale}/${countriesURL}/${generalURL}/${articleSlug}`;

  return (
    <SharedArticlePage
      Title={Title}
      ImageURL={ImageURL}
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
    />
  );
};

export default ArticlePage;
