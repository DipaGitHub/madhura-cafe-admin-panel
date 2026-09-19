import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { apiUrl, imageUrl } from "@/config/api";

const MenuItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(apiUrl("/api/menus"));
      const result = await response.json();
      if (result.success) {
        setItems(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch menu items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }
    
    try {
      const response = await fetch(apiUrl(`/api/menus/${id}`), {
        method: "DELETE"
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchItems();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred");
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
      <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
            <p className="text-muted-foreground mt-2">Manage all the food and drink items in your restaurant.</p>
          </div>
          <Button onClick={() => navigate("/menu-items/new")}>
            <Plus className="h-4 w-4 mr-2" /> Add Menu Item
          </Button>
        </div>

        <div className="rounded-md border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No menu items found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.image_url ? (
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                          <img 
                            src={item.image_url.startsWith('http') ? item.image_url : imageUrl(item.image_url)} 
                            alt={item.title} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.short_description}</div>
                    </TableCell>
                    <TableCell>{item.category_name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      {item.is_featured ? (
                        <Badge variant="default" className="bg-amber-600 hover:bg-amber-700 flex w-fit items-center gap-1">
                          <Star className="h-3 w-3" /> Featured
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Standard</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => navigate(`/menu-items/edit/${item.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuItems;
