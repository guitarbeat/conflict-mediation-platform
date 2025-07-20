import React, { useState, useEffect } from "react";
import {
  Settings,
  X,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import logger, { LOG_LEVELS } from "../utils/logger";

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logLevel, setLogLevel] = useState(logger.level);
  const [logHistory, setLogHistory] = useState([]);
  const [showLogs, setShowLogs] = useState(true);
  const [copyStatus, setCopyStatus] = useState({});

  useEffect(() => {
    // * Only run in development
    if (!import.meta.env.DEV) return;

    const updateLogHistory = () => {
      setLogHistory(logger.getLogHistory());
    };

    // * Add keyboard shortcut for debug panel
    const handleKeyDown = (event) => {
      if (event.key === "F12" || (event.ctrlKey && event.key === "d")) {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // * Update every second
    const intervalId = setInterval(() => {
      updateLogHistory();
    }, 1000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLogLevelChange = (newLevel) => {
    setLogLevel(newLevel);
    window.setLogLevel(newLevel);
  };

  const exportLogs = () => {
    const dataStr = logger.exportLogs();
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `debug-logs-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const clearLogs = () => {
    logger.clearLogHistory();
    setLogHistory([]);
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const copyAllLogs = () => {
    const logText = logHistory
      .map(
        (log) =>
          `[${log.level.toUpperCase()}] [${log.context}] ${log.message}${
            log.data ? "\n" + JSON.stringify(log.data, null, 2) : ""
          }`
      )
      .join("\n");
    copyToClipboard(logText, "allLogs");
  };

  const copyFormData = () => {
    const formDataText = `Form Debug Data:\n\nLogs (${
      logHistory.length
    } entries):\n${logHistory
      .filter(
        (log) => log.context === "FormField" || log.context === "FormStats"
      )
      .map(
        (log) =>
          `[${log.level.toUpperCase()}] [${log.context}] ${log.message}${
            log.data ? "\n" + JSON.stringify(log.data, null, 2) : ""
          }`
      )
      .join("\n")}`;
    copyToClipboard(formDataText, "formData");
  };

  const copyCurrentFormState = () => {
    // Get the current form state from the most recent FormStats log
    const latestFormStats = logHistory
      .filter((log) => log.context === "FormStats")
      .pop();

    const formStateText = latestFormStats
      ? `Current Form State:\n${JSON.stringify(latestFormStats.data, null, 2)}`
      : "No form statistics available yet. Try interacting with the form first.";

    copyToClipboard(formStateText, "formState");
  };

  const copyFormFieldLogs = () => {
    const formFieldLogs = logHistory
      .filter((log) => log.context === "FormField")
      .map(
        (log) =>
          `[${log.level.toUpperCase()}] [${log.context}] ${log.message}${
            log.data ? "\n" + JSON.stringify(log.data, null, 2) : ""
          }`
      )
      .join("\n");

    const logText = formFieldLogs
      ? `Form Field Logs:\n\n${formFieldLogs}`
      : "No form field logs available yet. Try interacting with form fields first.";

    copyToClipboard(logText, "formFieldLogs");
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case "ERROR":
        return "bg-destructive text-destructive-foreground";
      case "WARN":
        return "bg-yellow-500 text-white";
      case "INFO":
        return "bg-blue-500 text-white";
      case "DEBUG":
        return "bg-green-500 text-white";
      case "TRACE":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // * Only show in development
  if (!import.meta.env.DEV) return null;

  return (
    <>
      {/* * Debug Panel Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
      >
        <Settings className="h-4 w-4" />
        <span className="ml-2">Debug</span>
      </Button>

      {/* * Debug Panel */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full z-50 bg-background/95 backdrop-blur-sm border-l border-border shadow-lg">
          <Card className="h-full w-96 max-w-[90vw] rounded-none border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                Debug Panel
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 overflow-y-auto h-[calc(100vh-80px)]">
              {/* * Controls Section */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Log Level</label>
                  <select
                    value={logLevel}
                    onChange={(e) =>
                      handleLogLevelChange(parseInt(e.target.value))
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    {Object.entries(LOG_LEVELS).map(([name, value]) => (
                      <option key={name} value={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" onClick={exportLogs}>
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyAllLogs}>
                      {copyStatus.allLogs ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copyStatus.allLogs ? "Copied!" : "Copy All"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearLogs}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              {/* * Logs Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Logs ({logHistory.length})
                  </label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowLogs(!showLogs)}
                  >
                    {showLogs ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {showLogs && (
                  <div className="bg-muted/50 rounded-md p-2 max-h-80 overflow-y-auto">
                    {logHistory.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No logs yet
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {logHistory
                          .slice(-30)
                          .reverse()
                          .map((log, index) => (
                            <div
                              key={index}
                              className="text-xs font-mono border-b border-border/20 pb-1 relative group"
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  copyToClipboard(
                                    `[${log.level.toUpperCase()}] [${
                                      log.context
                                    }] ${log.message}${
                                      log.data
                                        ? "\n" +
                                          JSON.stringify(log.data, null, 2)
                                        : ""
                                    }`,
                                    `logEntry-${index}`
                                  )
                                }
                              >
                                {copyStatus[`logEntry-${index}`] ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                              <div className="flex items-center gap-1 mb-1">
                                <Badge
                                  className={`${getLogLevelColor(
                                    log.level
                                  )} text-xs px-1 py-0`}
                                >
                                  {log.level}
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-blue-600 text-xs">
                                [{log.context}]
                              </div>
                              <div className="text-xs">{log.message}</div>
                              {log.data && (
                                <details className="mt-1">
                                  <summary className="cursor-pointer text-blue-600 text-xs">
                                    Data
                                  </summary>
                                  <div className="relative">
                                    <pre className="text-xs bg-background p-1 rounded mt-1 overflow-x-auto max-h-20">
                                      {JSON.stringify(log.data, null, 1)}
                                    </pre>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="absolute top-1 right-1 h-6 w-6 p-0"
                                      onClick={() =>
                                        copyToClipboard(
                                          JSON.stringify(log.data, null, 2),
                                          `log-${index}`
                                        )
                                      }
                                    >
                                      {copyStatus[`log-${index}`] ? (
                                        <Check className="h-3 w-3" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </details>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* * Quick Actions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Actions</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      logger.info("DebugPanel", "Manual test log");
                    }}
                  >
                    Test Log
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      logger.warn("DebugPanel", "Test warning");
                    }}
                  >
                    Test Warning
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      logger.error(
                        "DebugPanel",
                        "Test error",
                        new Error("Test error")
                      );
                    }}
                  >
                    Test Error
                  </Button>
                </div>
              </div>

              {/* * Form Debug Controls */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Form Debug</label>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={copyFormData}>
                    {copyStatus.formData ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    {copyStatus.formData ? "Copied!" : "Copy Form Data"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyCurrentFormState}
                  >
                    {copyStatus.formState ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    {copyStatus.formState ? "Copied!" : "Copy Form State"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyFormFieldLogs}
                  >
                    {copyStatus.formFieldLogs ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    {copyStatus.formFieldLogs ? "Copied!" : "Copy Field Logs"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default DebugPanel;
