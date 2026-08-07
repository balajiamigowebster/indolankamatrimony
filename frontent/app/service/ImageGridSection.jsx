import React from "react";

const imageHoverClass =
  "transition-transform duration-500 ease-in-out group-hover:scale-105";

const createPicsumData = () => {
  const data = [];

  // 20 random IDs-ஐ தேர்ந்தெடுக்கவும் (உங்கள் இமேஜ் மாற்றங்களுக்கு)
  const picsumIds = [
    "/service/s1.webp",
    "/service/s2.webp",
    "/service/s3.webp",
    "/service/s4.webp",
    "/service/s5.webp",
    "/service/s6.webp",
    "/service/s7.webp",
    "/service/s8.webp",
  ];

  picsumIds.forEach((id, index) => {
    let gridClass = "col-span-3 lg:col-span-1"; // Default: Standard 1-column
    let caption = null;

    if (index === 0) {
      // First item: 2-column span with a caption
      gridClass = "col-span-3 lg:col-span-2";
      caption = { title: "The Ceremony", subtitle: "WEDDING MATRIMONY" };
    } else if (index === 4) {
      gridClass = "col-span-3 lg:col-span-2 lg:row-span-2";
    } else if (
      index === 1 ||
      index === 2 ||
      index === 3 ||
      index === 5 ||
      index === 6
    ) {
      gridClass = "col-span-3 lg:col-span-1";
    }

    data.push({
      id: index,
      URL: id,
      url: id,
      alt: `Image ${index}`,
      caption: caption,
      gridClass: gridClass,
    });
  });

  return data;
};

const service_items = createPicsumData();

console.log(service_items);

function ImageGridSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-7xl mx-auto p-4 md:p-6">
      {service_items.map((item) => (
        // grid-item classes: position, overflow, border-radius, group for hover
        <div
          key={item.id}
          className={`relative overflow-hidden rounded-lg group min-h-[250px] ${item.gridClass}`}
        >
          <img
            src={item.url}
            alt={item.alt}
            // Image Classes: full width/height, object-cover
            className={`w-full h-full object-cover ${imageHoverClass}`}
          />

          {/* Caption Overlay */}
          {item.caption && (
            // Caption Classes: absolute, full size, flex center, background overlay
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-30 text-white p-4">
              <p className="text-sm md:text-base font-light tracking-widest uppercase mb-1">
                {item.caption.subtitle}
              </p>
              <h3 className="text-xl md:text-2xl font-semibold border-b-2 pb-1">
                {item.caption.title}
              </h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ImageGridSection;
