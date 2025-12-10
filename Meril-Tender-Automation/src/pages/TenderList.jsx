// TenderList.jsx
import { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import Navbar from "../components/Navbar";
import {
  Search,
  Filter,
  Download,
  Star,
  StarOff,
  StickyNote,
  Calendar,
  Clock,
  TrendingUp,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  BarChart3,
  RefreshCw
} from "lucide-react";
import "../assets/css/TenderList.css";

export default function TenderList() {
  const [tenders, setTenders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // NOTES MODAL
  const [noteTenderId, setNoteTenderId] = useState(null);
  const [noteText, setNoteText] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  // FILTER STATE
  const [filters, setFilters] = useState({
    keyword: "",
    referenceNumber: "",
    state: "",
    city: "",
    department: "",
    status: "",
    assignBy: "",
    assignTo: "",
    tenderId: "",
    website: "",
    closingFrom: "",
    closingTo: "",
    ownership: "",
    prebidFrom: "",
    prebidTo: "",
    mailType: "",
    lastUpdated: "",
    quantityCompare: ">=",
    quantity: "",
    tenderValueCompare: "=",
    tenderValue: "",
    tenderValueTo: "",
    gemStatus: "All",
    msmeExemption: "All",
    startupExemption: "All",
    manualEntry: "",
  });

  // FETCH API
  const getTenders = () => {
    axios
      .get("/gem-tenders", { params: { ...filters, page, limit } })
      .then((res) => {
        setTenders(res.data.data || []);
        setTotal(res.data.total);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTenders();
  }, [page]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const searchWithFilters = () => {
    setPage(1);
    axios
      .get("/gem-tenders", { params: { ...filters, page: 1, limit } })
      .then((res) => {
        setTenders(res.data.data || []);
        setTotal(res.data.total);
      });
  };

  const clearFilters = () => {
    const empty = {
      keyword: "",
      referenceNumber: "",
      state: "",
      city: "",
      department: "",
      status: "",
      assignBy: "",
      assignTo: "",
      tenderId: "",
      website: "",
      closingFrom: "",
      closingTo: "",
      ownership: "",
      prebidFrom: "",
      prebidTo: "",
      mailType: "",
      lastUpdated: "",
      quantityCompare: ">=",
      quantity: "",
      tenderValueCompare: "=",
      tenderValue: "",
      tenderValueTo: "",
      gemStatus: "All",
      msmeExemption: "All",
      startupExemption: "All",
      manualEntry: "",
    };
    setFilters(empty);
    setPage(1);

    axios
      .get("/gem-tenders", { params: { ...empty, page: 1, limit } })
      .then((res) => {
        setTenders(res.data.data || []);
        setTotal(res.data.total);
      });
  };

  // TIME LEFT
  const getTimeLeft = (endDateStr) => {
    const end = new Date(endDateStr);
    const now = new Date();
    const diffMs = end - now;

    if (diffMs <= 0) return { text: "Closed", status: "closed" };

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

    if (days <= 2) return { text: `${days}d ${hours}h left`, status: "urgent" };
    if (days <= 7) return { text: `${days}d ${hours}h left`, status: "soon" };
    return { text: `${days}d ${hours}h left`, status: "active" };
  };

  // NOTE HANDLER
  const openNotePopup = (id) => {
    setNoteTenderId(id);
    setNoteText("");
  };

  const closeNotePopup = () => {
    setNoteTenderId(null);
    setNoteText("");
  };

  const saveNote = () => {
    console.log("Saving note:", noteTenderId, noteText);
    closeNotePopup();
  };

  // CONFIDENCE CSS
  const getConfidenceClass = (score) => {
    if (!score) return "confidence-na";
    if (score >= 80) return "confidence-high";
    if (score >= 50) return "confidence-medium";
    return "confidence-low";
  };

  // ⭐ NEW — TOGGLE INTEREST FUNCTION
  const toggleInterest = async (id) => {
    try {
      const res = await axios.post("/gem-tenders-interest/toggle", {
        tenderId: id,
      });

      setTenders((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_interested: res.data.is_interested } : t
        )
      );
    } catch (err) {
      console.log("Interest toggle failed:", err);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="tenders-page">

          {/* HEADER */}
          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">Active Tenders</h1>
              <p className="page-subtitle">Showing {tenders.length} of {total} tenders</p>
            </div>
            <div className="header-right">
              <button className="btn-icon" onClick={getTenders}>
                <RefreshCw size={18} />
                <span>Refresh</span>
              </button>
              <button
                className={`btn-icon ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="search-section">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleChange}
                placeholder="Search by keywords, bid number, or department..."
                className="search-input"
              />
              <button className="search-button" onClick={searchWithFilters}>
                Search
              </button>
            </div>
          </div>

          {/* TENDER CARDS */}
          <div className="tenders-grid">
            {tenders.map((t, index) => {
              const formattedEnd = new Date(t.end_date).toLocaleDateString("en-GB");
              const timeLeft = getTimeLeft(t.end_date);
              const confidence =
                t.main_relevency_score != null
                  ? Math.round(t.main_relevency_score * 100)
                  : null;

              const confidenceClass = getConfidenceClass(confidence);
              const interested = t.is_interested === 1;

              return (
                <div className="tender-card" key={t.id}>
                  {/* LEFT HEADER */}
                  <div className="card-header">
                    <div className="card-number">
                      <span className="hash">#</span>
                      {(page - 1) * limit + index + 1}
                    </div>
                    <div className={`time-badge ${timeLeft.status}`}>
                      <Clock size={14} />
                      <span>{timeLeft.text}</span>
                    </div>
                  </div>

                  {/* MIDDLE DETAILS */}
                  <div className="card-main-content">
                    <div className="bid-section">
                      <FileText size={18} className="bid-icon" />
                      <span className="bid-number">{t.bid_number}</span>
                    </div>

                    <div className="card-description">
                      <p>{t.items}</p>
                    </div>

                    <div className="info-grid">
                      <div className="info-item">
                        <Building2 size={16} className="info-icon" />
                        <div className="info-content">
                          <span className="info-label">Department</span>
                          <span className="info-value">{t.department || "N/A"}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <Calendar size={16} className="info-icon" />
                        <div className="info-content">
                          <span className="info-label">End Date</span>
                          <span className="info-value">{formattedEnd}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div className="card-right-section">

                    {/* Metrics */}
                    <div className="metrics-section">
                      <div className={`metric-badge ${confidenceClass}`}>
                        <BarChart3 size={16} />
                        <div className="metric-content">
                          <span className="metric-label">Confidence</span>
                          <span className="metric-value">
                            {confidence !== null ? `${confidence}%` : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="metric-badge confidence-na">
                        <TrendingUp size={16} />
                        <div className="metric-content">
                          <span className="metric-label">Win Prediction</span>
                          <span className="metric-value">N/A</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="card-actions">

                      {/* Note */}
                      <button
                        className="action-btn btn-note"
                        onClick={() => openNotePopup(t.id)}
                      >
                        <StickyNote size={16} />
                        <span>Note</span>
                      </button>

                      {/* Interest */}
                      <button
                        className={`action-btn btn-interest ${interested ? "active" : ""}`}
                        onClick={() => toggleInterest(t.id)}
                      >
                        {interested ? (
                          <Star size={16} fill="gold" />
                        ) : (
                          <StarOff size={16} />
                        )}
                        <span>{interested ? "Interested" : "Interest"}</span>
                      </button>

                      {/* Download */}
                      <button
                        className="action-btn btn-download"
                        onClick={() => window.open(t.detail_url, "_blank")}
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="pagination-section">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            <div className="pagination-info">
              <span className="page-text">Page</span>
              <span className="page-number">{page}</span>
              <span className="page-text">of</span>
              <span className="page-number">{totalPages}</span>
            </div>

            <button
              className="pagination-btn"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* NOTE MODAL */}
      {noteTenderId && (
        <div className="modal-overlay" onClick={closeNotePopup}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-section">
                <StickyNote size={24} className="modal-icon" />
                <h3>Add Note</h3>
              </div>
              <button className="modal-close" onClick={closeNotePopup}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your note here..."
                className="note-textarea"
                rows={6}
              ></textarea>
            </div>

            <div className="modal-footer">
              <button
                onClick={closeNotePopup}
                className="modal-btn btn-cancel"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
              <button
                onClick={saveNote}
                className="modal-btn btn-save"
              >
                <Check size={18} />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
