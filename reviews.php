<?php
declare(strict_types=1);

// L'endpoint restituisce sempre JSON, anche quando si verifica un errore.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo non consentito']);
    exit;
}

// Il browser invia i dati come JSON nel corpo della richiesta POST.
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Richiesta non valida']);
    exit;
}
$name = trim((string)($input['name'] ?? ''));
$text = trim((string)($input['text'] ?? ''));
$rating = filter_var($input['rating'] ?? null, FILTER_VALIDATE_INT);
$area = ($input['area'] ?? '') === 'casa' ? 'casa' : 'rental';

if ($name === '' || mb_strlen($name) > 80 || $text === '' || mb_strlen($text) > 1000 || $rating === false || $rating < 1 || $rating > 5) {
    http_response_code(422);
    echo json_encode(['error' => 'Compila correttamente tutti i campi']);
    exit;
}

// Le nuove recensioni restano in attesa di approvazione manuale.
$file = __DIR__ . '/data/recensioni-pending.json';
$reviews = file_exists($file) ? json_decode((string)file_get_contents($file), true) : [];
if (!is_array($reviews)) {
    $reviews = [];
}

$reviews[] = [
    'nome' => $name,
    'testo' => $text,
    'stelle' => $rating,
    'area' => $area,
    'data' => date('Y-m-d'),
    'fonte' => 'sito',
];

if (file_put_contents($file, json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Impossibile salvare la recensione']);
    exit;
}

echo json_encode(['ok' => true]);
