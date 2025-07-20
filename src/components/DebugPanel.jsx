import React, { useState, useEffect } from "react";
import { Settings, X, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import logger, { LOG_LEVELS } from "../utils/logger";

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logLevel, setLogLevel] = useState(logger.level);
  const [logHistory, setLogHistory] = useState([]);
  const [showLogs, setShowLogs] = useState(true);
  const [performanceData, setPerformanceData] = useState({});

  useEffect(() => {
    // * Only run in development
    if (!import.meta.env.DEV) return;

    const updateLogHistory = () => {
      setLogHistory(logger.getLogHistory());
    };

    const updatePerformanceData = () => {
      if (performance.memory) {
        const memory = performance.memory;
        setPerformanceData({
          usedMB: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
          totalMB:
            Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
          limitMB:
            Math.round((memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100,
        });
      }
    };

    // * Update every second
    const intervalId = setInterval(() => {
      updateLogHistory();
      updatePerformanceData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
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

            <CardContent className="space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* * Controls Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="flex gap-2">
                    <Button size="sm" onClick={exportLogs}>
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearLogs}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Performance</label>
                  {performanceData.usedMB && (
                    <div className="text-xs space-y-1">
                      <div>
                        Memory: {performanceData.usedMB}MB /{" "}
                        {performanceData.limitMB}MB
                      </div>
                      <div>
                        Usage:{" "}
                        {Math.round(
                          (performanceData.usedMB / performanceData.limitMB) *
                            100
                        )}
                        %
                      </div>
                    </div>
                  )}
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
                  <div className="bg-muted/50 rounded-md p-2 max-h-60 overflow-y-auto">
                    {logHistory.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No logs yet
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {logHistory
                          .slice(-50)
                          .reverse()
                          .map((log, index) => (
                            <div key={index} className="text-xs font-mono">
                              <Badge
                                className={`mr-2 ${getLogLevelColor(
                                  log.level
                                )}`}
                              >
                                {log.level}
                              </Badge>
                              <span className="text-muted-foreground">
                                {log.timestamp}
                              </span>
                              <span className="text-blue-600 ml-2">
                                [{log.context}]
                              </span>
                              <span className="ml-2">{log.message}</span>
                              {log.data && (
                                <details className="ml-4 mt-1">
                                  <summary className="cursor-pointer text-blue-600">
                                    Data
                                  </summary>
                                  <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                                    {JSON.stringify(log.data, null, 2)}
                                  </pre>
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
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default DebugPanel;
