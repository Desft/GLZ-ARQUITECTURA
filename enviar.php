<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'Exception.php';
require 'PHPMailer.php';
require 'SMTP.php';
// Recibe los datos del formulario
$nombre = $_POST['nombre'];
$correo = $_POST['correo'];
$mensaje = $_POST['mensaje'];

// Tu dirección de correo
$destino = "osorio.gnj@gmail.com"; 

// Asunto del correo
$asunto = "Nuevo mensaje de contacto desde tu sitio web";

// Contenido del mensaje que recibirás
$contenido = "Nombre: " . $nombre . "\n";
$contenido .= "Correo: " . $correo . "\n";
$contenido .= "Mensaje: " . $mensaje;

// Envía el correo
mail($destino, $asunto, $contenido);

// Redirige al usuario a la página de contacto después de enviar el mensaje
header("Location: contacto.html");
?>
