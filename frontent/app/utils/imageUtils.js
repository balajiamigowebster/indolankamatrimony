export const resolveImageUrl = (imagePath, gender) => {
  if (
    !imagePath ||
    imagePath === "null" ||
    imagePath === "N/A" ||
    typeof imagePath !== "string" ||
    imagePath.trim() === ""
  ) {
    return gender === "Female" ? "/default-girl.jpg" : "/default-boy.jpg";
  }

  const trimmed = imagePath.trim();

  // If it's a server disk or relative uploads path
  if (trimmed.includes("/uploads/")) {
    const filename = trimmed.split("/uploads/").pop();
    return `https://amigowebster.in/indolankamatrimony_working/uploads/${filename}`;
  }

  // If already a valid full URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // If it's a local public asset (e.g. /default-boy.jpg)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return gender === "Female" ? "/default-girl.jpg" : "/default-boy.jpg";
};

export const handleImageError = (e, gender) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src =
    gender === "Female" ? "/default-girl.jpg" : "/default-boy.jpg";
};
