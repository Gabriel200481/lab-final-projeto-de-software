package br.com.moedaestudantil.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import javax.imageio.ImageIO;

/**
 * Serviço de geração de QR Code para cupons de resgate
 * 
 * Responsabilidades:
 * - Gerar QR Code em formato PNG
 * - Persistir arquivo em disco/storage
 * - Retornar URL pública do QR Code
 * - Tratamento de erros
 */
@Service
public class QrCodeService {
    
    private static final Logger logger = LoggerFactory.getLogger(QrCodeService.class);
    
    @Value("${app.qrcode.basepath:qrcodes/}")
    private String qrcodePath;
    
    @Value("${app.qrcode.baseurl:http://localhost:8080/api/qrcodes/}")
    private String qrcodeBaseUrl;
    
    @Value("${app.qrcode.width:200}")
    private int qrcodeWidth;
    
    @Value("${app.qrcode.height:200}")
    private int qrcodeHeight;
    
    /**
     * Gera QR Code a partir de dados/texto
     * 
     * @param dados Conteúdo do QR Code (ex: "ABC-12345-XYZ")
     * @param nomeArquivo Nome do arquivo a salvar (sem extensão)
     * @return URL pública do QR Code gerado
     * @throws Exception Se houver erro na geração
     */
    public String gerarQrCode(String dados, String nomeArquivo) throws Exception {
        logger.info("Iniciando geração de QR Code para: {}", nomeArquivo);
        
        try {
            // 1. Criar diretório se não existir
            Path dirPath = Paths.get(qrcodePath);
            Files.createDirectories(dirPath);
            logger.debug("Diretório QR Code verificado: {}", qrcodePath);
            
            // 2. Gerar matriz de bits
            MultiFormatWriter writer = new MultiFormatWriter();
            BitMatrix bitMatrix = writer.encode(
                dados,
                BarcodeFormat.QR_CODE,
                qrcodeWidth,
                qrcodeHeight
            );
            logger.debug("Matriz de bits gerada com sucesso");
            
            // 3. Converter para imagem
            BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
            
            // 4. Salvar arquivo PNG
            String nomeComExtensao = nomeArquivo + ".png";
            File arquivo = new File(qrcodePath + nomeComExtensao);
            
            ImageIO.write(image, "PNG", arquivo);
            logger.info("QR Code salvo em: {}", arquivo.getAbsolutePath());
            
            // 5. Gerar URL pública
            String urlPublica = qrcodeBaseUrl + nomeComExtensao;
            logger.info("URL pública gerada: {}", urlPublica);
            
            return urlPublica;
            
        } catch (Exception e) {
            logger.error("Erro ao gerar QR Code para: {}", nomeArquivo, e);
            throw new RuntimeException("Falha ao gerar QR Code: " + e.getMessage(), e);
        }
    }
    
    /**
     * Gera nome de arquivo único para QR Code
     * 
     * @param usuarioId ID do usuário
     * @param vantagemId ID da vantagem
     * @return Nome único para arquivo
     */
    public String gerarNomeArquivoUnico(Long usuarioId, Long vantagemId) {
        String timestamp = System.currentTimeMillis() + "";
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return String.format("cupom_%d_%d_%s_%s", usuarioId, vantagemId, timestamp, uuid);
    }
    
    /**
     * Deleta arquivo QR Code (cleanup)
     * 
     * @param nomeArquivo Nome do arquivo a deletar
     */
    public void deletarQrCode(String nomeArquivo) {
        try {
            File arquivo = new File(qrcodePath + nomeArquivo);
            if (arquivo.exists() && arquivo.delete()) {
                logger.info("QR Code deletado: {}", nomeArquivo);
            }
        } catch (Exception e) {
            logger.warn("Erro ao deletar QR Code: {}", nomeArquivo, e);
        }
    }
    
    /**
     * Valida se QR Code foi gerado corretamente
     * 
     * @param urlQrCode URL do QR Code
     * @return true se arquivo existe e é válido
     */
    public boolean validarQrCode(String urlQrCode) {
        try {
            String nomeArquivo = urlQrCode.substring(urlQrCode.lastIndexOf("/") + 1);
            File arquivo = new File(qrcodePath + nomeArquivo);
            
            if (!arquivo.exists()) {
                logger.warn("Arquivo QR Code não encontrado: {}", nomeArquivo);
                return false;
            }
            
            if (arquivo.length() == 0) {
                logger.warn("Arquivo QR Code vazio: {}", nomeArquivo);
                return false;
            }
            
            logger.debug("QR Code validado com sucesso: {} ({}MB)", 
                nomeArquivo, arquivo.length() / 1024.0);
            return true;
            
        } catch (Exception e) {
            logger.error("Erro ao validar QR Code: {}", urlQrCode, e);
            return false;
        }
    }
    
}
