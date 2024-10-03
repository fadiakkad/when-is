import { Swal } from "sweetalert2";
import { blogTextStyle } from "../common/constants";
import { styles } from "./styles";
import { parseExcelDate } from "./AdminPanel";

export const renderCountryCards = (filteredData, activeTab) => {
  return filteredData.length === 0 ? (
    <p>
      No {activeTab === "edit-country-articles" ? "Country articles found" : ""}
    </p>
  ) : (
    filteredData.map(
      ({
        Conclusion,
        CountDown,
        date,
        EventName,
        Helmet_Description,
        Helmet_Keywords,
        ImageURL,
        Importance,
        LastUpdated,
        Preparation,
        TargetDate,
        TextBelowTitle,
        Title,
        TitleInternal,
        URL,
        WhatIs,
        countryCode,
        isHoliday,
        link,
        linkTitle,
      }) => (
        <div key={countryCode} style={styles.card}>
          <h3 style={{ ...styles.cardTitle, ...blogTextStyle, color: "black" }}>
            Title: {Title}
          </h3>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            TitleInternal: {TitleInternal}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            TextBelowTitle: {TextBelowTitle}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            WhatIs: {WhatIs}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            Preparation: {Preparation}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            Importance: {Importance}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            Conclusion: {Conclusion}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            Helmet_Description: {Helmet_Description}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            Helmet_Keywords: {Helmet_Keywords}
          </p>

          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            URL: {URL}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            ImageURL: {ImageURL}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            TargetDate: {TargetDate}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            LastUpdated: {parseExcelDate(LastUpdated)}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            EventName: {EventName}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            CountDown: {CountDown}
          </p>

          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            Country Code: {countryCode}
          </p>
          {/* <a href={`/ar/countdown/${id}`} style={{ color: "#18678d" }}>
              Link to countdown
            </a> */}

          <p style={{ ...styles.cardDate }}>{parseExcelDate(LastUpdated)}</p>
          <div style={styles.actions}>
            {/* <button
              onClick={() => {
                // setSelectedId(id);
                setTitle(title);
                setDescription(description);

                // const dateObj = new Date(date.seconds * 1000);
                // setDate(dateObj.toISOString().split("T")[0]);
                // setTime(dateObj.toTimeString().split(" ")[0]);
                setIsCountryModalOpen(true);
              }}
              style={styles.editButton}
            >
              Edit
            </button> */}
            <button
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#18678d",
                  cancelButtonColor: "#d9534f",
                  confirmButtonText: "Yes, delete it!",
                });
                //     .then((result) => {
                //   if (result.isConfirmed) {
                //     handleDelete(countryCode).then(() => {
                //       Swal.fire({
                //         title: "Deleted!",
                //         text: "Countdown has been deleted.",
                //         icon: "success",
                //         confirmButtonColor: "#18678d",
                //       });
                //     });
                //   }
                // });
              }}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        </div>
      )
    )
  );
};
