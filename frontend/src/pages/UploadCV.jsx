import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadCV } from "../lib/api";

const UploadCV = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    setFile(selected || null);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    try {
      await uploadCV(file);
      navigate("/career-interests");
    } catch (err) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 px-6 py-7 shadow-2xl shadow-slate-950/80 ring-1 ring-slate-800">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Upload Your CV
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Upload your latest CV to help companies discover your profile faster.
        </p>

        <form onSubmit={handleUpload} className="mt-5 space-y-4">
          {error ? (
            <p
              className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-center text-xs text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-6 text-center text-xs text-slate-300 hover:border-blue-500 hover:bg-slate-900 transition">
            <span className="mb-2 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-200">
              Choose PDF or DOC/DOCX
            </span>
            <span className="text-[11px] text-slate-400">
              Click to browse files or drag &amp; drop here
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <div className="min-h-[1.5rem] text-[11px] text-slate-300">
            {file ? (
              <span>
                Selected file:{" "}
                <span className="font-medium text-blue-300">{file.name}</span>
              </span>
            ) : (
              <span className="text-slate-500">No file selected yet.</span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition hover:bg-blue-500 hover:shadow-blue-500/40 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none"
            disabled={!file || loading}
          >
            {loading ? "Uploading…" : "Upload CV"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadCV;
