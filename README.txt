=====================================================
LUXORA MOTORS - Premium Automotive Showroom
Course: Multimedia (University Project)
=====================================================

1. PROJECT TITLE
LUXORA MOTORS

2. PROJECT DESCRIPTION
A multi-page static website for a premium showroom of luxury, sports and
high-performance vehicles. It uses only HTML5, CSS3 and vanilla JavaScript:
no frameworks, no backend, no database.
All vehicle prices, specifications and contact details are ILLUSTRATIVE
DEMO DATA. They are not verified facts and not real offers.

3. STUDENTS (PLACEHOLDERS - EDIT BEFORE SUBMISSION)
Student 1: [Full Name] - [Student ID]
Student 2: [Full Name] - [Student ID]
Student 3: [Full Name] - [Student ID]

4. TECHNOLOGIES USED
HTML5 (semantic elements), CSS3 (Flexbox, Grid, custom properties,
transitions, media queries), vanilla JavaScript (DOM, events,
IntersectionObserver). Google Fonts: Montserrat and Poppins.

5. PAGES AND SECTIONS
index.html          Hero, About, Featured Vehicles, Specifications,
                    PHOTOSHOP BEFORE & AFTER, Gallery, Contact, Footer
pages/about.html    Brand story, mission, vision, values
pages/cars.html     Collection (search + brand/price filters) and specs
pages/gallery.html  Photo gallery with full-screen viewer
pages/contact.html  Contact details and validated form

6. HTML TECHNIQUES
header, nav, main-style sections, article, figure/figcaption, footer;
labelled form fields; alt text on images; aria-labels on controls.

7. CSS TECHNIQUES
Flexbox: navigation, buttons, filter bar, footer rows.
Grid: card grid, gallery grid, specification grid, before/after pairs,
two-column layouts, footer columns.
Also: CSS variables (colour palette), hover and zoom transitions,
sticky/fixed navigation, responsive breakpoints at 1024, 768 and 560 px.

8. JAVASCRIPT FUNCTIONALITY
- js/data.js        Vehicle, featured and gallery data (edit cars here)
- js/collection.js  Renders cards; search, brand and price filters
- js/script.js      Mobile menu, active link / scroll spy, reveal
                    animations, gallery viewer, form validation,
                    image fallback (local image if a web photo fails)

8b. VEHICLE COLLECTION (30 CARS)
js/data.js holds exactly 30 vehicles (12 brands) with engine, performance,
drivetrain, body, interior, features and safety data. Prices are illustrative.
Specs are recalled typical figures, NOT verified; "estimatedFields" marks
estimates. Collection page: search, brand / price / category / fuel /
transmission filters, 4 sorting options, results counter, Clear All Filters,
and a details window (View Details) for every car.
CAR PHOTOS: 30 real photographs (supplied by the team) are stored as
images/cars/<brand>/<car-id>.jpg (1000x625, optimized JPEG). Two sources were
low resolution (BMW M5, Mercedes S-Class); replace them with sharper photos
using the same file names. Check photo licences before public use.

9. PHOTOSHOP REQUIREMENT
The section "PHOTOSHOP BEFORE & AFTER" (index.html) needs 5 comparisons.
The five pairs in images/original/ (real photos) and images/edited/ (AFTER) show:
1 cinematic colour grading, 2 background replacement, 3 distraction removal,
4 dodge & burn, 5 advertising poster. The AFTER images were made with Python/
OpenCV code that imitates Photoshop techniques; they are NOT Adobe Photoshop
work. No PSD files exist yet. Redo the edits in Photoshop before submission.

10. HOW TO REPLACE THE PHOTOSHOP IMAGES
1. Pick 5 car photos and save the untouched originals as
   images/original/image1.jpg ... image5.jpg
2. Edit each one in Adobe Photoshop and export the result as
   images/edited/image1.jpg ... image5.jpg
   (use the same size and aspect ratio, 3:2, e.g. 1200x800)
3. Keep the same file names - no HTML change is needed.
4. Open index.html, find PHOTOSHOP BEFORE & AFTER, and update each
   description and technique tag to match what you actually did.
5. Update the descriptions and the transparency note once the real Photoshop images are in place.
6. Save your .PSD files in the photoshop/ folder.

11. RUNNING THE WEBSITE LOCALLY
Double-click index.html (any modern browser). No installation needed.
An internet connection is only used for Google Fonts and the web photos;
if a photo cannot load, a local fallback image from images/cars,
images/gallery or images/fallback is shown automatically.
Optional: "node scripts/build.mjs" copies the site into a dist/ folder.

12. FOLDERS
css/ js/ pages/ images/original images/edited images/cars images/gallery
images/fallback photoshop/
