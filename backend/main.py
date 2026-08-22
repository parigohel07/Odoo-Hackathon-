from fastapi import FastAPI

app = FastAPI(title="Globetrotter API")


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
