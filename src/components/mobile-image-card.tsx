import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDownloadURL } from "@/services/images";
import { extractFilename } from "./image-card";
import { Download, Calendar, Star, Heart } from "lucide-react";
import type { ImageData } from "@/types/images";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface MobileImageCardProps {
  image: ImageData;
  isAuthenticated: boolean;
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
  isFavorited: boolean;
  setIsFavorited: (value: boolean) => void;
  handleInteractionMutation: ({
    image_id,
    interaction_type,
  }: {
    image_id: string;
    interaction_type: string;
  }) => void;
}

export default function MobileImageCard({
  image,
  isAuthenticated,
  isLiked,
  setIsLiked,
  isFavorited,
  setIsFavorited,
  handleInteractionMutation,
}: MobileImageCardProps) {
  const router = useRouter();

  // Parses the title of format hexacode-filename.extension --> filename
  const toDisplayTitle = extractFilename(image.title);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="cursor-pointer">
          <div className="relative group rounded-lg overflow-hidden border border-border drop-shadow-accent-muted hover:drop-shadow-lg">
            <Image
              src={image.url}
              alt={image.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
            />

            <div className="absolute inset-0">
              <div className="flex justify-between items-baseline absolute bottom-0 left-0 w-full p-4 space-y-2">
                <div className="flex justify-end items-baseline gap-2 w-full">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const publicURL = await getDownloadURL(
                        image.metadata.path
                      );
                      const a = document.createElement("a");
                      a.href = publicURL!;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                    }}
                  >
                    <Download
                      className="text-white hover:cursor-pointer hover:text-accent-hover"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="">
        <DrawerHeader className="text-center">
          <div className="relative">
            <div className="absolute bottom-0 mb-7 h-[6px] w-full mx-auto rounded-full bg-gray-300" />
          </div>
          <DrawerTitle className="text-title">{toDisplayTitle}</DrawerTitle>
          <DrawerDescription className="flex items-center justify-center gap-x-1 text-subtitle">
            <Calendar width={16} height={16} />
            {new Date(image.created_at).toLocaleDateString("en-CA")}
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-center items-center gap-6 py-4">
            <div className="group hover:text-red-400">
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
                className="flex flex-col items-center gap-1 p-2 rounded-lg"
              >
                <Heart
                  width={28}
                  height={28}
                  className={`${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "fill-none text-black"
                  } group-hover:text-red-400`}
                />
                <span className="text-xs text-black group-hover:text-red-400">
                  Like
                </span>
              </button>
            </div>

            <div className="group hover:text-amber-400">
              <button
                className="flex flex-col items-center gap-1 p-2 rounded-lg"
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
                  width={28}
                  height={28}
                  className={`${
                    isFavorited
                      ? "fill-amber-500 text-amber-500"
                      : "fill-none text-black"
                  } group-hover:text-amber-400`}
                />
                <span className="text-xs text-black group-hover:text-amber-400">
                  Favorite
                </span>
              </button>
            </div>

            <div className="group hover:text-accent">
              <button
                className="flex flex-col items-center gap-1 p-2 rounded-lg"
                onClick={async () => {
                  const publicURL = await getDownloadURL(image.metadata.path);
                  const a = document.createElement("a");
                  a.href = publicURL!;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }}
              >
                <Download
                  className="text-accent group-hover:text-accent"
                  width={28}
                  height={28}
                />
                <span className="text-xs text-accent group-hover:text-accent">
                  Download
                </span>
              </button>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <button className="flex justify-center items-center w-full text-title font-semibold p-3 gap-x-2 rounded-lg border border-border transition-all ease-in hover:bg-foreground hover:text-accent-contrast hover:cursor-pointer">
              Close
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
