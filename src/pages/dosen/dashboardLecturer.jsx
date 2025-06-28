import PageTitle from "../../components/PageTitle";

export default function DashboardLecturer() {
  return (
    <>
      <PageTitle
        title="Dashboard"
        description="Welcome to the dashboard, where you can manage your projects and settings."
      />

      <div style={outerWrapper}>
        <div style={dashboardBox}>
          <h2 style={headingStyle}>
            Welcome to your dashboard, Pt. Data Insight !
          </h2>
          <p style={subtextStyle}>
            You have submitted 3 projects,<br />
            there are 5 students who have registered.
          </p>

          {/* Section Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Card 1 */}
            <div>
              <div style={centeredHeaderStyle}>
                <img src="/assets/icons/icon-submitproject.png" alt="Submit" style={inlineIconStyle} />
                <span style={titleTextStyle}>Submit a new project</span>
              </div>
              <div style={boxStyle}>
                <p style={descStyle}>
                  Create rich course content and coaching products for your students.
                  When you give them a pricing plan, they'll appear on your site!
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div>
              <div style={centeredHeaderStyle}>
                <img src="/assets/icons/icon-yourproject.png" alt="Your Project" style={inlineIconStyle} />
                <span style={titleTextStyle}>Your Project</span>
              </div>
              <div style={boxStyle}>
                <p style={descStyle}>
                  Create rich course content and coaching products for your students.
                  When you give them a pricing plan, they'll appear on your site!
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div>
              <div style={centeredHeaderStyle}>
                <img src="/assets/icons/icon-studentregistrant.png" alt="Student Registrant" style={inlineIconStyle} />
                <span style={titleTextStyle}>Student registrant</span>
              </div>
              <div style={boxStyle}>
                <p style={descStyle}>
                  Create rich course content and coaching products for your students.
                  When you give them a pricing plan, they'll appear on your site!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// === Styles ===
const outerWrapper = {
  display: "flex",
  justifyContent: "center",
  marginTop: "5px",
  padding: "20px"
};

const dashboardBox = {
  backgroundColor: "#ffffff",
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "700px",
  width: "100%",
  textAlign: "center"
};

const headingStyle = {
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "8px"
};

const subtextStyle = {
  fontSize: "14px",
  marginBottom: "30px"
};

const centeredHeaderStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginBottom: "6px"
};

const inlineIconStyle = {
  width: "20px",
  height: "20px"
};

const titleTextStyle = {
  fontWeight: 600,
  fontSize: "14px"
};

const boxStyle = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "12px 16px",
  textAlign: "center"
};

const descStyle = {
  fontSize: "12px",
  color: "#555",
  margin: 0
};
