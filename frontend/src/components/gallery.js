import { useState, useEffect } from "react";
import { 
  Box, Button, Card, CardMedia, CardContent, Typography, Dialog, DialogContent, 
  TextField, Tabs, Tab, Grid, CircularProgress, IconButton 
} from "@mui/material";
import { PhotoCamera, Close, Delete, ArrowBack, ArrowForward } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/gallery"; // Backend URL

function Gallery() {
  // Hardcoded user role.
  // Only "Alumni" can see the upload button and only "Admin" can delete photos.
  // Uncomment the lines below to decode the role from the token stored in localStorage.
  let userRole = "Students"; // Change to "Admin" to test Admin functionalities
  // const decodeToken = (token) => {
  //   try {
  //     if (!token) return null;
  //     const decoded = jwtDecode(token);
  //     return decoded; // Returns the payload of the JWT
  //   } catch (error) {
  //     console.error("Invalid token:", error);
  //     return null;
  //   }
  // };
  // const token = localStorage.getItem("token");
  // const userRole = decodeToken(token).role;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role || "";

    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const [tabIndex, setTabIndex] = useState(0);
  const [allPhotos, setAllPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  // State for "All Photos" popup viewer
  const [allPhotosPopupOpen, setAllPhotosPopupOpen] = useState(false);
  const [allPhotosSliderIndex, setAllPhotosSliderIndex] = useState(0);

  useEffect(() => {
    fetchAllPhotos();
    fetchAlbums();
  }, []);

  const fetchAllPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const res = await axios.get(`${API_URL}/photos`);
      setAllPhotos(res.data.photos);
    } catch (err) {
      console.error("Error fetching photos", err);
    }
    setLoadingPhotos(false);
  };

  const fetchAlbums = async () => {
    setLoadingAlbums(true);
    try {
      const res = await axios.get(`${API_URL}/albums`);
      setAlbums(res.data.albums);
    } catch (err) {
      console.error("Error fetching albums", err);
    }
    setLoadingAlbums(false);
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validImages = [];
    let errorMsg = "";

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errorMsg = "Only JPEG, JPG, PNG, or WEBP images are allowed.";
      } else if (file.size > maxSize) {
        errorMsg = "Each image must be less than 5MB.";
      } else {
        validImages.push({
          file,
          preview: URL.createObjectURL(file),
        });
      }
    });

    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setSelectedImages((prevImages) => [...prevImages, ...validImages]);
  };

  const removeSelectedImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) return;
    const formData = new FormData();

    if (selectedImages.length === 1) {
      formData.append("photo", selectedImages[0].file);
      formData.append("caption", caption);
      await axios.post(`${API_URL}/uploadSingle`, formData);
    } else {
      if (!albumName) {
        alert("Enter Album Name for Multiple Images");
        return;
      }
      formData.append("album", albumName);
      selectedImages.forEach(({ file }) => formData.append("photos", file));
      await axios.post(`${API_URL}/uploadAlbum`, formData);
    }

    setUploadDialogOpen(false);
    setSelectedImages([]);
    setAlbumName("");
    setCaption("");
    fetchAllPhotos();
    fetchAlbums();
  };

  const openAlbum = async (albumName) => {
    const res = await axios.get(`${API_URL}/album/${albumName}`);
    setAlbumPhotos(res.data.photos);
    setSelectedAlbum(albumName);
    setSliderIndex(0);
  };

  // Album photo viewer navigation functions
  const nextAlbumPhoto = () =>
    setSliderIndex((prev) => (prev + 1) % albumPhotos.length);
  const prevAlbumPhoto = () =>
    setSliderIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length);

  // All photos viewer navigation functions
  const nextAllPhoto = () =>
    setAllPhotosSliderIndex((prev) => (prev + 1) % allPhotos.length);
  const prevAllPhoto = () =>
    setAllPhotosSliderIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      {/* Show Upload Button only if userRole is "Alumni" */}
      {(userRole === "Alumni" || userRole === "Admin") && (
        <Button
          variant="contained"
          startIcon={<PhotoCamera />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Photos
        </Button>
      )}

      {/* Tab Layout for Switching Views */}
      <Tabs
        value={tabIndex}
        onChange={(e, newIndex) => setTabIndex(newIndex)}
        centered
        sx={{ my: 2 }}
      >
        <Tab label="All Photos" />
        <Tab label="Albums" />
      </Tabs>

      {/* All Photos View */}
      {tabIndex === 0 &&
        (loadingPhotos ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {allPhotos.map((photo, index) => (
              <Grid item key={index} xs={12} sm={4} sx={{ position: "relative" }}>
                <Card sx={{ cursor: "pointer" }}>
                  {/* If userRole is "Admin", show delete icon */}
                  <CardMedia
                    component="img"
                    height="140"
                    image={photo.src}
                    alt="Uploaded Photo"
                    loading="lazy"
                    onClick={() => {
                      setAllPhotosSliderIndex(index);
                      setAllPhotosPopupOpen(true);
                    }}
                  />
                  <CardContent>
                    <Typography variant="body2">{photo.caption}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}

      {/* Albums View */}
      {tabIndex === 1 &&
        (loadingAlbums ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {albums.map((album) => (
              <Grid item key={album.albumName} xs={12} sm={4}>
                <Card sx={{ cursor: "pointer" }} onClick={() => openAlbum(album.albumName)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={album.coverImage}
                    alt={album.albumName}
                    loading="lazy"
                  />
                  <CardContent>
                    <Typography variant="h6">{album.albumName}</Typography>
                    <Typography variant="body2">{album.totalPhotos} photos</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", position: "relative" }}>
          <IconButton
            sx={{ position: "absolute", right: 10, top: 10 }}
            onClick={() => setUploadDialogOpen(false)}
          >
            <Close />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload Photos
          </Typography>

          {selectedImages.length === 1 && (
            <TextField
              label="Caption"
              variant="outlined"
              fullWidth
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {selectedImages.length > 1 && (
            <TextField
              label="Album Name"
              variant="outlined"
              fullWidth
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {/* File Input */}
          <input
            accept="image/*"
            type="file"
            multiple
            hidden
            id="file-upload"
            onChange={handleFileSelection}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<PhotoCamera />}
              sx={{ mb: 2 }}
            >
              Select More Photos
            </Button>
          </label>

          {/* Preview Selected Images */}
          <Grid container spacing={2} justifyContent="center">
            {selectedImages.map((img, index) => (
              <Grid item key={index} xs={4}>
                <Box sx={{ position: "relative" }}>
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      zIndex: 2,
                      background: "rgba(255,255,255,0.92)",
                      boxShadow: 2,
                      border: "2px solid #fff",
                      transition: "background 0.2s, color 0.2s",
                      "&:hover": {
                        background: "#d32f2f",
                        color: "#fff",
                      },
                    }}
                    size="small"
                    onClick={() => removeSelectedImage(index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <Card>
                    <CardMedia component="img" height="100" image={img.preview} alt="Selected" />
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Upload Button */}
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload}>
            Upload
          </Button>
        </DialogContent>
      </Dialog>

      {/* Album Photo Viewer (Popup) */}
      <Dialog open={!!selectedAlbum} onClose={() => setSelectedAlbum(null)} maxWidth="md">
        <DialogContent sx={{ position: "relative", p: 2, textAlign: "center" }}>
          <IconButton
            sx={{ position: "absolute", right: 10, top: 10 }}
            onClick={() => setSelectedAlbum(null)}
          >
            <Close />
          </IconButton>
          {albumPhotos.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 4,
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "rgba(173,216,230,0.5)",
                  "&:hover": { backgroundColor: "rgba(173,216,230,0.7)" },
                  mr: 2,
                }}
                onClick={prevAlbumPhoto}
              >
                <ArrowBack />
              </IconButton>
              <Box
                component="img"
                src={albumPhotos[sliderIndex].src}
                alt="Album Image"
                sx={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
              <IconButton
                sx={{
                  backgroundColor: "rgba(173,216,230,0.5)",
                  "&:hover": { backgroundColor: "rgba(173,216,230,0.7)" },
                  ml: 2,
                }}
                onClick={nextAlbumPhoto}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          )}
          {albumPhotos.length > 0 && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">{selectedAlbum}</Typography>
              <Typography variant="caption">
                {sliderIndex + 1} / {albumPhotos.length}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* All Photos Viewer (Popup) */}
      <Dialog open={allPhotosPopupOpen} onClose={() => setAllPhotosPopupOpen(false)} maxWidth="md">
        <DialogContent sx={{ position: "relative", p: 2, textAlign: "center" }}>
          <IconButton
            sx={{ position: "absolute", right: 10, top: 10 }}
            onClick={() => setAllPhotosPopupOpen(false)}
          >
            <Close />
          </IconButton>
          {allPhotos.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: 4 }}>
              <IconButton
                sx={{
                  backgroundColor: "rgba(173,216,230,0.5)",
                  "&:hover": { backgroundColor: "rgba(173,216,230,0.7)" },
                  mr: 2,
                }}
                onClick={prevAllPhoto}
              >
                <ArrowBack />
              </IconButton>
              <Box
                component="img"
                src={allPhotos[allPhotosSliderIndex].src}
                alt="Photo Viewer"
                sx={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
              <IconButton
                sx={{
                  backgroundColor: "rgba(173,216,230,0.5)",
                  "&:hover": { backgroundColor: "rgba(173,216,230,0.7)" },
                  ml: 2,
                }}
                onClick={nextAllPhoto}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          )}
          {allPhotos.length > 0 && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                {allPhotos[allPhotosSliderIndex].caption}
              </Typography>
              <Typography variant="caption">
                {allPhotosSliderIndex + 1} / {allPhotos.length}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Gallery;
