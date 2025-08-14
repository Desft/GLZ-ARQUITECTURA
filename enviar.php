<?php
// Carga las clases de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluye los archivos que copiaste
require 'Exception.php';
require 'PHPMailer.php';
require 'SMTP.php';

// Crea una nueva instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP (es la forma más fiable)
    $mail->isSMTP();
    $mail->Host       = 'smtp.tudominio.com'; // **Debes reemplazar con el SMTP de tu hosting**
    $mail->SMTPAuth   = true;
    $mail->Username   = 'tucorreo@tudominio.com'; // **Tu correo del hosting**
    $mail->Password   = 'tucontraseña'; // **Tu contraseña de correo**
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Destinatarios y remitente
    $mail->setFrom($_POST['email'], $_POST['name']); // El correo del usuario como remitente
    $mail->addAddress('osorio.gnj@gmail.com'); // Tu correo de destino
    $mail->addReplyTo($_POST['email'], $_POST['name']);

    // Contenido del correo
    $mail->isHTML(false);
    $mail->Subject = 'Nuevo mensaje de contacto: ' . $_POST['subject'];
    $mail->Body    = "Nombre: " . $_POST['name'] . "\n"
                   . "Correo: " . $_POST['email'] . "\n"
                   . "Asunto: " . $_POST['subject'] . "\n"
                   . "Mensaje: " . $_POST['message'];

    $mail->send();
    // Redirige al usuario
    header("Location: contacto.html?success=1");
    exit();
} catch (Exception $e) {
    echo "El mensaje no pudo ser enviado. Error: {$mail->ErrorInfo}";
}
?>