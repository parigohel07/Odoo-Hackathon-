# GlobeTrotter

GlobeTrotter is a travel planning web application built for the Odoo Hackathon. It allows users to search for destinations, discover tourist attractions, build itineraries, track trip expenses against a budget, find travel partners, and share their travel plans with others.

## Team

Nandini Brahmbhatt: Database design, Supabase setup, seed data, Geoapify integration for location search and tourist spots, FastAPI to Supabase connection.

Pari Gohel: User backend, trip CRUD, itinerary CRUD, manual and suggested spot integration, expenses and budget logic, sharing functionality, backend to frontend integration.

Khooshi Ahir: Frontend and UI (mock website), connecting the UI to backend APIs.

## Tech Stack

Backend framework: FastAPI (Python)
Server: Uvicorn
Database: Supabase (PostgreSQL, hosted, shared project)
Database client: supabase-py
External APIs: Geoapify, for destination autocomplete and tourist places search
HTTP requests: requests
Config management: python-dotenv, using a .env file that is not committed to Git
Frontend: React with Vite, built by Khooshi Ahir, connected to the backend, not redesigned
Version control: Git and GitHub, branch based workflow with pull requests

Required Python packages, listed in requirements.txt:
fastapi
uvicorn
requests
python-dotenv
supabase

## What Makes GlobeTrotter Different

Most trip planners assume the user already knows where they want to go. GlobeTrotter is built around a few features that set it apart from a plain itinerary builder.

1. Explore page for undecided travelers. A user who has no fixed destination in mind can browse the explore page to get ideas on where they could go, instead of being forced to type in a place name first.

2. Solo and group trip categorization. Every trip is tagged as either solo or group at the time of creation. This travel type is used throughout the app, including in spot suggestions, so recommendations match the kind of trip being planned rather than being generic.

3. Budget calculator. Users can log individual expenses under categories such as transport, stay, food, activity, or other. The app calculates the running total automatically and compares it against the trip budget, so users always know exactly where they stand instead of tracking it manually.

4. Community page with a find a buddy feature. Solo travelers can use the community page to find a travel partner instead of traveling alone, turning the app into more than just a planning tool.

5. Real time activity suggestions. Instead of a static list of attractions, the app surfaces activity suggestions based on what users are currently looking for, keeping recommendations relevant to current interest rather than a fixed dataset.

## Features

Core flow:
1. User registration, to create a user account.
2. Create trip, entering destination, start and end date, budget, and travel type such as solo or group.
3. Destination search, using real time autocomplete through Geoapify instead of a hardcoded city list.
4. Explore page, for users who have not decided on a destination yet, to browse ideas before committing to one.
5. Suggested itinerary, fetching nearby tourist attractions for the selected destination through the Geoapify Places API, filtered where relevant by travel type.
6. Add spot to itinerary, for both suggested and manually created spots.
7. View itinerary, showing all selected spots along with their order, visit dates, and notes.

Additional features, to be added after the core flow is stable:

8. Manual itinerary entry, letting users add a place themselves instead of choosing from suggestions.
9. Expenses and budget tracking, logging expenses by category such as transport, stay, food, activity, or other, calculating totals, and comparing against the trip budget with an over budget warning.
10. Sharing, generating a shareable link using share_token so trips can be shared through WhatsApp, Gmail, or social media.
11. Community page and find a buddy, letting solo travelers connect with other users planning trips to similar destinations.
12. Real time activity suggestions, surfacing relevant activities based on what users are actively searching for or interested in.

Out of scope for this hackathon:
Dynamic image fetching for destinations or spots is not a priority, since the app works fine without it.
Manually storing every city in the world is avoided, since destinations are resolved dynamically through Geoapify.

## Database Schema

The database already exists in a shared Supabase project, with six tables.

users
id, username, email, created_at

locations
id, name, state, country, description, image_url, created_at
Currently seeded with one record, Udaipur, Rajasthan, India, used for testing only.

trips
id, user_id, location_id, description, start_date, end_date, budget, travel_type, is_public, share_token, created_at
trips.user_id links to users.id
trips.location_id links to locations.id
travel_type stores whether the trip is solo or group, and is used to tailor spot suggestions and community matching.

spots
id, location_id, name, description, category, image_url, estimated_cost, duration, is_solo_friendly, is_group_friendly
spots.location_id links to locations.id
is_solo_friendly and is_group_friendly are used to match spot suggestions to the trip's travel type.

trip_spots
id, trip_id, spot_id, visit_date, visit_order, notes, created_at
trip_spots.trip_id links to trips.id
trip_spots.spot_id links to spots.id
There is a unique constraint on trip_id and spot_id together, so the same spot cannot be added twice to the same trip.

expenses
id, trip_id, category, description, amount, created_at
expenses.trip_id links to trips.id
Used by the budget calculator to total expenses and compare against trips.budget.

The schema is documented in database/schema.sql, which also includes the Udaipur seed data.

## How It Works

