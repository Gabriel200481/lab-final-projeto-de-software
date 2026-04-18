package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.EmpresaRequest;
import br.com.moedaestudantil.dto.EmpresaResponse;
import br.com.moedaestudantil.dto.VantagemRequest;
import br.com.moedaestudantil.dto.VantagemResponse;
import br.com.moedaestudantil.exception.BusinessException;
import br.com.moedaestudantil.exception.NotFoundException;
import br.com.moedaestudantil.model.EmpresaParceira;
import br.com.moedaestudantil.model.PapelUsuario;
import br.com.moedaestudantil.model.Vantagem;
import br.com.moedaestudantil.repository.EmpresaParceiraRepository;
import br.com.moedaestudantil.repository.VantagemRepository;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class EmpresaService {

    private final EmpresaParceiraRepository empresaParceiraRepository;
    private final VantagemRepository vantagemRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaService(
            EmpresaParceiraRepository empresaParceiraRepository,
            VantagemRepository vantagemRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.empresaParceiraRepository = empresaParceiraRepository;
        this.vantagemRepository = vantagemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public EmpresaResponse criar(EmpresaRequest request) {
        validarEmailDuplicado(request.email(), null);
        EmpresaParceira empresa = new EmpresaParceira();
        preencherEmpresa(empresa, request);
        empresa.setPapel(PapelUsuario.EMPRESA);
        EmpresaParceira salva = Objects.requireNonNull(empresaParceiraRepository.save(empresa));
        return paraResponse(salva);
    }

    public List<EmpresaResponse> listar() {
        return empresaParceiraRepository.findAll().stream().map(this::paraResponse).toList();
    }

    public EmpresaResponse buscarPorId(UUID id) {
        EmpresaParceira empresa = buscarEmpresa(id);
        return paraResponse(empresa);
    }

    public EmpresaResponse atualizar(UUID id, EmpresaRequest request) {
        UUID safeId = Objects.requireNonNull(id);
        EmpresaParceira empresa = buscarEmpresa(safeId);
        validarEmailDuplicado(request.email(), safeId);
        preencherEmpresa(empresa, request);
        EmpresaParceira salva = Objects.requireNonNull(empresaParceiraRepository.save(empresa));
        return paraResponse(salva);
    }

    public void excluir(UUID id) {
        UUID safeId = Objects.requireNonNull(id);
        if (!empresaParceiraRepository.existsById(safeId)) {
            throw new NotFoundException("Empresa nao encontrada");
        }
        empresaParceiraRepository.deleteById(safeId);
    }

    public VantagemResponse adicionarVantagem(UUID empresaId, VantagemRequest request) {
        EmpresaParceira empresa = buscarEmpresa(empresaId);
        Vantagem vantagem = new Vantagem();
        vantagem.setDescricao(request.descricao());
        vantagem.setFotoUrl(request.fotoUrl());
        vantagem.setCustoMoedas(request.custoMoedas());
        vantagem.setAtiva(true);
        vantagem.setEmpresa(empresa);

        Vantagem salva = vantagemRepository.save(vantagem);
        return new VantagemResponse(
                salva.getId(),
                salva.getDescricao(),
                salva.getFotoUrl(),
                salva.getCustoMoedas(),
                salva.isAtiva()
        );
    }

    public List<VantagemResponse> listarVantagens(UUID empresaId) {
        buscarEmpresa(empresaId);
        return vantagemRepository.findByEmpresaId(empresaId).stream()
                .map(v -> new VantagemResponse(v.getId(), v.getDescricao(), v.getFotoUrl(), v.getCustoMoedas(), v.isAtiva()))
                .toList();
    }

    private EmpresaParceira buscarEmpresa(UUID id) {
        UUID safeId = Objects.requireNonNull(id);
        return empresaParceiraRepository.findById(safeId)
                .orElseThrow(() -> new NotFoundException("Empresa nao encontrada"));
    }

    private void validarEmailDuplicado(String email, UUID idAtual) {
        boolean emailDuplicado = empresaParceiraRepository.findAll().stream()
                .anyMatch(e -> e.getEmail().equalsIgnoreCase(email) && (idAtual == null || !e.getId().equals(idAtual)));
        if (emailDuplicado) {
            throw new BusinessException("Email da empresa ja cadastrado");
        }
    }

    private void preencherEmpresa(EmpresaParceira empresa, EmpresaRequest request) {
        empresa.setNome(request.nome());
        empresa.setEmail(request.email());
        empresa.setSenhaHash(passwordEncoder.encode(request.senha()));
        empresa.setNomeFantasia(request.nomeFantasia());
        empresa.setAtivo(true);
    }

    private EmpresaResponse paraResponse(EmpresaParceira empresa) {
        List<VantagemResponse> vantagens = vantagemRepository.findByEmpresaId(empresa.getId()).stream()
                .map(v -> new VantagemResponse(v.getId(), v.getDescricao(), v.getFotoUrl(), v.getCustoMoedas(), v.isAtiva()))
                .toList();

        return new EmpresaResponse(
                empresa.getId(),
                empresa.getNome(),
                empresa.getEmail(),
                empresa.getNomeFantasia(),
                vantagens
        );
    }
}
