import React from "react";

const page = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Public Page</h1>
      <p>This is a public page accessible to everyone.</p>
      <a href="/" style={styles.navLink}>
        Go back to LoginPage
      </a>
    </div>
  );
};
const styles = {
  navLink: {
    display: "block",
    margin: "0.5rem 0",
    padding: "0.75rem 1rem",
    backgroundColor: "#0d6efd",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "background-color 0.3s",
    width: "300px",
  },
};

export default page;
