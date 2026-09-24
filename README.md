# 🏡 StayNest

<p align="center">
  <b>A full-stack accommodation listing platform built with Node.js, Express, MongoDB and EJS.</b>
</p>

<p align="center">
  Create, explore, search and manage accommodation listings with authentication, image uploads, categories, reviews and ratings.
</p>

---

## ✨ Features

* 🔐 User registration, login and logout
* 🏠 Create, view, edit and delete accommodation listings
* 🖼️ Image upload and storage using Cloudinary
* 🔎 Search listings by title, description, category, location and country
* 🗂️ Category-based listing filtering
* ⭐ Reviews and ratings for listings
* 👤 Listing ownership and authorization
* 📋 My Listings section for managing personal listings
* 🛡️ Protected routes for authenticated users
* ✅ Server-side validation using Joi and Mongoose
* 💬 Flash messages for success and error feedback
* 📱 Responsive interface for desktop, tablet and mobile
* ⚠️ Custom error handling for invalid requests and missing resources

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose                              |
| ---------- | ------------------------------------ |
| EJS        | Dynamic server-side HTML rendering   |
| EJS-Mate   | Layouts and reusable EJS templates   |
| Bootstrap  | Responsive UI components and layout  |
| HTML5      | Page structure                       |
| CSS3       | Custom styling and responsive design |
| JavaScript | Client-side form validation          |

### Backend

| Technology                | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| Node.js                   | JavaScript runtime                        |
| Express.js                | Web server and routing                    |
| Mongoose                  | MongoDB ODM                               |
| Passport.js               | Authentication                            |
| Passport-Local-Mongoose   | Local authentication and password hashing |
| Express Session           | User session management                   |
| Connect-Mongo             | Persistent session storage in MongoDB     |
| Joi                       | Request validation                        |
| Multer                    | Handling multipart/form-data uploads      |
| Cloudinary                | Image storage                             |
| Multer Storage Cloudinary | Connecting Multer with Cloudinary         |
| Connect-Flash             | Success and error messages                |
| Method Override           | Supporting PUT and DELETE from HTML forms |
| Dotenv                    | Environment variable management           |

### Database & Storage

* **MongoDB** — application database
* **Cloudinary** — listing image storage

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      Browser        │
                    │   EJS + Bootstrap   │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │   Express Server    │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐     ┌───────────┐    ┌────────────┐
        │ Passport │     │ Mongoose  │    │ Cloudinary │
        │   Auth   │     │  MongoDB  │    │   Images   │
        └──────────┘     └───────────┘    └────────────┘
```

StayNest follows a traditional **MVC-style structure**:

```text
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
```

The EJS views handle the presentation layer.

---

## 📁 Project Structure

```text
StayNest/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── routes/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── views/
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   │
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── error.ejs
│   │   ├── index.ejs
│   │   ├── mine.ejs
│   │   ├── new.ejs
│   │   └── view.ejs
│   │
│   └── users/
│       ├── login.ejs
│       └── signup.ejs
│
├── public/
│   ├── css/
│   │   ├── rating.css
│   │   └── style.css
│   │
│   └── js/
│       └── script.js
│
├── init/
│   ├── data.js
│   └── initDB.js
│
├── utils/
│   ├── CustomError.js
│   └── wrapAsync.js
│
├── CloudConfig.js
├── middleware.js
├── schema.js
├── index.js
├── package.json
└── .gitignore
```

---

## 🧩 Main Modules

### Listings

The listing module handles the complete lifecycle of an accommodation:

```text
Create → Read → Update → Delete
```

Users can:

* Create a new listing
* Upload a listing image
* View listing details
* Edit their own listings
* Delete their own listings
* Browse all listings
* Search listings
* Filter listings by category

---

### 🔎 Search & Category Filtering

StayNest supports search from the navbar.

The search checks:

```text
Title
Description
Category
Location
Country
```

Search is implemented using MongoDB's `$or` query with case-insensitive regular expressions.

Example:

```javascript
filter.$or = [
    { title: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } },
    { category: { $regex: search, $options: "i" } },
    { location: { $regex: search, $options: "i" } },
    { country: { $regex: search, $options: "i" } }
];
```

Users can also filter listings using predefined categories such as:

```text
Farms
Rooms
Beach
Mountain
Cabins
Amazing Pools
Amazing Views
Lakefront
Iconic Cities
Surfing
Camping
Historic
```

---

## 🔐 Authentication & Authorization

StayNest uses:

```text
Passport.js
Passport-Local-Mongoose
Express Session
Connect-Mongo
```

### Authentication Flow

```text
User Signup
     ↓
Passport-Local-Mongoose
     ↓
Password hashing
     ↓
User stored in MongoDB
     ↓
Session created
     ↓
HTTP-only session cookie
```

During login, Passport authenticates the user and establishes the session.

The session is stored in MongoDB using `connect-mongo`.

---

### Route Protection

Protected functionality requires authentication.

For example:

```text
Create Listing
Edit Listing
Delete Listing
Add Review
Delete Review
View My Listings
```

If a logged-out user tries to access protected functionality, they are redirected to the login page.

StayNest also remembers the original URL so that after logging in, the user can be redirected back to the page they originally wanted to access.

---

## 👤 Authorization

Authentication answers:

> "Are you logged in?"

Authorization answers:

> "Are you allowed to modify this particular resource?"

StayNest checks listing ownership before allowing editing or deletion.

```text
User
  ↓
Authenticated?
  ↓
Is user the listing owner?
  ↓
