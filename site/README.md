# Premium Car Wash Booking App

A modern, mobile-first car wash booking application with Arabic/English support and premium black & gold design.

## Features

- 🌐 **Dual Language Support**: Arabic (RTL) and English (LTR)
- 🎨 **Premium Design**: Black & gold theme with smooth animations
- 📱 **Mobile-First**: Optimized for mobile devices
- 🔐 **Authentication**: Secure login and registration with Supabase
- 🚗 **Car Management**: Add, edit, and delete cars
- 📍 **Address Management**: Save and manage locations
- 📅 **Booking System**: Multi-step wizard for easy booking
- 📋 **Order Tracking**: View open, completed, and cancelled orders
- ⚙️ **Settings**: Profile management and language toggle

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (Auth, Database, RLS)
- **Fonts**: Google Fonts (Tajawal for Arabic)
- **Icons**: Font Awesome 6
- **Design**: Custom CSS with variables system

## Project Structure

```
/New Site2
├── /assets              # Images and assets
├── /lang                # Language files (ar.json, en.json)
├── /pages               # Application pages
│   ├── login.html
│   ├── register.html
│   ├── home.html
│   ├── booking.html
│   ├── orders.html
│   ├── cars.html
│   ├── addresses.html
│   └── settings.html
├── /styles              # CSS files
│   ├── variables.css
│   ├── reset.css
│   └── components.css
├── /utils               # JavaScript utilities
│   ├── i18n.js
│   └── supabase.js
└── index.html           # Entry point with splash screen
```

## Setup Instructions

### 1. Supabase Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema SQL (provided separately)
3. Get your Supabase URL and anon key from project settings
4. Update `utils/supabase.js`:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

### 2. Local Development

1. Open the project folder in your code editor
2. Start a local server (required for proper CORS handling):
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js http-server
   npx http-server -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```
3. Open `http://localhost:8080` in your browser

### 3. Database Schema

The app uses the following Supabase tables:
- `business_settings` - App branding (name, logo)
- `cars` - User's vehicles
- `addresses` - Saved locations
- `bookings` - Booking records

All tables have Row Level Security (RLS) enabled.

## Features Overview

### Authentication
- Register with email, password, name, and phone
- Login with email/password
- Session persistence
- Secure logout

### Home Dashboard
- Welcome message with user name
- Business branding from Supabase
- Quick action cards
- Stats (total bookings, upcoming appointments)
- Recent orders

### Booking Wizard
- **Step 1**: Select car from saved cars
- **Step 2**: Choose service (basic, premium, deluxe)
- **Step 3**: Pick date
- **Step 4**: Select time slot (checks availability)
- **Step 5**: Location and optional notes
- Progress indicator
- Form validation

### Order Management
- Three tabs: Open, Completed, Cancelled
- Order details with car, date, time, location
- Status badges
- Cancel booking functionality

### Car Management
- List all cars
- Add new car (brand/model, license plate)
- Edit car details
- Delete cars
- Empty state with prompt

### Address Management
- Save multiple addresses
- Edit and delete addresses
- Labels (Home, Work, etc.)
- Used in booking flow

### Settings
- View profile (name, email, avatar)
- Language toggle (English ↔ Arabic)
- Quick links to cars/addresses/orders
- Logout

## Language System

The app uses a custom i18n system:

```javascript
// Get translation
i18n.t('auth.login'); // Returns "Login" or "تسجيل الدخول"

// Change language
i18n.setLanguage('ar'); // Switches to Arabic with RTL

// HTML usage
<button data-i18n="auth.login">Login</button>
```

## Styling

The app uses CSS custom properties for consistent theming:

```css
:root {
  --color-black: #000000;
  --color-gold: #D4AF37;
  --color-white: #FFFFFF;
  /* ... more variables */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All pages require authentication (except login/register)
- The app is fully responsive (320px - 428px optimal)
- RTL support is automatic when Arabic is selected
- All forms include validation
- Loading states for async operations

## License

Private project - All rights reserved

## Support

For issues or questions, contact the development team.
