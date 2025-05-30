import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Star, Download } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ImageData } from "@/types/images";
import { useMutation } from "@tanstack/react-query";
import { handleInteraction, getDownloadURL } from "@/services/images";

interface ImageCardProps {
  image: ImageData;
}

// Extracts descriptive parts of uploaded image
function extractFilename(filename: string): string | null {
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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const supabase = createClient();

  // Parses the title of format hexacode-filename.extension --> filename
  const toDisplayTitle = extractFilename(image.title);

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

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border drop-shadow-accent-muted hover:drop-shadow-lg">
      <Image
        src={image.url}
        alt={image.title}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 p-4 space-y-2">
          <h3 className="text-white text-xs font-medium md:text-lg">
            {toDisplayTitle}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setIsLiked(!isLiked);
                  handleInteractionMutation({
                    image_id: image.id,
                    interaction_type: "like",
                  });
                } else {
                  router.push("/login");
                }
              }}
            >
              <Heart
                width={15}
                height={15}
                className={`${
                  isLiked ? "fill-red-500 text-red-500" : "fill-none"
                } text-white md:w-10 md:h-10 hover:cursor-pointer transition-all ease-in`}
              />
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  setIsFavorited(!isFavorited);
                  handleInteractionMutation({
                    image_id: image.id,
                    interaction_type: "favorite",
                  });
                } else {
                  router.push("/login");
                }
              }}
            >
              <Star
                width={15}
                height={15}
                className={`${
                  isFavorited ? "fill-red-500 text-red-500" : "fill-none"
                } text-white md:w-10 md:h-10 hover:cursor-pointer transition-all ease-in`}
              />
            </button>

            <button
              onClick={async () => {
                // Handle file download
                const publicURL = await getDownloadURL(image.metadata.path);
                const a = document.createElement("a");
                a.href = publicURL!;
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
            >
              <Download
                className="text-white md:w-10 md:h-10 hover:cursor-pointer hover:text-accent-hover"
                width={15}
                height={15}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
