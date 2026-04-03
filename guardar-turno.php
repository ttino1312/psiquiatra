<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$json = file_get_contents('php://input');
$datos = json_decode($json, true);

if (!$datos || !isset($datos['nombre']) || !isset($datos['email']) || !isset($datos['telefono'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$nombre = htmlspecialchars(trim($datos['nombre']));
$email = filter_var(trim($datos['email']), FILTER_VALIDATE_EMAIL);
$telefono = htmlspecialchars(trim($datos['telefono']));
$fecha = htmlspecialchars(trim($datos['fecha']));
$horario = htmlspecialchars(trim($datos['horario']));
$motivo = isset($datos['motivo']) ? htmlspecialchars(trim($datos['motivo'])) : '';
$timestamp = isset($datos['timestamp']) ? $datos['timestamp'] : date('c');

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email inválido']);
    exit;
}

$archivo = 'turnos.json';
$turnos = [];

if (file_exists($archivo)) {
    $contenido = file_get_contents($archivo);
    $turnos = json_decode($contenido, true) ?: [];
}

$nuevoTurno = [
    'id' => uniqid('turno_', true),
    'nombre' => $nombre,
    'email' => $email,
    'telefono' => $telefono,
    'fecha' => $fecha,
    'horario' => $horario,
    'motivo' => $motivo,
    'estado' => 'pendiente',
    'timestamp' => $timestamp,
    'fecha_registro' => date('Y-m-d H:i:s')
];

$turnos[] = $nuevoTurno;

if (file_put_contents($archivo, json_encode($turnos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode([
        'success' => true,
        'mensaje' => 'Turno guardado correctamente',
        'turno_id' => $nuevoTurno['id']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al guardar el turno']);
}
?>
