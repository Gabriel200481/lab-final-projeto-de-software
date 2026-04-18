import json
import urllib.request
import urllib.error
import datetime

BASE = "http://localhost:8080"


def req(method, path, data=None, token=None):
    url = path if path.startswith("http") else BASE + path
    body = None
    headers = {}

    if data is not None:
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    if token:
        headers["Authorization"] = "Bearer " + token

    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            content = response.read()
            payload = json.loads(content.decode("utf-8")) if content else None
            return response.status, payload
    except urllib.error.HTTPError as e:
        content = e.read()
        try:
            payload = json.loads(content.decode("utf-8")) if content else None
        except Exception:
            payload = {"raw": content.decode("utf-8", errors="ignore")}
        return e.code, payload


def must_login(email, senha):
    status, payload = req("POST", "/api/auth/login", {"email": email, "senha": senha})
    if status != 200:
        raise RuntimeError(f"Falha no login de {email}: HTTP {status} {payload}")
    return payload


def main():
    print("== LOGINS ==")
    prof = must_login("prof.demo.lab05@gmail.com", "Senha@123")
    aluno = must_login("aluno.demo.lab05@gmail.com", "Senha@123")
    empresa = must_login("empresa.demo.lab05@gmail.com", "Senha@123")
    print("Login OK para professor/aluno/empresa")

    print("== PREPARO: vantagem cara para forcar saldo insuficiente ==")
    descricao = "Vantagem Cara " + datetime.datetime.now().strftime("%H%M%S")
    status, vantagem = req(
        "POST",
        f"/api/empresas/{empresa['id']}/vantagens",
        {
            "descricao": descricao,
            "fotoUrl": "https://picsum.photos/400",
            "custoMoedas": 9999.0,
        },
        token=empresa["token"],
    )
    if status not in (200, 201):
        raise RuntimeError(f"Falha ao criar vantagem cara: HTTP {status} {vantagem}")
    print(f"Vantagem cara criada: {vantagem['id']}")

    print("== TESTE NEGATIVO 1: resgate com saldo insuficiente ==")
    status, payload = req(
        "POST",
        "/api/resgates",
        {"alunoId": aluno["id"], "vantagemId": vantagem["id"]},
        token=aluno["token"],
    )
    print(f"HTTP {status} | payload={payload}")
    if status < 400:
        raise RuntimeError("Esperado erro de saldo insuficiente, mas chamada passou")

    print("== TESTE NEGATIVO 2: distribuicao sem mensagem obrigatoria ==")
    status, payload = req(
        "POST",
        "/api/transacoes/distribuicao",
        {
            "professorId": prof["id"],
            "alunoId": aluno["id"],
            "valor": 10.0,
            "mensagem": "",
        },
        token=prof["token"],
    )
    print(f"HTTP {status} | payload={payload}")
    if status < 400:
        raise RuntimeError("Esperado erro de mensagem obrigatoria, mas chamada passou")

    print("== TESTES NEGATIVOS FINALIZADOS COM SUCESSO ==")


if __name__ == "__main__":
    main()
