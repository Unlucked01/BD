from fastapi import APIRouter, Depends, HTTPException
from ..db import get_db
from ..services.representative_service import (
    add_flights_procedure,
    get_flights_by_city,
    view_all_flights_by_airline_id,
    update_flight,
    delete_flight,
    db_login_represent,
    db_register_represent,
    get_airports,
    get_planes,
    add_plane_db,
    delete_plane_db,
    add_airport_db, get_cities, delete_airport_db, get_ticket_stats, get_revenue_stats, get_all_airlines
)
from sqlalchemy.orm import Session
from ..models import FlightRequest, AirlineLogin, AirlineCreate

router = APIRouter()


@router.post("/login/")
def login_user(request: AirlineLogin, db: Session = Depends(get_db)):
    client_id = db_login_represent(db, request.login, request.password)
    if not client_id:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"client_id": client_id}


@router.post("/register/")
def register_user(request: AirlineCreate, db: Session = Depends(get_db)):
    airline_id = db_register_represent(
        db,
        request.first_name,
        request.surname,
        request.last_name,
        request.password,
        request.airline_id
    )
    if not airline_id:
        raise HTTPException(status_code=400, detail="User already exists or invalid data")
    return {"airline_id": airline_id}


@router.post("/flights/add")
def add_flights(request: FlightRequest, db: Session = Depends(get_db)):
    return add_flights_procedure(db, **request.model_dump())


@router.get("/flights/city")
def view_flights_by_city(airline_id: int, db: Session = Depends(get_db)):
    return get_flights_by_city(airline_id, db)


@router.get("/flights")
def view_flights(airline_id: int, db: Session = Depends(get_db)):
    return view_all_flights_by_airline_id(airline_id, db)


@router.get("/airports")
def view_airports(db: Session = Depends(get_db)):
    return get_airports(db)


@router.get("/planes/")
def view_planes(airline_id: int, db: Session = Depends(get_db)):
    return get_planes(airline_id, db)


@router.post("/planes")
def add_plane(name: str, capacity: int, airline_id: int, db: Session = Depends(get_db)):
    return add_plane_db(db, name, capacity, airline_id)


@router.delete("/planes/{plane_id}")
def delete_plane(plane_id: int, db: Session = Depends(get_db)):
    return delete_plane_db(db, plane_id)


@router.post("/airports")
def add_airport(name: str, city_id: int, db: Session = Depends(get_db)):
    return add_airport_db(db, name, city_id)


@router.delete("/airports/{airport_id}")
def delete_plane(airport_id: int, db: Session = Depends(get_db)):
    return delete_airport_db(db, airport_id)


@router.get("/cities")
def view_cities(db: Session = Depends(get_db)):
    return get_cities(db)


@router.put("/flights/{flight_id}")
def update_flight_info(
    request: FlightRequest,
    db: Session = Depends(get_db),
):
    return update_flight(db, **request.model_dump())


@router.delete("/flights/{flight_id}")
def delete_flight_info(flight_id: int, db: Session = Depends(get_db)):
    return delete_flight(db, flight_id)


@router.get("/statistics/tickets")
def view_ticket_statistics(airline_id: int, db: Session = Depends(get_db)):
    return get_ticket_stats(db, airline_id)


@router.get("/statistics/revenue")
def view_revenue(airline_id: int, db: Session = Depends(get_db)):
    return get_revenue_stats(db, airline_id)


@router.get("/airlines")
def view_all_airlines(db: Session = Depends(get_db)):
    return get_all_airlines(db)
