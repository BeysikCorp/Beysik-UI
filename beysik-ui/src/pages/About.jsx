import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Renamed to avoid conflict if MUI Link is used
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../styles/product-pages.css'; // Assuming this file contains the shared page styles

// Placeholder image URLs - replace with your actual images
const brandStoryImage = 'https://placehold.co/600x400/EAEAEA/333?text=Our+Story&font=Inter';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.alt || '#f9f9f9', // Added a fallback for background.alt
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none', // Removing default paper shadow if sections are distinct enough
}));

const AboutPage = () => {
  return (
    <div className="product-page"> {/* Use the common class for page styling */}
      <div className="container"> {/* Use the common class for content centering and padding */}
        <div className="page-header">
          <h2 className="page-title">About Us</h2>
          <div className="breadcrumb">
            <RouterLink to="/" className="breadcrumb-link">Home</RouterLink> &gt;
            <span className="breadcrumb-current">About Us</span>
          </div>
        </div>

        {/* MUI Container for finer control over content width if needed, or remove if "container" class is sufficient */}
        <Container maxWidth="lg" sx={{ mt: 0, pt: 0 }}> {/* Adjusted margin/padding if page-header handles it */}
          <StyledPaper>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
              Our Story
            </Typography>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  Welcome to BEYSIK, where minimalist design meets conscious living. Founded in 2025, our journey began with a simple idea: to create high-quality, timeless apparel that doesn't compromise on style or sustainability.
                </Typography>
                <Typography variant="body1" paragraph>
                  We believe that fashion should be effortless and enduring. Our collections are thoughtfully designed with a focus on clean lines, versatile pieces, and premium, eco-friendly materials. We're passionate about creating clothes that you'll love to wear season after season.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: '8px', // Consistent with theme.shape.borderRadius
                  }}
                  alt="Our Brand Story"
                  src={brandStoryImage}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          <StyledPaper>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
              Our Mission & Values
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Sustainability</Typography>
                <Typography variant="body2">
                  We are committed to minimizing our environmental footprint by using sustainable materials like organic cotton and recycled fabrics, and partnering with ethical manufacturers.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Quality Craftsmanship</Typography>
                <Typography variant="body2">
                  Every BEYSIK piece is crafted with attention to detail, ensuring durability and a perfect fit, so you can invest in pieces that last.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Timeless Design</Typography>
                <Typography variant="body2">
                  We focus on creating versatile essentials that transcend fleeting trends, allowing you to build a wardrobe that is both modern and enduring.
                </Typography>
              </Grid>
            </Grid>
          </StyledPaper>

          <Box textAlign="center" mt={5} mb={5}>
            <Typography variant="h5" gutterBottom>
              Join Our Journey
            </Typography>
            <Typography variant="body1">
              Follow us on social media or subscribe to our newsletter for the latest updates and inspirations.
            </Typography>
            {/* Add social media links or newsletter signup form here */}
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default AboutPage;