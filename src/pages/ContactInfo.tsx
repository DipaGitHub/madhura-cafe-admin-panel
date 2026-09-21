import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { apiUrl } from "@/config/api";
import AdminLayout from "@/components/layout/AdminLayout";

const API_URL = apiUrl("/api/contactInfo/admin");

interface ContactInfoData {
  id: number;
  location_text: string;
  phone_text: string;
  email_text: string;
  working_hours_text: string;
}

const ContactInfo = () => {
  const [formData, setFormData] = useState<ContactInfoData>({
    id: 0,
    location_text: "",
    phone_text: "",
    email_text: "",
    working_hours_text: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const data = result.data[0];
        setFormData({
          id: data.id,
          location_text: data.location_text || "",
          phone_text: data.phone_text || "",
          email_text: data.email_text || "",
          working_hours_text: data.working_hours_text || "",
        });
      }
    } catch (error) {
      console.error("Error fetching Contact Info:", error);
      toast.error("Failed to fetch Contact Info data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.location_text || !formData.phone_text || !formData.email_text || !formData.working_hours_text) {
      toast.error("All fields are required.");
      return;
    }
    if (formData.id === 0) {
      toast.error("No contact info record found to update.");
      return;
    }

    setIsSaving(true);
    try {
      // Using JSON since we don't have files
      const response = await fetch(`${API_URL}/update/${formData.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("Contact Info updated successfully!");
        fetchContactInfo(); 
      } else {
        throw new Error(result.error || "Failed to update");
      }
    } catch (error) {
      console.error("Error saving Contact Info:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">Contact Info Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage the content displayed on the "Contact Us" page cards.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            Update the location, phone numbers, email addresses, and working hours. Use new lines (Enter) to format the text across multiple lines.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Textarea 
                name="location_text"
                placeholder="e.g. Madhura Herbal Heritage Cafe&#10;Civil Lines, Jaipur, India" 
                rows={3}
                value={formData.location_text}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Numbers</label>
              <Textarea 
                name="phone_text"
                placeholder="e.g. +91 (800) 915-6271&#10;+91 (800) 915-6272" 
                rows={3}
                value={formData.phone_text}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Addresses</label>
              <Textarea 
                name="email_text"
                placeholder="e.g. info@madhuracafe.com&#10;namaste@madhuracafe.com" 
                rows={3}
                value={formData.email_text}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Working Hours</label>
              <Textarea 
                name="working_hours_text"
                placeholder="e.g. Mon - Sun: 10:00 AM - 11:00 PM&#10;Kitchen Closes at 10:30 PM" 
                rows={3}
                value={formData.working_hours_text}
                onChange={handleInputChange}
              />
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

export default ContactInfo;
