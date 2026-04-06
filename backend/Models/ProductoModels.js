const db = require('../config/db'); 


const Producto = {
    listarProducto: (nombre, callback) => {
        let sql = "SELECT * FROM Producto";
        if (nombre) {
            sql += " WHERE Nombre LIKE ?";
            return db.query(sql, [`%${nombre}%`], callback);
        }
        db.query(sql, callback);
    },

    
    obtenerProducto: (id, callback) => {
        db.query("SELECT * FROM Producto WHERE id_Producto = ?", [id], callback);
    },

    
    crearProducto: (data, callback) => {
        const sql = "INSERT INTO Producto (id_Producto, Cantidad, Precio, Nombre, Descripcion, ID_Categoria, Activo_Catalogo) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [data.id_Producto, data.Cantidad, data.Precio, data.Nombre, data.Descripcion, data.ID_Categoria, data.Activo_Catalogo], callback);
    },

    
    actualizarProducto: (id, data, callback) => {
        const sql = "UPDATE Producto SET Cantidad=?, Precio=?, Nombre=?, Descripcion=?, ID_Categoria=?, Activo_Catalogo=? WHERE id_Producto=?";
        db.query(sql, [data.Cantidad, data.Precio, data.Nombre, data.Descripcion, data.ID_Categoria, data.Activo_Catalogo, id], callback);
    },

    
    eliminarProducto: (id, callback) => {
        db.query("DELETE FROM Producto WHERE id_Producto = ?", [id], callback);
    }
};


module.exports = Producto;
