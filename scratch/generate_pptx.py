import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme colors
    PRIMARY = RGBColor(0, 35, 111)       # #00236F
    SECONDARY = RGBColor(0, 81, 213)     # #0051D5
    ACCENT_BG = RGBColor(220, 233, 255)  # #DCE9FF
    WHITE = RGBColor(255, 255, 255)
    DARK_TEXT = RGBColor(11, 28, 48)     # #0B1C30
    MUTED_TEXT = RGBColor(117, 118, 130) # #757682
    CARD_BG = RGBColor(248, 249, 255)    # #F8F9FF
    BORDER_COLOR = RGBColor(197, 197, 211)

    def set_bg(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, category, title):
        # Category pill/subtitle
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf = cat_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = category.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = SECONDARY

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf2 = title_box.text_frame
        tf2.word_wrap = True
        p2 = tf2.paragraphs[0]
        p2.text = title
        p2.font.size = Pt(24)
        p2.font.bold = True
        p2.font.color.rgb = PRIMARY

    def add_card(slide, left, top, width, height, title, items, bg_color=CARD_BG):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = BORDER_COLOR
        shape.line.width = Pt(1)

        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), height - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        if title:
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(16)
            p.font.bold = True
            p.font.color.rgb = PRIMARY
            p.space_after = Pt(10)

        first = True if not title else False
        for item in items:
            if first:
                p = tf.paragraphs[0]
                first = False
            else:
                p = tf.add_paragraph()
            p.text = f"• {item}"
            p.font.size = Pt(13)
            p.font.color.rgb = DARK_TEXT
            p.space_after = Pt(6)

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 1: Title Slide (Dark Elegant Theme)
    # ══════════════════════════════════════════════════════════════════
    slide1 = prs.slides.add_slide(blank_layout)
    set_bg(slide1, PRIMARY)

    # Badge
    pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.3), Inches(3.2), Inches(0.45))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(30, 58, 138)
    pill.line.color.rgb = RGBColor(49, 107, 243)
    p = pill.text_frame.paragraphs[0]
    p.text = "CLOUD-NATIVE RECRUITMENT SYSTEM"
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(180, 197, 255)

    # Main Title
    tb = slide1.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.7), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "TalentPulse (RecruitX)"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = WHITE
    
    p2 = tf.add_paragraph()
    p2.text = "Next-Gen Recruitment Management & Live Google Spreadsheet ATS"
    p2.font.size = Pt(22)
    p2.font.color.rgb = RGBColor(220, 233, 255)
    p2.space_before = Pt(8)

    # Metadata cards on bottom
    c1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.7), Inches(5.6), Inches(1.8))
    c1.fill.solid()
    c1.fill.fore_color.rgb = RGBColor(11, 28, 70)
    c1.line.color.rgb = RGBColor(49, 107, 243)
    tf1 = c1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "🌐 Live Deployments"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(180, 197, 255)
    p.space_after = Pt(4)
    p_f = tf1.add_paragraph()
    p_f.text = "• Frontend (Vercel): talentplus-tau.vercel.app"
    p_f.font.size = Pt(12)
    p_f.font.color.rgb = WHITE
    p_b = tf1.add_paragraph()
    p_b.text = "• Backend (Render): talentplus.onrender.com"
    p_b.font.size = Pt(12)
    p_b.font.color.rgb = WHITE

    c2 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(4.7), Inches(5.6), Inches(1.8))
    c2.fill.solid()
    c2.fill.fore_color.rgb = RGBColor(11, 28, 70)
    c2.line.color.rgb = RGBColor(49, 107, 243)
    tf2 = c2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "🛠️ Tech Ecosystem"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(180, 197, 255)
    p.space_after = Pt(4)
    p_t1 = tf2.add_paragraph()
    p_t1.text = "• Java 17 + Spring Boot 3 + Spring Security (Docker)"
    p_t1.font.size = Pt(12)
    p_t1.font.color.rgb = WHITE
    p_t2 = tf2.add_paragraph()
    p_t2.text = "• Google Firestore + Firebase Auth + Google Apps Script"
    p_t2.font.size = Pt(12)
    p_t2.font.color.rgb = WHITE

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 2: Problem Statement & Objectives
    # ══════════════════════════════════════════════════════════════════
    slide2 = prs.slides.add_slide(blank_layout)
    set_bg(slide2, WHITE)
    add_header(slide2, "Context & Motivation", "Problem Statement & Project Objectives")

    add_card(slide2, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.0), "⚠️ Traditional Hiring Pain Points", [
        "Disconnected Forms & Sheets: Candidate applications sit in unorganized spreadsheets without pipeline tracking.",
        "Manual Data Entry Overhead: HR teams manually copy paste candidate responses into internal trackers.",
        "Loss of Custom Questionnaire Data: ATS platforms often strip custom questions and Google Form survey responses.",
        "Duplicate Application Clutter: Multiple submissions from the same candidate corrupt pipeline metrics.",
        "Slow Recruiter Turnaround: No real-time synchronization between applicant submissions and hiring boards."
    ])

    add_card(slide2, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.0), "🎯 TalentPulse Solution Objectives", [
        "1:1 Spreadsheet Synchronization: Automatically capture every exact question and answer into the candidate profile.",
        "Zero-Latency Ingestion: Google Apps Script webhooks push candidate data to cloud backend in under 2 seconds.",
        "Structured 6-Stage Pipeline: Move applicants seamlessly from New to Screening, Interview, Offer, and Hired.",
        "Intelligent Duplicate Detection: Match existing records by email & job to merge updates without data loss.",
        "Automated Requisition Metrics: Dynamic counters update job applicant counts in real-time."
    ], bg_color=ACCENT_BG)

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 3: System Architecture & Technology Stack
    # ══════════════════════════════════════════════════════════════════
    slide3 = prs.slides.add_slide(blank_layout)
    set_bg(slide3, WHITE)
    add_header(slide3, "System Design", "Cloud-Native Full-Stack Architecture")

    add_card(slide3, Inches(0.8), Inches(1.7), Inches(3.6), Inches(5.0), "🖥️ Frontend Layer (Vercel)", [
        "Framework: Vanilla JS SPA + Vite",
        "Styling: Responsive CSS Design System",
        "Auth: Firebase Client SDK",
        "Dynamic Routing: Modular page loaders",
        "Edge CDN: Sub-second global delivery",
        "Live URL: talentplus-tau.vercel.app"
    ])

    add_card(slide3, Inches(4.8), Inches(1.7), Inches(3.6), Inches(5.0), "⚙️ Backend Layer (Render)", [
        "Runtime: Java 17 + Spring Boot 3",
        "Security: Spring Security + Firebase JWT",
        "Container: Multi-stage Docker Build",
        "Dynamic Port: Auto-binding to $PORT",
        "Endpoints: RESTful APIs + Webhooks",
        "Live URL: talentplus.onrender.com"
    ])

    add_card(slide3, Inches(8.8), Inches(1.7), Inches(3.6), Inches(5.0), "☁️ Cloud & Services", [
        "Database: Google Cloud Firestore",
        "Authentication: Firebase Auth (OAuth)",
        "Automation: Google Apps Script Triggers",
        "CI/CD: GitHub Automated Deployment",
        "Security: Webhook secret tokens",
        "Storage: Cloud document store"
    ])

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 4: Job Requisition Management
    # ══════════════════════════════════════════════════════════════════
    slide4 = prs.slides.add_slide(blank_layout)
    set_bg(slide4, WHITE)
    add_header(slide4, "Module 1", "Job Requisitions & Application Link Generator")

    add_card(slide4, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.0), "📋 Requisition Creation & Hierarchy", [
        "Field & Sub-field Classification: Categorized by core domains (Engineering, Business, Product, Operations) and specializations (AI/ML, DevOps, Frontend).",
        "Detailed Compensation & Criteria: Define salary brackets, location (Remote/Onsite), employment types (Full-Time, Contract).",
        "Dynamic Requisition Statuses: Easily toggle between Open, Paused, Draft, and Closed.",
        "Live Requisition Filters: Instant multi-parameter filtering across departments and job types."
    ])

    add_card(slide4, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.0), "🔗 Google Form Link & Script Wizard", [
        "Integrated 'Form' Button on Job Cards: Every requisition features a one-click Google Form configuration modal.",
        "Dedicated Application Link Storage: Save public Google Form links directly against the job requisition.",
        "Auto-Generated Apps Script Code: Generates customized JavaScript snippet with embedded Job ID and secure webhook URL.",
        "Copy-and-Paste Setup: Recruiters copy script directly into Google Sheets Extensions to enable live webhook triggers."
    ])

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 5: 1:1 Google Form & Spreadsheet Sync
    # ══════════════════════════════════════════════════════════════════
    slide5 = prs.slides.add_slide(blank_layout)
    set_bg(slide5, WHITE)
    add_header(slide5, "Module 2", "Automated 1:1 Google Form & Spreadsheet Sync")

    add_card(slide5, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.0), "🔄 Zero Data Loss Ingestion Flow", [
        "1. Submission: Candidate submits Google Form linked to Google Sheet.",
        "2. Trigger: onFormSubmit event fires automatically in Google Apps Script.",
        "3. Payload Extraction: Script maps e.namedValues preserving exact spreadsheet column titles and cell answers.",
        "4. HTTPS Webhook Post: Dispatches authenticated JSON payload to /api/webhooks/google-form with X-Webhook-Secret.",
        "5. Firestore Ingestion: Spring Boot stores clean 1:1 map in candidate document."
    ])

    add_card(slide5, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.0), "🧠 Smart Discovery & Candidate Updates", [
        "Arbitrary Column Mapping: Dynamic fallback scanner identifies name, email, phone, skills, and experience across any sheet format.",
        "Automatic Role Matching: Automatically links applicant to open job requisitions based on submitted role titles.",
        "Seamless Re-submission Merging: Candidate re-submissions update their profile and merge spreadsheet responses without duplicating entries.",
        "Instant Counter Recalculation: Automatically updates total applicants and new applicant badges on the job card."
    ], bg_color=ACCENT_BG)

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 6: Applicant Tracking & Pipeline
    # ══════════════════════════════════════════════════════════════════
    slide6 = prs.slides.add_slide(blank_layout)
    set_bg(slide6, WHITE)
    add_header(slide6, "Module 3", "Applicant Tracking & Recruitment Pipeline")

    add_card(slide6, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.0), "📊 6-Stage Recruitment Funnel", [
        "1. NEW: Incoming Google Form & direct candidate submissions.",
        "2. SCREENING: Resume evaluation and initial recruiter qualification.",
        "3. INTERVIEW: Technical assessments and panel video interviews.",
        "4. SELECTION: Final management review and candidate shortlisting.",
        "5. OFFER: Salary negotiation and official offer letter dispatch.",
        "6. HIRED: Onboarding completion and requisition fulfillment."
    ])

    add_card(slide6, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.0), "⚡ Recruiter Efficiency Features", [
        "Instant Search: Debounced real-time candidate search by name, email, role, or technical skills.",
        "Visual Source Indicators: Purple 'Form' badge clearly marks Google Form applicants in desktop and mobile views.",
        "Quick Action Triggers: One-click stage advancement and rejection buttons directly from the table.",
        "Bulk Management: Built-in 'Clear All Applicants' maintenance action with safety confirmations."
    ])

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 7: Comprehensive Candidate Profile
    # ══════════════════════════════════════════════════════════════════
    slide7 = prs.slides.add_slide(blank_layout)
    set_bg(slide7, WHITE)
    add_header(slide7, "Module 4", "Candidate Dossier & Exact Spreadsheet Viewer")

    add_card(slide7, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.0), "📄 Exact Spreadsheet Response Viewer", [
        "1:1 Question & Answer Cards: Displays every raw question title and candidate answer exactly as filled in Google Forms.",
        "Custom Questionnaire Support: Handles open-ended questions, portfolio links, notice period, and survey queries.",
        "Multi-select Answers: Cleanly formats multi-choice checkbox responses into clear readable summaries.",
        "Document Attachment Links: Instant clickable links to uploaded Google Drive resumes and portfolios."
    ])

    add_card(slide7, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.0), "⭐ Evaluation, Notes & Interviews", [
        "5-Star Candidate Rating: Interactive star-rating widget to record recruiter evaluations.",
        "Internal Recruiter Notes: Collaborative note-taking log with author timestamps for hiring panels.",
        "Interview Scheduling Module: Log interview dates, times, durations, and video meeting links.",
        "Direct Stage Progress Bar: Visual progress tracker showing current position in hiring pipeline."
    ])

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 8: Security & Reliability Engineering
    # ══════════════════════════════════════════════════════════════════
    slide8 = prs.slides.add_slide(blank_layout)
    set_bg(slide8, WHITE)
    add_header(slide8, "Security & Performance", "Enterprise Security & Reliability Engineering")

    add_card(slide8, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.0), "🛡️ Enterprise Security Measures", [
        "Webhook Header Verification: Secret token validation (X-Webhook-Secret) protects webhook ingestion endpoints.",
        "Stateless JWT Authentication: All private REST endpoints verified with Firebase ID Bearer tokens via Spring Security filter.",
        "Environment Secret Isolation: Service account keys loaded from environment variables (FIREBASE_SERVICE_ACCOUNT_JSON) with zero git exposure.",
        "Granular CORS Control: Configured allowed origin patterns for authorized Vercel frontend domains."
    ])

    add_card(slide8, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.0), "⚡ High-Performance Reliability", [
        "Sub-second SPA Navigation: Optimized client-side page router with modular dynamic imports.",
        "Instant Stale-While-Revalidate UI: Renders cached dashboard and candidate layouts instantly without blocking on network.",
        "Background Warmup Ping: Client pre-warms backend container on page load to eliminate free-tier cold-start latency.",
        "Graceful Fallback Resilience: Fail-safe database operations prevent application crashes."
    ])

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 9: Production Deployment & CI/CD
    # ══════════════════════════════════════════════════════════════════
    slide9 = prs.slides.add_slide(blank_layout)
    set_bg(slide9, WHITE)
    add_header(slide9, "DevOps & Infrastructure", "Multi-Cloud Production Deployment")

    add_card(slide9, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.0), "🚀 Multi-Cloud Hosting Setup", [
        "Frontend on Vercel: High-performance Global Edge CDN with Vite build optimization (talentplus-tau.vercel.app).",
        "Backend on Render: Multi-stage Dockerized Java Spring Boot container with dynamic $PORT binding (talentplus.onrender.com).",
        "Database on Firestore: Managed Google Cloud NoSQL document database with multi-region replication.",
        "Automated CI/CD: GitHub main branch tracking triggering automated zero-downtime builds on every push."
    ])

    add_card(slide9, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.0), "✅ Deployment Highlights & Verification", [
        "HTTP 200 OK Webhook Verification: Live automated webhook tests confirmed successful end-to-end data ingestion.",
        "Cross-Origin Handshake: Secure pre-flight OPTIONS and authenticated requests between Vercel and Render.",
        "Clean Build Artifacts: Docker container optimized with Eclipse Temurin 17 JRE footprint.",
        "Universal Accessibility: Fully functional on desktop and mobile web viewports."
    ])

    # ══════════════════════════════════════════════════════════════════
    # SLIDE 10: Results, Impact & Future Roadmap
    # ══════════════════════════════════════════════════════════════════
    slide10 = prs.slides.add_slide(blank_layout)
    set_bg(slide10, PRIMARY)

    tb = slide10.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(0.8))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "BUSINESS IMPACT & FUTURE ROADMAP"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(180, 197, 255)

    p2 = tf.add_paragraph()
    p2.text = "Driving Measurable ROI in Talent Acquisition"
    p2.font.size = Pt(26)
    p2.font.bold = True
    p2.font.color.rgb = WHITE

    c1 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    c1.fill.solid()
    c1.fill.fore_color.rgb = RGBColor(11, 28, 70)
    c1.line.color.rgb = RGBColor(49, 107, 243)
    tf1 = c1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "📈 Measurable Business Impact"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(180, 197, 255)
    p.space_after = Pt(10)
    items1 = [
        "100% Elimination of Manual Data Entry: Form submissions appear in pipeline under 2 seconds.",
        "Zero Lost Applications: 1:1 spreadsheet response capture guarantees all candidate survey data is preserved.",
        "50% Faster Screening: One-click candidate advancement and unified profile dossiers.",
        "Enterprise Data Quality: Automated duplicate resolution and job matching."
    ]
    for it in items1:
        p_item = tf1.add_paragraph()
        p_item.text = f"• {it}"
        p_item.font.size = Pt(13)
        p_item.font.color.rgb = WHITE
        p_item.space_after = Pt(6)

    c2 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0))
    c2.fill.solid()
    c2.fill.fore_color.rgb = RGBColor(11, 28, 70)
    c2.line.color.rgb = RGBColor(49, 107, 243)
    tf2 = c2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "🔮 Future Roadmap"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(180, 197, 255)
    p.space_after = Pt(10)
    items2 = [
        "AI Candidate Matching: Semantic parsing to score candidate resumes against job description keywords.",
        "Automated Email Campaigns: Automated rejection / invitation emails on stage change.",
        "Calendar & Zoom Sync: Automatic generation of interview calendar invites.",
        "Predictive Hiring Analytics: Time-to-hire forecasts and recruiter performance dashboards."
    ]
    for it in items2:
        p_item = tf2.add_paragraph()
        p_item.text = f"• {it}"
        p_item.font.size = Pt(13)
        p_item.font.color.rgb = WHITE
        p_item.space_after = Pt(6)

    # Save PPTX
    output_path = os.path.abspath("TalentPulse_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_deck()
