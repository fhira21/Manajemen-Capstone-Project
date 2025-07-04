import { useState, useEffect, useMemo } from "react";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/AuthContext";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler,
  RadialLinearScale
} from 'chart.js';

// Import data files
import projectData from "../data/project.json";
import issueData from "../data/issue.json";
import commitData from "../data/commit.json";
import mahasiswaData from "../data/mahasiswa.json";
import dosenData from "../data/dosen.json";
import mitraData from "../data/mitra.json";

// Import icons
import { FiGrid, FiList, FiFilter, FiCalendar, FiClock, FiCheckSquare, FiAlertCircle, FiClipboard, FiActivity, FiTrendingUp, FiUsers, FiCode, FiBriefcase, FiFlag } from "react-icons/fi";

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title,
  Filler,
  RadialLinearScale
);

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState("");
  const [taskList, setTaskList] = useState({ todo: [], inProgress: [], done: [] });
  const [recentCommits, setRecentCommits] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [issueStats, setIssueStats] = useState({ 
    open: 0, 
    closed: 0, 
    total: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
    byLabel: { bug: 0, feature: 0, improvement: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [activityStats, setActivityStats] = useState([]);
  const [taskCompletionTrend, setTaskCompletionTrend] = useState([]);
  const [dashboardTab, setDashboardTab] = useState("overview");
  const [commitActivityData, setCommitActivityData] = useState({});
  
  // Filter projects based on user role and access
  const accessibleProjects = useMemo(() => {
    if (!user) return [];
    
    try {
      switch(user.role) {
        case 'Mahasiswa':
          if (!mahasiswaData?.MAHASISWA) return [];
          const mahasiswa = mahasiswaData.MAHASISWA.find(m => m.ID_User === user.id);
          if (!mahasiswa) return [];
          return projectData?.PROJECT?.filter(p => p.ID_Mahasiswa?.includes(mahasiswa.ID_Mahasiswa)) || [];
          
        case 'Dosen':
          if (!dosenData?.DOSEN) return [];
          const dosen = dosenData.DOSEN.find(d => d.ID_User === user.id);
          if (!dosen) return [];
          return projectData?.PROJECT?.filter(p => p.ID_Dosen === dosen.ID_Dosen) || [];
          
        case 'Mitra':
          if (!mitraData?.MITRA) return [];
          const mitra = mitraData.MITRA.find(m => m.ID_User === user.id);
          if (!mitra) return [];
          return projectData?.PROJECT?.filter(p => p.ID_Mitra === mitra.ID_Mitra) || [];
          
        default:
          return [];
      }
    } catch (error) {
      console.error("Error in accessibleProjects:", error);
      return [];
    }
  }, [user]);
  
  // Handle project selection
  useEffect(() => {
    if (!selectedProject && accessibleProjects.length > 0) {
      setSelectedProject(accessibleProjects[0].ID_Project);
    }
  }, [accessibleProjects, selectedProject]);
  
  // Load project data when project selection changes
  useEffect(() => {
    if (!selectedProject) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        // Get project details
        if (!projectData?.PROJECT) {
          console.error("Project data is missing or invalid");
          setProjectDetails(null);
          setIsLoading(false);
          return;
        }
        
        const project = projectData.PROJECT.find(p => p.ID_Project === selectedProject);
        setProjectDetails(project);
        
        // Apply time filter to data
        const filterDate = (date) => {
          if (timeFilter === "all") return true;
          const today = new Date();
          const itemDate = new Date(date);
          const diffTime = Math.abs(today - itemDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          switch (timeFilter) {
            case "week": return diffDays <= 7;
            case "month": return diffDays <= 30;
            case "quarter": return diffDays <= 90;
            default: return true;
          }
        };
        
        // Get issues for the project
        const projectIssues = issueData.ISSUE.filter(i => i.ID_Project === selectedProject);
        
        // Calculate issue statistics
        const open = projectIssues.filter(i => i.Status === "Open").length;
        const closed = projectIssues.filter(i => i.Status === "Closed").length;
        
        // Calculate by priority
        const highPriority = projectIssues.filter(i => i.Prioritas?.toLowerCase() === "high").length;
        const mediumPriority = projectIssues.filter(i => i.Prioritas?.toLowerCase() === "medium").length;
        const lowPriority = projectIssues.filter(i => i.Prioritas?.toLowerCase() === "low").length;
        
        // Calculate by label
        const bugIssues = projectIssues.filter(i => i.Label === "Bug").length;
        const featureIssues = projectIssues.filter(i => i.Label === "Feature Request").length;
        const improvementIssues = projectIssues.filter(i => i.Label === "Improvement").length;
        
        setIssueStats({
          open,
          closed,
          total: open + closed,
          byPriority: {
            high: highPriority,
            medium: mediumPriority,
            low: lowPriority
          },
          byLabel: {
            bug: bugIssues,
            feature: featureIssues,
            improvement: improvementIssues
          }
        });
        
        // Categorize by priority if available
        const priorityCounts = {
          Critical: projectIssues.filter(i => i.Prioritas === "Critical").length,
          High: projectIssues.filter(i => i.Prioritas === "High").length,
          Medium: projectIssues.filter(i => i.Prioritas === "Medium").length,
          Low: projectIssues.filter(i => i.Prioritas === "Low").length || 0,
        };
        
        // Prepare task list with more detailed categorization
        const todo = projectIssues.filter(i => i.Status === "Open" && i.Label === "Feature Request");
        const inProgress = projectIssues.filter(i => i.Status === "Open" && 
          (i.Label === "Bug" || i.Label === "Improvement" || i.Label === "Performance"));
        const done = projectIssues.filter(i => i.Status === "Closed");
        
        setTaskList({
          todo,
          inProgress,
          done,
          priorityCounts
        });
        
        // Disable - This is replaced by better trend calculation below
        
        // Get commits for the project
        const projectCommits = commitData.COMMIT.filter(c => c.ID_Project === selectedProject);
        
        // Filter commits based on time filter
        let filteredCommits = [...projectCommits];
        const now = new Date();
        
        if (timeFilter === "week") {
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filteredCommits = projectCommits.filter(c => new Date(c.Tgl_Commit) >= oneWeekAgo);
        } else if (timeFilter === "month") {
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          filteredCommits = projectCommits.filter(c => new Date(c.Tgl_Commit) >= oneMonthAgo);
        }
        
        // Sort commits by date (most recent first)
        const sortedCommits = [...filteredCommits].sort((a, b) => 
          new Date(b.Tgl_Commit) - new Date(a.Tgl_Commit)
        );
        setRecentCommits(sortedCommits);
        
        // Generate commit activity data by day of week for chart
        const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const commitsByDay = Array(7).fill(0);
        
        projectCommits.forEach(commit => {
          const date = new Date(commit.Tgl_Commit);
          const dayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
          commitsByDay[dayIndex]++;
        });
        
        // Calculate commit activity by type
        const commitsByType = {
          'Fitur Baru': projectCommits.filter(c => c.CommitType === "Feature").length,
          'Perbaikan Bug': projectCommits.filter(c => c.CommitType === "Fix").length,
          'Peningkatan': projectCommits.filter(c => c.CommitType === "Enhancement").length,
          'Refaktor': projectCommits.filter(c => c.CommitType === "Refactor").length,
          'Lainnya': projectCommits.filter(c => !c.CommitType || !["Feature", "Fix", "Enhancement", "Refactor"].includes(c.CommitType)).length
        };
        
        // Calculate activity stats by day for the last 14 days
        const last14Days = Array.from({length: 14}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date;
        }).reverse();
        
        const activityByDay = last14Days.map(day => {
          const nextDay = new Date(day);
          nextDay.setDate(day.getDate() + 1);
          
          const commitsOnDay = projectCommits.filter(commit => {
            const commitDate = new Date(commit.Tgl_Commit);
            return commitDate >= day && commitDate < nextDay;
          });
          
          return {
            date: day,
            display: `${day.getDate()}/${day.getMonth() + 1}`,
            count: commitsOnDay.length
          };
        });
        
        setActivityStats(activityByDay);
        
        setCommitActivityData({
          byDay: {
            labels: daysOfWeek,
            datasets: [{
              label: 'Commit',
              data: commitsByDay,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            }]
          },
          byType: {
            labels: Object.keys(commitsByType),
            datasets: [{
              data: Object.values(commitsByType),
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 206, 86, 0.7)',
              ],
              borderWidth: 1,
            }]
          }
        });
        
        // Calculate top contributors
        const contributorMap = {};
        projectCommits.forEach(commit => {
          if (!contributorMap[commit.User]) {
            contributorMap[commit.User] = {
              commits: 0,
              linesAdded: 0,
              linesRemoved: 0,
              filesChanged: 0
            };
          }
          contributorMap[commit.User].commits++;
          contributorMap[commit.User].linesAdded += commit.LinesAdded || 0;
          contributorMap[commit.User].linesRemoved += commit.LinesRemoved || 0;
          contributorMap[commit.User].filesChanged += commit.FilesChanged || 0;
        });
        
        const sortedContributors = Object.entries(contributorMap)
          .map(([userId, stats]) => {
            // Find user details based on ID
            const mahasiswa = mahasiswaData.MAHASISWA.find(m => m.ID_Mahasiswa === userId);
            const dosen = dosenData.DOSEN.find(d => d.ID_Dosen === userId);
            const mitra = mitraData.MITRA.find(m => m.ID_Mitra === userId);
            
            const name = mahasiswa?.Nama || dosen?.Nama || mitra?.Nama_Perusahaan || userId;
            const photo = mahasiswa?.Foto_Profile || dosen?.Foto_Profile || mitra?.Foto_Profile || null;
            
            return {
              id: userId,
              name,
              photo,
              commitCount: stats.commits,
              linesAdded: stats.linesAdded,
              linesRemoved: stats.linesRemoved,
              filesChanged: stats.filesChanged,
              contribution: stats.linesAdded - stats.linesRemoved
            };
          })
          .sort((a, b) => b.commitCount - a.commitCount);
        
        setTopContributors(sortedContributors);
        
        // Generate activity stats for chart (commits per day)
        const lastTwoWeeks = Array(14).fill(0).map((_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - (13 - i));
          return {
            date: date.toISOString().split('T')[0],
            count: 0,
            display: `${date.getDate()}/${date.getMonth() + 1}`
          };
        });
        
        projectCommits.forEach(commit => {
          const commitDate = commit.Tgl_Commit.split('T')[0];
          const dayIndex = lastTwoWeeks.findIndex(day => day.date === commitDate);
          if (dayIndex !== -1) {
            lastTwoWeeks[dayIndex].count++;
          }
        });
        
        setActivityStats(lastTwoWeeks);
        
        // Generate task completion trend - Perbaikan dengan data mingguan dalam Bahasa Indonesia
        const last6Weeks = Array.from({length: 6}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (i * 7));
          return date;
        }).reverse();
        
        const monthNamesIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        
        const completionTrend = last6Weeks.map((weekStart, index) => {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          // Format tanggal dalam Bahasa Indonesia
          const formattedStart = `${weekStart.getDate()} ${monthNamesIndo[weekStart.getMonth()]}`;
          const formattedEnd = `${weekEnd.getDate()} ${monthNamesIndo[weekEnd.getMonth()]}`;
          
          // Count closed issues in this week
          const closedIssuesInWeek = projectIssues
            .filter(i => i.Status === "Closed")
            .filter(i => {
              const updateDate = new Date(i.Tgl_Update);
              return updateDate >= weekStart && updateDate <= weekEnd;
            });
          
          // Count created issues in this week
          const createdIssuesInWeek = projectIssues
            .filter(i => {
              const createDate = new Date(i.Tgl_Buat);
              return createDate >= weekStart && createDate <= weekEnd;
            });
            
          return {
            week: `M${index+1}`,
            display: `${formattedStart}`,
            completed: closedIssuesInWeek.length,
            created: createdIssuesInWeek.length
          };
        });
        
        setTaskCompletionTrend(completionTrend);
        
      } catch (error) {
        console.error("Error loading project data:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Simulate loading delay for better UX
    
  }, [selectedProject, timeFilter]);
  
  // Prepare chart data
  const issueStatusChartData = {
    labels: ['Issue Terbuka', 'Issue Tertutup'],
    datasets: [
      {
        data: [issueStats.open, issueStats.closed],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare activity stats chart data
  const activityChartData = {
    labels: activityStats.map(day => day.display),
    datasets: [
      {
        label: 'Aktivitas Commit',
        data: activityStats.map(day => day.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4,
      }
    ],
  };
  
  // Task completion trend chart data
  const taskCompletionChartData = {
    labels: taskCompletionTrend.map(item => item.display || item.week),
    datasets: [
      {
        type: 'line',
        label: 'Tugas Selesai',
        data: taskCompletionTrend.map(item => item.completed),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        type: 'bar',
        label: 'Tugas Dibuat',
        data: taskCompletionTrend.map(item => item.created),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      }
    ],
  };
  
  // Priority chart data
  const priorityChartData = {
    labels: ['Kritis', 'Tinggi', 'Sedang', 'Rendah'],
    datasets: [
      {
        data: [
          taskList.priorityCounts?.Critical || 0,
          taskList.priorityCounts?.High || 0,
          taskList.priorityCounts?.Medium || 0,
          taskList.priorityCounts?.Low || 0
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      }
    ],
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Get user name by ID
  // Safe function to get user name by ID
  const getUserName = (userId) => {
    if (!userId) return '-';
    
    try {
      // Handle missing data
      if (!mahasiswaData?.MAHASISWA) return userId;
      if (!dosenData?.DOSEN) return userId;
      if (!mitraData?.MITRA) return userId;
      
      // Find in mahasiswa data
      const mahasiswa = mahasiswaData.MAHASISWA.find(m => m.ID_Mahasiswa === userId);
      if (mahasiswa) return mahasiswa.Nama || userId;
      
      // Find in dosen data
      const dosen = dosenData.DOSEN.find(d => d.ID_Dosen === userId);
      if (dosen) return dosen.Nama || userId;
      
      // Find in mitra data
      const mitra = mitraData.MITRA.find(m => m.ID_Mitra === userId);
      if (mitra) return mitra.Nama_Perusahaan || userId;
    } catch (error) {
      console.error("Error in getUserName:", error);
      return userId;
    }
    
    return userId;
  };
  
  // Safe function to get first character of user name
  const getUserInitial = (userId) => {
    try {
      const name = getUserName(userId);
      return typeof name === 'string' && name.length > 0 ? name.charAt(0) : '?';
    } catch (error) {
      return '?';
    }
  };

  return (
    <>
      <PageTitle 
        title="Dashboard"                        
        description="Pantau kemajuan proyek dan aktivitas tim" 
      />
      
      <div className="h-full w-full overflow-y-auto">
       {/* Dashboard Controls */}
      <div className="bg-white sticky top-0 p-2 sm:p-3 mb-3 items-center justify-between w-full rounded-lg shadow flex flex-col sm:flex-row gap-2 sm:gap-3 z-10">
        
        {/* Left Section - Project Selection */}
        <div className={`flex-1 w-full ${(user?.role === 'Dosen' || user?.role === 'Mitra') ? '' : 'hidden'}`}>
          <div className="relative w-full sm:max-w-md">
            <select 
              className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 appearance-none bg-white"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="" disabled>Pilih Proyek</option>
              {accessibleProjects.map(project => (
                <option key={project.ID_Project} value={project.ID_Project}>
                  {project.Nama_Project}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Middle Section - Dashboard Tabs */}
        <div className="flex-1 flex justify-center w-full sm:w-auto">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 p-0.5 sm:p-1 rounded-lg w-full">
            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium ${
                dashboardTab === 'overview' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setDashboardTab('overview')}
            >
              <FiActivity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xxs:inline">Ringkasan</span>
            </button>
            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium ${
                dashboardTab === 'tasks' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setDashboardTab('tasks')}
            >
              <FiCheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xxs:inline">Tugas</span>
            </button>
            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1 text-xs sm:text-sm font-medium ${
                dashboardTab === 'activity' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setDashboardTab('activity')}
            >
              <FiCode className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xxs:inline">Aktivitas</span>
            </button>
          </div>
        </div>
        
        {/* Right Section - View Controls */}
        <div className="flex-1 flex justify-end w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            
            {/* Time Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                className="appearance-none w-full bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-1.5 pr-8 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">Semua Waktu</option>
                <option value="week">Minggu Terakhir</option>
                <option value="month">Bulan Terakhir</option>
                <option value="quarter">3 Bulan Terakhir</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
        
        
        {/* Dashboard Content */}
        
        {selectedProject ? (
          <>
            {dashboardTab === 'overview' && (
              <div className="overflow-y-auto w-full flex flex-col items-center justify-start gap-3 sm:gap-4">
                {/* Status Cards Row */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 w-full gap-3 sm:gap-4">
                  {/* Project Progress Card */}
                  <div className="bg-white rounded-lg shadow p-3 sm:p-4 flex flex-col w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Kemajuan Proyek</h3>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                          {projectDetails?.Progres || 0}%
                        </span>
                        <span className="text-2xs xs:text-xs text-gray-500">
                          Target: {formatDate(projectDetails?.Target_Selesai)}
                        </span>
                      </div>
                      
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
                        <Doughnut 
                          data={{
                            datasets: [{
                              data: [projectDetails?.Progres || 0, 100 - (projectDetails?.Progres || 0)],
                              backgroundColor: ['#4f46e5', '#e5e7eb'],
                              borderWidth: 0,
                              cutout: '80%',
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                              tooltip: { enabled: false },
                              legend: { display: false },
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 sm:mt-3 mb-1">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${projectDetails?.Progres || 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-2xs xs:text-xs text-gray-500">
                      <span>Mulai: {formatDate(projectDetails?.Tgl_Mulai)}</span>
                      <span>{projectDetails?.Progres || 0}% Selesai</span>
                    </div>
                  </div>
                  
                  {/* Issues Stats Card */}
                  <div className="bg-white rounded-lg shadow p-3 sm:p-4 flex flex-col w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Masalah</h3>
                      <span className="bg-green-100 text-green-800 text-2xs xs:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        {issueStats.total} Total
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      <div className="space-y-1.5 sm:space-y-2 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-2xs xs:text-xs text-gray-500">Terbuka</span>
                          <span className="text-2xs xs:text-xs font-medium">{issueStats.open}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-red-500 h-1.5 rounded-full" 
                            style={{ width: issueStats.total ? `${(issueStats.open / issueStats.total) * 100}%` : '0%' }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-2xs xs:text-xs text-gray-500">Tertutup</span>
                          <span className="text-2xs xs:text-xs font-medium">{issueStats.closed}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: issueStats.total ? `${(issueStats.closed / issueStats.total) * 100}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ml-2">
                        <Pie 
                          data={{
                            labels: ['Terbuka', 'Tertutup'],
                            datasets: [{
                              data: [issueStats.open, issueStats.closed],
                              backgroundColor: ['#ef4444', '#10b981'],
                              borderWidth: 0,
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                              legend: { display: false },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                  }
                                }
                              }
                            },
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 sm:mt-4 text-2xs xs:text-xs">
                      <div className="flex items-center">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 mr-1"></span>
                        <span className="text-gray-500">Terbuka ({issueStats.open})</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-gray-500">Tertutup ({issueStats.closed})</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Team Members Card */}
                  <div className="xs:col-span-2 md:col-span-1 bg-white rounded-lg shadow p-3 sm:p-4 flex flex-col w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Anggota Tim</h3>
                      <span className="bg-purple-100 text-purple-800 text-2xs xs:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        {projectDetails?.ID_Mahasiswa?.length || 0} Orang
                      </span>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                        {projectDetails?.ID_Mahasiswa?.map((id, index) => (
                          <div 
                            key={id} 
                            className="h-6 w-6 sm:h-8 sm:w-8 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow"
                            style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                            title={getUserName(id)}
                          >
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xs xs:text-xs">
                              {getUserInitial(id)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-col space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-2xs xs:text-xs text-gray-500">Ketua Tim:</span>
                          <span className="text-2xs xs:text-xs font-medium">{getUserName(projectDetails?.Tim_Lead)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-2xs xs:text-xs text-gray-500">Dosen:</span>
                          <span className="text-2xs xs:text-xs font-medium">{getUserName(projectDetails?.ID_Dosen)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-2xs xs:text-xs text-gray-500">Mitra:</span>
                          <span className="text-2xs xs:text-xs font-medium">{getUserName(projectDetails?.ID_Mitra)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Project Details and Tasks */}
                <div className="w-full flex items-center justify-center">
                  {/* Project Overview Card */}
                  <div className="bg-white w-full rounded-lg shadow p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 break-words pr-2">{projectDetails?.Nama_Project}</h2>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-2xs xs:text-xs sm:text-sm rounded-full whitespace-nowrap ${
                        projectDetails?.Status === 'Pengembangan' ? 'bg-blue-100 text-blue-800' :
                        projectDetails?.Status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {projectDetails?.Status}
                      </span>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{projectDetails?.Deskripsi}</p>
                    
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Teknologi</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {projectDetails?.Teknologi?.map(tech => (
                          <span key={tech} className="bg-gray-100 text-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-2xs xs:text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contributors and Activity */}
                <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
                  
                  {/* Recent Activity Card */}
                  <div className="md:col-span-6 bg-white rounded-lg shadow p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Aktivitas Terbaru</h2>
                    <div className="overflow-y-auto max-h-[250px] sm:max-h-[300px]">
                      {recentCommits.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {recentCommits.slice(0, 5).map((commit) => (
                            <div 
                              key={commit.ID_Commit} 
                              className="flex items-start"
                            >
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <FiCode className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-0.5 sm:mb-1">
                                  <h4 className="font-medium text-gray-800 text-xs sm:text-sm truncate pr-2">{commit.Judul_Commit}</h4>
                                  <span className="text-2xs xs:text-xs text-gray-500 whitespace-nowrap">{formatDate(commit.Tgl_Commit)}</span>
                                </div>
                                <p className="text-2xs xs:text-xs text-gray-600 mb-0.5 sm:mb-1 line-clamp-2">{commit.Catatan}</p>
                                <div className="flex items-center flex-wrap gap-1 text-2xs xs:text-xs">
                                  <span className={`px-1.5 sm:px-2 py-0.5 rounded-full mr-1 sm:mr-2 ${
                                    commit.CommitType === 'Feature' ? 'bg-blue-100 text-blue-800' :
                                    commit.CommitType === 'Fix' ? 'bg-red-100 text-red-800' :
                                    commit.CommitType === 'Enhancement' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {commit.CommitType}
                                  </span>
                                  <span className="text-gray-500">oleh {getUserName(commit.User)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 text-xs sm:text-sm">
                          Belum ada aktivitas commit pada proyek ini
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Top Contributors Card */}
                  <div className="md:col-span-6 bg-white rounded-lg shadow p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Kontributor Terbaik</h2>
                    <div className="overflow-y-auto max-h-[250px] sm:max-h-[300px]">
                      {topContributors.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {topContributors.map((contributor, index) => (
                            <div key={contributor.id} className="flex items-center py-2 sm:py-3">
                              <div className="flex-shrink-0 mr-2 sm:mr-3 text-base sm:text-lg font-bold text-gray-400 w-4 sm:w-6 text-center">
                                #{index + 1}
                              </div>
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                {contributor.photo ? (
                                  <img
                                    src={contributor.photo}
                                    alt={contributor.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm sm:text-xl">
                                    {contributor.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate text-xs sm:text-sm">{contributor.name}</h4>
                                <div className="flex text-2xs xs:text-xs text-gray-500 gap-1 sm:gap-2 flex-wrap">
                                  <span>{contributor.commitCount} commit</span>
                                  <span className="hidden xs:inline">|</span>
                                  <span>+{contributor.linesAdded} / -{contributor.linesRemoved}</span>
                                </div>
                              </div>
                              <div className="ml-1 sm:ml-2 flex items-center bg-primary/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                <FiActivity className="w-2 h-2 sm:w-3 sm:h-3 text-primary mr-0.5 sm:mr-1" />
                                <span className="text-2xs xs:text-xs font-medium text-primary">{contributor.impact}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 text-xs sm:text-sm">
                          Belum ada kontributor pada proyek ini
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {dashboardTab === 'tasks' && (
              <div className="overflow-y-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Task Columns */}
                {/* To-Do */}
                <div className="bg-white rounded-lg shadow flex flex-col">
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-200 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 text-xs sm:text-sm">
                        {taskList.todo?.length || 0}
                      </span>
                      <h3 className="font-semibold text-gray-700 text-xs sm:text-sm">Akan Dikerjakan</h3>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] sm:max-h-[calc(100vh-260px)]">
                    {taskList.todo?.map(issue => (
                      <div key={issue.ID_Issue} className="bg-gray-50 p-2 sm:p-3 rounded-md shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-start justify-between mb-1 sm:mb-2">
                          <h4 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">{issue.Judul_Issue}</h4>
                          <span className={`text-2xs xs:text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ml-1 ${
                            issue.Prioritas === 'High' ? 'bg-red-100 text-red-800' :
                            issue.Prioritas === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {issue.Prioritas}
                          </span>
                        </div>
                        
                        <p className="text-2xs xs:text-xs text-gray-600 line-clamp-2 mb-2 sm:mb-3">
                          {issue.Deskripsi}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gray-100 mr-1">
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xs xs:text-xs rounded-full">
                                {getUserName(issue.Assignee).charAt(0)}
                              </div>
                            </div>
                            <span className="text-2xs xs:text-xs text-gray-500 line-clamp-1">{getUserName(issue.Assignee)}</span>
                          </div>
                          
                          <div className="flex items-center ml-1">
                            <FiClock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 mr-0.5 sm:mr-1" />
                            <span className="text-2xs xs:text-xs text-gray-500 whitespace-nowrap">
                              Est: {issue.Estimasi}
                            </span>
                          </div>
                        </div>
                        
                        {issue.Tags && issue.Tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                            {issue.Tags.map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-600 text-2xs xs:text-xs px-1 sm:px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {(!taskList.todo || taskList.todo.length === 0) && (
                      <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-gray-400 text-xs sm:text-sm">
                        <FiClipboard className="w-5 h-5 sm:w-6 sm:h-6 mb-2" />
                        <p>Tidak ada tugas</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* In Progress */}
                <div className="bg-white rounded-lg shadow flex flex-col">
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-200 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-blue-600 text-xs sm:text-sm">
                        {taskList.inProgress?.length || 0}
                      </span>
                      <h3 className="font-semibold text-blue-700 text-xs sm:text-sm">Sedang Dikerjakan</h3>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] sm:max-h-[calc(100vh-260px)]">
                    {taskList.inProgress?.map(issue => (
                      <div key={issue.ID_Issue} className="bg-blue-50 p-2 sm:p-3 rounded-md shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-start justify-between mb-1 sm:mb-2">
                          <h4 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">{issue.Judul_Issue}</h4>
                          <span className={`text-2xs xs:text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ml-1 ${
                            issue.Label === 'Bug' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {issue.Label}
                          </span>
                        </div>
                        
                        <p className="text-2xs xs:text-xs text-gray-600 line-clamp-2 mb-2 sm:mb-3">
                          {issue.Deskripsi}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gray-100 mr-1">
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xs xs:text-xs rounded-full">
                                {getUserName(issue.Assignee).charAt(0)}
                              </div>
                            </div>
                            <span className="text-2xs xs:text-xs text-gray-500 line-clamp-1">{getUserName(issue.Assignee)}</span>
                          </div>
                          
                          <div className="flex items-center ml-1">
                            <FiTrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500 mr-0.5 sm:mr-1" />
                            <span className="text-2xs xs:text-xs text-gray-500">
                              {issue.Progres || 0}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5 sm:mt-2">
                          <div 
                            className="bg-blue-500 h-1 rounded-full" 
                            style={{ width: `${issue.Progres || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    {(!taskList.inProgress || taskList.inProgress.length === 0) && (
                      <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-gray-400 text-xs sm:text-sm">
                        <FiActivity className="w-5 h-5 sm:w-6 sm:h-6 mb-2" />
                        <p>Tidak ada tugas dalam pengerjaan</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Done */}
                <div className="bg-white rounded-lg shadow flex flex-col sm:col-span-2 lg:col-span-1">
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-200 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-green-600 text-xs sm:text-sm">
                        {taskList.done?.length || 0}
                      </span>
                      <h3 className="font-semibold text-green-700 text-xs sm:text-sm">Selesai</h3>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] sm:max-h-[calc(100vh-260px)]">
                    {taskList.done?.map(issue => (
                      <div key={issue.ID_Issue} className="bg-green-50 p-2 sm:p-3 rounded-md shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-start justify-between mb-1 sm:mb-2">
                          <h4 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">{issue.Judul_Issue}</h4>
                          <span className="text-2xs xs:text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ml-1">
                            Selesai
                          </span>
                        </div>
                        
                        <p className="text-2xs xs:text-xs text-gray-600 line-clamp-2 mb-2 sm:mb-3">
                          {issue.Deskripsi}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gray-100 mr-1">
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xs xs:text-xs rounded-full">
                                {getUserName(issue.Assignee).charAt(0)}
                              </div>
                            </div>
                            <span className="text-2xs xs:text-xs text-gray-500 line-clamp-1">{getUserName(issue.Assignee)}</span>
                          </div>
                          
                          <div className="flex items-center ml-1">
                            <FiCalendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 mr-0.5 sm:mr-1" />
                            <span className="text-2xs xs:text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(issue.Tgl_Update)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(!taskList.done || taskList.done.length === 0) && (
                      <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-gray-400 text-xs sm:text-sm">
                        <FiCheckSquare className="w-5 h-5 sm:w-6 sm:h-6 mb-2" />
                        <p>Tidak ada tugas yang selesai</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {dashboardTab === 'activity' && (
              <div className="overflow-y-auto w-full grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
                {/* Activity Timeline */}
                <div className="md:col-span-7 bg-white rounded-lg shadow p-3 sm:p-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Linimasa Aktivitas</h2>
                  <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                    {recentCommits.length > 0 ? (
                      <div className="relative">
                        <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="space-y-4 sm:space-y-6 ml-7 sm:ml-10 relative">
                          {recentCommits.map((commit) => (
                            <div 
                              key={commit.ID_Commit} 
                              className="relative"
                            >
                              <div className={`absolute -left-4 sm:-left-6 mt-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
                                commit.CommitType === 'Feature' ? 'bg-blue-500' :
                                commit.CommitType === 'Fix' ? 'bg-red-500' :
                                commit.CommitType === 'Enhancement' ? 'bg-green-500' :
                                'bg-purple-500'
                              }`}></div>
                              <div className="flex flex-col">
                                <div className="flex justify-between mb-1">
                                  <h4 className="font-medium text-gray-800 text-xs sm:text-sm line-clamp-1 pr-2">{commit.Judul_Commit}</h4>
                                  <span className="text-2xs xs:text-xs text-gray-500 whitespace-nowrap">{formatDate(commit.Tgl_Commit)}</span>
                                </div>
                                <p className="text-2xs xs:text-sm text-gray-600 mb-1 line-clamp-2">{commit.Catatan}</p>
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-2xs xs:text-xs">
                                  <span className={`px-1.5 sm:px-2 py-0.5 rounded-full ${
                                    commit.CommitType === 'Feature' ? 'bg-blue-100 text-blue-800' :
                                    commit.CommitType === 'Fix' ? 'bg-red-100 text-red-800' :
                                    commit.CommitType === 'Enhancement' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {commit.CommitType || 'Other'}
                                  </span>
                                  
                                  <div className="flex items-center">
                                    <FiCode className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 mr-0.5 sm:mr-1" />
                                    <span className="text-gray-500">
                                      {commit.FilesChanged || '?'} berkas
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <span className="text-green-500 text-2xs xs:text-xs mr-0.5 sm:mr-1">+{commit.LinesAdded || '?'}</span>
                                    <span className="text-red-500 text-2xs xs:text-xs">-{commit.LinesRemoved || '?'}</span>
                                  </div>
                                  
                                  <span className="text-gray-500">oleh {getUserName(commit.User)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500 text-xs sm:text-sm">
                        Belum ada aktivitas commit pada proyek ini
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Commit Stats */}
                <div className="md:col-span-5 grid grid-cols-1 gap-3 sm:gap-4">
                  {/* Activity by Day */}
                  <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Aktivitas Commit per Hari</h2>
                    <div className="h-48 sm:h-64">
                      <Bar 
                        data={commitActivityData.byDay || {
                          labels: ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                          datasets: [{
                            data: [2, 5, 3, 6, 8, 4, 1],
                            backgroundColor: 'rgba(79, 70, 229, 0.7)',
                            borderColor: 'rgba(79, 70, 229, 1)',
                            borderWidth: 1,
                            borderRadius: 4,
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                drawBorder: false,
                                color: 'rgba(0, 0, 0, 0.05)',
                              },
                              ticks: {
                                precision: 0,
                                font: {
                                  size: window.innerWidth < 640 ? 8 : 10
                                }
                              }
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                font: {
                                  size: window.innerWidth < 640 ? 8 : 10
                                }
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              bodyFont: {
                                size: window.innerWidth < 640 ? 10 : 12
                              },
                              titleFont: {
                                size: window.innerWidth < 640 ? 10 : 12
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Activity Metrics */}
                  <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Metrik Aktivitas</h2>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="bg-secondary/10 p-2 sm:p-3 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Total Commit</div>
                        <div className="text-base sm:text-2xl font-bold text-gray-800">
                          {recentCommits.length}
                        </div>
                      </div>
                      
                      <div className="bg-purple-200 p-2 sm:p-3 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Kontributor</div>
                        <div className="text-base sm:text-2xl font-bold text-gray-800">
                          {topContributors.length}
                        </div>
                      </div>
                      
                      <div className="bg-green-200 p-2 sm:p-3 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Baris Ditambahkan</div>
                        <div className="text-base sm:text-2xl font-bold text-green-600">
                          +{recentCommits.reduce((acc, commit) => acc + (commit.LinesAdded || 0), 0)}
                        </div>
                      </div>
                      
                      <div className="bg-red-200 p-2 sm:p-3 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Baris Dihapus</div>
                        <div className="text-base sm:text-2xl font-bold text-red-600">
                          -{recentCommits.reduce((acc, commit) => acc + (commit.LinesRemoved || 0), 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500 bg-white rounded-lg shadow p-4 sm:p-8">
            <FiAlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-gray-300" />
            <p className="text-base sm:text-lg">Tidak ada proyek yang tersedia</p>
            <p className="text-xs sm:text-sm text-center">Anda tidak memiliki akses ke proyek manapun saat ini</p>
          </div>
        )}
      </div>
    </>
  );
}
