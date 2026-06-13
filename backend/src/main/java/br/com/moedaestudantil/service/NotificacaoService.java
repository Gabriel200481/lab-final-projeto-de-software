package br.com.moedaestudantil.service;

import br.com.moedaestudantil.model.Aluno;
import br.com.moedaestudantil.model.EmpresaParceira;
import br.com.moedaestudantil.model.Professor;
import io.micronaut.context.annotation.Value;
import jakarta.inject.Singleton;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.File;
import java.math.BigDecimal;

@Singleton
@SuppressWarnings("null")
public class NotificacaoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificacaoService.class);

    private final JavaMailSender mailSender;
    private final String remetente;
    private final String destinoAlunoPadrao;
    private final String destinoEmpresaPadrao;
    private final boolean falharSeNaoEnviar;
    private final String qrcodePath;

    public NotificacaoService(
            JavaMailSender mailSender,
            @Value("${javamail.username}") String remetente,
            @Value("${app.mail.destino-aluno-padrao:gabrielvieira200481@gmail.com}") String destinoAlunoPadrao,
            @Value("${app.mail.destino-empresa-padrao:thalescarvalho622@gmail.com}") String destinoEmpresaPadrao,
            @Value("${app.mail.fail-on-error:false}") boolean falharSeNaoEnviar,
            @Value("${app.qrcode.basepath:qrcodes/}") String qrcodePath
    ) {
        this.mailSender = mailSender;
        this.remetente = remetente;
        this.destinoAlunoPadrao = destinoAlunoPadrao;
        this.destinoEmpresaPadrao = destinoEmpresaPadrao;
        this.falharSeNaoEnviar = falharSeNaoEnviar;
        this.qrcodePath = qrcodePath;
    }

    public void enviarConfirmacaoResgateParaAluno(Aluno aluno, String codigoUnico, String qrCodeUrl) {
        String destino = resolverDestino(aluno.getEmail(), destinoAlunoPadrao);
        String html = templateCupomAluno(aluno.getNome(), codigoUnico, qrCodeUrl);
        enviarHtml(destino, "Seu cupom de resgate - Sistema de Moeda Estudantil", html, qrCodeUrl);
    }

    public void enviarRecebimentoMoedasParaAluno(Aluno aluno, BigDecimal valor, String mensagemTransacao) {
        String destino = resolverDestino(aluno.getEmail(), destinoAlunoPadrao);
        String html = templateRecebimentoMoedas(aluno.getNome(), valor, mensagemTransacao);
        enviarHtml(destino, "Voce recebeu moedas! - Sistema de Moeda Estudantil", html, null);
    }

    public void enviarConfirmacaoDistribuicaoParaProfessor(Professor professor, Aluno aluno, BigDecimal valor, String mensagemTransacao) {
        String destino = resolverDestino(professor.getEmail(), destinoEmpresaPadrao);
        String html = templateDistribuicaoProfessor(professor.getNome(), aluno.getNome(), valor, mensagemTransacao);
        enviarHtml(destino, "Confirmacao de distribuicao de moedas", html, null);
    }

    public void enviarConfirmacaoResgateParaEmpresa(EmpresaParceira empresa, String codigoUnico, String descricaoVantagem, String qrCodeUrl) {
        String destino = resolverDestino(empresa.getEmail(), destinoEmpresaPadrao);
        String html = templateResgateEmpresa(empresa.getNomeFantasia(), descricaoVantagem, codigoUnico, qrCodeUrl);
        enviarHtml(destino, "Novo resgate de vantagem - " + descricaoVantagem, html, qrCodeUrl);
    }

    private void enviarHtml(String destino, String assunto, String html, String qrCodeUrl) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
            helper.setFrom(remetente);
            helper.setTo(destino);
            helper.setSubject(assunto);
            helper.setText(html, true);

            if (qrCodeUrl != null) {
                File qrFile = resolverArquivoQr(qrCodeUrl);
                if (qrFile != null && qrFile.exists()) {
                    helper.addInline("qrcode", new FileSystemResource(qrFile));
                }
            }

            mailSender.send(mime);
            LOGGER.info("EMAIL HTML enviado para {}", destino);
        } catch (Exception ex) {
            LOGGER.warn("Falha no envio SMTP para {}. Modo fallback ativo.", destino, ex);
            if (falharSeNaoEnviar) {
                throw new RuntimeException(ex);
            }
        }
    }

    private File resolverArquivoQr(String qrCodeUrl) {
        try {
            String nomeArquivo = qrCodeUrl.substring(qrCodeUrl.lastIndexOf("/") + 1);
            return new File(qrcodePath + nomeArquivo);
        } catch (Exception e) {
            return null;
        }
    }

    private String resolverDestino(String email, String padrao) {
        return (email == null || email.isBlank()) ? padrao : email;
    }

    private String templateCupomAluno(String nome, String codigo, String qrCodeUrl) {
        return "<!DOCTYPE html><html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"></head>"
                + "<body style=\"font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px\">"
                + "<div style=\"max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)\">"
                + "<div style=\"background:#2c3e50;padding:30px;text-align:center\">"
                + "<h1 style=\"color:#fff;margin:0;font-size:22px\">Sistema de Moeda Estudantil</h1>"
                + "</div>"
                + "<div style=\"padding:30px\">"
                + "<h2 style=\"color:#2c3e50\">Ola, " + escaparHtml(nome) + "!</h2>"
                + "<p style=\"color:#555;font-size:16px\">Seu resgate foi confirmado com sucesso. Apresente o codigo abaixo na troca presencial:</p>"
                + "<div style=\"background:#f8f9fa;border:2px dashed #2c3e50;border-radius:8px;padding:24px;text-align:center;margin:20px 0\">"
                + "<p style=\"color:#888;margin:0 0 8px 0;font-size:13px;text-transform:uppercase;letter-spacing:1px\">Codigo de Resgate</p>"
                + "<span style=\"font-size:42px;font-weight:bold;color:#2c3e50;letter-spacing:8px\">" + escaparHtml(codigo) + "</span>"
                + "</div>"
                + "<div style=\"text-align:center;margin:24px 0\">"
                + "<p style=\"color:#555;margin-bottom:12px\">Ou apresente o QR Code abaixo:</p>"
                + "<img src=\"cid:qrcode\" alt=\"QR Code de Resgate\" style=\"width:200px;height:200px;border:1px solid #eee;border-radius:4px\" />"
                + "<p style=\"color:#aaa;font-size:12px;margin-top:8px\">Caso a imagem nao apareça: <a href=\"" + escaparHtml(qrCodeUrl) + "\" style=\"color:#2c3e50\">clique aqui para ver o QR Code</a></p>"
                + "</div>"
                + "<p style=\"color:#888;font-size:13px;border-top:1px solid #eee;padding-top:16px\">Guarde este email e apresente-o na troca presencial com a empresa parceira.</p>"
                + "</div>"
                + "<div style=\"background:#f8f9fa;padding:15px;text-align:center\">"
                + "<p style=\"color:#aaa;font-size:12px;margin:0\">Sistema de Moeda Estudantil - PUC Minas</p>"
                + "</div>"
                + "</div></body></html>";
    }

    private String templateRecebimentoMoedas(String nome, BigDecimal valor, String mensagem) {
        return "<!DOCTYPE html><html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"></head>"
                + "<body style=\"font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px\">"
                + "<div style=\"max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)\">"
                + "<div style=\"background:#27ae60;padding:30px;text-align:center\">"
                + "<h1 style=\"color:#fff;margin:0;font-size:22px\">Sistema de Moeda Estudantil</h1>"
                + "</div>"
                + "<div style=\"padding:30px\">"
                + "<h2 style=\"color:#27ae60\">Ola, " + escaparHtml(nome) + "!</h2>"
                + "<p style=\"color:#555;font-size:16px\">Voce recebeu moedas de um professor. Parabens pelo reconhecimento!</p>"
                + "<div style=\"background:#eafaf1;border-left:4px solid #27ae60;border-radius:4px;padding:20px;margin:20px 0;text-align:center\">"
                + "<p style=\"color:#888;margin:0 0 4px 0;font-size:13px;text-transform:uppercase;letter-spacing:1px\">Moedas Recebidas</p>"
                + "<span style=\"font-size:48px;font-weight:bold;color:#27ae60\">" + valor.toPlainString() + "</span>"
                + "</div>"
                + "<p style=\"color:#555;margin-top:20px\"><strong>Mensagem do professor:</strong></p>"
                + "<p style=\"color:#333;background:#f8f9fa;padding:16px;border-radius:4px;font-style:italic;border-left:3px solid #27ae60\">" + escaparHtml(mensagem) + "</p>"
                + "</div>"
                + "<div style=\"background:#f8f9fa;padding:15px;text-align:center\">"
                + "<p style=\"color:#aaa;font-size:12px;margin:0\">Sistema de Moeda Estudantil - PUC Minas</p>"
                + "</div>"
                + "</div></body></html>";
    }

    private String templateDistribuicaoProfessor(String nomeProfessor, String nomeAluno, BigDecimal valor, String mensagem) {
        return "<!DOCTYPE html><html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"></head>"
                + "<body style=\"font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px\">"
                + "<div style=\"max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)\">"
                + "<div style=\"background:#2980b9;padding:30px;text-align:center\">"
                + "<h1 style=\"color:#fff;margin:0;font-size:22px\">Sistema de Moeda Estudantil</h1>"
                + "</div>"
                + "<div style=\"padding:30px\">"
                + "<h2 style=\"color:#2980b9\">Professor " + escaparHtml(nomeProfessor) + ",</h2>"
                + "<p style=\"color:#555;font-size:16px\">Sua distribuicao de moedas foi registrada com sucesso.</p>"
                + "<table style=\"width:100%;border-collapse:collapse;margin:20px 0\">"
                + "<tr style=\"background:#f8f9fa\">"
                + "<td style=\"padding:12px 16px;color:#888;font-size:13px\">Aluno</td>"
                + "<td style=\"padding:12px 16px;color:#333;font-weight:bold\">" + escaparHtml(nomeAluno) + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style=\"padding:12px 16px;color:#888;font-size:13px\">Moedas enviadas</td>"
                + "<td style=\"padding:12px 16px;color:#27ae60;font-weight:bold;font-size:18px\">" + valor.toPlainString() + "</td>"
                + "</tr>"
                + "<tr style=\"background:#f8f9fa\">"
                + "<td style=\"padding:12px 16px;color:#888;font-size:13px\">Mensagem</td>"
                + "<td style=\"padding:12px 16px;color:#333;font-style:italic\">" + escaparHtml(mensagem) + "</td>"
                + "</tr>"
                + "</table>"
                + "</div>"
                + "<div style=\"background:#f8f9fa;padding:15px;text-align:center\">"
                + "<p style=\"color:#aaa;font-size:12px;margin:0\">Sistema de Moeda Estudantil - PUC Minas</p>"
                + "</div>"
                + "</div></body></html>";
    }

    private String templateResgateEmpresa(String nomeEmpresa, String descricaoVantagem, String codigo, String qrCodeUrl) {
        return "<!DOCTYPE html><html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"></head>"
                + "<body style=\"font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px\">"
                + "<div style=\"max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1)\">"
                + "<div style=\"background:#8e44ad;padding:30px;text-align:center\">"
                + "<h1 style=\"color:#fff;margin:0;font-size:22px\">Sistema de Moeda Estudantil</h1>"
                + "</div>"
                + "<div style=\"padding:30px\">"
                + "<h2 style=\"color:#8e44ad\">Novo resgate - " + escaparHtml(nomeEmpresa) + "</h2>"
                + "<p style=\"color:#555;font-size:16px\">Um aluno resgatou a seguinte vantagem:</p>"
                + "<p style=\"color:#333;background:#f8f9fa;padding:16px;border-radius:4px;font-weight:bold;font-size:15px;border-left:3px solid #8e44ad\">" + escaparHtml(descricaoVantagem) + "</p>"
                + "<p style=\"color:#555;margin-top:20px\">Valide o codigo abaixo no atendimento presencial:</p>"
                + "<div style=\"background:#f8f9fa;border:2px dashed #8e44ad;border-radius:8px;padding:24px;text-align:center;margin:20px 0\">"
                + "<p style=\"color:#888;margin:0 0 8px 0;font-size:13px;text-transform:uppercase;letter-spacing:1px\">Codigo de Validacao</p>"
                + "<span style=\"font-size:42px;font-weight:bold;color:#8e44ad;letter-spacing:8px\">" + escaparHtml(codigo) + "</span>"
                + "</div>"
                + "<div style=\"text-align:center;margin:24px 0\">"
                + "<p style=\"color:#555;margin-bottom:12px\">Ou escaneie o QR Code para validar:</p>"
                + "<img src=\"cid:qrcode\" alt=\"QR Code de Validacao\" style=\"width:200px;height:200px;border:1px solid #eee;border-radius:4px\" />"
                + "<p style=\"color:#aaa;font-size:12px;margin-top:8px\">Caso a imagem nao apareça: <a href=\"" + escaparHtml(qrCodeUrl) + "\" style=\"color:#8e44ad\">clique aqui para ver o QR Code</a></p>"
                + "</div>"
                + "</div>"
                + "<div style=\"background:#f8f9fa;padding:15px;text-align:center\">"
                + "<p style=\"color:#aaa;font-size:12px;margin:0\">Sistema de Moeda Estudantil - PUC Minas</p>"
                + "</div>"
                + "</div></body></html>";
    }

    private String escaparHtml(String texto) {
        if (texto == null) return "";
        return texto
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
