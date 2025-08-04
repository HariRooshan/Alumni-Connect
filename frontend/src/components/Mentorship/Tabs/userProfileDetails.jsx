import { Box, Typography, Avatar, Stack, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UserProfileDetails = ({ profile, showEdit, onEdit }) => {
  if (!profile) return null;

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar src={profile.photo} sx={{ width: 72, height: 72, mr: 3, bgcolor: "primary.main" }}>
          {profile.firstName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {profile.firstName} {profile.lastName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.role}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {showEdit && (
          <IconButton color="primary" onClick={onEdit} aria-label="edit profile">
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography><b>Email:</b> {profile.email}</Typography>
        <Typography><b>Introduction:</b> {profile.introduction || <span style={{ color: "#888" }}>Not set</span>}</Typography>
        <Typography><b>LinkedIn:</b> {profile.linkedin ? (
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin}</a>
        ) : <span style={{ color: "#888" }}>Not set</span>}</Typography>
        <Typography><b>Experience/Year:</b> {profile.experienceOrYear || <span style={{ color: "#888" }}>Not set</span>}</Typography>
        <Typography><b>Industry/Department:</b> {profile.industryOrDepartment || <span style={{ color: "#888" }}>Not set</span>}</Typography>
        <Typography><b>Meeting Method:</b> {profile.meetingMethod || <span style={{ color: "#888" }}>Not set</span>}</Typography>
        <Typography><b>Education:</b> {profile.education || <span style={{ color: "#888" }}>Not set</span>}</Typography>
        <Typography><b>Skills:</b></Typography>
        <Box sx={{ mb: 0 }}>
          {profile.skills && profile.skills.length > 0
            ? profile.skills.map((skill) => (
              <Chip key={skill} label={skill} sx={{ mr: 1, mb: 1 }} />
            ))
            : <span style={{ color: "#888" }}>No skills listed</span>
          }
        </Box>
      </Stack>
    </>
  );
};

export default UserProfileDetails;