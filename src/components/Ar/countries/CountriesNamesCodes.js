export const countryNames = {
  sy: "سوريا",
  sa: "السعودية",
  ae: "الإمارات",
  bh: "البحرين",
  dz: "الجزائر",
  eg: "مصر",
  iq: "العراق",
  jq: "الأردن",
  kw: "الكويت",
  lb: "لبنان",
  ly: "ليبيا",
  ma: "المغرب",
  om: "عمان",
  ps: "فلسطين",
  qa: "قطر",
  sd: "السودان",
  tn: "تونس",
  ye: "اليمن",
};
const files = require.context(
  "../../../Excel/Data/Countries",
  false,
  /\.xlsx$/
); 

export const countries = files.keys().map((file) => {
  const countryCode = file.replace("./", "").replace(".xlsx", "");

  const name = countryNames[countryCode];

  const data = files(file);

  return {
    name,
    data,
    countryCode,
  };
});
