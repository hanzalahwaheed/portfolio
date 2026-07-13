// Single source of truth for which image formats the blog editor accepts.
// Used by both the /api/upload server route and the editor's client-side
// validation (file pickers, paste, and drag-and-drop).
export const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

export const allowedImageTypesLabel = "jpg, jpeg, png, gif, webp"

export const allowedImageAccept = allowedImageTypes.join(",")
