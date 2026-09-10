import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";
import Axios from "@/utils/axiosConfig";
import SilgateForm from "@/components/Forms/SilgateForm";

const SilgateFormPage = () => {
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
          const fetchUrl = isSuperadmin ? "/silgate/allData" : "/silgate/myData";
          const res = await Axios.get(fetchUrl, {
            params: { limit: 100 }, // Query first batch to find match
          });
          const list = res.data?.submissions || res.data?.data || [];
          const found = list.find((item) => item._id === id);
          if (found) {
            setInitialData(found);
          } else {
            // If not found in first batch, try fetching direct update state if possible
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
      navigate("/submissions/silgate");
    }, 1200);
  };

  return (
    <div className="fade-in-slide max-w-6xl mx-auto py-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/submissions/silgate")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-silgate-secondary hover:text-silgate-primary transition-all cursor-pointer mb-6"
      >
        <ArrowLeft size={13} />
        Back to Silgate Logs
      </button>

      {/* Header */}
      <div className="mb-7">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-silgate-tertiary uppercase mb-1">
          {isEdit ? "Edit Record" : "New Record"}
        </p>
        <h1 className="text-2xl font-bold text-silgate-primary tracking-tight">
          {isEdit ? "Update Silgate Entry" : "Add Silgate Candidate"}
        </h1>
        <p className="text-xs text-silgate-secondary mt-1">
          {isEdit
            ? "Modify candidate details and lineup disposition settings."
            : "Fill in the candidate parameters to log a new lineup entry."}
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
        <SilgateForm
          initialData={initialData}
          onClose={() => navigate("/submissions/silgate")}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default SilgateFormPage;
