import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDownloadURL } from "@/services/images";
import { extractFilename } from "./image-card";
import { Download, Calendar, Star, Heart } from "lucide-react";
import { ImageData } from "@/types/images";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DesktopImageCardProps {
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
export default function DesktopImageCard({
  image,
  isAuthenticated,
  isLiked,
  setIsLiked,
  isFavorited,
  setIsFavorited,
  handleInteractionMutation,
}: DesktopImageCardProps) {
  const router = useRouter();

  // Parses the title of format hexacode-filename.extension --> filename
  const toDisplayTitle = extractFilename(image.title);

  return (
    <Dialog>
      <DialogTrigger asChild>
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className=" flex justify-between items-baseline absolute bottom-0 left-0 w-full p-4 space-y-2">
                <h3 className="text-white text-xs font-medium md:text-lg">
                  {toDisplayTitle}
                </h3>
                <div className="flex justify-between items-baseline gap-2">
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
                      className="text-white md:w-10 md:h-10 hover:cursor-pointer hover:text-accent-hover"
                      width={15}
                      height={15}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{toDisplayTitle}</DialogTitle>
          <DialogDescription className="flex justify-center items-center gap-x-1">
            <Calendar width={20} height={20} />{" "}
            {new Date(image.created_at).toLocaleDateString("en-CA")}
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-[16/9] overflow-hidden rounded-lg space-y-4">
          <Image
            src={image.url}
            alt={image.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex justify-start items-baseline gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
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
              width={35}
              height={35}
              className={`${
                isLiked ? "fill-red-500 text-red-500" : "fill-none"
              } text-white transition-all ease-in hover:cursor-pointer hover:text-red-400`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
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
              width={35}
              height={35}
              className={`${
                isFavorited ? "fill-red-500 text-red-500" : "fill-none"
              } text-white transition-all ease-in hover:cursor-pointer hover:text-amber-400`}
            />
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const publicURL = await getDownloadURL(image.metadata.path);
              const a = document.createElement("a");
              a.href = publicURL!;
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
          >
            <Download
              className="text-white hover:cursor-pointer hover:text-accent-hover"
              width={35}
              height={35}
            />
          </button>
        </div>
        <DialogFooter className="justify-center">
          <DialogClose asChild>
            <button className="flex justify-center items-center w-full text-title font-semibold p-3 gap-x-2 rounded-lg border border-border transition-all ease-in hover:bg-foreground hover:text-accent-contrast hover:cursor-pointer">
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
