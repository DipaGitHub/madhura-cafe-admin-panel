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
import { Plus, Edit, Trash2, Loader2, Star, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { apiUrl, imageUrl } from "@/config/api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTableRowProps {
  item: any;
  navigate: (path: string) => void;
  handleDelete: (id: string) => void;
}

const SortableTableRow = ({ item, navigate, handleDelete }: SortableTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id.toString() });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10 px-2 text-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground inline-flex items-center justify-center rounded hover:bg-muted transition-colors"
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
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
  );
};

const MenuItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i: any) => i.id.toString() === active.id.toString());
    const newIndex = items.findIndex((i: any) => i.id.toString() === over.id.toString());

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    try {
      const response = await fetch(apiUrl("/api/menus/reorder"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newItems.map((i: any) => i.id) }),
      });
      const res = await response.json();
      if (res.success) {
        toast.success("Menu items reordered successfully");
      } else {
        toast.error(res.message || "Failed to update menu order");
      }
    } catch (error) {
      toast.error("Failed to update menu order");
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
            <p className="text-muted-foreground mt-2">Manage all the food and drink items in your restaurant. Drag rows using the grip handle to reorder.</p>
          </div>
          <Button onClick={() => navigate("/menu-items/new")}>
            <Plus className="h-4 w-4 mr-2" /> Add Menu Item
          </Button>
        </div>

        <div className="rounded-md border bg-card overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 px-2 text-center"></TableHead>
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
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No menu items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext
                    items={items.map((i: any) => i.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((item: any) => (
                      <SortableTableRow
                        key={item.id}
                        item={item}
                        navigate={navigate}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuItems;
