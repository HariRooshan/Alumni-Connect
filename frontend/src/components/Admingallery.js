import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";
import { Close, Delete, ArrowBack, ArrowForward } from "@mui/icons-material";
import axios from "axios";
import AdminNavBar from "./AdminNavBar";

const API_URL = "http://localhost:5000/api/gallery";

function AdminGallery() {
  const [tabIndex, setTabIndex] = useState(0);
  const [allPhotos, setAllPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");

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
  // sort the photos array by mtimeMs
  const sortedPhotos = [...allPhotos].sort((a, b) =>
    sortOrder === "newest" ? b.mtimeMs - a.mtimeMs : a.mtimeMs - b.mtimeMs
  );

  const openAlbum = async (albumName) => {
    setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/album/${albumName}`);
        setAlbumPhotos(res.data.photos);
        setSelectedAlbum(albumName);
        setSliderIndex(0);
      } catch (err) {
        console.error("Error fetching album photos", err);
      }
    }, 100); // Small delay to prevent album opening while deleting
  };

  const confirmDelete = (type, target, event) => {
    if (event) event.stopPropagation(); // Prevent album from opening
    setDeleteTarget({ type, target });
    setDeleteConfirmOpen(true);
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "photo") {
        await axios.delete(`${API_URL}/photo`, {
          data: { filename: deleteTarget.target.filename, album: deleteTarget.target.album },
        });
        fetchAllPhotos();
        if (selectedAlbum) openAlbum(selectedAlbum);
      } else if (deleteTarget.type === "album") {
        await axios.delete(`${API_URL}/album/${deleteTarget.target}`);
        fetchAlbums();
      }
    } catch (err) {
      console.error("Error deleting", err);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <><AdminNavBar /></>
      <Box
        sx={{
          background: "linear-gradient(to right, #4a00e0, #8e2de2)",
          padding: "16px", // Increased padding for better spacing
          borderRadius: "8px",
          textAlign: "center",
          mb: 3,
        }}
      >
        <Typography variant="h3" fontWeight="bold" color="white">
          Admin Photo Gallery
        </Typography>
      </Box>

      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
        <Tab label="All Photos" />
        <Tab label="Albums" />
      </Tabs>

      {tabIndex === 0 && (
        <>
          {/* --- NEW SORT CONTROL --- */}
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <FormControl
              size="small"
              sx={{
                minWidth: 160,
                background: "#fff",
                borderRadius: 4,
                boxShadow: 1,
                "& .MuiInputBase-root": {
                  borderRadius: 4,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#bdbdbd",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortOrder}
                label="Sort by"
                onChange={e => setSortOrder(e.target.value)}
                sx={{
                  fontWeight: 500,
                  color: "#333",
                  "& .MuiSelect-icon": {
                    color: "#1976d2",
                  },
                }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loadingPhotos ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {sortedPhotos.map((photo, index) => (
                <Grid item key={index} xs={12} sm={4} sx={{ position: "relative" }}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      minHeight: 200,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: 3,
                      borderRadius: 3,
                      border: "1px solid #e0e0e0",
                      position: "relative",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: 6 }
                    }}
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setPhotoDialogOpen(true);
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={photo.src}
                        alt="Uploaded Photo"
                        loading="lazy"
                        sx={{
                          objectFit: "cover",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          minHeight: 180,
                          background: "#f5f5f5"
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
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
                        onClick={event => {
                          event.stopPropagation?.();
                          confirmDelete("photo", { filename: photo.filename, album: photo.album }, event);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        
                        height: "3%",
                        p: 1,
                        background: "#fafafa",
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          textAlign: "center",
                          width: "100%",
                          wordBreak: "break-word",
                        }}
                      >
                        {photo.caption || <span style={{ color: "#bbb" }}>No caption</span>}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {tabIndex === 1 && (loadingAlbums ? <CircularProgress /> : (
        <Grid container spacing={2} justifyContent="center">
          {albums.map((album) => (
            <Grid item key={album.albumName} xs={12} sm={4} sx={{ position: "relative" }}>
              <Card sx={{ cursor: "pointer" }} onClick={() => openAlbum(album.albumName)}>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
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
                  size="medium"
                  onClick={(event) => {
                    event.stopPropagation?.();
                    confirmDelete("album", album.albumName, event);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
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
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        sx={{ zIndex: 1300 }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteTarget?.type === "photo"
              ? "Are you sure you want to delete this photo?"
              : `Are you sure you want to delete the album "${deleteTarget?.target}"?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedAlbum} onClose={() => setSelectedAlbum(null)} maxWidth="md">
        <DialogContent sx={{ position: "relative", p: 2, textAlign: "center" }}>
          <IconButton sx={{ position: "absolute", right: 10, top: 10 }} onClick={() => setSelectedAlbum(null)}>
            <Close />
          </IconButton>
          {albumPhotos.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: 4 }}>
              <IconButton onClick={() => setSliderIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length)}>
                <ArrowBack />
              </IconButton>
              <Box component="img" src={albumPhotos[sliderIndex].src} alt="Album Image" sx={{ maxWidth: "100%", maxHeight: "80vh" }} />
              <IconButton onClick={() => confirmDelete("photo", { filename: albumPhotos[sliderIndex].filename, album: selectedAlbum })}>
                <Delete />
              </IconButton>
              <IconButton onClick={() => setSliderIndex((prev) => (prev + 1) % albumPhotos.length)}>
                <ArrowForward />
              </IconButton>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        maxWidth="md"
      >
        <DialogContent sx={{ position: "relative", p: 2, textAlign: "center" }}>
          <IconButton
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              zIndex: 10,
              background: "rgba(255,255,255,0.92)",
              boxShadow: 2,
              border: "2px solid #fff",
              transition: "background 0.2s, color 0.2s",
              "&:hover": {
                background: "#d32f2f",
                color: "#fff",
              },
            }}
            onClick={() => setPhotoDialogOpen(false)}
            size="medium"
          >
            <Close />
          </IconButton>
          {selectedPhoto && (
            <Box sx={{ mt: 4 }}>
              <Box
                component="img"
                src={selectedPhoto.src}
                alt={selectedPhoto.caption || "Photo"}
                sx={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 2 }}
              />
              {selectedPhoto.caption && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {selectedPhoto.caption}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AdminGallery;
