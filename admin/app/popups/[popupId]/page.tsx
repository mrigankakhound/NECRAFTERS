"use client";

import { useState, useEffect } from "react";
import { PopupForm } from "../_components/popup-form";

interface PageProps {
  params: Promise<{ popupId: string }>;
}

export default function PopupPage({ params }: PageProps) {
  const [popup, setPopup] = useState(null);
  const [popupId, setPopupId] = useState<string | null>(null);

  useEffect(() => {
    // Handle async params
    params.then(({ popupId }) => {
      setPopupId(popupId);
    });
  }, [params]);

  useEffect(() => {
    if (!popupId) return;

    const fetchPopup = async () => {
      try {
        const response = await fetch(`/api/popups/${popupId}`);
        if (!response.ok) throw new Error('Failed to fetch popup');
        const data = await response.json();
        setPopup(data);
      } catch (error) {
        console.error('Error fetching popup:', error);
      }
    };

    fetchPopup();
  }, [popupId]);

  if (!popupId) {
    return <div>Loading...</div>;
  }

  return <PopupForm initialData={popup} />;
}