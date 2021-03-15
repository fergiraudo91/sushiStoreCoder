<?php
    $nombre = $_POST['name'];
    $apellido = $_POST['surname'];
    $mail = $_POST['mail'];
    $mensaje = $_POST['message'];

    if($nombre === '' || $apellido === '' || $mail === '' || $mensaje === ''){
        echo json_encode('error');
    }
    else{
        echo json_encode('Mail enviado correctamente');
    }

?>