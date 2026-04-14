
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2026 a las 05:30:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `servicios`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `ID_Categoria` int(10) NOT NULL,
  `Nombre_Categoria` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`ID_Categoria`, `Nombre_Categoria`) VALUES
(1, 'Audifonos'),
(2, 'Cargadores'),
(3, 'Forros'),
(4, 'Accesorios'),
(5, 'Otros'),
(6, 'Partes'),
(7, 'USB'),
(8, 'Microfonos'),
(9, 'Altavoces'),
(10, 'Mouse');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_servicios`
--

CREATE TABLE `historial_servicios` (
  `ID_Historial` varchar(50) NOT NULL,
  `ID_Servicio` int(10) NOT NULL,
  `Fecha_Evento` date NOT NULL,
  `Descripcion_Evento` varchar(50) NOT NULL,
  `Estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_servicios`
--

INSERT INTO `historial_servicios` (`ID_Historial`, `ID_Servicio`, `Fecha_Evento`, `Descripcion_Evento`, `Estado`) VALUES
('1', 1, '2026-04-01', '1', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `ID_Consulta` int(10) NOT NULL,
  `ID_Usuario` varchar(50) NOT NULL,
  `Codigo_Producto` varchar(50) NOT NULL,
  `Pregunta` varchar(50) NOT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`ID_Consulta`, `ID_Usuario`, `Codigo_Producto`, `Pregunta`, `Fecha`) VALUES
(1, '425124636', 'PRO001', 'Disculpe estan disponibles estos audifonos', '2025-08-13'),
(2, '12938475602', 'PRO002', 'Buenos dias quisiera preguntar por este producto', '2025-08-15'),
(3, '67890123458', 'PRO003', 'Hola, tienen este motivo de forro?', '2025-08-15'),
(4, '55461352789', 'PRO004', 'Buenas Noches, para preguntar si este cargador sir', '2025-08-24'),
(5, '10045612317', 'PRO005', 'Hola, de que tamaños tienen estas usb?', '2025-08-22'),
(6, '25863675', 'PRO006', 'Hola,aun esta disponible el forro', '2025-08-24'),
(7, '10008547854', 'PRO007', 'Hola,Los Audifonos tienen botones?', '2025-08-06'),
(8, '10045612317', 'PRO008', 'Hola, cuantas espacio para baterias?', '2020-08-25'),
(9, '25863675', 'PRO009', 'Disculpe,El teclado tiene garantia?', '2025-08-22'),
(10, 'B5465312', 'PRO010', 'Buenas,Para que modelo de celular es?', '2025-08-27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `Codigo_Producto` varchar(50) NOT NULL,
  `Cantidad` int(10) NOT NULL,
  `Precio` double NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Descripcion` varchar(50) NOT NULL,
  `Imagen` varchar(50) NOT NULL,
  `Activo_Catalogo` int(10) NOT NULL,
  `ID_Categoria` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`Codigo_Producto`, `Cantidad`, `Precio`, `Nombre`, `Descripcion`, `Imagen`, `Activo_Catalogo`, `ID_Categoria`) VALUES
