import {
  getCandidateDetailsReport,
  getCompanyDesignationStatusReport,
  getHrCompanyStatusReport,
} from "@/services/dashboardService";
import React, { useEffect, useState } from "react";
import CompanyReport from "./CompanyReport";
import CandidateDetailsReport from "./CandidateDetailsReport";
import HrDetails from "./HrDetails";
import TalentCornerHeader from "./TalentCornerHeader";

const TalentCornerDashboard = () => {
  // Single source of filter for all 3 tables
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    designation: "",
    language: "",
    hrId: "",
  });

  // Company states
  const [disposalColumn, setDisposalColumn] = useState([]);
  const [disposalData, setDisposalData] = useState([]);
  const [companyReportData, setCompanyReportData] = useState(false);

  // Candidate States
  const [candidateReport, setCandidateReport] = useState([]);
  const [candidateReportData, setCandidateReportData] = useState(false);

  // HR report states
  const [HrReportColumn, setHrReportColumn] = useState([]);
  const [HrReport, setHrReport] = useState([]);
  const [HrReportData, setHrReportData] = useState(false);

  //Company report pagination states
  const [companyPage, setCompanyPage] = useState(1);
  const [companyPagination, setCompanyPagination] = useState({
    currentPage: 1, totalPages: 1, totalSubmissions: 0,
  });

  //Candidate report pagination states
  const [candidatePage, setCandidatePage] = useState(1);
  const [candidatePagination, setCandidatePagination] = useState({
    currentPage: 1, totalPages: 1, totalSubmissions: 0,
  });

  //HR report pagination states
  const [hrPage, setHrPage] = useState(1);
  const [hrPagination, setHrPagination] = useState({
    currentPage: 1, totalPages: 1, totalSubmissions: 0,
  });

  // Whenever the filters change, reset every table back to page 1
  // and update filter state in one shot (avoids double-fetch races)
  const handleFiltersChange = (update) => {
    setFilters((prev) => (typeof update === "function" ? update(prev) : update));
    setCompanyPage(1);
    setCandidatePage(1);
    setHrPage(1);
  };

  // useEffect for fetch company report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getCompanyDesignationStatusReport({
          page: companyPage,
          limit: 5,
          ...filters,
        });
        setDisposalColumn(res.columns);
        setDisposalData(res.data);
        setCompanyPagination({
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          totalSubmissions: res.totalSubmissions,
        });
        setCompanyReportData(!!(res.data && res.data.length > 0));
      } catch (err) {
        console.error(err);
      }
    };
    fetchReport();
  }, [companyPage, filters]);

  // useEffect for fetch candidate report data
  useEffect(() => {
    const fetchCandidateReport = async () => {
      try {
        const res = await getCandidateDetailsReport({
          page: candidatePage,
          limit: 5,
          ...filters,
        });
        setCandidateReport(res.data);
        setCandidatePagination({
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          totalSubmissions: res.totalSubmissions,
        });
        setCandidateReportData(!!(res.data && res.data.length > 0));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCandidateReport();
  }, [candidatePage, filters]);

  // useEffect for fetch HR report data
  useEffect(() => {
    const fetchHrReport = async () => {
      try {
        const res = await getHrCompanyStatusReport({
          page: hrPage,
          limit: 5,
          ...filters,
        });
        setHrReport(res.data);
        setHrReportColumn(res.columns);
        setHrPagination({
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          totalSubmissions: res.totalSubmissions,
        });
        setHrReportData(!!(res.data && res.data.length > 0));
      } catch (err) {
        console.error(err);
      }
    };
    fetchHrReport();
  }, [hrPage, filters]); // was `[]` before — HR table never refetched on page OR filter changes

  return (
    <div>
      <TalentCornerHeader
        filters={filters}
        onFiltersChange={handleFiltersChange}
        companyTotal={companyPagination.totalSubmissions}
        candidateTotal={candidatePagination.totalSubmissions}
        hrTotal={hrPagination.totalSubmissions}
      />

      {companyReportData && (
        <CompanyReport
          disposalColumn={disposalColumn}
          disposalData={disposalData}
          pagination={companyPagination}
          onPageChange={setCompanyPage}
        />
      )}

      {candidateReportData && (
        <CandidateDetailsReport
          candidateReport={candidateReport}
          pagination={candidatePagination}
          onPageChange={setCandidatePage}
        />
      )}

      {HrReportData && (
        <HrDetails
        HrReportColumn={HrReportColumn}
          HrReport={HrReport}
          pagination={hrPagination}
          onPageChange={setHrPage}
        />
      )}
    </div>
  );
};

export default TalentCornerDashboard;