import { useState, useEffect } from "react";
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
import { Close, Delete, ArrowBack, ArrowForward, CheckCircleOutline } from "@mui/icons-material";
import axios from "axios";
import AdminNavBar from "./AdminNavBar";

const API_URL = "http://localhost:5000/api/gallery";

function AdminGallery() {
  const [tabIndex, setTabIndex] = useState(0);
  const [validatedPhotos, setValidatedPhotos] = useState([]);
  const [unvalidatedPhotos, setUnvalidatedPhotos] = useState([]);
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
  const [validatedSortOrder, setValidatedSortOrder] = useState("newest");
  const [unvalidatedSortOrder, setUnvalidatedSortOrder] = useState("newest");
  const [albumPhotosByAlbum, setAlbumPhotosByAlbum] = useState({});
  const backendURL = "http://localhost:5000";

  useEffect(() => {
    fetchPhotos();
    fetchAlbums();
  }, []);

 const fetchPhotos = async () => {
  setLoadingPhotos(true);
  try {
    // 1️⃣ Fetch every photo once
    const { data: { photos: all } } = await axios.get(`${API_URL}/photos`);

    // 2️⃣ Split into validated / unvalidated
    const validated = all.filter(p => p.validated);
    const unvalidated = all.filter(p => !p.validated);
    setValidatedPhotos(validated);
    setUnvalidatedPhotos(unvalidated);

    // 3️⃣ Group by album name
    const byAlbum = all.reduce((acc, p) => {
      if (p.album) {
        acc[p.album] = acc[p.album] || [];
        acc[p.album].push(p);
      }
      return acc;
    }, {});
    setAlbumPhotosByAlbum(byAlbum);

  } catch (err) {
    console.error("Error fetching photos", err);
  } finally {
    setLoadingPhotos(false);
  }
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

  const sortByTime = (arr, order) =>
    [...arr].sort((a, b) =>
      order === "newest"
        ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
        : new Date(a.uploadedAt) - new Date(b.uploadedAt)
    );

  const sortedValidated = sortByTime(validatedPhotos, validatedSortOrder);
  const sortedUnvalidated = sortByTime(unvalidatedPhotos, unvalidatedSortOrder);

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
    }, 100);
  };

  const confirmDelete = (type, target, event) => {
    if (event) event.stopPropagation();
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
        fetchPhotos();
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

  // Validate photo handler
  const handleValidate = async (photoId) => {
    try {
      await axios.patch(`${API_URL}/validate/${photoId}`);
      fetchPhotos();
    } catch (err) {
      console.error("Error validating photo", err);
    }
  };

  const handleValidateAll = async () => {
    if (sortedUnvalidated.length === 0) return;

    const ids = sortedUnvalidated.map(photo => photo._id);
    try {
      const response = await fetch(`${backendURL}/api/gallery/validate-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error("Validation failed");
      fetchPhotos();
    } catch (error) {
      console.error("Bulk validation error:", error);
      alert("Failed to validate all photos.");
    }
  };
  const handleDeleteAllUnvalidated = async () => {
    if (!window.confirm("Are you sure you want to delete all unvalidated photos?")) return;

    try {
      const response = await axios.delete(`${backendURL}/api/gallery/delete-unvalidated`);
      if (response.status === 200) {
        alert("All unvalidated photos deleted successfully!");
        fetchPhotos(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting unvalidated photos:", error);
      alert("Failed to delete unvalidated photos.");
    }
  };
  const handleValidateAlbum = async (albumName) => {
  try {
    // fetch all photos in that album
    const res = await axios.get(`${API_URL}/album/${albumName}`);
    const ids = res.data.photos.map(p => p._id);
    // bulk-validate
    await axios.post(`${API_URL}/validate-bulk`, { ids });
    // refresh both sections
    fetchPhotos();
    fetchAlbums();
  } catch (err) {
    console.error("Error validating album:", err);
    alert("Failed to validate album.");
  }
};

  const handleDeleteAlbum = async (albumName) => {
    if (!window.confirm(`Delete entire album "${albumName}"?`)) return;
    try {
      await axios.delete(`${API_URL}/album/${albumName}`);
      fetchAlbums();
      fetchPhotos();
    } catch (err) {
      console.error("Error deleting album:", err);
    }
  };
  const unvalidatedCountByAlbum = unvalidatedPhotos.reduce((acc, p) => {
  if (p.album) {
    acc[p.album] = (acc[p.album] || 0) + 1;
  }
  return acc;
}, {});

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <AdminNavBar />

      <Box
        sx={{
          background: "linear-gradient(to right, #4a00e0, #8e2de2)",
          p: 2,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" color="white">
          Admin Photo Gallery
        </Typography>
      </Box>

      <Tabs value={tabIndex} onChange={(e, idx) => setTabIndex(idx)} centered>
        <Tab label="Photos" />
        <Tab label="Albums" />
      </Tabs>

      {/* --- PHOTOS TAB --- */}
      {tabIndex === 0 && (
        <>
          {/* Unvalidated Section */}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              textAlign: "left",
              mt: 3,
              mb: 1.5,
              px: 2,
              py: 1,
              background: "linear-gradient(90deg, #ffe0e0 0%, #fff7f7 100%)",
              color: "#d32f2f",
              borderRadius: 2,
              boxShadow: 1,
              letterSpacing: 1,
              fontSize: { xs: "1.1rem", sm: "1.25rem" }
            }}
          >
            Unvalidated Photos
          </Typography>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <FormControl size="small" sx={{ minWidth: 160, background: "#fff", borderRadius: 2, boxShadow: 1 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={unvalidatedSortOrder}
                label="Sort by"
                onChange={e => setUnvalidatedSortOrder(e.target.value)}
                sx={{ fontWeight: 500, color: "#333" }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {loadingPhotos ? (
            <CircularProgress />
          ) : sortedUnvalidated.length === 0 ? (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              No unvalidated photos.
            </Typography>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {sortedUnvalidated.map((photo, index) => (
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
                        src={`${backendURL}${photo.src}`}
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
                          event.stopPropagation();
                          confirmDelete("photo", { filename: photo.filename, album: photo.album }, event);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          zIndex: 2,
                          background: "rgba(255,255,255,0.92)",
                          boxShadow: 2,
                          border: "2px solid #fff",
                          transition: "background 0.2s, color 0.2s",
                          "&:hover": {
                            background: "#43a047",
                            color: "#fff",
                          },
                        }}
                        size="small"
                        onClick={event => {
                          event.stopPropagation();
                          handleValidate(photo._id);
                        }}
                        title="Validate Photo"
                      >
                        <CheckCircleOutline fontSize="small" />
                      </IconButton>
                    </Box>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 36,
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
          {sortedUnvalidated.length > 0 && (
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap"
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleValidateAll}
              disabled={sortedUnvalidated.length === 0}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                minWidth: 140,
                fontWeight: 500,
                px: 3,
                py: 1
              }}
            >
              Validate All
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAllUnvalidated}
              disabled={sortedUnvalidated.length === 0}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                minWidth: 140,
                fontWeight: 500,
                px: 3,
                py: 1,
                borderWidth: 2
              }}
            >
              Delete All
            </Button>
          </Box>
          )}


          {/* Divider */}
          <Box sx={{ height: 32 }} />

          {/* Validated Section */}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              textAlign: "left",
              mb: 1.5,
              px: 2,
              py: 1,
              background: "linear-gradient(90deg, #e0e7ff 0%, #ede9fe 100%)",
              color: "#4a00e0",
              borderRadius: 2,
              boxShadow: 1,
              letterSpacing: 1,
              fontSize: { xs: "1.1rem", sm: "1.25rem" }
            }}
          >
            Validated Photos
          </Typography>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <FormControl size="small" sx={{ minWidth: 160, background: "#fff", borderRadius: 2, boxShadow: 1 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={validatedSortOrder}
                label="Sort by"
                onChange={e => setValidatedSortOrder(e.target.value)}
                sx={{ fontWeight: 500, color: "#333" }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {loadingPhotos ? (
            <CircularProgress />
          ) : sortedValidated.length === 0 ? (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              No validated photos.
            </Typography>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {sortedValidated.map((photo, index) => (
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
                        src={`${backendURL}${photo.src}`}
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
                          event.stopPropagation();
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

      {tabIndex === 1 && (loadingAlbums ? (<CircularProgress />
      ) : albums.length === 0 ? (
        <Typography color="text.secondary" sx={{ my: 4 }}>
          No albums to display.
        </Typography>
      )
        : (
          <Grid container spacing={2} justifyContent="center">
            {albums.map((album) => {
              const unvalCount = unvalidatedCountByAlbum[album.albumName] || 0;
              return (
                <Grid item key={album.albumName} xs={12} sm={4} sx={{ position: "relative" }}>
                  <Card sx={{ cursor: "pointer" }} onClick={() => openAlbum(album.albumName)}>
                    <IconButton
                      sx={{
                        position: "absolute",
                          top: 10,
                          left: 10,
                          zIndex: 2,
                          background: "rgba(255,255,255,0.92)",
                          boxShadow: 2,
                          border: "2px solid #fff",
                          transition: "background 0.2s, color 0.2s",
                          "&:hover": {
                            background: "#43a047",
                            color: "#fff",
                          },
                        }}
                        size="small"
                        onClick={event => {
                          event.stopPropagation();
                          handleValidateAlbum(album.albumName);
                        }}
                        disabled={unvalCount === 0}
                title={
                  unvalCount === 0
                    ? "All photos already validated"
                    : `Validate ${unvalCount} photos`
                }>
                        <CheckCircleOutline fontSize="small" />
                      </IconButton>
                  <IconButton
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 2,
                background: "rgba(255,255,255,0.92)",
                "&:hover": { background: "#d32f2f", color: "#fff" },
              }}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAlbum(album.albumName);
              }}
              title="Delete Album"
            >
              <Delete fontSize="small" />
            </IconButton>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`${backendURL}${album.coverImage}`}
                    alt={album.albumName}
                    loading="lazy"
                  />
                  <CardContent>
                    <Typography variant="h6">{album.albumName}</Typography>
                    <Typography variant="body2">{album.totalPhotos} photos</Typography>
                  </CardContent>
                </Card>
              </Grid>
              );
            })}
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
              <Box component="img" src={`${backendURL}${albumPhotos[sliderIndex].src}`} alt="Album Image" sx={{ maxWidth: "100%", maxHeight: "80vh" }} />
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
                src={`${backendURL}${selectedPhoto.src}`}
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