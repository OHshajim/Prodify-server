# Prodify - Backend

Live Link : https://prodify-232d8.web.app/

Server Side Link : https://github.com/OHshajim/Prodify

## Project Overview

This backend server is part of Prodify, single-page application designed to allow users to perform search and filtering operations on a set of products. The backend is responsible for handling data storage, retrieval, and API endpoints for product management, including functionalities such as pagination, searching, categorization, sorting, and authentication.

## Features

- **CRUD Operations**: Only Read operation used on this project.
- **Pagination**: Efficient loading of products with support for pagination.
- **Search**: Allows users to search products by name.
- **Categorization**: Filters products by brand name, category name, and price range.
- **Sorting**: Sorts products by price (Low to High, High to Low) and date added (Newest first).

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Environment Variables:** Managed with dotenv

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- Express.Js
- MongoDB

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/OHshajim/Prodify-server.git
   ```
2. **Navigate to the project directory**
   ```bash
   cd Prodify-server
   ```
3. **Install dependencies**
   ```bash
   npm install express cors mongodb dotenv
   ```
4. **Create a .env file in the root directory with your Firebase credentials:**

```bash
   DB_URL = "URL"
```

5. **Run the frontend server**
   ```bash
   node index.js
   ```
