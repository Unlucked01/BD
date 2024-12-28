import React from 'react';

const PlaneCard = ({ plane, onEdit, onSave, onDelete }) => {
  const handleBlur = () => {
    if (plane.name.trim() && plane.capacity > 0) {
      onEdit(plane.id, { ...plane, isEditable: false });
      onSave(plane.id, { ...plane });
    } else {
      onDelete(plane.id);
    }
  };

  return (
    <div key={plane.id} className="card mb-2 p-2 d-flex align-items-center position-relative">
      {plane.isEditable ? (
        <div className="row-cols-1">
          <input
            type="text"
            className="form-control mb-1"
            placeholder="Название самолета"
            value={plane.name}
            onChange={(e) => onEdit(plane.id, { ...plane, name: e.target.value })}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Количество мест"
            value={plane.capacity}
            onChange={(e) => onEdit(plane.id, { ...plane, capacity: e.target.value })}
            onBlur={handleBlur} // Single blur handler to validate and save
          />
        </div>
      ) : (
        <>
          <span>Название: {plane.name}</span>
          <span>Количество мест: {plane.capacity}</span>
          <button
            className="btn position-absolute"
            onClick={() => onDelete(plane.id)}
            style={{
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default PlaneCard;
