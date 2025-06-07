import UploadForm from "@/components/upload-form";

export default function UploadPage() {
  return (
    <div className="pt-15">
      <div className="space-y-4 mx-2">
        <h1 className="text-4xl text-center font-bold text-title md:text-5xl ">
          Upload Your Image
        </h1>
        <p className="text-sm text-center text-subtitle md:text-lg ">
          Share your visual stories with the GlowyBits community
        </p>
      </div>
      <div className="mx-7">
        <UploadForm />
      </div>
    </div>
  );
}
