import React from 'react';

const Navbar = ({ titulo, cerrarSesion, children }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
      <div className="container">
        <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal">
          MENÚ
        </button>
        <span className="navbar-brand fw-bold ms-3">{titulo}</span>
        <div className="d-flex gap-2 ms-auto">
          {children}
          {cerrarSesion && (
            <button className="btn btn-sm fw-bold text-white" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
