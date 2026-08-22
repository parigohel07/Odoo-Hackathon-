from fastapi import FastAPI, Query, HTTPException
from dotenv import load_dotenv
import os
import requests
from pathlib import Path

# Find the .env file inside the backend folder
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

app = FastAPI(title="Globetrotter API")

GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


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