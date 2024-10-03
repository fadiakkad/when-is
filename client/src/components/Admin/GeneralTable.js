import { Table } from "react-bootstrap";
import { styles } from "./styles";
import { blogTextStyle, generalURL, locale } from "../common/constants";
import { format } from "date-fns";
import { getColorByTargetDate } from "./AdminPanel";

export const renderGeneralTable = (generalData) => {
  if (generalData.length === 0) {
    return <p>No articles available.</p>;
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
            Link
          </th>
        </tr>
      </thead>
      <tbody>
        {generalData.map((article, index) => (
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
              {format(new Date(article.TargetDate), "dd/MM/yyyy")}
            </td>
            <td style={{ ...styles.td, ...blogTextStyle, color: "black" }}>
              <a
                href={`/${locale}/${generalURL}/${article.URL}`}
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
