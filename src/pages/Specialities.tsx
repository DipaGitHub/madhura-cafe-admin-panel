import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Image as ImageIcon } from "lucide-react";
import { apiUrl, imageUrl } from "@/config/api";
import AdminLayout from "@/components/layout/AdminLayout";

const API_URL = apiUrl("/api/specialities/admin");

interface SpecialityData {
  id: number;
  title: string;
  description: string;
  image1_url?: string;
  image2_url?: string;
  image1?: File | null;
  image2?: File | null;
}

const Specialities = () => {
  const [formData, setFormData] = useState<SpecialityData>({
    id: 0,
    title: "",
    description: "",
    image1_url: "",
    image2_url: "",
    image1: null,
    image2: null,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [image1Preview, setImage1Preview] = useState<string>("");
  const [image2Preview, setImage2Preview] = useState<string>("");

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const fetchSpecialities = async () => {
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
          image1_url: data.image1_url || "",
          image2_url: data.image2_url || "",
          image1: null,
          image2: null,
        });
        
        if (data.image1_url) {
          setImage1Preview(data.image1_url.startsWith('http') ? data.image1_url : imageUrl(data.image1_url));
        }
        if (data.image2_url) {
          setImage2Preview(data.image2_url.startsWith('http') ? data.image2_url : imageUrl(data.image2_url));
        }
      }
    } catch (error) {
      console.error("Error fetching Specialities:", error);
      toast.error("Failed to fetch Specialities data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image1: file }));
      setImage1Preview(URL.createObjectURL(file));
    }
  };

  const handleImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image2: file }));
      setImage2Preview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required.");
      return;
    }
    if (formData.id === 0) {
      toast.error("No speciality found to update.");
      return;
    }

    setIsSaving(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      
      if (formData.image1) submitData.append("image1", formData.image1);
      if (formData.image2) submitData.append("image2", formData.image2);

      const response = await fetch(`${API_URL}/update/${formData.id}`, {
        method: "PUT",
        body: submitData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("Specialities updated successfully!");
        fetchSpecialities(); 
      } else {
        throw new Error(result.error || "Failed to update");
      }
    } catch (error) {
      console.error("Error saving Specialities:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">Our Specialties Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage the content displayed in the "Our Specialties" sections of the website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Settings</CardTitle>
          <CardDescription>
            Update the title, description, and images used for the Specialties section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              name="title"
              placeholder="e.g. Our Specialties" 
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              name="description"
              placeholder="Enter a compelling description..."
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium block">Image 1 (Left Image)</label>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:bg-muted/50 transition-colors">
                {image1Preview ? (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4 bg-black/5">
                    <img 
                      src={image1Preview} 
                      alt="Preview 1" 
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
                    onChange={handleImage1Change}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="pointer-events-none">
                    {image1Preview ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Recommended size: 700x1000px.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium block">Image 2 (Right Image)</label>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:bg-muted/50 transition-colors">
                {image2Preview ? (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4 bg-black/5">
                    <img 
                      src={image2Preview} 
                      alt="Preview 2" 
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
                    onChange={handleImage2Change}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="pointer-events-none">
                    {image2Preview ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Recommended size: 800x1200px.
                </p>
              </div>
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

export default Specialities;
