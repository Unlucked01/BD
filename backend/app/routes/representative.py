from fastapi import APIRouter, Depends, HTTPException
from ..db import get_db
from ..services.representative_service import (
    add_flights_procedure,
    get_flights_by_city,
    view_all_flights_by_airline_id,
    update_flight,
    delete_flight, db_login_user, db_register_user,
)
from sqlalchemy.orm import Session
from ..models import FlightRequest, AirlineLogin, AirlineCreate

router = APIRouter()


@router.post("/login/")
def login_user(request: AirlineLogin, db: Session = Depends(get_db)):
    client_id = db_login_user(db, request.login, request.password)
    if not client_id:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"client_id": client_id}


@router.post("/register/")
def register_user(request: AirlineCreate, db: Session = Depends(get_db)):
    airline_id = db_register_user(
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


@router.put("/flights/{flight_id}")
def update_flight_info(
    flight_id: int,
    request: FlightRequest,
    db: Session = Depends(get_db),
):
    return update_flight(db, flight_id, **request.model_dump())


@router.delete("/flights/{flight_id}")
def delete_flight_info(flight_id: int, db: Session = Depends(get_db)):
    return delete_flight(db, flight_id)

