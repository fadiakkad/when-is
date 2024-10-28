import { Helmet, HelmetProvider } from "react-helmet-async";
import { websiteURL } from "./constants";
function SharedHelmet({
  TITLE,
  DESCRIPTION,
  KEYWORDS,
  OG_URL,
  IMAGE,
  IMAGES_PRELOAD = [],
  COUNTRY_CODE,
  structuredData,
  isNotIndexed,
  taxonomyTerms, 
  contentType,
  pageTitle,
  articleSlug,
  where   
}) {
  if (!OG_URL.endsWith("/")) {
    OG_URL += "/"; 
  }
  const MAIN_IMAGES_PRELOAD = IMAGE
  IMAGE = IMAGE ? "" + `${websiteURL}${IMAGE}` : null;

  const langAttribute = COUNTRY_CODE ? `ar-${COUNTRY_CODE}` : "ar";

  return (
    <HelmetProvider>
      <Helmet>
        <html lang={langAttribute} dir="rtl" />
        <title>{TITLE}</title>
        {MAIN_IMAGES_PRELOAD && <link rel="preload" href={MAIN_IMAGES_PRELOAD} as="image" />}
        {IMAGES_PRELOAD.map((image, index) => (
          <link key={index} rel="preload" href={image} as="image" />
        ))}
        <meta name="description" content={DESCRIPTION || ""} />
        <meta property="og:description" content={DESCRIPTION || ""} />
        <meta name="keywords" content={KEYWORDS || ""} />
        <meta property="og:url" content={OG_URL || ""} />
        <meta property="og:title" content={TITLE || ""} />
        {IMAGE && <meta property="og:image" content={IMAGE || ""} />}

        <link rel="canonical" href={OG_URL || ""} />

        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION || ""} />
        {IMAGE && <meta name="twitter:image" content={IMAGE || ""} />}

        {taxonomyTerms && <meta name="taxonomyTerms" content={taxonomyTerms} />}
        {contentType && <meta name="contentType" content={contentType} />}
        {pageTitle && <meta name="pageTitle" content={pageTitle} />}
        {articleSlug && <meta name="articleSlug" content={articleSlug} />}
        {where && <meta name="where" content={where} />}

        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
        {isNotIndexed && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
    </HelmetProvider>

  );
}
export default SharedHelmet;
