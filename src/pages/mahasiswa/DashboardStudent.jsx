import PageTitle from "../../components/PageTitle";
// Import data langsung dari file JSON
import commitData from "../../data/commit.json";
import issueData from "../../data/issue.json";
import mahasiswaData from "../../data/mahasiswa.json";
import projectData from "../../data/project.json";
import userData from "../../data/user.json";

export default function DashboardStudent() {
  return (
    <>
      <PageTitle title="Dashboard Mahasiswa"
      description={'asdasd'} />

      <div className="">
        <p>dashboard</p>
      </div>
    </>
  );
}