('PRO001', 10, 75000, 'Audifonos de cable', 'Audifonos de cable normal negro', '[Archivo]', 1, 1),
('PRO002', 22, 20000, 'Audifonos bluetooth', 'Audifonos de conexión bluetooth recargables', '[Archivo]', 0, 1),
('PRO003', 14, 14000, 'Forro de celular', 'Forros con diferentes motivos', '[Archivo]', 1, 3),
('PRO004', 23, 18000, 'Cargador tipo c', 'Cargador de celuLar con entrada tipo C', '[Archivo]', 0, 2),
('PRO005', 7, 15000, 'USB 15GB', 'Unidad de memoria de 15 gigabites', '[Archivo]', 1, 4),
('PRO006', 5, 17000, 'Forro Protector', 'Forro color azul', '[Archivo]', 1, 3),
('PRO007', 9, 12000, 'Audifonos de cable', 'Audifonos de cable tipo C blanco', '[Archivo]', 0, 1),
('PRO008', 6, 6500, 'Cargador de bateria', 'Cargador para cargar baterias', '[Archivo]', 1, 2),
('PRO009', 11, 30000, 'Teclado Mecanico', 'Teclado mecanico en color negro', '[Archivo]', 1, 5),
('PRO010', 4, 16000, 'Vidrio templado', 'Vidrio templado de Xiaomi', '[Archivo]', 0, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `Codigo_Rol` int(10) NOT NULL,
  `Descripcion_Rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`Codigo_Rol`, `Descripcion_Rol`) VALUES
(1, 'El rol es tecnico'),
(2, 'El rol es cliente'),
(3, 'El rol es administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `ID_Servicio` int(10) NOT NULL,
  `Descripcion` varchar(50) NOT NULL,
  `ID_Usuario` varchar(50) NOT NULL,
  `Precio` double NOT NULL,
  `Movil_Nombre` varchar(50) NOT NULL,
  `Movil_Especificacion` varchar(50) NOT NULL,
  `Fecha` date NOT NULL,
  `Etapa` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`ID_Servicio`, `Descripcion`, `ID_Usuario`, `Precio`, `Movil_Nombre`, `Movil_Especificacion`, `Fecha`, `Etapa`) VALUES
(4, 'Pantalla Rota', '10216541630', 40000, 'Nokia', 'La pantalla se rompio en la parte superior', '2026-03-23', 50),
(6, '4', '4', 4, '4', '4', '2026-04-04', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documento`
--

CREATE TABLE `tipo_documento` (
  `Codigo_Documento` int(10) NOT NULL,
  `Nombre_Documento` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_documento`
--

INSERT INTO `tipo_documento` (`Codigo_Documento`, `Nombre_Documento`) VALUES
(1, 'Cedula'),
(2, 'Tarjeta de Identidad'),
(3, 'Cedula de Extrajeria'),
(4, 'Pasaporte'),
(5, 'PEP');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` varchar(50) NOT NULL,
  `Codigo_Documento` varchar(50) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Fecha_Nacimiento` date NOT NULL,
  `Direccion` varchar(50) NOT NULL,
  `Telefono` varchar(50) NOT NULL,
  `Correo` varchar(50) NOT NULL,
  `Clave` varchar(255) DEFAULT NULL,
  `Rol` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Codigo_Documento`, `Nombre`, `Fecha_Nacimiento`, `Direccion`, `Telefono`, `Correo`, `Clave`, `Rol`) VALUES
('1', '1', '1', '2026-03-23', '1', '1', '1', '1', 'Admin'),
('1000492972', 'Tarjeta de Identidad', 'Nick', '2026-03-23', 'Calle 49 #5N-72 sur', '3103186256', 'juannicolasmh@gmail.com', '123', 'Admin'),
('2', '2', '2', '2026-03-23', '2', '2', '2', '123', 'Admin'),
('5', '5', '5', '2026-03-23', '5', '5', '5', '5', 'Cliente'),
('55', '3', '55', '2026-04-05', '55', '55', '55', '$2b$10$R00YnqnL2eWamzcjiujjKe1RI5b4dNHar.AvgP1R.yTdeC1CKSm8i', 'Admin'),
('67', '1', '67', '2026-04-05', '67', '67', '67', '$2b$10$Q2CP8TCE3JcjsGYq3tZ6meygPFDpjG3yWi.maW5NWY6bZ4E9G9mWy', 'Admin'),
('8', '8', '8', '0008-08-08', '8', '8', '8', '8', 'Admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`ID_Categoria`);

--
-- Indices de la tabla `historial_servicios`
--
ALTER TABLE `historial_servicios`
  ADD PRIMARY KEY (`ID_Historial`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`ID_Consulta`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`Codigo_Producto`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`Codigo_Rol`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`ID_Servicio`);

--
-- Indices de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  ADD PRIMARY KEY (`Codigo_Documento`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `ID_Servicio` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
