import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
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
      <Typography variant="h5" sx={{
          background: "linear-gradient(to right, #4a00e0, #8e2de2)",
          padding: "12px",
          borderRadius: "8px",
          textAlign: "center",
          mb: 3,
        }}>
        Admin Photo Gallery
      </Typography>

      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
        <Tab label="All Photos" />
        <Tab label="Albums" />
      </Tabs>

      {tabIndex === 0 && (loadingPhotos ? <CircularProgress /> : (
        <Grid container spacing={2} justifyContent="center">
          {allPhotos.map((photo, index) => (
            <Grid item key={index} xs={12} sm={4} sx={{ position: "relative" }}>
              <Card sx={{ cursor: "pointer" }}>
                <IconButton
                  sx={{ position: "absolute", top: 5, right: 5, zIndex: 1 }}
                  size="small"
                  onClick={() => confirmDelete("photo", { filename: photo.filename })}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <CardMedia
                  component="img"
                  height="140"
                  image={photo.src}
                  alt="Uploaded Photo"
                  loading="lazy"
                />
                <CardContent>
                  <Typography variant="body2">{photo.caption}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ))}

      {tabIndex === 1 && (loadingAlbums ? <CircularProgress /> : (
        <Grid container spacing={2} justifyContent="center">
          {albums.map((album) => (
            <Grid item key={album.albumName} xs={12} sm={4} sx={{ position: "relative" }}>
              <Card sx={{ cursor: "pointer" }} onClick={() => openAlbum(album.albumName)}>
              <IconButton
            sx={{ position: "absolute", top: 5, right: 5, zIndex: 1 }}
            size="small"
            onClick={(event) => confirmDelete("album", album.albumName, event)}
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
        sx={{ zIndex: 1300 }} // Ensure it appears above other elements
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
    </Box>
  );
}

export default AdminGallery;
