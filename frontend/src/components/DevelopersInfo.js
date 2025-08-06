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
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

const developers = [
  {
    name: 'Balamurugan M',
    department: 'IT',
    email: 'balamuurganmani4@gmail.com',
    linkedin: 'https://www.linkedin.com/in/balamurugan-mani-9b4471254',
  },
  {
    name: 'Kathiravan R',
    department: 'IT',
    email: 'kathir@gmail.com',
    linkedin: 'https://linkedin.com/in/kathir',
  },
  {
    name: 'Sundar S',
    department: 'ECE',
    email: 'sundar@gmail.com',
    linkedin: 'https://linkedin.com/in/sundar',
  },
  {
    name: 'Vignesh T',
    department: 'MECH',
    email: 'vignesh@gmail.com',
    linkedin: 'https://linkedin.com/in/vignesh',
  },
  {
    name: 'Divya K',
    department: 'EEE',
    email: 'divya@gmail.com',
    linkedin: 'https://linkedin.com/in/divya',
  },
  {
    name: 'Priya R',
    department: 'CIVIL',
    email: 'priya@gmail.com',
    linkedin: 'https://linkedin.com/in/priya',
  },
];

const DeveloperInfo = () => {
  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Developer Team
      </Typography>

      <Grid container spacing={4}>
        {developers.map((dev, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 2 }}>
                <PersonIcon />
              </Avatar>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{dev.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {dev.department} Department
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  <Link href={`mailto:${dev.email}`} underline="hover">
                    {dev.email}
                  </Link>
                </Typography>
              </CardContent>
              <CardActions>
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
