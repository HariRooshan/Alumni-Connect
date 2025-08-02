import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Chip
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import * as eventService from "../services/eventService";
import { deleteEventAttachment } from "../services/eventService";
import { format, parse } from "date-fns";
const EventForm = ({ eventForEdit, addOrEdit }) => {
  const initialFieldValues = {
    eventName: "",
    eventDate: new Date().toISOString().split("T")[0],
    description: "",
    location: "",
    eventType: "",
    customEventType: "",
    passedOutYear: "",
  };

  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  useEffect(() => {
    if (eventForEdit) {
      console.log("Received event for edit:", eventForEdit);
      setValues((prev) => ({
        ...prev,
        _id: eventForEdit._id || prev._id || "",
        eventName: eventForEdit.title || "",
        eventDate: eventForEdit.date
          ? new Date(eventForEdit.date).toISOString().split("T")[0]
          : "",
        description: eventForEdit.description || "",
        location: eventForEdit.location || "",
        eventType: eventForEdit.eventType || "",
        passedOutYear: eventForEdit.passedOutYear || "",
        file: eventForEdit.attachment || "",
      }));
      setFile(null); // Reset file input
      setFilePreviewUrl(null); // Reset preview
    } else {
      // Reset form to initial values when creating a new event
      setValues(initialFieldValues);
      setFile(null);
      setFilePreviewUrl(null);
      setErrors({});
    }
  }, [eventForEdit]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;

    // Type validation
    if (!validTypes.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Only PDF, JPEG, JPG, PNG, or WebP files are allowed.",
      }));
      setFile(null);
      setFilePreviewUrl(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        file: "File size must be less than 5MB.",
      }));
      setFile(null);
      setFilePreviewUrl(null);
      return;
    }

    setErrors((prev) => ({ ...prev, file: "" }));
    setFile(selectedFile);
    setFilePreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🟢 handleSubmit called");

    console.log("🔹 Validating...");
    if (!validate()) {
      console.log("❌ Validation failed. Exiting...");
      return;
    }

    console.log("✅ Validation passed. Processing event...");

    const formattedEvent = {
      _id: values._id,
      title: values.eventName,
      date: values.eventDate ? format(new Date(values.eventDate), "yyyy-MM-dd") : null,
      description: values.description,
      location: values.location,
      eventType: values.eventType === "other" ? values.customEventType : values.eventType,
      passedOutYear: values.passedOutYear,
    };

    console.log("📝 Formatted Event Before FormData:", formattedEvent);

    const formData = new FormData();
    Object.keys(formattedEvent).forEach((key) => {
      if (formattedEvent[key] !== null && formattedEvent[key] !== undefined) {
        // console.log("📌 Adding to FormData: ${key} ->, formattedEvent[key]");
        formData.append(key, formattedEvent[key]);
      }
    });

    if (file) {
      console.log("📂 Attaching file:", file.name);
      formData.append("attachment", file);
    }

    console.log("📤 Final FormData before sending:", Object.fromEntries(formData));

    console.log("🚀 Calling addOrEdit function...");
    addOrEdit(formData);

    console.log("✅ Submission completed!");
  };

  const validate = () => {
    let temp = {};
    temp.eventName = values.eventName ? "" : "This field is required.";
    temp.eventDate = values.eventDate ? "" : "This field is required.";
    temp.eventType = values.eventType ? "" : "This field is required.";
    temp.description = values.description ? "" : "This field is required.";
    temp.location = values.location ? "" : "This field is required.";
    temp.passedOutYear =
      !values.passedOutYear || /^\d{4}$/.test(values.passedOutYear) ? "" : "Please enter a valid year (4 digits).";
    if (values.eventType === "other") {
      temp.customEventType = values.customEventType ? "" : "This field is required.";
    }
    setErrors(temp);
    console.log("Validation Errors:", temp);
    return Object.values(temp).every((x) => x === "");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            label={<span>Event Name <span style={{ color: 'red' }}>*</span></span>}
            variant="outlined"
            name="eventName"
            value={values.eventName}
            onChange={handleInputChange}
            error={Boolean(errors.eventName)}
            helperText={errors.eventName}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Event Date"
              inputFormat="dd/MM/yyyy"
              value={values.eventDate ? parse(values.eventDate, "yyyy-MM-dd", new Date()) : null}
              onChange={(date) => {
                if (date) {
                  setValues((prev) => ({
                    ...prev,
                    eventDate: format(date, "yyyy-MM-dd"),
                  }));
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={Boolean(errors.eventDate)}
                  helperText={errors.eventDate}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={<span>Description <span style={{ color: 'red' }}>*</span></span>}
            variant="outlined"
            name="description"
            value={values.description}
            onChange={handleInputChange}
            error={Boolean(errors.description)}
            helperText={errors.description}
            multiline
            rows={4}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={<span>Location <span style={{ color: 'red' }}>*</span></span>}
            variant="outlined"
            name="location"
            value={values.location}
            onChange={handleInputChange}
            error={Boolean(errors.location)}
            helperText={errors.location}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" error={Boolean(errors.eventType)}>
            <InputLabel><span>Event Type <span style={{ color: 'red' }}>*</span></span></InputLabel>
            <Select
              label="Event Type"
              name="eventType"
              value={values.eventType}
              onChange={handleInputChange}
            >
              {eventService.getEventTypes().map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
            {errors.eventType && <FormHelperText>{errors.eventType}</FormHelperText>}
          </FormControl>
        </Grid>
        {values.eventType === "other" && (
          <Grid item xs={12}>
            <TextField
              label="Custom Event Type"
              variant="outlined"
              name="customEventType"
              value={values.customEventType}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            label="Passed Out Year (Optional)"
            variant="outlined"
            name="passedOutYear"
            value={values.passedOutYear}
            onChange={handleInputChange}
            error={Boolean(errors.passedOutYear)}
            helperText={errors.passedOutYear}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            color={file ? "success" : "primary"}
            startIcon={<CloudUploadIcon />}
          >
            {file ? "Change File" : "Upload Event File"}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
            />
          </Button>

          {file && (
            <Chip
              label={file.name}
              color="primary"
              onDelete={() => {
                setFile(null);
                setFilePreviewUrl(null);
                setErrors((prev) => ({ ...prev, file: "" }));
              }}
              sx={{ mt: 1 }}
            />
          )}

          {errors.file && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.file}
            </Typography>
          )}

          {/* File Preview */}

          {file && filePreviewUrl ? (
            // Preview for newly uploaded file
            <Box mt={2}>
              {file.type.startsWith("image/") ? (
                <img
                  src={filePreviewUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
                />
              ) : file.type === "application/pdf" ? (
                <iframe
                  src={filePreviewUrl}
                  title="PDF Preview"
                  style={{ width: "100%", height: 300, border: "1px solid #ccc", borderRadius: 8 }}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Preview not supported for this file type.
                </Typography>
              )}
            </Box>
          ) : values.file ? (
            // Preview for existing uploaded file
            <Box mt={2} sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {values.file.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={`http://localhost:5000${values.file}`}
                title="PDF Preview"
                style={{
                  width: "100%",
                  height: 300,
                  border: "0px",
                  borderRadius: 8
                }}
              />
            ) : (
              <img
                src={`http://localhost:5000${values.file}`}
                alt="Existing"
                style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
              />
            )}

            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ mt: 1 }}
              onClick={async () => {
                if (values._id) {
                  try {
                    await deleteEventAttachment(values._id);
                  } catch (e) {
                    console.error(e);
                  }
                }
                setValues(v => ({ ...v, file: "" }));
                setFile(null);
                setFilePreviewUrl(null);
              }}
            >
              Remove File
            </Button>
          </Box>
          ) : null}


        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#1e88e5" },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EventForm;