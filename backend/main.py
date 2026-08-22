from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
import os
import requests
from pathlib import Path

# Find the .env file inside the backend folder
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

app = FastAPI(title="Globetrotter API")


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# API KEYS
# -----------------------------

GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# -----------------------------
# SUPABASE CONNECTION
# -----------------------------

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase environment variables are missing")

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# -----------------------------
# REQUEST MODELS
# -----------------------------

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# -----------------------------
# AUTH - REGISTER
# -----------------------------

@app.post("/register")
def register_user(data: RegisterRequest):
    try:
        # Create authentication account using Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })

        if not auth_response.user:
            raise HTTPException(
                status_code=400,
                detail="Registration failed"
            )

        user_id = auth_response.user.id

        # Store public profile information in the users table
        profile_response = (
            supabase
            .table("users")
            .insert({
                "id": user_id,
                "username": data.username,
                "email": data.email
            })
            .execute()
        )

        return {
            "message": "Registration successful",
            "user": profile_response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# -----------------------------
# AUTH - LOGIN
# -----------------------------

@app.post("/login")
def login_user(data: LoginRequest):
    try:
        # Authenticate using Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

        if not auth_response.user:
            raise HTTPException(
                status_code=401,
                detail=str(e)
            )

        # Get the user's profile from the users table
        profile_response = (
            supabase
            .table("users")
            .select("id, username, email, created_at")
            .eq("id", auth_response.user.id)
            .single()
            .execute()
        )

        return {
            "message": "Login successful",
            "user": profile_response.data,
            "access_token": auth_response.session.access_token
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


# -----------------------------
# HEALTH CHECK
# -----------------------------

@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


# -----------------------------
# TEST SUPABASE CONNECTION
# -----------------------------

@app.get("/test-supabase")
def test_supabase():
    try:
        response = (
            supabase
            .table("locations")
            .select("id, name, state, country")
            .limit(10)
            .execute()
        )

        return {
            "status": "connected",
            "locations": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Supabase connection failed: {str(e)}"
        )


# -----------------------------
# SEARCH LOCATION
# -----------------------------

@app.get("/search-location")
def search_location(text: str = Query(..., min_length=2)):

    url = "https://api.geoapify.com/v1/geocode/autocomplete"

    params = {
        "text": text,
        "apiKey": GEOAPIFY_API_KEY,
        "limit": 5
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Geoapify location search failed"
        )

    data = response.json()

    locations = []

    for feature in data.get("features", []):
        properties = feature.get("properties", {})

        locations.append({
            "name": properties.get("name"),
            "city": properties.get("city"),
            "state": properties.get("state"),
            "country": properties.get("country"),
            "country_code": properties.get("country_code"),
            "latitude": properties.get("lat"),
            "longitude": properties.get("lon"),
            "place_id": properties.get("place_id")
        })

    return locations


# -----------------------------
# SUGGESTED TOURIST SPOTS
# -----------------------------

@app.get("/suggested-spots")
def suggested_spots(
    latitude: float,
    longitude: float,
    limit: int = Query(10, ge=1, le=20)
):

    url = "https://api.geoapify.com/v2/places"

    params = {
        "categories": "tourism",
        "filter": f"circle:{longitude},{latitude},20000",
        "limit": limit,
        "apiKey": GEOAPIFY_API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Geoapify places search failed"
        )

    data = response.json()

    spots = []

    for feature in data.get("features", []):
        properties = feature.get("properties", {})

        spots.append({
            "name": properties.get("name"),
            "city": properties.get("city"),
            "state": properties.get("state"),
            "country": properties.get("country"),
            "latitude": properties.get("lat"),
            "longitude": properties.get("lon"),
            "formatted": properties.get("formatted"),
            "categories": properties.get("categories"),
            "place_id": properties.get("place_id")
        })

    return spots