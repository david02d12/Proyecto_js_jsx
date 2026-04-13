import React from 'react';

const Sidebar = ({ setVista }) => {
  return (
    <div className="offcanvas offcanvas-start text-white" tabIndex="-1" id="menuGlobal" style={{ backgroundColor: '#121212' }}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title fw-bold">Menú de Navegación</h5>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body">
        <div className="d-grid gap-3">
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('home')} data-bs-dismiss="offcanvas"> Inicio</button>
          <hr className="border-secondary" />
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('miServicio')} data-bs-dismiss="offcanvas"> Mis Servicios</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('catalogo')} data-bs-dismiss="offcanvas"> Catálogo</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('chatVista')} data-bs-dismiss="offcanvas"> Chat</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('comentarios')} data-bs-dismiss="offcanvas"> Comentarios</button>
          <hr className="border-secondary" />
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('usuarios')} data-bs-dismiss="offcanvas"> Gestión de Usuarios</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('roles')} data-bs-dismiss="offcanvas"> Roles</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('tipo')} data-bs-dismiss="offcanvas"> Tipos de Documento</button>
          <hr className="border-secondary" />
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('servicios')} data-bs-dismiss="offcanvas"> Admin Servicios</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('historial')} data-bs-dismiss="offcanvas"> Historial</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('productos')} data-bs-dismiss="offcanvas"> Gestión de Productos</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('categorias')} data-bs-dismiss="offcanvas"> Categorías</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('preguntas')} data-bs-dismiss="offcanvas"> Preguntas de Productos</button>
          <hr className="border-secondary" />
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('chats')} data-bs-dismiss="offcanvas"> Admin Chats</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('mensajes')} data-bs-dismiss="offcanvas"> Admin Mensajes</button>
          <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('notificaciones')} data-bs-dismiss="offcanvas"> Notificaciones</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
