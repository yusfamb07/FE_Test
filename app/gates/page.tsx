"use client";

import { useState } from "react";
import { useEffect } from "react";
import { apiRequest } from "@/lib/api";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function GatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gatesData, setGatesData] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<any>(null);
  const [searchField, setSearchField] = useState("NamaCabang"); // default: NamaCabang

  const [formData, setFormData] = useState({
    IdCabang: "",
    NamaGerbang: "",
    NamaCabang: "",
  });

  useEffect(() => {
    fetchGates("", "NamaCabang");
  }, []);

  const fetchGates = async (query: string, field: string) => {
    const params = new URLSearchParams();

    if (query && field) {
      params.append(field, query);
    }

    try {
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await apiRequest(`/api/gerbangs${queryString}`);
      const gates = response?.data?.rows?.rows ?? [];
      setGatesData(gates);
    } catch (error) {
      console.error("Gagal memuat data gerbang:", error);
    }
  };

  const handleSearch = () => {
    fetchGates(searchQuery.trim(), searchField);
  };

  const handleReset = () => {
    setSearchQuery("");
    fetchGates("", searchField);
  };

  const { toast } = useToast();
  const itemsPerPage = 10;

  const filteredData = gatesData.filter(
    (gate) =>
      gate.NamaGerbang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gate.NamaCabang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = async () => {
    const newId = Math.max(...gatesData.map((g) => g.id), 0) + 1;

    const newGate = {
      id: newId,
      IdCabang: parseInt(formData.IdCabang),
      NamaGerbang: formData.NamaGerbang,
      NamaCabang: formData.NamaCabang,
    };

    try {
      await apiRequest("/api/gerbangs", {
        method: "POST",
        body: newGate,
      });

      setGatesData([...gatesData, newGate]);

      toast({
        title: "Berhasil",
        description: "Data gerbang berhasil ditambahkan",
      });

      setIsAddDialogOpen(false);
      setFormData({
        IdCabang: "",
        NamaGerbang: "",
        NamaCabang: "",
      });
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menambahkan data",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    const updatedGate = {
      id: formData.id,
      IdCabang: parseInt(formData.IdCabang),
      NamaGerbang: formData.NamaGerbang,
      NamaCabang: formData.NamaCabang,
    };

    try {
      await apiRequest(`/api/gerbangs`, {
        method: "PUT",
        body: updatedGate,
      });

      setGatesData(
        gatesData.map((gate) =>
          gate.id === updatedGate.id ? updatedGate : gate
        )
      );

      toast({
        title: "Berhasil",
        description: "Data gerbang berhasil diperbarui",
      });

      setIsEditDialogOpen(false);
      setSelectedGate(null);
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message || "Gagal memperbarui data gerbang",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number, IdCabang: number) => {
    try {
      await apiRequest(`/api/gerbangs`, {
        method: "DELETE",
        body: {
          id,
          IdCabang,
        },
      });

      // Update state lokal
      setGatesData(gatesData.filter((gate) => gate.id !== id));

      toast({
        title: "Berhasil",
        description: "Data gerbang berhasil dihapus",
      });
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menghapus data gerbang",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (gate: any) => {
    setSelectedGate(gate);
    setFormData({
      id: gate.id,
      IdCabang: String(gate.IdCabang),
      NamaGerbang: gate.NamaGerbang,
      NamaCabang: gate.NamaCabang,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Master Data Gerbang
            </h1>
            <p className="text-gray-600">Kelola data gerbang tol</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Gerbang
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Gerbang Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi gerbang tol baru
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="NamaGerbang">Nama Gerbang</Label>
                <Input
                  id="NamaGerbang"
                  value={formData.NamaGerbang}
                  onChange={(e) =>
                    setFormData({ ...formData, NamaGerbang: e.target.value })
                  }
                  placeholder="Masukkan nama gerbang"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="IdCabang">Id Cabang</Label>
                <Input
                  id="IdCabang"
                  value={formData.IdCabang}
                  onChange={(e) =>
                    setFormData({ ...formData, IdCabang: e.target.value })
                  }
                  placeholder="Masukkan ID Cabang"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="NamaCabang">Nama Cabang</Label>
                <Input
                  id="NamaCabang"
                  value={formData.NamaCabang}
                  onChange={(e) =>
                    setFormData({ ...formData, NamaCabang: e.target.value })
                  }
                  placeholder="Masukkan Nama Cabang"
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleAdd}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Cari berdasarkan ${
                    searchField === "NamaCabang"
                      ? "Nama Cabang"
                      : "Nama Gerbang"
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="pl-10"
                />
              </div>

              <Select value={searchField} onValueChange={setSearchField}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NamaCabang">Nama Cabang</SelectItem>
                  <SelectItem value="NamaGerbang">Nama Gerbang</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch}>Cari</Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Data Gerbang</CardTitle>
                <CardDescription>
                  Menampilkan {filteredData.length} data dari total{" "}
                  {gatesData.length} gerbang
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Gerbang</TableHead>
                    <TableHead>Cabang</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gatesData.length > 0 ? (
                    gatesData.map((gate, index) => (
                      <TableRow key={`${gate.id}-${index}`}>
                        <TableCell className="font-mono">{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {gate.NamaGerbang || (
                            <span className="text-red-500 italic">Kosong</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {gate.NamaCabang || (
                            <span className="text-red-500 italic">Kosong</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Detail Dialog */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Detail Gerbang</DialogTitle>
                                  <DialogDescription>
                                    {gate.NamaGerbang}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <Label className="text-sm text-gray-500">
                                      ID
                                    </Label>
                                    <p className="font-mono">{gate.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-500">
                                      Nama Gerbang
                                    </Label>
                                    <p>{gate.NamaGerbang}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-gray-500">
                                      Cabang
                                    </Label>
                                    <p>{gate.NamaCabang}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Edit Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(gate)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            {/* Delete Dialog */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Hapus Gerbang
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Yakin ingin menghapus gerbang "
                                    {gate.NamaGerbang}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDelete(gate.id, gate.IdCabang)
                                    }
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 italic"
                      >
                        Tidak ada data gerbang ditemukan
                      </TableCell>
                    </TableRow>
                  )}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Gerbang</DialogTitle>
              <DialogDescription>
                Perbarui informasi gerbang tol
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nama-gerbang">Nama Gerbang</Label>
                <Input
                  id="edit-nama-gerbang"
                  value={formData.NamaGerbang}
                  onChange={(e) =>
                    setFormData({ ...formData, NamaGerbang: e.target.value })
                  }
                  placeholder="Masukkan nama gerbang"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-id-cabang">ID Cabang</Label>
                <Input
                  id="edit-id-cabang"
                  type="number"
                  value={formData.IdCabang}
                  onChange={(e) =>
                    setFormData({ ...formData, IdCabang: e.target.value })
                  }
                  placeholder="Masukkan ID Cabang"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-nama-cabang">Nama Cabang</Label>
                <Input
                  id="edit-nama-cabang"
                  value={formData.NamaCabang}
                  onChange={(e) =>
                    setFormData({ ...formData, NamaCabang: e.target.value })
                  }
                  placeholder="Masukkan Nama Cabang"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={handleEdit}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
