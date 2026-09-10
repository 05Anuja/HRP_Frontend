import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";
import Axios from "@/utils/axiosConfig";
import TalentCornerForm from "@/components/Forms/TalentCornerForm";

const TalentCornerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);

  const [initialData, setInitialData] = useState(location.state || null);
  const [loading, setLoading] = useState(isEdit && !location.state);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isSuperadmin = user?.role === "superadmin";

  useEffect(() => {
    if (isEdit && !initialData) {
      const fetchBackup = async () => {
        setLoading(true);
        try {
          const fetchUrl = isSuperadmin ? "/talent/allData" : "/talent/myData";
          const res = await Axios.get(fetchUrl, {
            params: { limit: 100 }, // Query first batch
          });
          const list = res.data?.submissions || res.data?.data || [];
          const found = list.find((item) => item._id === id);
          if (found) {
            setInitialData(found);
          } else {
            console.warn("Record not found in overview list");
          }
        } catch (err) {
          console.error("Backup fetch failed", err);
        } finally {
          setLoading(false);
        }
      };
      fetchBackup();
    }
  }, [id, isEdit, initialData, isSuperadmin]);

  const handleSuccess = () => {
    setTimeout(() => {
      navigate("/submissions/talent-corner");
    }, 1200);
  };

  return (
    <div className="fade-in-slide max-w-6xl mx-auto py-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/submissions/talent-corner")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-silgate-secondary hover:text-silgate-primary transition-all cursor-pointer mb-6"
      >
        <ArrowLeft size={13} />
        Back to Talent Corner Logs
      </button>

      {/* Header */}
      <div className="mb-7">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-silgate-tertiary uppercase mb-1">
          {isEdit ? "Edit Record" : "New Record"}
        </p>
        <h1 className="text-2xl font-bold text-silgate-primary tracking-tight">
          {isEdit ? "Update Talent Corner Entry" : "Add Talent Corner Candidate"}
        </h1>
        <p className="text-xs text-silgate-secondary mt-1">
          {isEdit
            ? "Modify candidate details, designation settings, and resume status."
            : "Fill in the candidate parameters to log a new candidate and tracking record."}
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-silgate-outline-variant/25 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="h-6 w-6 rounded-full border-2 border-silgate-tertiary border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-silgate-secondary">
            Retrieving entry details...
          </span>
        </div>
      ) : (
        <TalentCornerForm
          initialData={initialData}
          isEdit={isEdit}
          onClose={() => navigate("/submissions/talent-corner")}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default TalentCornerFormPage;
