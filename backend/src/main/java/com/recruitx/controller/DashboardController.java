package com.recruitx.controller;

import com.recruitx.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final FirestoreService db;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() throws Exception {
        List<Map<String, Object>> jobs = db.findAll("jobs");
        List<Map<String, Object>> applicants = db.findAll("applicants");
        List<Map<String, Object>> interviews = db.findAll("interviews");
        List<Map<String, Object>> offers = db.findAll("offers");

        // Today's date prefix
        String today = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date());

        long activeJobs = jobs.stream().filter(j -> "OPEN".equals(j.get("status"))).count();
        long totalApplicants = applicants.size();
        long unreadApplicants = applicants.stream()
                .filter(a -> "NEW".equals(a.get("stage"))).count();
        long todayInterviews = interviews.stream()
                .filter(i -> {
                    String s = (String) i.getOrDefault("scheduledAt", "");
                    return s.startsWith(today);
                }).count();
        long doneInterviews = interviews.stream()
                .filter(i -> {
                    String s = (String) i.getOrDefault("scheduledAt", "");
                    return s.startsWith(today) && "COMPLETED".equals(i.get("status"));
                }).count();

        long pendingOffers = offers.stream().filter(o -> "PENDING".equals(o.get("status"))).count();
        long signedOffers = offers.stream().filter(o -> "ACCEPTED".equals(o.get("status"))).count();
        long totalOffersResponded = offers.stream().filter(o -> !"PENDING".equals(o.get("status"))).count();
        long acceptanceRate = totalOffersResponded > 0 ? Math.round(signedOffers * 100.0 / totalOffersResponded) : 0;

        // Funnel counts
        Map<String, Long> funnelMap = new HashMap<>();
        funnelMap.put("funnelSourced", totalApplicants);
        funnelMap.put("funnelScreening", applicants.stream().filter(a -> {
            String stage = (String) a.getOrDefault("stage", "NEW");
            return List.of("SCREENING","SHORTLISTED","INTERVIEW","SELECTION","OFFER","HIRED").contains(stage);
        }).count());
        funnelMap.put("funnelInterviews", applicants.stream().filter(a -> {
            String stage = (String) a.getOrDefault("stage", "NEW");
            return List.of("INTERVIEW","SELECTION","OFFER","HIRED").contains(stage);
        }).count());
        funnelMap.put("funnelSelection", applicants.stream().filter(a -> {
            String stage = (String) a.getOrDefault("stage", "NEW");
            return List.of("SELECTION","OFFER","HIRED").contains(stage);
        }).count());
        funnelMap.put("funnelOffers", (long) offers.size());
        funnelMap.put("funnelHired", applicants.stream().filter(a -> "HIRED".equals(a.get("stage"))).count());

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("activeJobs", activeJobs);
        stats.put("totalApplicants", totalApplicants);
        stats.put("unreadApplicants", unreadApplicants);
        stats.put("todayInterviews", todayInterviews);
        stats.put("doneInterviews", doneInterviews);
        stats.put("pendingOffers", pendingOffers);
        stats.put("signedOffers", signedOffers);
        stats.put("acceptanceRate", acceptanceRate);
        stats.put("pipelineHealth", acceptanceRate + "% On Schedule");
        stats.putAll(funnelMap);

        return ResponseEntity.ok(stats);
    }
}
