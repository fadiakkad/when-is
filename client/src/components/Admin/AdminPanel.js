import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { fetchCountryFlags } from "../../helpers/readExcel.js";
import { blogTextStyle, countdownURL, locale } from "../common/constants";
import Axios from "../../helpers/Axios.js";
import { styles } from "./styles.js";
import { renderGeneralTable } from "./GeneralTable.js";
import { renderCountriesTable } from "./countriesTable.js";

Modal.setAppElement("#root");
export const parseExcelDate = (serial) => {
  const excelEpoch = new Date(1899, 11, 30);
  const daysOffset = serial - 1;
  const date = new Date(
    excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000
  );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const fullDate = `${year}-${month}-${day}`.split("T")[0];
  return fullDate;
};

export const getColorByTargetDate = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return "red";
  } else if (diffDays <= 7) {
    return "orange";
  } else {
    return "white";
  }
};

const AdminPanel = () => {
  const [user] = useAuthState(auth);
  const [countdowns, setCountdowns] = useState([]);
  const [acceptedCountdowns, setAcceptedCountdowns] = useState([]);
  const [pendingCountdowns, setPendingCountdowns] = useState([]);
  const [articlesData, setArticlesData] = useState([]);
  const [generalData, setGeneralData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryForCards, setSelectedCountryForCards] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedCountryForCreation, setSelectedCountryForCreation] =
    useState("");
  const [newCountryArticle, setNewCountryArticle] = useState({});
  const [newGeneralArticle, setNewGeneralArticle] = useState({});
  const [data, setData] = useState({
    Conclusion: "",
    CountDown: "",
    Date: "",
    EventName: "",
    Helmet_Description: "",
    Helmet_Keywords: "",
    ImageURL: "",
    Importance: "",
    LastUpdated: "",
    Preparation: "",
    TargetDate: "",
    TextBelowTitle: "",
    Title: "",
    TitleInternal: "",
    URL: "",
    WhatIs: "",
    countryCode: "",
    isHoliday: "",
    link: "",
    linkTitle: "",
    ID: "",
  });
  const navigate = useNavigate();

  const handleCreateCountryArticleSubmit = async () => {
    const newArticle = {
      ...newCountryArticle,
      countryCode: selectedCountryForCreation,
    };

    try {
      const response = await Axios.post("/country_articles", {
        countryCode: selectedCountryForCreation,
        article: newArticle,
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Country Article has been created.",
          icon: "success",
          confirmButtonColor: "#18678d",
        }).catch((error) => {
          console.error("Error creating country article", error);
          Swal.fire({
            title: "Error!",
            text: "Could not creating country article.",
            icon: "error",
            confirmButtonColor: "#18678d",
          });
        });
        setNewCountryArticle({});
        setSelectedCountryForCreation("");
      }
    } catch (error) {
      console.error(
        "Error creating country article:",
        error.response?.data || error.message
      );
    }
  };

  const handleCreateGeneralArticleSubmit = async () => {
    const newArticle = { ...newGeneralArticle };

    try {
      const response = await Axios.post("/general_articles", {
        article: newArticle,
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "General Article has been created.",
          icon: "success",
          confirmButtonColor: "#18678d",
        }).catch((error) => {
          console.error("Error creating general article", error);
          Swal.fire({
            title: "Error!",
            text: "Could not creating general article.",
            icon: "error",
            confirmButtonColor: "#18678d",
          });
        });
        setNewGeneralArticle({});
      }
    } catch (error) {
      console.error(
        "Error creating general article:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (user) {
      if (
        !["taiseertello@gmail.com", "docalculate@gmail.com"].includes(
          user.email
        )
      ) {
        navigate("/");
      } else {
        setIsAdmin(true);
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const { allCountriesData } = await fetchCountryFlags();
      await Axios.get("/countries").then((response) => {
        setArticlesData(response.data.combinedData);
        setCountryList(allCountriesData);
      });
    };
    const fetchGeneral = async () => {
      await Axios.get("/general")
        .then((response) => {
          setGeneralData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching general data", error);
        });
    };

    fetchCountriesData();
    fetchGeneral();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryData = articlesData.filter(
        (article) => article.countryCode === selectedCountry
      );
      setFilteredData(countryData);
    } else {
      setFilteredData(articlesData);
    }
  }, [selectedCountry, articlesData]);

  const handleCountryChangeForArticles = (event) => {
    setSelectedCountry(event.target.value);
  };
  const handleCountryChangeForCards = (event) => {
    setSelectedCountryForCards(event.target.value);
  };

  const getCountriesArticlesCount = () => {
    return articlesData.length;
  };
  const getGeneralArticlesCount = () => {
    return generalData.length;
  };

  const getCountryArticlesCount = () => {
    if (selectedCountry) {
      return articlesData.filter(
        (article) => article.countryCode === selectedCountry
      ).length;
    }
    return 0;
  };

  useEffect(() => {
    const fetchCountdowns = async () => {
      const querySnapshot = await getDocs(collection(db, "countdowns"));
      const countdownsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCountdowns(countdownsList);
      setAcceptedCountdowns(countdownsList.filter((item) => item.isAccepted));
      setPendingCountdowns(countdownsList.filter((item) => !item.isAccepted));
    };

    if (isAdmin) {
      fetchCountdowns();
    }
  }, [isAdmin]);

  const handleApprove = async (id) => {
    const countdownRef = doc(db, "countdowns", id);
    await updateDoc(countdownRef, { isAccepted: true });
    Swal.fire("Approved!", "Countdown has been approved.", "success");
    setPendingCountdowns(
      pendingCountdowns.filter((countdown) => countdown.id !== id)
    );
  };

  const handleDelete = async (id) => {
    const countdownRef = doc(db, "countdowns", id);
    await deleteDoc(countdownRef);
    setCountdowns(countdowns.filter((countdown) => countdown.id !== id));
  };

  const handleEditSubmit = async () => {
    const countdownRef = doc(db, "countdowns", selectedId);

    const newDateTime = new Date(`${date}T${time}`);

    await updateDoc(countdownRef, { title, description, date: newDateTime });
    setIsModalOpen(false);
    Swal.fire({
      title: "Success!",
      text: "Countdown has been updated.",
      icon: "success",
      confirmButtonColor: "#18678d",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleDeleteArticle = (id, countryCode) => {
    if (countryCode) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#18678d",
        cancelButtonColor: "#d9534f",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.delete(`/country_articles`, {
            data: { id, countryCode },
          })
            .then((response) => {
              setArticlesData(
                articlesData.filter((article) => article.ID !== id)
              );
              Swal.fire({
                title: "Deleted!",
                text: "Article has been deleted.",
                icon: "success",
                confirmButtonColor: "#18678d",
              });
            })
            .catch((error) => {
              console.error("Error deleting article", error);
              Swal.fire({
                title: "Error!",
                text: "Could not delete article.",
                icon: "error",
                confirmButtonColor: "#18678d",
              });
            });
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#18678d",
        cancelButtonColor: "#d9534f",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.delete(`/general_articles`, {
            data: { id },
          })
            .then((response) => {
              setGeneralData(
                generalData.filter((article) => article.ID !== id)
              );
              Swal.fire({
                title: "Deleted!",
                text: "Article has been deleted.",
                icon: "success",
                confirmButtonColor: "#18678d",
              });
            })
            .catch((error) => {
              console.error("Error deleting article", error);
              Swal.fire({
                title: "Error!",
                text: "Could not delete article.",
                icon: "error",
                confirmButtonColor: "#18678d",
              });
            });
        }
      });
    }
  };

  const handleEditArticleSubmit = (countryCode, id) => {
    if (countryCode) {
      Axios.put(`/country_articles`, {
        countryCode,
        id,
        data,
      })
        .then((response) => {
          setArticlesData(
            articlesData.map((article) => (article.ID === id ? data : article))
          );
          setIsCountryModalOpen(false);
          Swal.fire({
            title: "Success!",
            text: "Article has been updated.",
            icon: "success",
            confirmButtonColor: "#18678d",
          });
        })
        .catch((error) => {
          console.error("Error updating article", error);
          Swal.fire({
            title: "Error!",
            text: "Could not update article.",
            icon: "error",
            confirmButtonColor: "#18678d",
          });
        });
    } else {
      Axios.put(`/general_articles`, {
        id,
        data,
      })
        .then((response) => {
          setGeneralData(
            generalData.map((article) => (article.ID === id ? data : article))
          );
          setIsCountryModalOpen(false);
          Swal.fire({
            title: "Success!",
            text: "Article has been updated.",
            icon: "success",
            confirmButtonColor: "#18678d",
          });
        })
        .catch((error) => {
          console.error("Error updating article", error);
          Swal.fire({
            title: "Error!",
            text: "Could not update article.",
            icon: "error",
            confirmButtonColor: "#18678d",
          });
        });
    }
  };

  const renderCountdowns = (countdownList) => {
    return countdownList.length === 0 ? (
      <p>
        No{" "}
        {activeTab === "accepted"
          ? "accepted countdowns"
          : activeTab === "pending"
          ? "pending countdowns"
          : "Articles"}
      </p>
    ) : (
      countdownList.map(({ id, title, description, date, createdAt }) => (
        <div key={id} style={styles.card}>
          <h3 style={{ ...styles.cardTitle, ...blogTextStyle, color: "black" }}>
            Title: {title}
          </h3>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            Description: {description}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            Date: {new Date(date.seconds * 1000).toLocaleString()}
          </p>
          <p
            style={{
              ...styles.cardDescription,
              ...blogTextStyle,
              color: "black",
            }}
          >
            ID: {id}
          </p>
          <a
            href={`/${locale}/${countdownURL}/${id}`}
            style={{ color: "#18678d" }}
          >
            Link to countdown
          </a>

          <p style={{ ...styles.cardDate }}>
            {new Date(createdAt.seconds * 1000).toLocaleString()}
          </p>
          <div style={styles.actions}>
            {activeTab === "pending" && (
              <button
                onClick={() => {
                  handleApprove(id).then(() => {
                    Swal.fire({
                      title: "Approved!",
                      text: "Countdown has been approved.",
                      icon: "success",
                      confirmButtonColor: "#18678d",
                    });
                  });
                }}
                style={styles.approveButton}
              >
                Approve
              </button>
            )}
            <button
              onClick={() => {
                setSelectedId(id);
                setTitle(title);
                setDescription(description);

                const dateObj = new Date(date.seconds * 1000);
                setDate(dateObj.toISOString().split("T")[0]);
                setTime(dateObj.toTimeString().split(" ")[0]);
                setIsModalOpen(true);
              }}
              style={styles.editButton}
            >
              Edit
            </button>
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
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(id).then(() => {
                      Swal.fire({
                        title: "Deleted!",
                        text: "Countdown has been deleted.",
                        icon: "success",
                        confirmButtonColor: "#18678d",
                      });
                    });
                  }
                });
              }}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        </div>
      ))
    );
  };

  return (
    <>
      {isAdmin ? (
        <div style={styles.dashboard}>
          <div style={styles.sidebar}>
            <h2 style={styles.sidebarTitle}>Admin Panel</h2>
            <p style={styles.welcomeMessage}>
              {isAdmin ? `Welcome, ${user.email}` : "Not authorized."}
            </p>

            <div style={styles.navTabs}>
              <button
                style={activeTab === "accepted" ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab("accepted")}
              >
                Approved Countdowns
              </button>
              <button
                style={activeTab === "pending" ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab("pending")}
              >
                Pending Countdowns
              </button>
              <button
                style={activeTab === "articles" ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab("articles")}
              >
                Articles In Each Country
              </button>
              <button
                style={
                  activeTab === "general-articles"
                    ? styles.activeTab
                    : styles.tab
                }
                onClick={() => setActiveTab("general-articles")}
              >
                General Articles
              </button>
              <button
                style={
                  activeTab === "edit-country-articles"
                    ? styles.activeTab
                    : styles.tab
                }
                onClick={() => setActiveTab("edit-country-articles")}
              >
                Edit Country's Articles
              </button>
              <button
                style={
                  activeTab === "edit-general-articles"
                    ? styles.activeTab
                    : styles.tab
                }
                onClick={() => setActiveTab("edit-general-articles")}
              >
                Edit General Articles
              </button>
              <button
                style={
                  activeTab === "add-general-article"
                    ? styles.activeTab
                    : styles.tab
                }
                onClick={() => setActiveTab("add-general-article")}
              >
                Add General Article
              </button>
              <button
                style={
                  activeTab === "add-country-article"
                    ? styles.activeTab
                    : styles.tab
                }
                onClick={() => setActiveTab("add-country-article")}
              >
                Add Country Article
              </button>
              {isAdmin && (
                <a href="/">
                  <button style={styles.logoutButton} onClick={handleLogout}>
                    Logout
                  </button>
                </a>
              )}
            </div>
          </div>
          <div style={styles.content}>
            <h2 style={styles.title}>
              {activeTab === "accepted"
                ? "Accepted Countdowns"
                : activeTab === "pending"
                ? "Pending Countdowns"
                : activeTab === "articles"
                ? "Articles In Each Country"
                : activeTab === "general-articles"
                ? "General Articles"
                : activeTab === "edit-country-articles"
                ? "Edit Country's Articles"
                : activeTab === "edit-general-articles"
                ? "Edit General Articles"
                : "Add General Article"}
            </h2>
            {activeTab === "accepted" ? (
              renderCountdowns(acceptedCountdowns)
            ) : activeTab === "pending" ? (
              renderCountdowns(pendingCountdowns)
            ) : activeTab === "articles" ? (
              <div style={styles.container}>
                <div style={styles.articlesCount}>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "25px",
                      ...blogTextStyle,
                    }}
                  >
                    Total Articles: {getCountriesArticlesCount()}
                  </p>
                  {selectedCountry && (
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        ...blogTextStyle,
                      }}
                    >
                      Articles Count: {getCountryArticlesCount()}
                    </p>
                  )}
                </div>
                <br />
                <br />
                <div style={styles.filterContainer}>
                  <label htmlFor="countrySelect" style={styles.label}>
                    Choose Country:
                  </label>
                  <select
                    id="countrySelect"
                    value={selectedCountry}
                    onChange={handleCountryChangeForArticles}
                    style={{
                      ...styles.select,
                      ...blogTextStyle,
                      color: "black",
                      fontSize: "15px",
                    }}
                  >
                    <option value="">All Countries</option>
                    {countryList.map((country, index) => (
                      <option
                        key={index}
                        value={country.countryCode}
                        style={{ ...blogTextStyle, color: "#black" }}
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {renderCountriesTable(filteredData)}
              </div>
            ) : activeTab === "general-articles" ? (
              <div>
                <div style={styles.articlesCount}>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "25px",
                      ...blogTextStyle,
                    }}
                  >
                    Total Articles: {getGeneralArticlesCount()}
                  </p>
                </div>
                {renderGeneralTable(generalData)}
              </div>
            ) : activeTab === "edit-country-articles" ? (
              <div>
                <div style={styles.filterContainer}>
                  <label htmlFor="countrySelect" style={styles.label}>
                    Choose Country:
                  </label>
                  <select
                    id="countrySelect"
                    value={selectedCountryForCards}
                    onChange={handleCountryChangeForCards}
                    style={{
                      ...styles.select,
                      ...blogTextStyle,
                      fontSize: "15px",
                      color: "black",
                    }}
                  >
                    <option value="">Select a country</option>
                    {countryList.map((country, index) => (
                      <option
                        key={index}
                        value={country.countryCode}
                        style={{ ...blogTextStyle, color: "#black" }}
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCountryForCards && (
                  <div>
                    {articlesData
                      .filter(
                        (article) =>
                          article.countryCode === selectedCountryForCards
                      )
                      .map((article, index) => (
                        <div key={index} style={styles.card}>
                          <h3
                            style={{
                              ...styles.cardTitle,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Title: {article.Title}
                          </h3>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            ID: {article.ID}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            TextBelowTitle: {article.TextBelowTitle}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            TitleInternal: {article.TitleInternal}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Importance: {article.Importance}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Preparation: {article.Preparation}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            WhatIs: {article.WhatIs}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Conclusion: {article.Conclusion}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Target Date: {article.TargetDate}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            isHoliday:{" "}
                            {article.isHoliday === true ? "true" : "false"}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Helmet Description: {article.Helmet_Description}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Helmet Keywords: {article.Helmet_Keywords}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Event Name: {article.EventName}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Countdown: {article.CountDown}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Link: {article.link}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Link Title: {article.linkTitle}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Country Code: {article.countryCode}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Image URL: {article.ImageURL}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            Last Updated: {parseExcelDate(article.LastUpdated)}
                          </p>
                          <p
                            style={{
                              ...styles.cardDescription,
                              ...blogTextStyle,
                              color: "black",
                            }}
                          >
                            URL: {article.URL}
                          </p>
                          <div style={styles.actions}>
                            <button
                              onClick={() => {
                                setSelectedId(article.ID);
                                setData(article);
                                setIsCountryModalOpen(true);
                              }}
                              style={styles.editButton}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteArticle(
                                  article.ID,
                                  article.countryCode
                                );
                              }}
                              style={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : activeTab === "edit-general-articles" ? (
              <>
                {generalData && (
                  <div>
                    {console.log("generalData: ", generalData)}
                    {generalData.map((article, index) => (
                      <div key={index} style={styles.card}>
                        <h3
                          style={{
                            ...styles.cardTitle,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Title: {article.Title}
                        </h3>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          ID: {article.ID}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          TextBelowTitle: {article.TextBelowTitle}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          TitleInternal: {article.TitleInternal}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Importance: {article.Importance}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Preparation: {article.Preparation}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          WhatIs: {article.WhatIs}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Conclusion: {article.Conclusion}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Target Date: {article.TargetDate}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          isHoliday:{" "}
                          {article.isHoliday === true ? "true" : "false"}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Helmet Description: {article.Helmet_Description}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Helmet Keywords: {article.Helmet_Keywords}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Event Name: {article.EventName}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Countdown: {article.CountDown}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Link: {article.link}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Link Title: {article.linkTitle}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Image URL: {article.ImageURL}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          Last Updated: {parseExcelDate(article.LastUpdated)}
                        </p>
                        <p
                          style={{
                            ...styles.cardDescription,
                            ...blogTextStyle,
                            color: "black",
                          }}
                        >
                          URL: {article.URL}
                        </p>
                        <div style={styles.actions}>
                          <button
                            onClick={() => {
                              setSelectedId(article.ID);
                              setData(article);
                              setIsCountryModalOpen(true);
                            }}
                            style={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteArticle(
                                article.ID,
                                article.countryCode
                              );
                            }}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : activeTab === "add-general-article" ? (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateGeneralArticleSubmit();
                  }}
                >
                  <label htmlFor="Title">Title</label>
                  <input
                    type="text"
                    id="Title"
                    value={newGeneralArticle.Title}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        Title: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="URL">URL</label>
                  <input
                    type="text"
                    id="URL"
                    value={newGeneralArticle.URL}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        URL: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="TextBelowTitle">TextBelowTitle</label>
                  <input
                    type="text"
                    id="TextBelowTitle"
                    value={newGeneralArticle.TextBelowTitle}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        TextBelowTitle: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="TitleInternal">TitleInternal</label>
                  <input
                    type="text"
                    id="TitleInternal"
                    value={newGeneralArticle.TitleInternal}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        TitleInternal: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="Importance">Importance</label>
                  <input
                    type="text"
                    id="Importance"
                    value={newGeneralArticle.Importance}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        Importance: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="Preparation">Preparation</label>
                  <input
                    type="text"
                    id="Preparation"
                    value={newGeneralArticle.Preparation}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        Preparation: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="Date">Date</label>
                  <input
                    type="text"
                    id="Date"
                    value={newGeneralArticle.Date}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        Date: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="WhatIs">WhatIs</label>
                  <input
                    type="text"
                    id="WhatIs"
                    value={newGeneralArticle.WhatIs}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        WhatIs: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="Conclusion">Conclusion</label>
                  <input
                    type="text"
                    id="Conclusion"
                    value={newGeneralArticle.Conclusion}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        Conclusion: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="TargetDate">Target Date</label>
                  <input
                    type="date"
                    id="TargetDate"
                    value={newGeneralArticle.TargetDate}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        TargetDate: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="isHoliday">isHoliday</label>
                  <input
                    type="text"
                    id="isHoliday"
                    value={newGeneralArticle.isHoliday}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        isHoliday: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="Helmet_Description">Helmet_Description</label>
                  <input
                    type="text"
                    id="Helmet_Description"
                    value={newGeneralArticle.Helmet_Description}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        Helmet_Description: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="Helmet_Keywords">Helmet_Keywords</label>
                  <input
                    type="text"
                    id="Helmet_Keywords"
                    value={newGeneralArticle.Helmet_Keywords}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        Helmet_Keywords: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="EventName">Event Name</label>
                  <input
                    type="text"
                    id="EventName"
                    value={newGeneralArticle.EventName}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        EventName: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="CountDown">Countdown</label>
                  <input
                    type="text"
                    id="CountDown"
                    value={newGeneralArticle.CountDown}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        CountDown: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="link">Link</label>
                  <input
                    type="text"
                    id="link"
                    value={newGeneralArticle.link}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        link: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="linkTitle">Link Title</label>
                  <input
                    type="text"
                    id="linkTitle"
                    value={newGeneralArticle.linkTitle}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        linkTitle: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="ImageURL">ImageURL</label>
                  <input
                    type="text"
                    id="ImageURL"
                    value={newGeneralArticle.ImageURL}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        ImageURL: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <label htmlFor="LastUpdated">LastUpdated</label>
                  <input
                    type="date"
                    id="LastUpdated"
                    value={newGeneralArticle.LastUpdated}
                    onChange={(e) =>
                      setNewGeneralArticle({
                        ...newGeneralArticle,
                        LastUpdated: e.target.value,
                      })
                    }
                    style={styles.inputField}
                  />
                  <div style={styles.actions}>
                    <button type="submit" style={styles.approveButton}>
                      Create
                    </button>
                  </div>
                </form>
              </>
            ) : activeTab === "add-country-article" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateCountryArticleSubmit();
                }}
              >
                <label htmlFor="countrySelect" style={styles.label}>
                  Select Country
                </label>
                <select
                  id="countrySelect"
                  value={selectedCountryForCreation}
                  onChange={(e) =>
                    setSelectedCountryForCreation(e.target.value)
                  }
                  style={{
                    ...styles.select,
                    ...blogTextStyle,
                    fontSize: "15px",
                    color: "black",
                  }}
                >
                  <option value="">Select a country</option>
                  {countryList.map((country, index) => (
                    <option key={index} value={country.countryCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <br />
                <br />
                {selectedCountryForCreation && (
                  <>
                    <label htmlFor="Title">Title</label>
                    <input
                      type="text"
                      id="Title"
                      value={newCountryArticle.Title}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          Title: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="URL">URL</label>
                    <input
                      type="text"
                      id="URL"
                      value={newCountryArticle.URL}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          URL: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="TextBelowTitle">TextBelowTitle</label>
                    <input
                      type="text"
                      id="TextBelowTitle"
                      value={newCountryArticle.TextBelowTitle}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          TextBelowTitle: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="TitleInternal">TitleInternal</label>
                    <input
                      type="text"
                      id="TitleInternal"
                      value={newCountryArticle.TitleInternal}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          TitleInternal: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="Importance">Importance</label>
                    <input
                      type="text"
                      id="Importance"
                      value={newCountryArticle.Importance}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          Importance: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="Preparation">Preparation</label>
                    <input
                      type="text"
                      id="Preparation"
                      value={newCountryArticle.Preparation}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          Preparation: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="Date">Date</label>
                    <input
                      type="text"
                      id="Date"
                      value={newCountryArticle.Date}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          Date: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="WhatIs">WhatIs</label>
                    <input
                      type="text"
                      id="WhatIs"
                      value={newCountryArticle.WhatIs}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          WhatIs: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="Conclusion">Conclusion</label>
                    <input
                      type="text"
                      id="Conclusion"
                      value={newCountryArticle.Conclusion}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          Conclusion: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="TargetDate">Target Date</label>
                    <input
                      type="date"
                      id="TargetDate"
                      value={newCountryArticle.TargetDate}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          TargetDate: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="isHoliday">isHoliday</label>
                    <input
                      type="text"
                      id="isHoliday"
                      value={newCountryArticle.isHoliday}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          isHoliday: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="Helmet_Description">
                      Helmet_Description
                    </label>
                    <input
                      type="text"
                      id="Helmet_Description"
                      value={newCountryArticle.Helmet_Description}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          Helmet_Description: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="Helmet_Keywords">Helmet_Keywords</label>
                    <input
                      type="text"
                      id="Helmet_Keywords"
                      value={newCountryArticle.Helmet_Keywords}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          Helmet_Keywords: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="EventName">Event Name</label>
                    <input
                      type="text"
                      id="EventName"
                      value={newCountryArticle.EventName}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          EventName: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="CountDown">Countdown</label>
                    <input
                      type="text"
                      id="CountDown"
                      value={newCountryArticle.CountDown}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          CountDown: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="link">Link</label>
                    <input
                      type="text"
                      id="link"
                      value={newCountryArticle.link}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          link: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="linkTitle">Link Title</label>
                    <input
                      type="text"
                      id="linkTitle"
                      value={newCountryArticle.linkTitle}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          linkTitle: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="ImageURL">ImageURL</label>
                    <input
                      type="text"
                      id="ImageURL"
                      value={newCountryArticle.ImageURL}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          ImageURL: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <label htmlFor="LastUpdated">LastUpdated</label>
                    <input
                      type="date"
                      id="LastUpdated"
                      value={newCountryArticle.LastUpdated}
                      onChange={(e) =>
                        setNewCountryArticle({
                          ...newCountryArticle,
                          LastUpdated: e.target.value,
                        })
                      }
                      style={styles.inputField}
                    />
                    <div style={styles.actions}>
                      <button type="submit" style={styles.approveButton}>
                        Create
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              ""
            )}
          </div>

          {/* Modal for editing countdowns */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={styles.modalStyles}
          >
            <h2>Edit Countdown</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
            >
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.inputField}
              />
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.inputField}
              />
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.inputField}
              />
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={styles.inputField}
              />
              <button type="submit" style={styles.saveButton}>
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </form>
          </Modal>

          {/* Modal for editing articles */}
          <Modal
            isOpen={isCountryModalOpen}
            onRequestClose={() => setIsCountryModalOpen(false)}
            style={styles.modalStyles}
          >
            <h2>Edit Article</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditArticleSubmit(data.countryCode, data.ID);
              }}
            >
              <label htmlFor="Title">Title</label>
              <input
                type="text"
                id="Title"
                value={data.Title}
                onChange={(e) => setData({ ...data, Title: e.target.value })}
                style={styles.inputField}
              />
              <label htmlFor="URL">URL</label>
              <input
                type="text"
                id="URL"
                value={data.URL}
                onChange={(e) => setData({ ...data, URL: e.target.value })}
                style={styles.inputField}
              />
              <label htmlFor="TextBelowTitle">TextBelowTitle</label>
              <input
                type="text"
                id="TextBelowTitle"
                value={data.TextBelowTitle}
                onChange={(e) =>
                  setData({ ...data, TextBelowTitle: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="TitleInternal">TitleInternal</label>
              <input
                type="text"
                id="TitleInternal"
                value={data.TitleInternal}
                onChange={(e) =>
                  setData({ ...data, TitleInternal: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="Importance">Importance</label>
              <input
                type="text"
                id="Importance"
                value={data.Importance}
                onChange={(e) =>
                  setData({ ...data, Importance: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="Preparation">Preparation</label>
              <input
                type="text"
                id="Preparation"
                value={data.Preparation}
                onChange={(e) =>
                  setData({ ...data, Preparation: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="WhatIs">WhatIs</label>
              <input
                type="text"
                id="WhatIs"
                value={data.WhatIs}
                onChange={(e) => setData({ ...data, WhatIs: e.target.value })}
                style={styles.inputField}
              />
              <label htmlFor="Conclusion">Conclusion</label>
              <input
                type="text"
                id="Conclusion"
                value={data.Conclusion}
                onChange={(e) =>
                  setData({ ...data, Conclusion: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="TargetDate">Target Date</label>
              <input
                type="date"
                id="TargetDate"
                value={
                  data.TargetDate && !isNaN(new Date(data.TargetDate))
                    ? new Date(data.TargetDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setData({ ...data, TargetDate: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="isHoliday">isHoliday</label>
              <input
                type="text"
                id="isHoliday"
                value={data.isHoliday}
                onChange={(e) =>
                  setData({ ...data, isHoliday: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="Helmet_Description">Helmet_Description</label>
              <input
                type="text"
                id="Helmet_Description"
                value={data.Helmet_Description}
                onChange={(e) =>
                  setData({ ...data, Helmet_Description: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="Helmet_Keywords">Helmet_Keywords</label>
              <input
                type="text"
                id="Helmet_Keywords"
                value={data.Helmet_Keywords}
                onChange={(e) =>
                  setData({ ...data, Helmet_Keywords: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="EventName">Event Name</label>
              <input
                type="text"
                id="EventName"
                value={data.EventName}
                onChange={(e) =>
                  setData({ ...data, EventName: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="CountDown">Countdown</label>
              <input
                type="text"
                id="CountDown"
                value={data.CountDown}
                onChange={(e) =>
                  setData({ ...data, CountDown: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="link">Link</label>
              <input
                type="text"
                id="link"
                value={data.link}
                onChange={(e) => setData({ ...data, link: e.target.value })}
                style={styles.inputField}
              />
              <label htmlFor="linkTitle">Link Title</label>
              <input
                type="text"
                id="linkTitle"
                value={data.linkTitle}
                onChange={(e) =>
                  setData({ ...data, linkTitle: e.target.value })
                }
                style={styles.inputField}
              />
              <label htmlFor="ImageURL">ImageURL</label>
              <input
                type="text"
                id="ImageURL"
                value={data.ImageURL}
                onChange={(e) => setData({ ...data, ImageURL: e.target.value })}
                style={styles.inputField}
              />
              <label htmlFor="LastUpdated">LastUpdated</label>
              <input
                type="date"
                id="LastUpdated"
                value={parseExcelDate(data.LastUpdated)}
                onChange={(e) =>
                  setData({ ...data, LastUpdated: e.target.value })
                }
                style={styles.inputField}
              />
              <button type="submit" style={styles.saveButton}>
                Save
              </button>
              <button
                onClick={() => setIsCountryModalOpen(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </form>
          </Modal>
        </div>
      ) : (
        <div style={styles.messageContainer}>
          <h2 style={styles.message}>Not Authorized!</h2>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
