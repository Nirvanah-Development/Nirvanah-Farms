import Container from "@/components/Container";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
// import OfficeSection from "@/components/OfficeSection";
import VideoHeroSection from "@/components/VideoHeroSection";
import { getCategories } from "@/sanity/queries";
import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  // Example office data - in a real app, this would come from your backend/API
/*   const mockOfficeData = {
    code: "001",
    name: "Dutch Bangla Bank Ltd.",
    location: "Satmasjid Road, Dhanmondi",
    image: "/images/greenback.jpg" // Using fallback image for now
  };
 */
  // Set this to true to show connected state, false to show not connected state
 /*  const isConnectedToOffice = true; */ // Change to true to see connected state

  return (
    <>
      {/* Office Section - right after header */}
      {/* <OfficeSection 
        office={mockOfficeData}
        isConnected={isConnectedToOffice}
      /> */}

      {/* Video Hero Section */}
      <VideoHeroSection />

      {/* Existing Content */}
      <Container className="bg-shop-light-pink">
        <ProductGrid categories={categories} />
        <HomeCategories categories={categories} />
      </Container>
    </>
  );
};

export default Home;
