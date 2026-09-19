import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Image as ImageIcon } from "lucide-react";
import { apiUrl, imageUrl } from "@/config/api";
import AdminLayout from "@/components/layout/AdminLayout";

const API_URL = apiUrl("/api/aboutUs");

interface AboutUsData {
  title: string;
  description: string;
  image_url?: string;
  image?: File | null;
}

const AboutUs = () => {
  const [formData, setFormData] = useState<AboutUsData>({
    title: "",
    description: "",
    image_url: "",
    image: null,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      
      if (result.success && result.data) {
        setFormData({
          title: result.data.title || "",
          description: result.data.description || "",
          image_url: result.data.image_url || "",
          image: null,
        });
        
        if (result.data.image_url) {
          setImagePreview(imageUrl(result.data.image_url));
        }
      }
    } catch (error) {
      console.error("Error fetching About Us:", error);
      toast.error("Failed to fetch About Us data.");
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
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required.");
      return;
    }

    setIsSaving(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await fetch(API_URL, {
        method: "PUT",
        body: submitData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("About Us updated successfully!");
        fetchAboutUs(); // Refresh data to get proper image_url if changed
      } else {
        throw new Error(result.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error saving About Us:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">About Us Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage the content displayed in the "About Us" sections of the website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Settings</CardTitle>
          <CardDescription>
            Update the title, description, and image used for the About Us section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              name="title"
              placeholder="e.g. Our Ayurvedic Heritage" 
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              name="description"
              placeholder="Enter the main body text for the About section..." 
              className="min-h-[200px]"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Image */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Featured Image</label>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-1/2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x800px or larger.
                </p>
              </div>

              <div className="w-full sm:w-1/2">
                {imagePreview ? (
                  <div className="relative aspect-video rounded-md overflow-hidden border">
                    <img 
                      src={imagePreview} 
                      alt="About Preview" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center aspect-video bg-muted rounded-md border border-dashed">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">No image selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
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

export default AboutUs;
