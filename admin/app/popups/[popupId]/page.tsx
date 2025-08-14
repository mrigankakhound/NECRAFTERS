"use client";

import { useEffect, useState } from "react";
import { PopupForm } from "../_components/popup-form";

export default function PopupPage({
  params
}: {
  params: { popupId: string }
}) {
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const response = await fetch(`/api/popups/${params.popupId}`);
        if (!response.ok) throw new Error('Failed to fetch popup');
        const data = await response.json();
        setPopup(data);
      } catch (error) {
        console.error('Error fetching popup:', error);
      }
    };

    fetchPopup();
  }, [params.popupId]);

  return <PopupForm initialData={popup} />;
}