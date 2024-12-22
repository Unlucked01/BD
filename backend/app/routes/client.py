from fastapi import APIRouter, Depends, HTTPException

from ..db import get_db
from ..services.client_service import book_tickets, get_tickets_by_class, get_ticket_stats, return_ticket, \
    get_client_flights, delete_ticket_service, db_login_user, db_search_flights, get_client_profile, \
    db_register_user, get_reserved_tickets, pay_for_ticket
from sqlalchemy.orm import Session

from ..models import TicketBookingRequest, UserLogin, UserCreate, SearchFlightRequest

router = APIRouter()


@router.post("/login/")
def login_user(request: UserLogin, db: Session = Depends(get_db)):
    client_id = db_login_user(db, request.login, request.password)
    if not client_id:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"client_id": client_id}


@router.post("/register/")
def register_user(request: UserCreate, db: Session = Depends(get_db)):
    client_id = db_register_user(
        db,
        request.first_name,
        request.surname,
        request.last_name,
        request.email,
        request.login,
        request.password
    )
    if not client_id:
        raise HTTPException(status_code=400, detail="User already exists or invalid data")
    return {"client_id": client_id}


@router.get("/profile/{client_id}")
def get_profile(client_id: int, db: Session = Depends(get_db)):
    user_data = get_client_profile(db, client_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="Client not found")
    return user_data


@router.post("/flights/search")
def search_flights(
        request: SearchFlightRequest,
        db: Session = Depends(get_db)
):
    return db_search_flights(db, **request.model_dump())


@router.post("/tickets/")
def book_ticket(request: TicketBookingRequest, db: Session = Depends(get_db)):
    return book_tickets(db, **request.model_dump())


@router.delete("/tickets/")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return delete_ticket_service(db, ticket_id)


@router.put("/tickets/pay/{ticket_id}")
def pay_for_ticket_route(ticket_id: int, db: Session = Depends(get_db)):
    return pay_for_ticket(db, ticket_id)


@router.post("/tickets/return/{ticket_id}")
def return_booked_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return return_ticket(db, ticket_id)


@router.get("/tickets/reserved/{client_id}")
def get_reserved_tickets_route(client_id: int, db: Session = Depends(get_db)):
    return get_reserved_tickets(db, client_id)


@router.get("/tickets/class/{client_id}")
def view_tickets_by_class(client_id: int, db: Session = Depends(get_db)):
    return get_tickets_by_class(db, client_id)


@router.get("/tickets/stats/{client_id}")
def view_ticket_stats(client_id: int, db: Session = Depends(get_db)):
    return get_ticket_stats(db, client_id)


@router.get("/flights/{client_id}")
def get_client_flights_route(client_id: int, db: Session = Depends(get_db)):
    return get_client_flights(db, client_id)
