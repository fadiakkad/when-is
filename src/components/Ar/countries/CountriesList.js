const countryNames = {
  SY: "سوريا",
  SA: "السعودية",
  AE: "الإمارات",
  BH: "البحرين",
  DZ: "الجزائر",
  EG: "مصر",
  IQ: "العراق",
  JO: "الأردن",
  KW: "الكويت",
  LB: "لبنان",
  LY: "ليبيا",
  MA: "المغرب",
  OM: "عمان",
  PS: "فلسطين",
  QA: "قطر",
  SD: "السودان",
  TN: "تونس",
  YE: "اليمن",
};
const files = require.context(
  "../../../Excel/Data/Countries",
  false,
  /\.xlsx$/
);  //TODO: Remove string

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
