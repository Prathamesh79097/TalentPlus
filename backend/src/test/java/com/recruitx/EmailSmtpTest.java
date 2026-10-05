package com.recruitx;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import java.util.Properties;

public class EmailSmtpTest {

    @Test
    public void testGmailSmtp() {
        String username = "talentpulseteam@gmail.com";
        String password = "gtzlvymqsvpkvqtk";
        
        System.out.println("=== STARTING SMTP TEST ===");
        System.out.println("Connecting as: " + username);

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
        session.setDebug(true);

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username, "TalentPulseTeam"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(username));
            message.setSubject("Test Email - TalentPulse Verification");
            message.setText("SMTP connection works successfully!");

            Transport.send(message);
            System.out.println("=== SMTP TEST SUCCESSFUL! Email sent to " + username + " ===");
        } catch (Exception e) {
            System.err.println("=== SMTP TEST FAILED: " + e.getMessage() + " ===");
            e.printStackTrace();
            org.junit.jupiter.api.Assertions.fail("SMTP failed: " + e.getMessage());
        }
    }
}
