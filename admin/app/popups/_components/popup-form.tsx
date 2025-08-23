"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { uploadImage } from "@/lib/uploadImage";

interface PopupFormProps {
  initialData: any | null;
}

export const PopupForm: React.FC<PopupFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    isActive: initialData?.isActive || false,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      const imageResult = await uploadImage(file);
      setData({ ...data, imageUrl: imageResult.url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = initialData 
        ? `/api/popups/${initialData.id}`
        : '/api/popups';
      
      const response = await fetch(url, {
        method: initialData ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      router.refresh();
      router.push('/popups');
      toast.success(initialData ? 'Popup updated' : 'Popup created');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">
          {initialData ? 'Edit Popup' : 'Create Popup'}
        </h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            disabled={loading}
            placeholder="Enter title"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            disabled={loading}
            placeholder="Enter description"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Image</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              disabled={loading}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Input
              placeholder="Or enter image URL"
              value={data.imageUrl}
              onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
            />
          </div>
          {data.imageUrl && (
            <div className="mt-2 relative w-40 h-40 rounded-lg overflow-hidden">
              <Image
                src={data.imageUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={data.isActive}
            onCheckedChange={(checked) => setData({ ...data, isActive: checked })}
          />
          <Label>Active</Label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/popups')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};