import { Helmet, HelmetProvider } from "react-helmet-async";
function SharedHelmet({
  TITLE,
  DESCRIPTION,
  KEYWORDS,
  OG_URL,
  IMAGE,
  COUNTRY_CODE,
}) {
  if (!OG_URL.endsWith("/")) {
    OG_URL += "/"; // Add '/' if it does not end with '/'
  }
  IMAGE = IMAGE ? "" + IMAGE : null;
  return (
    <HelmetProvider>
      <Helmet
        onChangeClientState={(newState) => {
          const metaDescription = document.querySelector(
            'meta[name="description"]'
          );
          if (metaDescription) {
            metaDescription.setAttribute("content", DESCRIPTION || "");
          }
          const metaKeywords = document.querySelector('meta[name="keywords"]');
          if (metaKeywords) {
            metaKeywords.setAttribute("content", KEYWORDS || "");
          }
          const metaOG_URL = document.querySelector('meta[property="og:url"]');
          if (metaOG_URL) {
            metaOG_URL.setAttribute("content", OG_URL || "");
          }

          const metaOG_Title = document.querySelector(
            'meta[property="og:title"]'
          );
          if (metaOG_Title) {
            metaOG_Title.setAttribute("content", TITLE || "");
          }
          const metaOG_CountryCode = document.querySelector(
            'meta[property="og:countryCode"]'
          );
          if (metaOG_CountryCode) {
            metaOG_CountryCode.setAttribute("content", COUNTRY_CODE || "");
          }
          const metaOG_Image = document.querySelector(
            'meta[property="og:image"]'
          );
          if (metaOG_Image && IMAGE) {
            metaOG_Image.setAttribute("content", IMAGE || "");
          }
          const CANONICAL_URL = document.querySelector('link[rel="canonical"]');
          if (CANONICAL_URL) {
            CANONICAL_URL.setAttribute("href", OG_URL || "");
          }
        }}
      >
        <title>{TITLE}</title>
        {IMAGE && <link rel="preload" href={IMAGE} as="image" />}
      </Helmet>
    </HelmetProvider>
  );
}
export default SharedHelmet;
