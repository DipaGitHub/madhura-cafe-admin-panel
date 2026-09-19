import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import { apiUrl } from "@/config/api";

const MenuCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sort_order: "",
    image_url: "",
  });

  useEffect(() => {
    if (isEdit) {
      fetchCategoryDetails();
    }
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      const response = await fetch(apiUrl("/api/menus/categories"));
      const result = await response.json();
      if (result.success && result.data) {
        const category = result.data.find((c: any) => c.id.toString() === id);
        if (category) {
          setFormData({
            name: category.name || "",
            description: category.description || "",
            sort_order: category.sort_order?.toString() || "0",
            image_url: category.image_url || "",
          });
        } else {
          toast.error("Category not found");
          navigate("/menu-categories");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch category details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Please provide a category name");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        sort_order: parseInt(formData.sort_order) || 0,
      };

      const url = isEdit ? apiUrl(`/api/menus/categories/${id}`) : apiUrl("/api/menus/categories");
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        navigate("/menu-categories");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while saving");
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
      <div className="container mx-auto py-8 px-4 max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/menu-categories")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit ? "Edit Category" : "Add Category"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? "Update the details of this category." : "Create a new category for your menu items."}
            </p>
          </div>
        </div>

        <div className="rounded-md border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="name">Category Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g. Starters, Beverages, Mains" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Brief description of the category..." 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input 
                id="sort_order" 
                name="sort_order" 
                type="number"
                placeholder="e.g. 1" 
                value={formData.sort_order} 
                onChange={handleInputChange} 
              />
              <p className="text-xs text-muted-foreground">Lower numbers appear first in the menu list.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Parallax Banner Image URL</Label>
              <Input 
                id="image_url" 
                name="image_url" 
                type="url"
                placeholder="https://images.unsplash.com/... or /images/parallax/filename.jpg" 
                value={formData.image_url} 
                onChange={handleInputChange} 
              />
              <p className="text-xs text-muted-foreground">This image will appear as the full-width parallax background behind this category on the Menu page.</p>
              {formData.image_url && (
                <div className="mt-2 rounded-md overflow-hidden border">
                  <img
                    src={formData.image_url}
                    alt="Category banner preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate("/menu-categories")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isEdit ? "Update Category" : "Save Category"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuCategoryForm;
