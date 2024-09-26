import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
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
import { isMobile } from "react-device-detect";

Modal.setAppElement("#root");

const AdminPanel = () => {
  const [user] = useAuthState(auth);
  const [countdowns, setCountdowns] = useState([]);
  const [acceptedCountdowns, setAcceptedCountdowns] = useState([]);
  const [pendingCountdowns, setPendingCountdowns] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!["taiseertello@gmail.com"].includes(user.email)) {
        navigate("/");
      } else {
        setIsAdmin(true);
      }
    }
  }, [user, navigate]);

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
      confirmButtonColor: "#1e81b0",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const renderCountdowns = (countdownList) => {
    return countdownList.length === 0 ? (
      <p>No {activeTab === "accepted" ? "accepted" : "pending"} countdowns</p>
    ) : (
      countdownList.map(({ id, title, description, date }) => (
        <div key={id} style={styles.card}>
          <h3 style={styles.cardTitle}>Title: {title}</h3>
          <p style={styles.cardDescription}>Description: {description}</p>
          <p style={styles.cardDescription}>ID: {id}</p>
          <a href={`/ar/countdown/${id}`} style={{ color: "#1e81b0" }}>
            Link to countdown
          </a>
          <p style={styles.cardDate}>
            {new Date(date.seconds * 1000).toLocaleString()}
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
                      confirmButtonColor: "#1e81b0",
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
                  confirmButtonColor: "#1e81b0",
                  cancelButtonColor: "#d9534f",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(id).then(() => {
                      Swal.fire({
                        title: "Deleted!",
                        text: "Countdown has been deleted.",
                        icon: "success",
                        confirmButtonColor: "#1e81b0",
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
                : "Pending Countdowns"}
            </h2>
            {activeTab === "accepted"
              ? renderCountdowns(acceptedCountdowns)
              : renderCountdowns(pendingCountdowns)}
          </div>

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
        </div>
      ) : (
        <div style={styles.messageContainer}>
          <h2 style={styles.message}>Not Authorized!</h2>
        </div>
      )}
    </>
  );
};

const buttonBase = {
  padding: "10px 15px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const styles = {
  dashboard: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    minHeight: "100vh",
    backgroundColor: "#e9f2f7",
    borderRadius: "8px",
  },
  sidebar: {
    width: isMobile ? "100%" : "250px",
    backgroundColor: "#0c3446",
    color: "#fff",
    padding: isMobile ? "10px" : "20px",
    borderRadius: "8px",
  },
  sidebarTitle: {
    fontSize: isMobile ? "18px" : "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  welcomeMessage: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "20px",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s",
  },
  navTabs: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  tab: {
    backgroundColor: "#bcd9e7",
    color: "#0c3446",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  activeTab: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#1e81b0",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
    transition: "transform 0.3s, box-shadow 0.3s",
    ":hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
    },
    color: "#333",
    fontFamily: "'Roboto', sans-serif",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#0c3446",
  },
  cardDescription: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "#0c3446",
  },
  cardDate: {
    fontSize: "14px",
    color: "#888",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "15px",
  },
  approveButton: {
    ...buttonBase,
    backgroundColor: "#28a745",
    color: "#fff",
  },
  messageContainer: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#ffe6e6",
    width: "50%",
    height: "200px",
    transform: "translateX(50%)",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "red",
    fontSize: "18px",
  },
  message: {
    color: "#d9534f",
  },
  editButton: {
    ...buttonBase,
    backgroundColor: "#1e81b0",
    color: "#fff",
  },
  deleteButton: {
    ...buttonBase,
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  inputField: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ced4da",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  modalStyles: {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "10px",
      width: "400px",
      maxWidth: "90%",
    },
  },
};

export default AdminPanel;
