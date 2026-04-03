import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [logueado, setLogueado] = useState(false); 
  const [modoRegistro, setModoRegistro] = useState(false); 
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [formReg, setFormReg] = useState({
    ID_Usuario: '', Codigo_Documento: '', Nombre: '', Fecha_Nacimiento: '', 
    Direccion: '', Telefono: '', Correo: '', Clave: ''
  });
  const [servicios, setServicios] = useState([]); 
  const [enEdicion, setEnEdicion] = useState(false); 
  const [idServicioSel, setIdServicioSel] = useState(null);
  const [formServicio, setFormServicio] = useState({
    Descripcion: '', ID_Usuario: '', Precio: '', Movil_Nombre: '', 
    Movil_Especificacion: '', Fecha: '', Etapa: ''
  });
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) { 
      setLogueado(true); 
      listar(); 
    }
  }, []);
  const config = () => ({ 
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
  });

  const acceder = async () => {
    const u = loginUser.trim();
    const p = loginPass.trim();
    if (!u || !p) return alert("Por favor, completa los campos.");
    
    try {
      const res = await axios.post("http://localhost:3000/api/login", { user: u, password: p });
      if (res.data.auth) {
        localStorage.setItem('token', res.data.token); // Guarda el token de sesión
        setLogueado(true);
        listar(); // Carga los datos apenas entra
      }
    } catch (err) { alert("Usuario o contraseña incorrectos."); }
  };

  // Registro
  const registrarUsuario = async () => {
    const datosFinales = {
        ...formReg,
        ID_Usuario: formReg.ID_Usuario.trim(),
        Clave: formReg.Clave.trim()
    };
    try {
      await axios.post("http://localhost:3000/api/registro", datosFinales);
      alert("¡Registro exitoso! Ya puedes iniciar sesión.");
      setModoRegistro(false);
    } catch (err) { alert("Error al registrar el usuario."); }
  };

  // Listar Servicios
  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/servicios/listar', config());
      setServicios(res.data);
    } catch (err) { console.error("Error al listar", err); }
  };

  // Agregar Servicio
  const guardarServicio = async () => {
    try {
      const url = enEdicion ? "actualizar" : "agregar";
      const metodo = enEdicion ? 'put' : 'post';
      const data = enEdicion ? { ...formServicio, ID_Servicio: idServicioSel } : formServicio;
      
      await axios[metodo](`http://localhost:3000/api/servicios/${url}`, data, config());
      
      listar(); // Refresca la tabla
      limpiarServicio(); // Limpia el formulario
    } catch (err) { alert("Error al procesar la solicitud."); }
  };
  // Eliminar Servicio
  const eliminarServicio = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      await axios.delete(`http://localhost:3000/api/servicios/eliminar/${id}`, config());
      listar();
    }
  };

  const limpiarServicio = () => {
    setFormServicio({ Descripcion: '', ID_Usuario: '', Precio: '', Movil_Nombre: '', Movil_Especificacion: '', Fecha: '', Etapa: '' });
    setEnEdicion(false);
    setIdServicioSel(null);
  };

  if (modoRegistro) {
    return (
      <div className="container py-5">
        <div className="card p-4 mx-auto shadow-sm" style={{maxWidth: '450px'}}>
          <h4 className="text-center mb-4">Registro de Usuarios</h4>
          {Object.keys(formReg).map(key => (
            <div className="mb-2" key={key}>
              <label className="form-label small mb-1">{key.replace('_', ' ')}</label>
              <input className="form-control" 
                type={key === 'Clave' ? 'password' : key === 'Fecha_Nacimiento' ? 'date' : 'text'}
                onChange={e => setFormReg({...formReg, [key]: e.target.value})} />
            </div>
          ))}
          <button className="btn w-100 mt-3 text-white fw-bold" style={{ backgroundColor: '#121212' }} onClick={registrarUsuario}>Registrarse</button>
          <button className="btn btn-link w-100 mt-2 text-decoration-none" style={{ color: '#121212' }} onClick={() => setModoRegistro(false)}>Volver al Inicio de Sesión</button>
        </div>
      </div>
    );
  }

  // LOGIN
  if (!logueado) {
    return (
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="card p-4 shadow-sm border-0" style={{width: '320px', background: '#f8f9fa'}}>
		  <h3 className="text-center mb-4 fw-bold" style={{ color: '#DB0000' }}>Sistema Celuaccel</h3>
          <h3 className="text-center mb-4 fw-bold" style={{ color: '#DB0000' }}>Iniciar Sesión</h3>
          <input className="form-control mb-2" placeholder="Documento" onChange={e => setLoginUser(e.target.value)} />
          <input className="form-control mb-3" type="password" placeholder="Contraseña" onChange={e => setLoginPass(e.target.value)} />
          <button className="btn w-100 mb-2 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={acceder}>Entrar</button>
          <button className="btn w-100 fw-bold" style={{ color: '#121212', borderColor: '#121212' }} onClick={() => setModoRegistro(true)}>Crear Usuario</button>
        </div>
      </div>
    );
  }

  // HOME
  return (
    <div>
      <nav className="navbar navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
          <span className="navbar-brand fw-bold">CELUACCEL Gestión de Servicios</span>
          <button className="btn btn-sm fw-bold text-white" style={{ backgroundColor: '#121212' }} onClick={() => { localStorage.clear(); window.location.reload(); }}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5 className="mb-3">{enEdicion ? "Editar Servicio" : "Nuevo Registro"}</h5>
              <input className="form-control mb-2" value={formServicio.Descripcion} placeholder="Descripción del servicio" onChange={e => setFormServicio({...formServicio, Descripcion: e.target.value})} />
              <input className="form-control mb-2" value={formServicio.ID_Usuario} placeholder="Documento del cliente" onChange={e => setFormServicio({...formServicio, ID_Usuario: e.target.value})} />
              <input className="form-control mb-2" type="number" value={formServicio.Precio} placeholder="Precio total ($)" onChange={e => setFormServicio({...formServicio, Precio: e.target.value})} />
              <input className="form-control mb-2" value={formServicio.Movil_Nombre} placeholder="Nombre Móvil" onChange={e => setFormServicio({...formServicio, Movil_Nombre: e.target.value})} />
              <input className="form-control mb-2" value={formServicio.Movil_Especificacion} placeholder="Especificación Móvil" onChange={e => setFormServicio({...formServicio, Movil_Especificacion: e.target.value})} />
              <input className="form-control mb-2" type="date" value={formServicio.Fecha} onChange={e => setFormServicio({...formServicio, Fecha: e.target.value})} />
              <input className="form-control mb-3" type="number" value={formServicio.Etapa} placeholder="Etapa (1-100)" onChange={e => setFormServicio({...formServicio, Etapa: e.target.value})} />
              <button className={`btn w-100 text-white fw-bold`} style={{ backgroundColor: '#DB0000' }} onClick={guardarServicio}>
                {enEdicion ? "Actualizar" : "Guardar Servicio"}
              </button>
              {enEdicion && <button className="btn btn-secondary w-100 mt-2" style={{ backgroundColor: '#121212' }} onClick={limpiarServicio}>Cancelar</button>}
            </div>
          </div>

          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>ID</th><th>Descripción</th><th>Móvil</th><th>Precio</th><th>Acciones</th></tr>
                </thead>
                <tbody className="bg-white">
                  {servicios.map(s => (
                    <tr key={s.ID_Servicio}>
                      <td className="fw-bold">{s.ID_Servicio}</td>
                      <td>{s.Descripcion}</td>
                      <td>{s.Movil_Nombre}</td>
                      <td className="text-success fw-bold">${s.Precio}</td>
                      <td>
                        <button className="btn btn-sm me-1 text-white fw-bold" style={{ backgroundColor: '#121212' }} onClick={() => { 
                          setEnEdicion(true); 
                          setIdServicioSel(s.ID_Servicio); 
                          setFormServicio({...s, Fecha: s.Fecha ? s.Fecha.split('T')[0] : ''}); 
                        }}>Editar</button>
                        <button className="btn btn-sm text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={() => eliminarServicio(s.ID_Servicio)}>Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;