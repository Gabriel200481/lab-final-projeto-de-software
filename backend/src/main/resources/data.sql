INSERT INTO instituicao_ensino (id, nome, sigla) VALUES
('11111111-1111-1111-1111-111111111111', 'Universidade Federal de Minas Gerais', 'UFMG'),
('22222222-2222-2222-2222-222222222222', 'Pontificia Universidade Catolica de Minas Gerais', 'PUC-MG'),
('33333333-3333-3333-3333-333333333333', 'Centro Federal de Educacao Tecnologica de Minas Gerais', 'CEFET-MG');

INSERT INTO usuario (id, ativo, email, nome, papel, senha_hash) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true, 'professor.seed@lab03.com', 'Professor Seed', 'PROFESSOR', '$2a$10$wk6Yv3sMYV5CI7zrMwojIerW3FOQdzM4VG9I59L7SVQ0R9wP1kuLi');

INSERT INTO professor (id, cpf, departamento, instituicao_id, saldo_atual) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '12345678901', 'Computacao', '11111111-1111-1111-1111-111111111111', 1000);

INSERT INTO usuario (id, ativo, email, nome, papel, senha_hash) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', true, 'gabrielvieira200481@gmail.com', 'Aluno Seed', 'ALUNO', '$2a$10$wk6Yv3sMYV5CI7zrMwojIerW3FOQdzM4VG9I59L7SVQ0R9wP1kuLi');

INSERT INTO aluno (id, cpf, rg, endereco, curso, instituicao_id, saldo_atual) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10987654321', 'MG1234567', 'Rua A, 123', 'Engenharia de Software', '11111111-1111-1111-1111-111111111111', 0);

INSERT INTO usuario (id, ativo, email, nome, papel, senha_hash) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', true, 'thalescarvalho622@gmail.com', 'Empresa Seed', 'EMPRESA', '$2a$10$wk6Yv3sMYV5CI7zrMwojIerW3FOQdzM4VG9I59L7SVQ0R9wP1kuLi');

INSERT INTO empresa_parceira (id, nome_fantasia) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Loja Parceira Seed');

INSERT INTO vantagem (id, descricao, foto_url, custo_moedas, ativa, empresa_id) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Cupom 10% de desconto', 'https://picsum.photos/200', 100, true, 'cccccccc-cccc-cccc-cccc-cccccccccccc');
