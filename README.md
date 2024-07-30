# Bikayi Admin Panel

## Overview

Welcome to our ReactJS-powered e-commerce Admin Panel, where managing your online store is effortless. With streamlined features including sales reports, website customization, and settings adjustment, you can efficiently oversee every aspect of your business operations. From monitoring sales performance to fine-tuning website aesthetics and configuring preferences, our Admin Panel offers a seamless experience for optimizing your e-commerce venture.

## Table of Contents

1.  [Overview](#overview)
2.  [Requirements](#requirements)
3.  [Installation](#installation)
4.  [Configuration](#configuration)
5.  [Running the Application](#running-the-application)
6.  [Folder Structure](#folder-structure)
7.  [Testing Environment](#testing-environment)
8.  [Production Environment](#production-environment)

## Requirements

Before you begin, ensure you have met the following requirements:

- Node (version 20 or higher)
- React (version 18.2 or higher)
- pnpm (version 9.1.2 or higher)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/devinnow8/bikayi-clone.git
   cd bikayi-clone
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   ```

## Configuration

**Environment Variables:**

Create a .env file in the root directory and add the following environment variables:

```env
VITE_BASE_URL =
VITE_WEBSITE_URL =

```

## Running the Application

1. **Environment Variables:**

   To start the application, use the following command:

   ```sh
    pnpm run dev
   ```

   The server will start on the port specified in the .env file.

## Folder Structure

```sh
bikayi-clone/
├── public/                    # Public Files
└── src/                       # Main App
   ├── api/                    # API Handler
   └──  app/                   # Main Routes
      ├── auth/                # Authentication
      ├── components/          # Reusable Components
      ├── constant/            # Constant Values
      ├── cropper/             # Image Cropping
      ├── customers/           # Customer Page
      ├── customize/           # Customization Website
      ├── home/                # Dashboard
      ├── navbarComponents/    # NavBar/SideBar
      ├── orders/              # Orders Page
      ├── products/            # Product Page
      ├── reports/             # Reports Page
      ├── search/              # SearchBar
      ├── settings/            # Settings Page
      ├── shimmer/             # Loading Animations or Effects
      └── utils/               # Utility Functions
   ├── errorBoundary/          # Error Boundary Component
   ├── store/                  # Redux Store & Slices
   ├── utils/                  # Utilities
   ├── App.jsx                 # Layout Structure (Outlet)
   ├── index.css               # TailwindCSS Imports
   ├── main.jsx                # Main Entry Point
   ├── protectedRoutes.jsx     # Protected Routes
   └── routes.jsx              # Routes Defined Here
├── .env                       # Environment Variables
├── index.html                 # Index Page
├── package.json               # NPM Dependencies and Scripts
├── README.md                  # README
├── tailwind.config.js         # Tailwind Config File
└── vite.config.js             # Vite Config File
```

## Testing Environment

The testing environment has been deployed on Firebase , which is connected with staging branch

[https://bikayi-clone-test.web.app/](https://bikayi-clone-test.web.app/)

## Production Environment

The production environment has been deployed to Firebase, which is connected with stable branch

[https://bikayi-clone.web.app/](https://bikayi-clone.web.app/)
