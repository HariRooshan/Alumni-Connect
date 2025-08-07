import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Link,
  IconButton,
  Avatar,
  Box,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

const developers = [
  {
    name: 'Hari Rooshan S S',
    department: 'IT',
    email: 'kathir@gmail.com',
    linkedin: 'https://linkedin.com/in/kathir',
  },
  {
    name: 'Kathir P',
    department: 'IT',
    email: 'sundar@gmail.com',
    linkedin: 'https://linkedin.com/in/sundar',
  },
  {
    name: 'Balamurugan M',
    department: 'IT',
    email: 'balamuurganmani4@gmail.com',
    linkedin: 'https://www.linkedin.com/in/balamurugan-mani-9b4471254',
  },
  
  {
    name: 'Shriram B',
    department: 'IT',
    email: 'vignesh@gmail.com',
    linkedin: 'https://linkedin.com/in/vignesh',
  },
  {
    name: 'Kalaisidharth P',
    department: 'It',
    email: 'divya@gmail.com',
    linkedin: 'https://linkedin.com/in/divya',
  },
  {
    name: 'Nandha Eswar C M',
    department: 'It',
    email: 'priya1@gmail.com',
    linkedin: 'https://linkedin.com/in/priya1',
  },
  {
    name: 'Chaandhanu M G',
    department: 'IT',
    email: 'manoj@gmail.com',
    linkedin: 'https://linkedin.com/in/manoj',
  },
  {
    name: 'Nitin S',
    department: 'IT',
    email: 'lavanya@gmail.com',
    linkedin: 'https://linkedin.com/in/lavanya',
  },
];

const DeveloperInfo = () => {
  return (
    <Container sx={{ py: 6, px: { xs: 2, sm: 4, md: 6 } }}>
      <Typography variant="h4" align="center" gutterBottom>
        Developer Team
      </Typography>

      <Grid container spacing={6}>
        {/* Full-screen Background Image */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: "url('Alumni_Image.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  zIndex: -1, // Ensures the background stays behind content
                }}
              />
        {developers.map((dev, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                mb: { xs: 3, sm: 0 }, // Add margin bottom for extra vertical space on small screens
              }}
              elevation={4}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
                <PersonIcon fontSize="large" />
              </Avatar>

              <CardContent sx={{ textAlign: 'center', flexGrow: 1, pb: 0 }}>
                <Typography variant="h6" fontWeight="bold">
                  {dev.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {dev.department} Department
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 1 }} />
                  <Link href={`mailto:${dev.email}`} underline="hover" color="text.primary">
                    {dev.email}
                  </Link>
                </Box>
              </CardContent>

              <CardActions sx={{ pt: 0 }}>
                <IconButton
                  component="a"
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon color="primary" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DeveloperInfo;
