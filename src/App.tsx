import type { CustomCode } from "framer-plugin";
import { framer } from "framer-plugin";
import { useEffect, useState } from "react";
import "./App.css";

framer.showUI({
  position: "top right",
  width: 240,
  height: 250,
});

function useCustomCode() {
  const [customCode, setCustomCode] = useState<CustomCode | null>(null);
  useEffect(() => framer.subscribeToCustomCode(setCustomCode), []);
  return customCode;
}

export function App() {
  const customCode = useCustomCode();
  const [siteId, setSiteId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customCode && customCode.headEnd.html) {
      // Extract `siteId` from the added script if it exists
      const match = customCode.headEnd.html.match(/data-site="(.*?)"/);
      if (match) {
        setSiteId(match[1]);
      }
    }
  }, [customCode]);

  // Derive status message
  const getStatusMessage = () => {
    if (!customCode) return "Loading...";

    const { headEnd } = customCode;
    if (headEnd.html === null) return "No script added.";
    if (headEnd.disabled)
      return "Script added but disabled. Please enable it in settings.";
    return `Script is active.`;
  };

  // Determine button label based on status
  const getButtonLabel = () => {
    if (!customCode) return "Loading...";
    const { headEnd } = customCode;
    return headEnd.html === null ? "Add Script" : "Update Script";
  };

  const handleAddOrUpdateScript = async () => {
    try {
      if (!siteId) throw new Error("Site ID cannot be empty.");
      framer.setCustomCode({
        html: `
        <!-- Fathom - beautiful, simple website analytics -->
        <script src="https://cdn.usefathom.com/script.js" data-site="${siteId}" defer></script>
        <!-- / Fathom -->
        `,
        location: "headEnd",
      });
      setError(null); // Clear error on success
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred while adding the script."
      );
    }
  };

  const handleRemoveScript = async () => {
    try {
      framer.setCustomCode({
        html: null,
        location: "headEnd",
      });
      setSiteId(""); // Clear siteId on removal
      setError(null); // Clear error on success
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred while removing the script."
      );
    }
  };

  const hasScript = customCode?.headEnd.html !== null;

  return (
    <main>
      <p>Configure Fathom Analytics tracking code for your Framer project.</p>
      <div className="text-xs text-[var(--framer-color-text-secondary)] mt-1">
        <strong>Status:</strong> {getStatusMessage()}
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="w-full mt-1">
        <label
          htmlFor="siteId"
          className="block text-xs text-[var(--framer-color-text-secondary)] mb-1"
        >
          Site ID:
        </label>
        <input
          id="siteId"
          type="text"
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          placeholder="Enter your Fathom site ID"
          className="w-full"
        />
      </div>
      <button
        className="mt-1 framer-button-primary"
        onClick={handleAddOrUpdateScript}
        disabled={!siteId}
      >
        {getButtonLabel()}
      </button>
      {hasScript && (
        <button
          className="framer-button-secondary"
          onClick={handleRemoveScript}
        >
          Remove Script
        </button>
      )}
    </main>
  );
}