Destination search flow:
User types a partial name, such as "Uda".
The app calls GET /search-location with that text, which uses Geoapify autocomplete.
User selects a destination, for example Udaipur.
The frontend receives coordinates for that destination.
The app calls GET /suggested-spots with those coordinates, which uses the Geoapify Places API.
Tourist spots are returned to the frontend.
Coordinates are handled internally, the user never enters them manually.

Explore flow:
A user who has not chosen a destination can browse the explore page for ideas, then move into the normal destination search and trip creation flow once they decide.

Trip creation flow:
When a trip is created, the backend checks that the selected destination already exists in the locations table before creating the trip. Geoapify results are not inserted into the database automatically for every search. The trip is also tagged as solo or group at this stage.

Itinerary flow:
The itinerary page has three sections. Create itinerary lets the user manually add a place. Suggested itinerary shows spots fetched from Geoapify, filtered where relevant by the trip's solo or group type, which the user can add. View itinerary shows all selected spots with their order, visit dates, notes, and budget and expense information.

Expense and budget flow:
Expenses are logged against a trip and categorized. The backend totals all expenses for a trip and compares that total to the trip's budget, returning an over budget status when relevant. This is the budget calculator feature.

Community and find a buddy flow:
Solo travelers can visit the community page to see other users planning similar trips and connect with them as potential travel partners.

Real time activity suggestion flow:
As users search or show interest in specific activities, the app surfaces relevant, up to date activity suggestions rather than relying only on a fixed list of spots.

Sharing flow:
When a user chooses to share an itinerary, the backend generates or returns a share_token and marks the trip as public. The resulting link can be shared through WhatsApp, Gmail, or other platforms.

## API Endpoints

Already implemented, not to be recreated:
GET /search-location, with a text parameter, for Geoapify destination autocomplete.
GET /suggested-spots, with latitude, longitude, and limit parameters, for nearby tourist attractions.

To be implemented:
POST /register, to register a new user.
User endpoints under /users, for user operations.
POST /trips, to create a trip, including its solo or group travel type.
GET /trips/{id}, to get trip details.
POST /trips/{id}/spots, to add a spot, suggested or manual, to a trip's itinerary.
GET /trips/{id}/spots, to view the full itinerary for a trip.
POST /trips/{id}/expenses, to add an expense to a trip.
GET /trips/{id}/expenses, to get total expenses and budget comparison.
GET /explore, to get destination ideas for users who have not decided where to go.
GET /community, to view other users or trips for the find a buddy feature.
GET /share/{token}, to view a publicly shared itinerary.

Exact route naming may be adjusted after inspecting the existing repository. Any change to the response format of existing Geoapify endpoints should be coordinated with Khooshi Ahir.

## Project Structure

backend/
  main.py
  requirements.txt
  .env (local only, not committed, already in .gitignore)
  venv/

database/
  schema.sql

frontend/
  React + Vite app, built by Khooshi Ahir

## Setup Instructions

1. Clone the repository.
git clone https://github.com/parigohel07/Odoo-Hackathon-.git
cd Odoo-Hackathon-
git checkout backend

2. Create a local .env file inside backend/, since this file is not shared through Git.
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
Secrets are shared separately by the team and should never be committed.

3. Install dependencies.
pip install -r backend/requirements.txt
If any new package is installed, update requirements.txt before committing.

4. Run the server.
uvicorn main:app --reload

## Git Workflow

Work happens on the backend branch. Commit and push there, then open a pull request into main for stable checkpoints, roughly every hour.

Rules:
Do not force push.
Do not delete branches.
Do not overwrite other people's work.
Do not push directly to main.
Never commit the .env file.

Example commit:
git add .
git commit -m "Add trip creation endpoint"
git push origin backend

## Development Priorities for Backend 

1. User functionality, registration and user endpoints on the users table.
2. Create trip, validating or creating a locations entry, then inserting into trips, including travel type.
3. Suggested itinerary, reusing the existing /suggested-spots endpoint, without rewriting it unless it is broken.
4. Add spot to itinerary, inserting into spots and trip_spots.
5. Manual itinerary, an endpoint for user submitted custom spots.
6. Expenses and budget, CRUD operations on expenses, plus total versus budget calculation.
7. Explore page support, an endpoint returning destination ideas for undecided users.
8. Community and find a buddy, an endpoint for matching or listing solo travelers.
9. Sharing, exposing is_public and share_token through a share endpoint.

## Existing Work Not to Be Recreated

The following are already complete and tested:
Supabase database with six tables.
Database schema.
Geoapify location search.
Geoapify tourist spot suggestions.
FastAPI setup.
FastAPI to Supabase connection, both read and write tested.
requirements.txt.
GitHub branch structure.
Frontend mockup.

## Hackathon Goal

This is an eight hour hackathon, so the priority is a working minimum viable product rather than a polished, production grade system.

Minimum working flow:
Register, then create trip, then select destination, then suggested spots, then add spot, then view itinerary.

If time allows, add next:
Expenses, then budget calculation, then explore page, then community and find a buddy, then real time activity suggestions, then sharing.
