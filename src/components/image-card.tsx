import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ImageData } from "@/types/images";
import { useMutation } from "@tanstack/react-query";
import { handleInteraction } from "@/services/images";
import DesktopImageCard from "./desktop-image-card";
import MobileImageCard from "./mobile-image-card";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ImageCardProps {
  image: ImageData;
}

// Extracts descriptive parts of uploaded image
export function extractFilename(filename: string): string | null {
  const namePart = filename.split(".")[0]; // Remove extension
  const segments = namePart.split("-");

  // Filter out purely numeric and known prefixes
  const filtered = segments.filter(
    (seg) =>
      !/^\d+$/.test(seg) && // not all numbers
      !["pexels", "unsplash", "img", "image"].includes(seg.toLowerCase()) &&
      !/^[a-f0-9]{3,}$/i.test(seg) // not a hex-like prefix
  );

  // Return joined meaningful part or null if nothing found
  return filtered.length > 0 ? filtered.join("-") : null;
}

export default function ImageCard({ image }: ImageCardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const supabase = createClient();

  const { mutateAsync: handleInteractionMutation } = useMutation({
    mutationFn: ({
      image_id,
      interaction_type,
    }: {
      image_id: string;
      interaction_type: string;
    }) => handleInteraction(image_id, interaction_type),
  });

  // Verify user status (Authenticated or not authenticated)
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // User may interact with available images
        setIsAuthenticated(true);
      }
    };
    fetchUser();
  });

  const commonProps = {
    image,
    isAuthenticated,
    setIsFavorited,
    isFavorited,
    isLiked,
    setIsLiked,
    handleInteractionMutation,
  };

  return isMobile ? (
    <MobileImageCard {...commonProps} />
  ) : (
    <DesktopImageCard {...commonProps} />
  );
}
