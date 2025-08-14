"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/popups/${data.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete');
      
      toast.success('Popup deleted.');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Popup ID copied to clipboard.');
  };

  const onPreview = () => {
    // Open preview in new tab
    const previewUrl = `/preview/popup/${data.id}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/popups/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPreview}>
            <Eye className="mr-2 h-4 w-4" /> Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};