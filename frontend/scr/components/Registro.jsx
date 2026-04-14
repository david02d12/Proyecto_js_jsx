import React, { useState } from 'react';
import axios from 'axios';

const Registro = ({ setModoRegistro }) => {
  const [formReg, setFormReg] = useState({
    ID_Usuario: '', Codigo_Documento: '', Nombre: '', Fecha_Nacimiento: '', 
    Direccion: '', Telefono: '', Correo: '', Clave: ''
  });

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

  return (
    <div className="container py-5">
      <div className="card p-4 mx-auto shadow-sm" style={{maxWidth: '450px'}}>
        <h4 className="text-center mb-4">Registro de Usuarios</h4>
        
        {Object.keys(formReg).map(key => (
          <div className="mb-3" key={key}>
            <label className="form-label small mb-1 fw-bold text-uppercase" style={{fontSize: '0.75rem'}}>
                {key.replace('_', ' ')}
            </label>

            {key === 'Codigo_Documento' ? (
              <select 
                className="form-select"
                value={formReg[key]}
                onChange={e => setFormReg({...formReg, [key]: e.target.value})}
              >
                <option value="">Seleccione un código...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            ) : (
              <input 
                className="form-control" 
                value={formReg[key]}
                type={key === 'Clave' ? 'password' : key === 'Fecha_Nacimiento' ? 'date' : 'text'}
                placeholder={`Ingrese ${key.replace('_', ' ').toLowerCase()}`}
                onChange={e => setFormReg({...formReg, [key]: e.target.value})} 
              />
            )}
          </div>
        ))}

        <button className="btn w-100 mt-3 text-white fw-bold" style={{ backgroundColor: '#121212' }} onClick={registrarUsuario}>Registrarse</button>
        <button className="btn btn-link w-100 mt-2 text-decoration-none" style={{ color: '#121212' }} onClick={() => setModoRegistro(false)}>Volver al Inicio de Sesión</button>
      </div>
    </div>
  );
};

export default Registro;
