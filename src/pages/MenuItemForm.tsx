import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import { apiUrl, imageUrl } from "@/config/api";

const MenuItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    category_id: "",
    title: "",
    short_description: "",
    benefit: "",
    price: "",
    image_url: "",
    ingredients: "",
    long_description: "",
    is_featured: false,
    is_popular: false,
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchItemDetails();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(apiUrl("/api/menus/categories"));
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchItemDetails = async () => {
    try {
      const response = await fetch(apiUrl(`/api/menus/${id}`));
      const result = await response.json();
      if (result.success && result.data) {
        const data = result.data;
        setFormData({
          id: data.id,
          category_id: data.category_id ? data.category_id.toString() : "",
          title: data.title || "",
          short_description: data.short_description || "",
          benefit: data.benefit || "",
          price: data.price || "",
          image_url: data.image_url || "",
          ingredients: data.ingredients ? (typeof data.ingredients === 'string' ? data.ingredients : data.ingredients.join(', ')) : "",
          long_description: data.long_description || "",
          is_featured: data.is_featured === 1 || data.is_featured === true,
          is_popular: data.is_popular === 1 || data.is_popular === true,
        });
      } else {
        toast.error("Item not found");
        navigate("/menu-items");
      }
    } catch (error) {
      toast.error("Failed to fetch item details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (field: 'is_featured' | 'is_popular') => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      // In a real app, this would open a modal to create a new category
      const newCatName = window.prompt("Enter new category name:");
      if (newCatName) {
        createNewCategory(newCatName);
      }
      return;
    }
    setFormData((prev) => ({ ...prev, category_id: value }));
  };

  const createNewCategory = async (name: string) => {
    try {
      const response = await fetch(apiUrl("/api/menus/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: "", sort_order: categories.length + 1 }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Category created successfully");
        fetchCategories(); // Refresh list
        setFormData((prev) => ({ ...prev, category_id: result.id.toString() }));
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.id || !formData.category_id) {
      toast.error("Please fill in ID, Title, and Category");
      return;
    }

    setIsSaving(true);
    try {
      let ingredientsArray = [];
      if (formData.ingredients) {
        try {
          ingredientsArray = formData.ingredients.split(',').map(i => i.trim());
        } catch(e) {}
      }

      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        ingredients: ingredientsArray
      };

      const url = isEdit ? apiUrl(`/api/menus/${id}`) : apiUrl("/api/menus");
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        navigate("/menu-items");
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
      <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/menu-items")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit ? "Edit Menu Item" : "Add Menu Item"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? "Update the details of this menu item." : "Create a new food or drink item for your menu."}
            </p>
          </div>
        </div>

        <div className="rounded-md border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div className="space-y-2">
                <Label htmlFor="id">Item ID (URL Slug) <span className="text-red-500">*</span></Label>
                <Input 
                  id="id" 
                  name="id" 
                  placeholder="e.g. ashwagandha-latte" 
                  value={formData.id} 
                  onChange={handleInputChange} 
                  disabled={isEdit}
                  required 
                />
                <p className="text-xs text-muted-foreground">Unique identifier used in URLs. Use dashes instead of spaces.</p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g. Ashwagandha Golden Elixir" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category_id">Category <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new" className="text-blue-600 font-medium">
                      + Create New Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  name="price" 
                  placeholder="e.g. ₹ 250" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                />
              </div>

              {/* Benefit */}
              <div className="space-y-2">
                <Label htmlFor="benefit">Key Benefit (Hover pop-up)</Label>
                <Input 
                  id="benefit" 
                  name="benefit" 
                  placeholder="e.g. Reduces cortisol & boosts vitality" 
                  value={formData.benefit} 
                  onChange={handleInputChange} 
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input 
                  id="image_url" 
                  name="image_url" 
                  placeholder="https://..." 
                  value={formData.image_url} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description (List View)</Label>
              <Textarea 
                id="short_description" 
                name="short_description" 
                placeholder="Brief description for the menu list..." 
                value={formData.short_description} 
                onChange={handleInputChange} 
                rows={2}
              />
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <Label htmlFor="long_description">Long Description (Details Page)</Label>
              <Textarea 
                id="long_description" 
                name="long_description" 
                placeholder="Full description for the item details page..." 
                value={formData.long_description} 
                onChange={handleInputChange} 
                rows={4}
              />
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (Comma separated)</Label>
              <Input 
                id="ingredients" 
                name="ingredients" 
                placeholder="e.g. A2 Milk, Turmeric, Ashwagandha, Honey" 
                value={formData.ingredients} 
                onChange={handleInputChange} 
              />
            </div>

            {/* Is Featured */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-base">Featured on Home Page (Slider)</Label>
                <p className="text-sm text-muted-foreground">
                  If enabled, this item will appear in the main showcase carousel on the home page.
                </p>
              </div>
              <Switch 
                checked={formData.is_featured}
                onCheckedChange={handleSwitchChange('is_featured')}
              />
            </div>

            {/* Is Popular */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-base">Popular Item</Label>
                <p className="text-sm text-muted-foreground">
                  If enabled, this item appears in the home page food list and the "Popular Items" sidebar on menu details pages.
                </p>
              </div>
              <Switch 
                checked={formData.is_popular}
                onCheckedChange={handleSwitchChange('is_popular')}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate("/menu-items")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isEdit ? "Update Item" : "Save Item"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuItemForm;
