export default function CropMask() {
  return (
    <div className="absolute inset-0 pointer-events-none grid grid-rows-[1fr_auto_1fr]">
      <div className="bg-black/60" />
      <div className="relative">
        <div className="w-full aspect-video border-2 border-white shadow-lg" />
      </div>
      <div className="bg-black/60" />
    </div>
  );
}
