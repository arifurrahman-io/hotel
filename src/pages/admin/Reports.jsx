import React, { useState, useMemo } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// API & Custom Hooks
import { getSummaryReport } from "../../api/reportApi";
import useApi from "../../hooks/useApi";

// Components
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import DateRangePicker from "../../components/ui/DateRangePicker"; // The new modern date picker
import { DollarSign, BarChart, Bed, ChevronDown, FileText } from "lucide-react";

const Reports = () => {
  // Use a single state object for the date range
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [activePreset, setActivePreset] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const {
    data: report,
    loading,
    error,
    request: fetchReport,
  } = useApi(getSummaryReport);

  const handlePresetClick = (preset) => {
    setActivePreset(preset);
    const today = new Date();
    let start, end;

    switch (preset) {
      case "last7":
        start = subDays(today, 6);
        end = today;
        break;
      case "last30":
        start = subDays(today, 29);
        end = today;
        break;
      case "thisMonth":
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      default:
        return;
    }

    setDateRange({ from: start, to: end });
    // Immediately fetch the report for the preset range
    fetchReport(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    setActivePreset("custom");
    if (dateRange.from && dateRange.to) {
      fetchReport(
        format(dateRange.from, "yyyy-MM-dd"),
        format(dateRange.to, "yyyy-MM-dd")
      );
    }
  };

  const totalOccupancy = useMemo(() => {
    if (!report) return 0;
    return Object.values(report.summary.occupancyByRoomType).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [report]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Business Reports
      </h1>

      {/* Date Range Selector Card */}
      <Card className="mb-8">
        <Card.Header>
          <h2 className="text-xl font-semibold">Select Date Range</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["last7", "last30", "thisMonth"].map((p) => (
              <Button
                key={p}
                variant={activePreset === p ? "primary" : "secondary"}
                onClick={() => handlePresetClick(p)}
              >
                {p === "last7"
                  ? "Last 7 Days"
                  : p === "last30"
                  ? "Last 30 Days"
                  : "This Month"}
              </Button>
            ))}
          </div>
        </Card.Header>
        <form onSubmit={handleGenerateReport}>
          <Card.Content className="flex flex-col sm:flex-row items-end gap-4 border-t pt-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">
                Custom Range
              </label>
              <DateRangePicker
                initialRange={dateRange}
                onDateChange={(range) =>
                  setDateRange(range || { from: null, to: null })
                }
              />
            </div>
            <Button
              type="submit"
              isLoading={loading}
              className="w-full sm:w-auto"
              disabled={!dateRange.from || !dateRange.to}
            >
              Generate Custom
            </Button>
          </Card.Content>
        </form>
      </Card>

      {/* Report Display Area */}
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}

      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-red-50 border-red-200">
              <Card.Content className="text-center text-red-700">
                {error}
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {report && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              Report for{" "}
              {format(new Date(report.reportPeriod.from), "MMM d, yyyy")} to{" "}
              {format(new Date(report.reportPeriod.to), "MMM d, yyyy")}
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card>
                <Card.Content>
                  <DollarSign className="w-8 h-8 text-green-500 mb-2" />
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-4xl font-bold">
                    ${report.summary.totalRevenue}
                  </p>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <BarChart className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-4xl font-bold">
                    {report.summary.totalBookings}
                  </p>
                </Card.Content>
              </Card>

              {/* Data Visualization Card */}
              <Card className="md:col-span-2 xl:col-span-1">
                <Card.Content>
                  <Bed className="w-8 h-8 text-purple-500 mb-2" />
                  <h3 className="text-lg font-semibold">Occupancy by Type</h3>
                  <div className="mt-4 space-y-3">
                    {Object.entries(report.summary.occupancyByRoomType).map(
                      ([type, count]) => {
                        const percentage =
                          totalOccupancy > 0
                            ? (count / totalOccupancy) * 100
                            : 0;
                        return (
                          <div key={type}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{type}</span>
                              <span>{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-purple-600 h-2.5 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Collapsible Details Table */}
            <div className="mt-8">
              <Button
                variant="secondary"
                onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isDetailsVisible ? "Hide" : "Show"} Detailed Bookings
                <ChevronDown
                  className={`w-4 h-4 ml-2 transform transition-transform ${
                    isDetailsVisible ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <AnimatePresence>
                {isDetailsVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <Card className="mt-2">
                      <Card.Content className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b">
                              <th className="p-2 text-left">Guest</th>
                              <th className="p-2 text-left">Room</th>
                              <th className="p-2 text-left">Date</th>
                              <th className="p-2 text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.bookings.map((b) => (
                              <tr
                                key={b._id}
                                className="border-b last:border-0"
                              >
                                <td className="p-2">{b.user.name}</td>
                                <td className="p-2">{b.room.name}</td>
                                <td className="p-2">
                                  {format(new Date(b.createdAt), "MMM d, yyyy")}
                                </td>
                                <td className="p-2 text-right">
                                  ${b.totalPrice.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Card.Content>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial Empty State */}
      {!report && !loading && !error && (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow border">
          <p>Select a date range to generate a report.</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
