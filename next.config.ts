import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "media.api-sports.io" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Clickjacking protection — deny all framing
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Referrer policy — send origin for cross-origin, full URL for same-origin
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Disable DNS prefetching (reduces info leakage)
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
          // X-XSS-Protection is deprecated; set 0 to let modern browsers
          // rely on CSP instead
          {
            key: "X-XSS-Protection",
            value: "0",
          },
          // HTTP Strict Transport Security — enforce HTTPS for 1 year,
          // include subdomains, no preload until we're confident
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Content Security Policy — restricts resources to same-origin
          // plus known CDNs (Wikimedia for team crests, API-Sports for
          // club crest images). unsafe-inline on scripts/styles is
          // required for Next.js App Router hydration runtime.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://upload.wikimedia.org https://media.api-sports.io",
              "connect-src 'self'",
              "font-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // Permissions-Policy — restrict browser features
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()",
              "accelerometer=()",
            ].join(", "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
