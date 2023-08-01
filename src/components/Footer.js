const Footer = ({ pad, str, pageCount, z, sifra }) => {
  return (
    <div
      style={{
        position: "absolute",
        display: "block",
        top: pad ? pad : "28cm",
        left: z === 1 ? "0" : "1.5cm",
      }}
    >
      <hr
        style={{
          width: "18cm",
          height: "1px",
          borderBottom: "1px",
        }}
      ></hr>
      <p
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#74bc74",
          fontStyle: "italic",
          marginTop: "0cm",
        }}
      >
        ISP{sifra}
        {pageCount ? (
          <span style={{ color: "black", fontStyle: "normal" }}>
            Страница <strong>{str}</strong> od <strong>{pageCount}</strong>
          </span>
        ) : null}
      </p>
    </div>
  );
};

export default Footer;
