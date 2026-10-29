import { useState, useCallback, useEffect, useMemo } from "react";
import { Search, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { apiUrl, imageUrl } from "@/config/api";

const API_BASE_URL = apiUrl("/api/page-banners");

interface PageBanner {
  id: number;
  page_title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface BannerFormData {
  pageTitle: string;
  image: File | null;
}

const PageBanners = () => {
  const [banners, setBanners] = useState<PageBanner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<BannerFormData>({
    pageTitle: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setBanners(result.data || []);
    } catch (err) {
      console.error("Error fetching page banners:", err);
      setError("Failed to fetch page banners. Check console for details.");
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleCreate = async () => {
    if (!createFormData.pageTitle || !createFormData.image) {
      toast.error("Page Title and Image are required.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('pageTitle', createFormData.pageTitle);
    formData.append('image', createFormData.image);

    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `Failed with status: ${response.status}`);
      }
      
      setUploadProgress(100);
      toast.success("Page banner saved successfully!");
      setIsCreateOpen(false);
      setCreateFormData({ pageTitle: "", image: null });
      await fetchBanners();

    } catch (err) {
      console.error('Error saving page banner:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error("Failed to save page banner.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this page banner?")) {
      return;
    }
    
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || 'Failed to delete banner');
      }

      toast.success("Page banner deleted successfully!");
      await fetchBanners();
    } catch (error) {
       console.error("Error deleting banner:", error);
       toast.error(error instanceof Error ? error.message : "Failed to delete banner.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBanners = useMemo(() => {
    return banners.filter(banner =>
      banner.page_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [banners, searchTerm]);

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Page Banners</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsCreateOpen(true)} disabled={isProcessing}>
              Upload New Banner
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by page title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-full"
            />
          </div>
           <Button variant="outline" size="icon" onClick={fetchBanners} disabled={isLoading || isProcessing}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
           </Button>
        </div>

        <div className="rounded-md border">
           {isLoading ? (
               <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                 <Loader2 className="h-8 w-8 animate-spin mb-2" />
                 <p>Loading banners...</p>
               </div>
            ) : filteredBanners.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                   <p>No page banners found.</p>
                   {searchTerm && <p className="text-sm">Try adjusting your search.</p>}
               </div>
            ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Page Title</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredBanners.map((banner) => (
                  <tr key={banner.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{banner.page_title}</td>
                    <td className="p-4 align-middle">
                      {banner.image_url ? (
                         <div className="w-32 h-16 rounded overflow-hidden border">
                            <img src={imageUrl(banner.image_url)} alt="Banner" className="w-full h-full object-cover" />
                         </div>
                      ) : (
                          <span className="text-muted-foreground italic">No image</span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                       <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)} disabled={isProcessing}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            )}
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Page Banner</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="pageTitle">Page Title (e.g. About Us)</Label>
                <Select
                  value={createFormData.pageTitle}
                  onValueChange={(val) => setCreateFormData({ ...createFormData, pageTitle: val })}
                >
                   <SelectTrigger>
                     <SelectValue placeholder="Select Page Title" />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="About Us">About Us</SelectItem>
                      <SelectItem value="Blog">Blog</SelectItem>
                      <SelectItem value="Contact Us">Contact Us</SelectItem>
                      <SelectItem value="Menu">Menu</SelectItem>
                      <SelectItem value="Gallery">Gallery</SelectItem>
                   </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Banner Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCreateFormData({ ...createFormData, image: file });
                  }}
                  disabled={isProcessing}
                />
                 {createFormData.image && (
                     <p className="text-xs text-muted-foreground mt-1">
                         Selected: {createFormData.image.name}
                     </p>
                 )}
              </div>
               {isProcessing && uploadProgress > 0 && (
                   <div className="space-y-1">
                       <Progress value={uploadProgress} />
                       <p className="text-xs text-right text-muted-foreground">{uploadProgress}%</p>
                   </div>
               )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isProcessing}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleCreate} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Banner"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PageBanners;
