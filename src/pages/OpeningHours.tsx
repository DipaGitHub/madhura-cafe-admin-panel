import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Image as ImageIcon } from "lucide-react";
import { apiUrl, imageUrl } from "@/config/api";
import AdminLayout from "@/components/layout/AdminLayout";

const API_URL = apiUrl("/api/openingHours/admin");

interface OpeningHoursData {
  id: number;
  title: string;
  description: string;
  hours_1: string;
  hours_2: string;
  image_url?: string;
  image?: File | null;
}

const OpeningHours = () => {
  const [formData, setFormData] = useState<OpeningHoursData>({
    id: 0,
    title: "",
    description: "",
    hours_1: "",
    hours_2: "",
    image_url: "",
    image: null,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchOpeningHours();
  }, []);

  const fetchOpeningHours = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const data = result.data[0];
        setFormData({
          id: data.id,
          title: data.title || "",
          description: data.description || "",
          hours_1: data.hours_1 || "",
          hours_2: data.hours_2 || "",
          image_url: data.image_url || "",
          image: null,
        });
        
        if (data.image_url) {
          setImagePreview(data.image_url.startsWith('http') ? data.image_url : imageUrl(data.image_url));
        }
      }
    } catch (error) {
      console.error("Error fetching Opening Hours:", error);
      toast.error("Failed to fetch Opening Hours data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.hours_1) {
      toast.error("Title, description, and at least Hours 1 are required.");
      return;
    }
    if (formData.id === 0) {
      toast.error("No opening hours record found to update.");
      return;
    }

    setIsSaving(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("hours_1", formData.hours_1);
      submitData.append("hours_2", formData.hours_2);
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await fetch(`${API_URL}/update/${formData.id}`, {
        method: "PUT",
        body: submitData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("Opening Hours updated successfully!");
        fetchOpeningHours(); 
      } else {
        throw new Error(result.error || "Failed to update");
      }
    } catch (error) {
      console.error("Error saving Opening Hours:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
        <div>
        <h1 className="text-3xl font-bold tracking-tight">Opening Hours Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage the content displayed in the "Opening Hours" section of the website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Settings</CardTitle>
          <CardDescription>
            Update the title, description, timings, and background image used for the Opening Hours section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              name="title"
              placeholder="e.g. Opening Hours" 
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              name="description"
              placeholder="Enter a short description..."
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hours 1</label>
              <Input 
                name="hours_1"
                placeholder="e.g. SUNDAY - THURSDAY: 11:30AM - 11PM" 
                value={formData.hours_1}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Hours 2 (Optional)</label>
              <Input 
                name="hours_2"
                placeholder="e.g. FRIDAY & SATURDAY: 11:30AM - 12AM" 
                value={formData.hours_2}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium block">Background Image</label>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:bg-muted/50 transition-colors">
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4 bg-black/5">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
              )}
              
              <div className="relative">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="pointer-events-none">
                  {imagePreview ? "Change Background Image" : "Upload Image"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Recommended size: 1200x800px. High-quality ambiance image.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
};

export default OpeningHours;
