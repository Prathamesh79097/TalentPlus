package com.recruitx;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

public class TestEmailConnection {
    public static void main(String[] args) {
        String username = "talentpulseteam@gmail.com";
        String password = "gtzlvymqsvpkvqtk"; // or with spaces "gtzl vymq svpk vqtk"
        
        System.out.println("Testing SMTP connection with Gmail for: " + username);

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");

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
            message.setSubject("Test Email - TalentPulse SMTP Verification");
            message.setText("Hello!\n\nThis is a test email from TalentPulse backend to verify Gmail SMTP configuration.");

            Transport.send(message);
            System.out.println("SUCCESS: Test email sent successfully to " + username);
        } catch (Exception e) {
            System.err.println("FAILURE: Failed to send test email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
