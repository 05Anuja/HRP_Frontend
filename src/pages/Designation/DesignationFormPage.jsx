import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Layers } from "lucide-react";
import Axios from "@/utils/axiosConfig";
import DesignationForm from "@/components/Forms/DesignationForm";

const DesignationFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);

  const [initialData, setInitialData] = useState(location.state || null);
  const [loading, setLoading] = useState(isEdit && !location.state);

  useEffect(() => {
    if (isEdit && !initialData) {
      const fetchBackup = async () => {
        setLoading(true);
        try {
          // Since there is no get-by-id, fetch page-wise or first batch to match
          const res = await Axios.get("/designations", {
            params: { limit: 100 },
          });
          const list = res.data?.data || [];
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
  }, [id, isEdit, initialData]);

  const handleSuccess = () => {
    setTimeout(() => {
      navigate("/designations");
    }, 1200);
  };

  return (
    <div className="fade-in-slide max-w-6xl mx-auto py-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/designations")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-silgate-secondary hover:text-silgate-primary transition-all cursor-pointer mb-6"
      >
        <ArrowLeft size={13} />
        Back to Designations Directory
      </button>

      {/* Header */}
      <div className="mb-7 text-left">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-silgate-tertiary uppercase mb-1">
          {isEdit ? "Edit Designation" : "New Designation"}
        </p>
        <h1 className="text-2xl font-bold text-silgate-primary tracking-tight">
          {isEdit ? "Update Designation Role" : "Add Designation Role"}
        </h1>
        <p className="text-xs text-silgate-secondary mt-1">
          {isEdit
            ? "Modify designation details and update campaign target rules."
            : "Define a new candidate role designation and select which campaign intake forms can select it."}
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-silgate-outline-variant/25 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="h-6 w-6 rounded-full border-2 border-silgate-tertiary border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-silgate-secondary">
            Retrieving role details...
          </span>
        </div>
      ) : (
        <DesignationForm
          initialData={initialData}
          onClose={() => navigate("/designations")}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default DesignationFormPage;
