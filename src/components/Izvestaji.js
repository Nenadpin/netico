import React from "react";

const Izvestaji = ({ reports }) => {
  const handleDownload = async (link) => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_SERVER_URL
        }/download?filePath=${encodeURIComponent(link)}`
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = link;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  return (
    <div
      style={{
        background: "white",
        maxWidth: "600px",
        margin: "auto",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
        padding: "2rem 2.5rem",
      }}
    >
      {reports
        ? reports.map((r, index) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              key={index}
            >
              <span>
                {r.broj_izvestaja} - {r.naziv}
              </span>
              {r.link ? (
                <button
                  className="block-btn"
                  style={{ width: "3cm", marginBottom: "0" }}
                  onClick={() => handleDownload(r.link)}
                >
                  Download
                </button>
              ) : null}
            </div>
          ))
        : null}
    </div>
  );
};

export default Izvestaji;
