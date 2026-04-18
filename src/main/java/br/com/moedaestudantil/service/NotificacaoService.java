package br.com.moedaestudantil.service;

import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.EmpresaParceira;
import br.com.moedaestudantil.model.Professor;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class NotificacaoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificacaoService.class);
    private final JavaMailSender mailSender;
    private final String remetente;
    private final String destinoAlunoPadrao;
    private final String destinoEmpresaPadrao;
    private final boolean falharSeNaoEnviar;

    public NotificacaoService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String remetente,
            @Value("${app.mail.destino-aluno-padrao:gabrielvieira200481@gmail.com}") String destinoAlunoPadrao,
            @Value("${app.mail.destino-empresa-padrao:thalescarvalho622@gmail.com}") String destinoEmpresaPadrao,
            @Value("${app.mail.fail-on-error:false}") boolean falharSeNaoEnviar
    ) {
        this.mailSender = mailSender;
        this.remetente = remetente;
        this.destinoAlunoPadrao = destinoAlunoPadrao;
        this.destinoEmpresaPadrao = destinoEmpresaPadrao;
        this.falharSeNaoEnviar = falharSeNaoEnviar;
    }

    public void enviarConfirmacaoResgateParaAluno(Aluno aluno, String codigoUnico, String qrCodeUrl) {
        String destino = (aluno.getEmail() == null || aluno.getEmail().isBlank()) ? destinoAlunoPadrao : aluno.getEmail();
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destino);
        mensagem.setSubject("Confirmacao de Resgate - Sistema de Moeda Estudantil");
        mensagem.setText("Ola " + aluno.getNome()
                + ", seu codigo de resgate e: " + codigoUnico
                + ".\nQR Code do cupom: " + qrCodeUrl + ".");
        enviarComFallback(mensagem, "Aluno", aluno.getNome(), destino);
    }

    public void enviarRecebimentoMoedasParaAluno(Aluno aluno, BigDecimal valor, String mensagemTransacao) {
        String destino = (aluno.getEmail() == null || aluno.getEmail().isBlank()) ? destinoAlunoPadrao : aluno.getEmail();
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destino);
        mensagem.setSubject("Voce recebeu moedas");
        mensagem.setText("Ola " + aluno.getNome()
                + ", voce recebeu " + valor + " moedas. Mensagem do professor: " + mensagemTransacao + ".");
        enviarComFallback(mensagem, "Aluno", aluno.getNome(), destino);
    }

    public void enviarConfirmacaoDistribuicaoParaProfessor(Professor professor, Aluno aluno, BigDecimal valor, String mensagemTransacao) {
        String destino = (professor.getEmail() == null || professor.getEmail().isBlank()) ? destinoEmpresaPadrao : professor.getEmail();
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destino);
        mensagem.setSubject("Confirmacao de distribuicao de moedas");
        mensagem.setText("Professor " + professor.getNome()
                + ", sua distribuicao foi registrada com sucesso.\nAluno: " + aluno.getNome()
                + "\nValor: " + valor
                + "\nMensagem: " + mensagemTransacao + ".");
        enviarComFallback(mensagem, "Professor", professor.getNome(), destino);
    }

    public void enviarConfirmacaoResgateParaEmpresa(EmpresaParceira empresa, String codigoUnico, String descricaoVantagem, String qrCodeUrl) {
        String destino = (empresa.getEmail() == null || empresa.getEmail().isBlank()) ? destinoEmpresaPadrao : empresa.getEmail();
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destino);
        mensagem.setSubject("Novo Resgate de Vantagem");
        mensagem.setText("A vantagem '" + descricaoVantagem + "' foi resgatada com o codigo: " + codigoUnico
                + ".\nQR Code para validacao: " + qrCodeUrl + ".");
        enviarComFallback(mensagem, "Empresa", empresa.getNomeFantasia(), destino);
    }

    private void enviarComFallback(SimpleMailMessage mensagem, String tipo, String nome, String destino) {
        try {
            mailSender.send(mensagem);
            LOGGER.info("EMAIL enviado para {} [{}] ({})", tipo, nome, destino);
        } catch (MailException ex) {
            LOGGER.warn("Falha no envio SMTP para {} [{}] ({}). Modo fallback ativo.", tipo, nome, destino, ex);
            if (falharSeNaoEnviar) {
                throw ex;
            }
        }
    }
}
