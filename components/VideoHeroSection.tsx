"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
// import LeafButton from "./leaf-button"
import Container from "./Container"

interface VideoHeroSectionProps {
  videoUrl?: string
  fallbackImage?: string
  title?: string
  subtitle?: string
  description?: string
}

const VideoHeroSection: React.FC<VideoHeroSectionProps> = ({
  videoUrl = "/placeholder.svg?height=800&width=1200",
  title = "Freshness, Purity and Trust",
  subtitle = "that you",
  description = "deserve.",
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [showFallback, setShowFallback] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // For demo purposes, we'll use the fallback image
    setShowFallback(true)
    setIsVideoError(true)
  }, [])

  // const handleVisitFarm = () => {
  //   console.log("Visit farm clicked")
  // }

  return (
    <section className="relative w-full h-[45vh] sm:h-[80vh] lg:h-screen min-h-[390px] max-h-[800px] overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 w-full h-full">
        {!isVideoError && videoUrl && (
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded && !showFallback ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => {
              setIsVideoLoaded(true)
              setShowFallback(false)
            }}
            onError={() => setIsVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Fallback Image */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            showFallback || isVideoError ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')`,
          }}
        />
      </div>

      {/* Gradient Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <Container>
          <div className="text-left text-white px-4 max-w-5xl mx-auto">
            {/* Main Heading */}
            <div className="space-y-2 sm:space-y-4 mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block mb-2">{title}</span>
                <span className="block">
                  {subtitle}{" "}
                  <span className="text-orange-400 relative">
                    {description}
                    {/* Decorative underline */}
                    <div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transform scale-x-0 animate-pulse"
                      style={{ animationDelay: "1s", animationDuration: "2s", animationFillMode: "forwards" }}
                    />
                  </span>
                </span>
              </h1>
            </div>

            {/* Visit Farm Button */}
            {/* <div className="flex justify-start">
              <LeafButton
                onClick={handleVisitFarm}
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl"
              >
                Visit Farm
              </LeafButton>
            </div> */}

            {/* Decorative elements */}
            <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Status Indicator */}
      {/* <div className="absolute bottom-6 right-6 z-10">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isVideoError ? "bg-orange-500" : "bg-green-500"}`} />
          <span className="text-white text-sm font-medium">{isVideoError ? "Image Mode" : "Video Mode"}</span>
        </div>
      </div> */}

      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-green-400/30 rounded-full animate-float" />
      <div
        className="absolute top-40 right-20 w-6 h-6 bg-orange-400/30 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-19 left-20 w-3 h-3 bg-yellow-400/30 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      />
    </section>
  )
}

export default VideoHeroSection
