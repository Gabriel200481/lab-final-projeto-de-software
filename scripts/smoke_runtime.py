import json
import random
import urllib.request

BASE = "http://localhost:8080"


def req(method, path, data=None, token=None, raw=False):
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


def main():
    suffix = random.randint(10000, 99999)

    instituicoes = req("GET", "/api/instituicoes")
    if not instituicoes:
        raise RuntimeError("Sem instituicoes cadastradas")
    instituicao_id = instituicoes[0]["id"]

    senha = "Senha@123"
    aluno_email = f"aluno.smoke.{suffix}@lab03.com"
    prof_email = f"prof.smoke.{suffix}@lab03.com"
    emp_email = f"empresa.smoke.{suffix}@lab03.com"

    cpf_aluno = f"9{suffix}12345"
    cpf_prof = f"8{suffix}12345"

    req("POST", "/api/alunos", {
        "nome": "Aluno Smoke",
        "email": aluno_email,
        "senha": senha,
        "cpf": cpf_aluno,
        "rg": f"MG{suffix}",
        "endereco": "Rua Smoke, 1",
        "curso": "Engenharia de Software",
        "instituicaoId": instituicao_id,
    })
    aluno_login = req("POST", "/api/auth/login", {"email": aluno_email, "senha": senha})

    prof_create = req("POST", "/api/professores", {
        "nome": "Professor Smoke",
        "email": prof_email,
        "senha": senha,
        "cpf": cpf_prof,
        "departamento": "Computacao",
        "instituicaoId": instituicao_id,
    }, token=aluno_login["token"])
    prof_login = req("POST", "/api/auth/login", {"email": prof_email, "senha": senha})

    emp_create = req("POST", "/api/empresas", {
        "nome": "Responsavel Smoke",
        "email": emp_email,
        "senha": senha,
        "nomeFantasia": "Empresa Smoke",
    })
    emp_login = req("POST", "/api/auth/login", {"email": emp_email, "senha": senha})

    vantagem = req("POST", f"/api/empresas/{emp_create['id']}/vantagens", {
        "descricao": "Vantagem Smoke",
        "fotoUrl": "https://picsum.photos/200",
        "custoMoedas": 30.0,
    }, token=emp_login["token"])

    tx = req("POST", "/api/transacoes/distribuicao", {
        "professorId": prof_create["id"],
        "alunoId": aluno_login["id"],
        "valor": 50.0,
        "mensagem": "Reconhecimento Smoke",
    }, token=prof_login["token"])

    resumo_antes = req("GET", f"/api/extratos/alunos/{aluno_login['id']}/resumo", token=aluno_login["token"])

    resgate = req("POST", "/api/resgates", {
        "alunoId": aluno_login["id"],
        "vantagemId": vantagem["id"],
    }, token=aluno_login["token"])

    qr_status, qr_type, _ = req("GET", resgate["qrCodeUrl"], raw=True)

    resumo_depois = req("GET", f"/api/extratos/alunos/{aluno_login['id']}/resumo", token=aluno_login["token"])
    tem_resgate = any(str(t.get("mensagem", "")).startswith("Resgate de vantagem") for t in resumo_depois["transacoes"])

    print("SMOKE_OK")
    print("TX_ID=", tx["id"])
    print("RESGATE_ID=", resgate["id"])
    print("QR_STATUS=", qr_status, "QR_TYPE=", qr_type)
    print("EXTRATO_ANTES=", resumo_antes["totalMoedasPeriodo"])
    print("EXTRATO_DEPOIS=", resumo_depois["totalMoedasPeriodo"])
    print("TEM_RESGATE_NO_EXTRATO=", tem_resgate)


if __name__ == "__main__":
    main()
