"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Search,
  RotateCcw,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface LalinData {
  id: string;
  Tanggal: string;
  IdGerbang: string;
  IdCabang: string;
  Shift: string;
  Tunai: number;
  eMandiri: number;
  eBca: number;
  eBni: number;
  eBri: number;
  eDki: number;
  eMega: number;
  eNobu: number;
  eFlo: number;
  dinaskary: number;
  dinasmitra: number;
  dinasopr: number;
}

// Sample data
const reportData = [
  {
    id: 1,
    date: "2024-01-15",
    gate: "Gerbang Tol Jakarta Timur",
    totalCash: 2500000,
    totalEToll: 4800000,
    totalFlo: 1200000,
    totalKTP: 800000,
    totalAll: 9300000,
    totalCombined: 8500000,
    shift: "Shift 1",
    route: "Jakarta-Bogor",
  },
  {
    id: 2,
    date: "2024-01-15",
    gate: "Gerbang Tol Jakarta Barat",
    totalCash: 1800000,
    totalEToll: 3200000,
    totalFlo: 900000,
    totalKTP: 600000,
    totalAll: 6500000,
    totalCombined: 5900000,
    shift: "Shift 2",
    route: "Jakarta-Tangerang",
  },
  {
    id: 3,
    date: "2024-01-15",
    gate: "Gerbang Tol Jakarta Utara",
    totalCash: 2100000,
    totalEToll: 3800000,
    totalFlo: 1100000,
    totalKTP: 700000,
    totalAll: 7700000,
    totalCombined: 7000000,
    shift: "Shift 3",
    route: "Jakarta-Bekasi",
  },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(reportData.length / itemsPerPage);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDate("");
    setCurrentPage(1);
    setSelectedPaymentType("all");
  };

  const handleExport = () => {
    // Simulate export functionality
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Tanggal,Gerbang,Total Tunai,Total E-Toll,Total Flo,Total KTP,Total Keseluruhan\n" +
      filteredData
        .map(
          (row) =>
            `${row.date},${row.gate},${row.totalCash},${row.totalEToll},${row.totalFlo},${row.totalKTP},${row.totalAll}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `laporan_lalin_${format(selectedDate, "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [lalinData, setLalinData] = useState<LalinData[]>([]);
  const [selectedReport, setSelectedReport] = useState<LalinData | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("all");

  const fetchLalinData = async (tanggal?: Date) => {
    setIsLoading(true);
    setError("");

    try {
      const url = tanggal
        ? `/api/lalins?tanggal=${format(tanggal, "yyyy-MM-dd")}`
        : "/api/lalins";

      const response = await apiRequest(url);
      const rows = response?.data?.rows?.rows || [];
      setLalinData(rows);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data lalu lintas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLalinData(selectedDate || undefined); // undefined = tanpa parameter tanggal
  }, [selectedDate]);

  const filteredData = lalinData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      String(item?.IdGerbang || "")
        .toLowerCase()
        .includes(query) ||
      String(item?.IdCabang || "")
        .toLowerCase()
        .includes(query) ||
      String(item?.NamaGerbang || "")
        .toLowerCase()
        .includes(query) ||
      String(item?.NamaCabang || "")
        .toLowerCase()
        .includes(query)
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaymentTypeTotal = (item: LalinData, type: string): number => {
    switch (type) {
      case "cash":
        return item.Tunai || 0;
      case "etoll":
        return (
          (item.eMandiri || 0) +
          (item.eBca || 0) +
          (item.eBni || 0) +
          (item.eBri || 0) +
          (item.eDki || 0) +
          (item.eMega || 0) +
          (item.eNobu || 0)
        );
      case "flo":
        return item.eFlo || 0;
      case "ktp":
        return (
          (item.dinaskary || 0) + (item.dinasmitra || 0) + (item.dinasopr || 0)
        );
      case "all":
        return (
          getPaymentTypeTotal(item, "cash") +
          getPaymentTypeTotal(item, "etoll") +
          getPaymentTypeTotal(item, "flo") +
          getPaymentTypeTotal(item, "ktp")
        );
      default:
        return 0;
    }
  };

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Laporan Lalu Lintas Harian
          </h1>
          <p className="text-gray-600">
            Data laporan lalu lintas per hari berdasarkan jenis pembayaran
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Pencarian</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Cari gerbang atau ruas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Type Filter */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                { key: "all", label: "Semua" },
                { key: "cash", label: "Tunai" },
                { key: "etoll", label: "E-Toll" },
                { key: "flo", label: "Flo" },
                { key: "ktp", label: "KTP" },
              ].map((type) => (
                <Button
                  key={type.key}
                  variant={
                    selectedPaymentType === type.key ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedPaymentType(type.key)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Filter laporan berdasarkan metode pembayaran: KTP, E-Toll, Flo,
              atau Tunai.
            </p>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Laporan</CardTitle>
            <CardDescription>
              Menampilkan {filteredData.length} data dari total{" "}
              {reportData.length} laporan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No/ID</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Gerbang</TableHead>
                    <TableHead>Cabang</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lalinData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        {format(new Date(item.Tanggal), "PPP", { locale: id })}
                      </TableCell>
                      <TableCell>Gerbang {item.IdGerbang}</TableCell>
                      <TableCell>Cabang {item.IdCabang}</TableCell>
                      {/* <TableCell>
                        <Badge variant="outline">{item.Shift}</Badge>
                      </TableCell> */}
                      <TableCell className="text-right font-mono font-semibold text-blue-600">
                        {formatCurrency(
                          getPaymentTypeTotal(item, selectedPaymentType)
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReport(item)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detail Laporan</DialogTitle>
                              <DialogDescription>
                                {item.IdGerbang} -{" "}
                                {format(new Date(item.Tanggal), "PPP", {
                                  locale: id,
                                })}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {["cash", "etoll", "flo", "ktp"].map((type) => (
                                <div key={type}>
                                  <Label className="text-sm text-muted-foreground">
                                    Total {type.toUpperCase()}
                                  </Label>
                                  <p className="text-lg font-semibold">
                                    {formatCurrency(
                                      getPaymentTypeTotal(item, type)
                                    )}
                                  </p>
                                </div>
                              ))}
                              <div className="col-span-2 border-t pt-4">
                                <Label className="text-sm text-muted-foreground">
                                  Total Keseluruhan
                                </Label>
                                <p className="text-lg font-bold text-blue-600">
                                  {formatCurrency(
                                    getPaymentTypeTotal(item, "all")
                                  )}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Show {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} from{" "}
                {filteredData.length} data
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <span className="text-sm">
                  Page {currentPage} from {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
