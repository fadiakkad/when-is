import { getColorByTargetDate } from "./AdminPanel";
import { countryNames } from "../Ar/countries/CountriesNamesCodes.js";
import { format } from "date-fns";
import { blogTextStyle } from "../common/constants";
import { styles } from "./styles";
import { Table } from "react-bootstrap";

export const renderCountriesTable = (filteredData) => {
  if (filteredData.length === 0) {
    return <p>No articles available for the selected country.</p>;
  }
  return (
    <Table striped bordered hover style={styles.table}>
      <thead>
        <tr>
          <th style={{ ...styles.th, ...blogTextStyle, color: "black" }}>
            Title
          </th>
          <th style={{ ...styles.th, ...blogTextStyle, color: "black" }}>
            Target Date
          </th>
          <th style={{ ...styles.th, ...blogTextStyle, color: "black" }}>
            Country Name
          </th>
          <th style={{ ...styles.th, ...blogTextStyle, color: "black" }}>
            Country Code
          </th>
          <th style={{ ...styles.th, ...blogTextStyle, color: "black" }}>
            Link
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((article, index) => (
          <tr key={index}>
            <td style={{ ...styles.td, ...blogTextStyle, color: "black" }}>
              {article.Title}
            </td>
            <td
              style={{
                ...styles.td,
                ...blogTextStyle,
                color: "black",
                backgroundColor: getColorByTargetDate(article.TargetDate),
              }}
            >
              {article.TargetDate
                ? format(new Date(article.TargetDate), "dd/MM/yyyy")
                : ""}
            </td>
            <td style={{ ...styles.td, ...blogTextStyle, color: "black" }}>
              {countryNames[article.countryCode]}
            </td>
            <td style={{ ...styles.td, ...blogTextStyle, color: "black" }}>
              {article.countryCode}
            </td>
            <td style={{ ...styles.td, ...blogTextStyle, color: "black" }}>
              <a
                href={`/${article.countryCode}/${article.URL}`}
                style={{ ...blogTextStyle }}
              >
                {article.Title}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
