import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/layout/AdminLayout";
import { apiUrl, imageUrl } from "@/config/api";
import { toast } from "sonner";

interface Gallery {
  id: number;
  image: string;
  image_title: string;
  image_type: string;
  is_featured: boolean;
  uploaded_at: string;
}

const Galleries = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState("interior");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl('/api/gallery'));
      const result = await res.json();
      if (result.success) {
        setGalleries(result.data);
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
      toast.error("Failed to load gallery images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const resetForm = () => {
    setTitle("");
    setType("interior");
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreate = async () => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('image_title', title);
      formData.append('image_type', type);

      const res = await fetch(apiUrl('/api/gallery'), {
        method: 'POST',
        body: formData
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Image uploaded successfully");
        setIsCreateOpen(false);
        resetForm();
        fetchGalleries();
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(apiUrl(`/api/gallery/${id}`), {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Image deleted successfully");
        setGalleries(galleries.filter(g => g.id !== id));
      } else {
        toast.error(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setGalleries(galleries.map(g => g.id === id ? { ...g, is_featured: newStatus } : g));

    try {
      const res = await fetch(apiUrl(`/api/gallery/${id}/toggle-featured`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: newStatus })
      });
      const result = await res.json();
      
      if (!result.success) {
        // Revert on failure
        setGalleries(galleries.map(g => g.id === id ? { ...g, is_featured: currentStatus } : g));
        toast.error("Failed to update featured status");
      } else {
        toast.success(newStatus ? "Added to Home Page" : "Removed from Home Page");
      }
    } catch (error) {
      console.error("Error toggling:", error);
      setGalleries(galleries.map(g => g.id === id ? { ...g, is_featured: currentStatus } : g));
      toast.error("Failed to update status");
    }
  };

  const filteredGalleries = galleries.filter((gallery) =>
    (gallery.image_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gallery.image_type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Home › Galleries
            </div>
            <h1 className="text-3xl font-bold">Image Gallery</h1>
          </div>
          <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" /> Upload Image
          </Button>
        </div>

        {/* Content Card */}
        <div className="rounded-lg border border-border bg-card">
          {/* Search */}
          <div className="border-b border-border p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium">Image</th>
                  <th className="p-4 text-left text-sm font-medium">Title</th>
                  <th className="p-4 text-left text-sm font-medium">Type</th>
                  <th className="p-4 text-left text-sm font-medium">Home Page (Featured)</th>
                  <th className="p-4 text-left text-sm font-medium">Uploaded</th>
                  <th className="p-4 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Loading gallery...
                    </td>
                  </tr>
                ) : filteredGalleries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No images found.
                    </td>
                  </tr>
                ) : (
                  filteredGalleries.map((gallery) => (
                    <tr key={gallery.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-4">
                        <div className="h-16 w-24 rounded overflow-hidden bg-muted flex items-center justify-center">
                          {gallery.image ? (
                            <img 
                              src={imageUrl(gallery.image)} 
                              alt={gallery.image_title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                              }}
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium">{gallery.image_title || "Untitled"}</td>
                      <td className="p-4 text-sm capitalize">
                        <span className="bg-secondary px-2 py-1 rounded text-xs">
                          {gallery.image_type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={gallery.is_featured}
                            onCheckedChange={() => handleToggleFeatured(gallery.id, gallery.is_featured)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {gallery.is_featured ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(gallery.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDelete(gallery.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image File <span className="text-destructive">*</span></Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${previewUrl ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="max-h-[200px] mx-auto rounded object-cover" />
                    <p className="text-xs text-muted-foreground mt-2">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <div className="text-sm font-medium">Click to browse or drag image here</div>
                    <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WEBP (Max 5MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Image Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Cozy Interior Seating"
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Image Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interior">Interior / Ambience</SelectItem>
                  <SelectItem value="food">Food / Cuisine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-primary" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Galleries;
