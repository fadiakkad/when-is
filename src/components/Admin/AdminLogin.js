import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { admin } from "../common/constants";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = `/${admin}`;
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={styles.loginContainer}>
      <h2 style={styles.title}>Admin Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  loginContainer: {
    marginTop: "100px",
    maxWidth: "400px",
    margin: "auto",
    padding: "40px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    marginBottom: "5px",
    fontSize: "16px",
    color: "#555",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    transition: "border-color 0.3s",
    "&:focus": {
      borderColor: "#1e81b0",
      outline: "none",
    },
  },
  error: {
    color: "red",
    margin: "10px 0",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#1e81b0",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#166f8d",
    },
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};

export default AdminLogin;
