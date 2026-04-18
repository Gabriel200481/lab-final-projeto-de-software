import json
import urllib.request
import datetime
from typing import Any, Dict, List, Tuple, cast

BASE = "http://localhost:8080"


def req(method: str, path: str, data: Any = None, token: str | None = None, raw: bool = False) -> Any:
    url = path if path.startswith("http") else BASE + path
    body = None
    headers = {}

    if data is not None:
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    if token:
        headers["Authorization"] = "Bearer " + token

    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=20) as response:
        content = response.read()
        if raw:
            return response.status, response.headers.get("Content-Type", ""), content
        if not content:
            return None
        return json.loads(content.decode("utf-8"))


def expect_obj(payload: Any, label: str) -> Dict[str, Any]:
    if not isinstance(payload, dict):
        raise RuntimeError(f"Resposta invalida para {label}: {payload}")
    return payload


def expect_list(payload: Any, label: str) -> List[Any]:
    if not isinstance(payload, list):
        raise RuntimeError(f"Resposta invalida para {label}: {payload}")
    return payload


def main():
    print("== LOGIN ==")
    prof = expect_obj(req("POST", "/api/auth/login", {"email": "prof.demo.lab05@gmail.com", "senha": "Senha@123"}), "login professor")
    aluno = expect_obj(req("POST", "/api/auth/login", {"email": "aluno.demo.lab05@gmail.com", "senha": "Senha@123"}), "login aluno")
    empresa = expect_obj(req("POST", "/api/auth/login", {"email": "empresa.demo.lab05@gmail.com", "senha": "Senha@123"}), "login empresa")

    print(f"PROF OK: {prof['id']}")
    print(f"ALUNO OK: {aluno['id']}")
    print(f"EMPRESA OK: {empresa['id']}")

    print("== CADASTRO VANTAGEM ==")
    descricao = "Voucher Lab05 " + datetime.datetime.now().strftime("%H%M%S")
    vantagem = expect_obj(req(
        "POST",
        f"/api/empresas/{empresa['id']}/vantagens",
        {
            "descricao": descricao,
            "fotoUrl": "https://picsum.photos/300",
            "custoMoedas": 30.0,
        },
        empresa["token"],
    ), "cadastro vantagem")
    print(f"VANTAGEM OK: {vantagem['id']} | {vantagem['descricao']}")

    print("== DISTRIBUICAO DE MOEDAS ==")
    tx = expect_obj(req(
        "POST",
        "/api/transacoes/distribuicao",
        {
            "professorId": prof["id"],
            "alunoId": aluno["id"],
            "valor": 50.0,
            "mensagem": "Reconhecimento Lab05 E2E",
        },
        prof["token"],
    ), "distribuicao")
    print(f"TRANSACAO OK: {tx['id']} | valor={tx['valor']}")

    print("== EXTRATOS ==")
    ex_prof = expect_list(req("GET", f"/api/extratos/professores/{prof['id']}", token=prof["token"]), "extrato professor")
    ex_aluno = expect_list(req("GET", f"/api/extratos/alunos/{aluno['id']}", token=aluno["token"]), "extrato aluno")
    print(f"EXTRATO PROF QTDE: {len(ex_prof)}")
    print(f"EXTRATO ALUNO QTDE: {len(ex_aluno)}")

    print("== RESGATE + QR ==")
    resgate = expect_obj(req(
        "POST",
        "/api/resgates",
        {"alunoId": aluno["id"], "vantagemId": vantagem["id"]},
        aluno["token"],
    ), "resgate")
    print(f"RESGATE OK: {resgate['id']} | codigo={resgate['codigoUnico']}")
    qr_url = cast(str, resgate.get("qrCodeUrl"))
    if not qr_url:
        raise RuntimeError("qrCodeUrl ausente na resposta de resgate")
    print(f"QR URL: {qr_url}")

    status, content_type, _ = cast(Tuple[int, str, bytes], req("GET", qr_url, raw=True))
    print(f"QR HTTP: {status} | Content-Type={content_type}")

    if status != 200:
        raise RuntimeError("QR nao retornou HTTP 200")

    print("== TESTE E2E FINALIZADO COM SUCESSO ==")


if __name__ == "__main__":
    main()
