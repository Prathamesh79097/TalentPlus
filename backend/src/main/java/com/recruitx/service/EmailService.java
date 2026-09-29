package com.recruitx.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.from-email:noreply@talentpulse.com}")
    private String fromEmail;

    @Value("${app.mail.from-name:TalentPulse Recruitment}")
    private String fromName;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' hh:mm a (z)")
            .withZone(ZoneId.systemDefault());

    /**
     * Asynchronously send an application acknowledgment email to the candidate.
     */
    @Async
    public void sendApplicationConfirmationEmail(String toEmail, String candidateName, String jobRole, Instant appliedTime) {
        if (!mailEnabled) {
            log.info("Email service is disabled (app.mail.enabled=false). Skipping confirmation email to {}", toEmail);
            return;
        }

        if (toEmail == null || toEmail.trim().isEmpty() || !toEmail.contains("@")) {
            log.warn("Cannot send email: invalid email address '{}'", toEmail);
            return;
        }

        if (mailUsername == null || mailUsername.trim().isEmpty()) {
            log.info("ℹ️ [EMAIL NOTICE] Mail credentials (spring.mail.username) not configured. Application confirmation email to {} was prepared with role '{}'. To send live emails, set SPRING_MAIL_USERNAME and SPRING_MAIL_PASSWORD in environment variables.", toEmail, jobRole);
            return;
        }

        try {
            String roleName = (jobRole != null && !jobRole.trim().isEmpty()) ? jobRole.trim() : "General Application";
            String name = (candidateName != null && !candidateName.trim().isEmpty() && !"Applicant".equalsIgnoreCase(candidateName)) ? candidateName.trim() : "Candidate";
            Instant timestamp = (appliedTime != null) ? appliedTime : Instant.now();
            String formattedTime = DATE_FORMATTER.format(timestamp);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String senderAddress = (mailUsername != null && !mailUsername.trim().isEmpty()) ? mailUsername : fromEmail;
            helper.setFrom(new InternetAddress(senderAddress, fromName));
            helper.setTo(toEmail.trim());
            helper.setSubject("Application Received: " + roleName + " – TalentPulse");

            String htmlBody = buildHtmlEmail(name, roleName, formattedTime);
            String plainText = buildPlainTextEmail(name, roleName, formattedTime);

            helper.setText(plainText, htmlBody);

            log.info("Sending application confirmation email to {} for role '{}'...", toEmail, roleName);
            mailSender.send(message);
            log.info("Successfully sent application confirmation email to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send application confirmation email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildPlainTextEmail(String name, String roleName, String formattedTime) {
        return "Dear " + name + ",\n\n"
                + "Thank you for applying for the position of \"" + roleName + "\" at TalentPulse.\n\n"
                + "We have successfully received your application submitted on " + formattedTime + ".\n\n"
                + "What happens next?\n"
                + "Our hiring team is currently reviewing your application and credentials against the position requirements. "
                + "Please wait for our recruiters' decision. We will reach out to you via email regarding the next steps in our hiring process.\n\n"
                + "We wish you all the very best!\n\n"
                + "Warm regards,\n"
                + "TalentPulse Recruitment Team\n"
                + "https://talentpulse.app";
    }

    private String buildHtmlEmail(String name, String roleName, String formattedTime) {
        return "<!DOCTYPE html>\n"
                + "<html>\n"
                + "<head>\n"
                + "  <meta charset=\"UTF-8\">\n"
                + "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
                + "  <title>Application Received</title>\n"
                + "</head>\n"
                + "<body style=\"margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;\">\n"
                + "  <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color: #f1f5f9; padding: 40px 16px;\">\n"
                + "    <tr>\n"
                + "      <td align=\"center\">\n"
                + "        <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);\">\n"
                + "          \n"
                + "          <!-- Header -->\n"
                + "          <tr>\n"
                + "            <td style=\"background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 36px 32px; text-align: center;\">\n"
                + "              <h1 style=\"margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;\">TalentPulse</h1>\n"
                + "              <p style=\"margin: 6px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.85);\">Recruitment Management System</p>\n"
                + "            </td>\n"
                + "          </tr>\n"
                + "\n"
                + "          <!-- Body Content -->\n"
                + "          <tr>\n"
                + "            <td style=\"padding: 36px 32px;\">\n"
                + "              <h2 style=\"margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #0f172a;\">Dear " + escapeHtml(name) + ",</h2>\n"
                + "              \n"
                + "              <p style=\"margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;\">\n"
                + "                Thank you for your interest in joining our team! We have successfully received your job application.\n"
                + "              </p>\n"
                + "\n"
                + "              <!-- Application Summary Box -->\n"
                + "              <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;\">\n"
                + "                <tr>\n"
                + "                  <td style=\"padding: 18px 20px;\">\n"
                + "                    <div style=\"font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; margin-bottom: 4px;\">Applied Role</div>\n"
                + "                    <div style=\"font-size: 17px; font-weight: 700; color: #4f46e5; margin-bottom: 12px;\">" + escapeHtml(roleName) + "</div>\n"
                + "                    <div style=\"font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; margin-bottom: 4px;\">Submission Time</div>\n"
                + "                    <div style=\"font-size: 14px; color: #0f172a; font-weight: 500;\">" + escapeHtml(formattedTime) + "</div>\n"
                + "                  </td>\n"
                + "                </tr>\n"
                + "              </table>\n"
                + "\n"
                + "              <!-- What's Next Card -->\n"
                + "              <div style=\"border-left: 4px solid #4f46e5; padding-left: 16px; margin-bottom: 24px;\">\n"
                + "                <h3 style=\"margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #0f172a;\">What's Next?</h3>\n"
                + "                <p style=\"margin: 0; font-size: 14px; line-height: 1.6; color: #475569;\">\n"
                + "                  Our recruitment team is currently reviewing your profile, background, and skillset against the job criteria. Please wait for the recruiters' decision.\n"
                + "                </p>\n"
                + "              </div>\n"
                + "\n"
                + "              <p style=\"margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #334155;\">\n"
                + "                If your profile matches our requirements, we will reach out to you directly regarding the next interview stages. <strong>All the best!</strong>\n"
                + "              </p>\n"
                + "\n"
                + "              <!-- Signature -->\n"
                + "              <div style=\"border-top: 1px solid #e2e8f0; padding-top: 20px;\">\n"
                + "                <p style=\"margin: 0; font-size: 14px; color: #334155; font-weight: 600;\">Warm regards,</p>\n"
                + "                <p style=\"margin: 2px 0 0 0; font-size: 14px; color: #64748b;\">TalentPulse Recruitment Team</p>\n"
                + "              </div>\n"
                + "            </td>\n"
                + "          </tr>\n"
                + "\n"
                + "          <!-- Footer -->\n"
                + "          <tr>\n"
                + "            <td style=\"background-color: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;\">\n"
                + "              <p style=\"margin: 0; font-size: 12px; color: #94a3b8;\">\n"
                + "                This is an automated confirmation email from TalentPulse. Please do not reply directly to this email.\n"
                + "              </p>\n"
                + "            </td>\n"
                + "          </tr>\n"
                + "\n"
                + "        </table>\n"
                + "      </td>\n"
                + "    </tr>\n"
                + "  </table>\n"
                + "</body>\n"
                + "</html>";
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}
