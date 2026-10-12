<?php
// Optional error reports. The page sends an uncaught error here, and this forwards it to the
// collector as kind "error" with the token, which never reaches the browser. Without
// COLLECTOR_URL and COLLECTOR_TOKEN nothing is sent. Always 204.
$url = rtrim(getenv('COLLECTOR_URL') ?: '', '/');
$token = getenv('COLLECTOR_TOKEN') ?: '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $url && $token && function_exists('curl_init')) {
    $body = json_decode(file_get_contents('php://input') ?: '', true);
    $message = is_array($body) ? substr((string)($body['message'] ?? ''), 0, 300) : '';
    if ($message !== '') {
        $ch = curl_init($url . '/collect');
        curl_setopt_array($ch, array(
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode(array(
                'kind'    => 'error',
                'page'    => getenv('TRACKING_PAGE_NAME') ?: 'p5_shootergame',
                'message' => $message,
                'source'  => substr((string)($body['source'] ?? ''), 0, 250),
                'agent'   => $_SERVER['HTTP_USER_AGENT'] ?? '')),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT_MS     => 1500,
            CURLOPT_NOSIGNAL       => true,
            CURLOPT_USERAGENT      => 'estate-collector-client/1.0',
            CURLOPT_HTTPHEADER     => array('Content-Type: application/json',
                                            'Authorization: Bearer ' . $token),
        ));
        @curl_exec($ch);
        @curl_close($ch);
    }
}
http_response_code(204);
