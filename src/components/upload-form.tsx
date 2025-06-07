"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { uploadImage } from "@/services/images";
import {
  Upload,
  ImageIcon,
  X,
  Tag,
  FileText,
  Eye,
  Globe,
  Lock,
  Home,
} from "lucide-react";

// Upload form schema
const uploadSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
  visibility: z.enum(["public", "private"]),
  category: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export default function UploadForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      visibility: "public",
    },
  });

  const watchedVisibility = watch("visibility");

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Auto-fill title with filename if not provided
      if (!watch("title")) {
        const filename = file.name.split(".")[0];
        setValue("title", filename);
      }
    },
    [setValue, watch]
  );

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect]
  );

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Handle form submission
  const handleUpload = async (data: UploadFormData) => {
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", data.title || selectedFile.name.split(".")[0]);
      formData.append("description", data.description || "");
      formData.append("tags", data.tags || "");
      formData.append("category", data.category || "");
      formData.append(
        "is_private",
        data.visibility === "private" ? "true" : "false"
      );

      const { status } = await uploadImage(formData);
      if (status === 200) {
        toast.success("Image uploaded successfully!");
        reset();
        removeFile();
        router.push("/");
      } else {
        toast.error(
          "An error has occured when trying to upload image. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 py-7 md:py-15 lg:grid-cols-2 ">
      <div className="space-y-6">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-title">
          <Eye className="h-6 w-6" />
          Preview
        </h2>

        <div
          className={`p-4 ${
            !selectedFile && "border-2 border-dashed border-border h-full"
          } rounded-lg`}
        >
          {previewUrl ? (
            <div className="relative">
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 z-10 text-white rounded-full p-2 transition-colors hover:bg-background/65 hover:text-accent-contrast hover:cursor-pointer"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>{" "}
              <div className="p-4 bg-gray-50 rounded-b-lg">
                <p className="text-sm text-body">
                  <strong>File:</strong> {selectedFile?.name}
                </p>
                <p className="text-sm text-body">
                  <strong>Size:</strong>{" "}
                  {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center text-center transition-colors ${
                dragActive ? "border-accent bg-accent-muted" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <ImageIcon className="h-16 w-16 text-body mb-4" />
              <h3 className="text-lg font-semibold text-subtitle mb-2">
                No image selected
              </h3>
              <p className="text-body mb-4">
                Drag and drop an image here, or click to select
              </p>
              <label className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
                <Upload className="h-5 w-5 inline mr-2" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-body mt-2">
                Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-title flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Image Details
        </h2>

        <form onSubmit={handleSubmit(handleUpload)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Image Title</Label>
            <Input
              {...register("title")}
              id="title"
              type="text"
              disabled={isSubmitting}
              placeholder="Enter a custom title (optional)"
              className={`${errors.title && "border-error"}`}
            />
            <p className="text-xs text-body">
              If no title is provided, the original filename will be used
            </p>
            {errors.title && (
              <p className="text-sm text-error">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register("description")}
              id="description"
              disabled={isSubmitting}
              placeholder="Describe your image (optional)"
              rows={4}
              className={`${errors.description && "border-error"} resize-none`}
            />
            {errors.description && (
              <p className="text-sm text-error">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <Input
              {...register("tags")}
              id="tags"
              type="text"
              disabled={isSubmitting}
              placeholder="nature, landscape, photography (comma-separated)"
              className={`${errors.tags && "border-error"}`}
            />
            <p className="text-xs text-body">
              Add tags separated by commas (e.g., nature, landscape, sunset)
            </p>
            {errors.tags && (
              <p className="text-sm text-error">{errors.tags.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Visibility</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("visibility")}
                  type="radio"
                  value="public"
                  className="text-accent"
                />
                <Globe className="h-4 w-4" />
                <span className="text-sm">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("visibility")}
                  type="radio"
                  value="private"
                  className="text-accent"
                />
                <Lock className="h-4 w-4" />
                <span className="text-sm">Private</span>
              </label>
            </div>
            <p className="text-xs text-body">
              {watchedVisibility === "public"
                ? "Anyone can view and discover your image"
                : "Only you can view this image"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedFile}
            tabIndex={isSubmitting ? -1 : 0}
            aria-disabled={isSubmitting}
            className="flex justify-center items-center w-full text-white font-bold p-3 gap-x-2 rounded-md transition-all ease-in bg-accent hover:bg-accent/75 hover:text-title hover:cursor-pointer disabled:bg-disabled disabled:cursor-not-allowed"
          >
            {!isSubmitting && <Upload width={20} height={20} />}
            {isSubmitting ? "Uploading..." : "Upload Image"}
          </button>
        </form>

        <Link
          href="/"
          className={`flex justify-center items-center w-full text-accent-contrast font-bold p-3 gap-x-2 rounded-md transition-all ease-in ${
            isSubmitting
              ? "bg-disabled hover:cursor-not-allowed"
              : "bg-foreground hover:cursor-pointer"
          }`}
          tabIndex={isSubmitting ? -1 : 0}
          aria-disabled={isSubmitting}
          onClick={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <Home width={20} height={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