Yes → Allow operation
No  → Redirect with error
```

The same concept is used for review deletion, where only the review author can delete their review.

---

## 🖼️ Image Upload

Listing images are uploaded using:

```text
Multer
   ↓
Cloudinary Storage
   ↓
Cloudinary
   ↓
Image URL stored in MongoDB
```

Each listing stores:

```javascript
image: {
    filename,
    url
}
```

Cloudinary is configured specifically for the `StayNest` folder.

Supported image formats include:

```text
PNG
JPG
JPEG
```

---

## ⭐ Reviews & Ratings

Users can add reviews to listings.

Each review contains:

```text
Rating
Comment
Author
```

Ratings are validated between:

```text
0 → 5
```

Reviews are referenced from the listing using MongoDB ObjectIds.

The application also populates review authors when displaying a listing.

When a listing is deleted, its associated reviews are also removed.

---

## 🗄️ Database Models

StayNest uses three main MongoDB models.

### User

```text
User
├── username
├── email
└── authentication data
```

Authentication-related fields are handled through Passport-Local-Mongoose.

---

### Listing

```text
Listing
├── title
├── description
├── image
│   ├── filename
│   └── url
├── price
├── location
├── country
├── category
├── owner
└── reviews[]
```

---

### Review

```text
Review
├── comment
├── rating
└── author
```

Relationships:

```text
User
 │
 ├──────── owns ────────► Listing
 │
 └──────── writes ──────► Review

Listing
 │
 └──────── contains ────► Reviews
```

---

## ✅ Validation

StayNest performs validation at multiple levels.

### Joi Validation

Incoming listing and review data is validated using Joi before reaching the controller.

Listing validation checks:

```text
Title
Description
Category
Price
Location
Country
```

Review validation checks:

```text
Rating
Comment
```

### Mongoose Validation

The Listing model also validates fields such as:

```text
Required title
Required image fields
Required category
Rating range
```

Updates use:

```javascript
{ runValidators: true }
```

so Mongoose validation is also applied during listing updates.

---

## 🛡️ Error Handling

StayNest uses a custom error-handling system.

### CustomError

Application-specific errors can be passed through the custom error class.

```javascript
new CustomError(statusCode, message)
```

### Async Error Handling

Asynchronous route handlers are wrapped using:

```text
wrapAsync()
```

This prevents repetitive `try/catch` blocks in route handlers.

### Central Error Handler

The Express application has a centralized error-handling middleware that handles:

```text
404 errors
Validation errors
Cast errors
Server errors
```

and renders a dedicated error page.

---

## 🎨 UI & Design

StayNest uses a clean accommodation-platform style interface.

### Navbar

The navigation bar contains:

```text
Explore
My Nests
Search
Add New Nest
Sign Up / Log In / Log Out
```

### Listing Cards

Listings are displayed as image-based cards with:

```text
Listing image
Title
Price / night
Location
Country
```

### Categories

Category icons are displayed horizontally and can be scrolled on smaller screens.

### Responsive Design

The CSS contains responsive layouts for:

```text
Desktop
Tablet
Mobile
Small mobile screens
```

The listing cards, navigation bar, search bar and forms adapt to smaller screen sizes.

---

## 🔄 Request Flow

For example, when a user creates a listing:

```text
User fills listing form
          ↓
POST /listings
          ↓
Authentication Middleware
          ↓
Multer handles image
          ↓
Cloudinary uploads image
          ↓
Joi validates listing data
          ↓
Controller creates Listing
          ↓
MongoDB stores listing
          ↓
Flash success message
          ↓
Redirect to listings
```

---

## 🔎 Search Flow

```text
User enters search
        ↓
GET /listings?search=...
        ↓
Listing Controller
        ↓
MongoDB $or query
        ↓
Title / Description / Category
Location / Country
        ↓
Matching listings
        ↓
EJS renders results
```

---

## ⭐ Review Flow

```text
Logged-in user
      ↓
Submit review
      ↓
Joi validation
      ↓
Review created
      ↓
Review author stored
      ↓
Review ID added to Listing
      ↓
Listing displays populated reviews
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd StayNest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

> Never commit your `.env` file to GitHub.

### 4. Start the application

```bash
node index.js
```

The application runs on:

```text
http://localhost:3000
```

---

## 📦 Dependencies

The project uses packages including:

```text
express
mongoose
ejs
ejs-mate
passport
passport-local
passport-local-mongoose
express-session
connect-mongo
connect-flash
multer
multer-storage-cloudinary
cloudinary
joi
method-override
dotenv
```

---

## 🌱 Future Improvements

Possible future improvements include:

* 💳 Online booking and payment
* 📅 Availability calendar
* 🗺️ Location maps
* ❤️ Wishlist / favourites
* 🔔 Booking notifications
* 💬 Host–guest messaging
* 🔍 More advanced filtering
* 📊 Host dashboard and analytics
* ☁️ Deployment with production configuration

---

## 👨‍💻 Author

### Shreshth Rastogi

Computer Science Engineering Student

<p align="center">
  <a href="https://github.com/shreshth-rastogi">
    <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github" />
  </a>
  <a href="https://www.linkedin.com/in/shreshth-rastogi-9a523b32a/">
    <img src="https://img.shields.io/badge/LinkedIn-Profile-0A66C2?style=for-the-badge&logo=linkedin" />
  </a>
  <a href="https://leetcode.com/u/ShreshthR5/">
    <img src="https://img.shields.io/badge/LeetCode-Profile-FFA116?style=for-the-badge&logo=leetcode" />
  </a>
</p>

---

<p align="center">
  Built with Node.js, Express, MongoDB and EJS ❤️
</p>
