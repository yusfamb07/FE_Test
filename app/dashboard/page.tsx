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
import { CalendarIcon, Search, RotateCcw } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const paymentMethodData = [
  { name: "BCA", value: 1250, fill: "#3b82f6" },
  { name: "BRI", value: 980, fill: "#ef4444" },
  { name: "BNI", value: 750, fill: "#10b981" },
  { name: "DKI", value: 620, fill: "#f59e0b" },
  { name: "Mandiri", value: 890, fill: "#8b5cf6" },
  { name: "Flo", value: 450, fill: "#06b6d4" },
  { name: "KTP", value: 320, fill: "#84cc16" },
];

const gateData = [
  { name: "Gerbang A", value: 1200 },
  { name: "Gerbang B", value: 980 },
  { name: "Gerbang C", value: 850 },
  { name: "Gerbang D", value: 720 },
  { name: "Gerbang E", value: 650 },
];

const shiftData = [
  { name: "Shift 1", value: 35, fill: "#3b82f6" },
  { name: "Shift 2", value: 40, fill: "#ef4444" },
  { name: "Shift 3", value: 25, fill: "#10b981" },
];

const routeData = [
  { name: "Ruas Jakarta-Bogor", value: 45, fill: "#f59e0b" },
  { name: "Ruas Jakarta-Tangerang", value: 30, fill: "#8b5cf6" },
  { name: "Ruas Jakarta-Bekasi", value: 25, fill: "#06b6d4" },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDate(new Date());
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Ringkasan data lalu lintas dan pendapatan tol
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Pencarian</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Cari data..."
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
                        "w-full lg:w-[240px] justify-start text-left font-normal",
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
              <div className="flex items-end">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Lalu Lintas per Metode Pembayaran</CardTitle>
              <CardDescription>
                Data berdasarkan tanggal{" "}
                {format(selectedDate, "PPP", { locale: id })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Chart
                  options={{
                    chart: {
                      type: "bar",
                      height: 350,
                      toolbar: {
                        show: false,
                      },
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: "55%",
                        borderRadius: 4,
                      },
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stroke: {
                      show: true,
                      width: 2,
                      colors: ["transparent"],
                    },
                    xaxis: {
                      categories: paymentMethodData.map((item) => item.name),
                    },
                    yaxis: {
                      title: {
                        text: "Jumlah Kendaraan",
                      },
                    },
                    fill: {
                      opacity: 1,
                    },
                    tooltip: {
                      y: {
                        formatter: (val: number) => val + " kendaraan",
                      },
                    },
                    colors: ["#3b82f6"],
                    grid: {
                      borderColor: "#f1f5f9",
                      strokeDashArray: 3,
                    },
                  }}
                  series={[
                    {
                      name: "Jumlah Kendaraan",
                      data: paymentMethodData.map((item) => item.value),
                    },
                  ]}
                  type="bar"
                  height={350}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gates Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Lalu Lintas per Gerbang</CardTitle>
              <CardDescription>
                Data berdasarkan tanggal{" "}
                {format(selectedDate, "PPP", { locale: id })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Chart
                  options={{
                    chart: {
                      type: "bar",
                      height: 350,
                      toolbar: {
                        show: false,
                      },
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: "55%",
                        borderRadius: 4,
                      },
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stroke: {
                      show: true,
                      width: 2,
                      colors: ["transparent"],
                    },
                    xaxis: {
                      categories: gateData.map((item) => item.name),
                      labels: {
                        rotate: -45,
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Jumlah Kendaraan",
                      },
                    },
                    fill: {
                      opacity: 1,
                    },
                    tooltip: {
                      y: {
                        formatter: (val: number) => val + " kendaraan",
                      },
                    },
                    colors: ["#ef4444"],
                    grid: {
                      borderColor: "#f1f5f9",
                      strokeDashArray: 3,
                    },
                  }}
                  series={[
                    {
                      name: "Jumlah Kendaraan",
                      data: gateData.map((item) => item.value),
                    },
                  ]}
                  type="bar"
                  height={350}
                />
              </div>
            </CardContent>
          </Card>

          {/* Shift Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi per Shift</CardTitle>
              <CardDescription>
                Persentase lalu lintas berdasarkan shift kerja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Chart
                  options={{
                    chart: {
                      type: "donut",
                      height: 350,
                    },
                    labels: shiftData.map((item) => item.name),
                    colors: shiftData.map((item) => item.fill),
                    plotOptions: {
                      pie: {
                        donut: {
                          size: "60%",
                          labels: {
                            show: true,
                            total: {
                              show: true,
                              label: "Total",
                              formatter: () => "100%",
                            },
                          },
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val: number) => val.toFixed(1) + "%",
                    },
                    tooltip: {
                      y: {
                        formatter: (val: number) => val + "%",
                      },
                    },
                    legend: {
                      position: "bottom",
                      horizontalAlign: "center",
                    },
                    responsive: [
                      {
                        breakpoint: 480,
                        options: {
                          chart: {
                            width: 300,
                          },
                          legend: {
                            position: "bottom",
                          },
                        },
                      },
                    ],
                  }}
                  series={shiftData.map((item) => item.value)}
                  type="donut"
                  height={350}
                />
              </div>
            </CardContent>
          </Card>

          {/* Route Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi per Ruas</CardTitle>
              <CardDescription>
                Persentase lalu lintas berdasarkan ruas jalan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Chart
                  options={{
                    chart: {
                      type: "pie",
                      height: 350,
                    },
                    labels: routeData.map((item) => item.name),
                    colors: routeData.map((item) => item.fill),
                    plotOptions: {
                      pie: {
                        expandOnClick: true,
                        dataLabels: {
                          offset: -10,
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val: number) => val.toFixed(1) + "%",
                      style: {
                        fontSize: "12px",
                        fontWeight: "bold",
                      },
                    },
                    tooltip: {
                      y: {
                        formatter: (val: number) => val + "%",
                      },
                    },
                    legend: {
                      position: "bottom",
                      horizontalAlign: "center",
                    },
                    responsive: [
                      {
                        breakpoint: 480,
                        options: {
                          chart: {
                            width: 300,
                          },
                          legend: {
                            position: "bottom",
                          },
                        },
                      },
                    ],
                  }}
                  series={routeData.map((item) => item.value)}
                  type="pie"
                  height={350}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
