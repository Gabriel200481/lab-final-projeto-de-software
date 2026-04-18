package br.com.moedaestudantil.service;

import br.com.moedaestudantil.dto.InstituicaoResponse;
import br.com.moedaestudantil.repository.InstituicaoEnsinoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class InstituicaoService {

    private final InstituicaoEnsinoRepository instituicaoEnsinoRepository;

    public InstituicaoService(InstituicaoEnsinoRepository instituicaoEnsinoRepository) {
        this.instituicaoEnsinoRepository = instituicaoEnsinoRepository;
    }

    public List<InstituicaoResponse> listar() {
        return instituicaoEnsinoRepository.findAll().stream()
                .map(i -> new InstituicaoResponse(i.getId(), i.getNome(), i.getSigla()))
                .toList();
    }
}
