<?php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método inválido."
    ]);
    exit;
}

$nome = htmlspecialchars(trim($_POST["nome"] ?? ""));
$telefone = htmlspecialchars(trim($_POST["telefone"] ?? ""));
$email = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$tipo = htmlspecialchars(trim($_POST["tipo"] ?? ""));
$mensagem = htmlspecialchars(trim($_POST["mensagem"] ?? ""));

if (
    empty($nome) ||
    empty($telefone) ||
    empty($email) ||
    empty($tipo)
) {
    echo json_encode([
        "success" => false,
        "message" => "Preencha todos os campos."
    ]);
    exit;
}

$destinatario = "eng@fadoniconstrutora.com.br";

$assunto = "Nova solicitação de orçamento";

$corpo = "
Nome: $nome

Telefone: $telefone

E-mail: $email

Tipo da obra: $tipo

Mensagem:

$mensagem
";

$cabecalhos =
"From: eng@fadoniconstrutora.com.br\r\n".
"Reply-To: $email\r\n".
"Content-Type: text/plain; charset=UTF-8";

if(mail($destinatario, $assunto, $corpo, $cabecalhos)){

    echo json_encode([
        "success"=>true
    ]);

}else{

    echo json_encode([
        "success"=>false,
        "message"=>"Não foi possível enviar o e-mail."
    ]);

}