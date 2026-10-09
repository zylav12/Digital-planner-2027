
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor
from reportlab.pdfbase.pdfmetrics import stringWidth
from datetime import date, timedelta
import calendar
import os

from planner_config import COLORS, TABS

OUTPUT = "2027-Intentional-Life-Planner.pdf"
W, H = landscape(A4)
YEAR = 2027

BG = COLORS["ivory"]
SAGE = COLORS["sage"]
FOREST = COLORS["forest"]
TAUPE = COLORS["taupe"]
BEIGE = COLORS["beige"]
DARK = COLORS["charcoal"]
WHITE = COLORS["white"]
MUTED = COLORS["muted"]

LEFT = 38
RIGHT = W - 38
TOP = H - 40
BOTTOM = 35


def text(c, x, y, value, size=10, color=DARK, font="Helvetica"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, str(value))


def centered(c, x, y, value, size=10, color=DARK,
             font="Helvetica"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawCentredString(x, y, str(value))


def line(c, x1, y1, x2, y2, color=TAUPE, width=0.6):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


def rounded(c, x, y, w, h, fill=WHITE, stroke=TAUPE, r=10):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.roundRect(x, y, w, h, r, fill=1, stroke=1)


def background(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def heading(c, title, subtitle=None):
    text(c, LEFT, TOP - 12, title, 23, FOREST, "Helvetica-Bold")
    if subtitle:
        text(c, LEFT, TOP - 32, subtitle, 9, MUTED)
    line(c, LEFT, TOP - 43, RIGHT - 65, TOP - 43, SAGE, 1.2)


def footer(c, number, section="2027 INTENTIONAL LIFE PLANNER"):
    line(c, LEFT, 24, RIGHT - 65, 24, TAUPE, 0.5)
    text(c, LEFT, 12, section.upper(), 6.5, MUTED)
    c.setFillColor(FOREST)
    c.setFont("Helvetica", 7)
    c.drawRightString(RIGHT - 70, 12, str(number))


def tabs(c, active="HOME"):
    labels = [
        ("HOME", "HOME"), ("GOALS", "GOALS"),
        ("MONTH", "MONTH"), ("WEEK", "WEEK"),
        ("DAY", "DAY"), ("MONEY", "MONEY"),
        ("WELL", "WELL"), ("NOTES", "NOTES")
    ]
    x = W - 58
    y = H - 65
    for label, key in labels:
        fill = FOREST if label == active else BEIGE
        c.setFillColor(fill)
        c.roundRect(x, y, 42, 29, 5, fill=1, stroke=0)
        centered(c, x + 21, y + 11, label, 5.5,
                 WHITE if label == active else FOREST,
                 "Helvetica-Bold")
        y -= 35


def new_page(c, number, title, subtitle=None, active="HOME"):
    background(c)
    heading(c, title, subtitle)
    tabs(c, active)
    footer(c, number, title)
    return c


def card(c, x, y, w, h, title, fill=WHITE):
    rounded(c, x, y, w, h, fill, TAUPE, 9)
    text(c, x + 12, y + h - 20, title, 9, FOREST, "Helvetica-Bold")


def writing_lines(c, x, y, w, count, spacing=18):
    for i in range(count):
        line(c, x, y - i * spacing, x + w, y - i * spacing,
             BEIGE, 0.7)


def checkbox_list(c, x, y, w, count, spacing=23):
    for i in range(count):
        yy = y - i * spacing
        c.setStrokeColor(SAGE)
        c.roundRect(x, yy - 4, 9, 9, 2, fill=0, stroke=1)
        line(c, x + 17, yy, x + w, yy, BEIGE, 0.6)


def cover(c):
    background(c)
    c.setStrokeColor(SAGE)
    c.setLineWidth(1.5)
    c.roundRect(35, 30, W - 70, H - 60, 20, fill=0, stroke=1)

    centered(c, W / 2, H - 115, "YOUR YEAR, YOUR INTENTIONS",
             10, FOREST, "Helvetica-Bold")
    line(c, W / 2 - 45, H - 135, W / 2 + 45, H - 135, SAGE, 1.5)

    centered(c, W / 2, H - 205, "2027", 62, FOREST, "Helvetica-Bold")
    centered(c, W / 2, H - 255, "INTENTIONAL LIFE PLANNER",
             22, DARK, "Helvetica-Bold")
    centered(c, W / 2, H - 287, "Plan your days. Design your life.",
             12, MUTED, "Helvetica-Oblique")

    rounded(c, W / 2 - 110, 95, 220, 55, SAGE, SAGE, 14)
    centered(c, W / 2, 126, "A YEAR OF PURPOSEFUL LIVING",
             8, WHITE, "Helvetica-Bold")
    centered(c, W / 2, 57, "YEARLY  •  MONTHLY  •  WEEKLY  •  DAILY",
             7, MUTED)
    c.showPage()


def index_page(c, number):
    new_page(c, number, "Welcome to Your Year",
             "A thoughtful space to plan, reflect and grow.")
    items = [
        ("01", "Year at a Glance", "See the bigger picture"),
        ("02", "Goals & Intentions", "Choose what matters"),
        ("03", "Monthly Planning", "Create a clear monthly focus"),
        ("04", "Weekly Planning", "Turn priorities into action"),
        ("05", "Daily Planning", "Make space for what matters"),
        ("06", "Notes & Reflection", "Capture thoughts and ideas"),
    ]
    x, y, w, h = LEFT, H - 125, 315, 52
    for num, title, desc in items:
        rounded(c, x, y - h, w, h - 7, WHITE, BEIGE, 8)
        text(c, x + 13, y - 25, num, 10, FOREST, "Helvetica-Bold")
        text(c, x + 47, y - 23, title, 10, DARK, "Helvetica-Bold")
        text(c, x + 47, y - 38, desc, 8, MUTED)
        y -= h

    card(c, 390, 130, 300, 205, "MY WORD FOR 2027")
    writing_lines(c, 405, 290, 270, 5, 29)
    card(c, 390, 65, 300, 48, "A NOTE TO MY FUTURE SELF")
    c.showPage()


def yearly_page(c, number):
    new_page(c, number, "2027 Year at a Glance",
             "Make room for the year you want to create.", "GOALS")

    months = list(calendar.month_name)[1:]
    cell_w, cell_h = 145, 82
    gap_x, gap_y = 10, 10
    start_x, start_y = LEFT, H - 145

    for i, month in enumerate(months):
        col = i % 4
        row = i // 4
        x = start_x + col * (cell_w + gap_x)
        y = start_y - row * (cell_h + gap_y) - cell_h
        card(c, x, y, cell_w, cell_h, month)
        writing_lines(c, x + 10, y + 38, cell_w - 20, 2, 17)

    c.showPage()


def goal_page(c, number, index):
    names = [
        "My Vision", "Life Areas", "Personal Growth",
        "Career & Purpose", "Health & Energy", "Relationships",
        "Home & Lifestyle", "Learning Goals", "Creative Goals",
        "Experiences & Adventures", "My Top Priorities",
        "My Action Plan"
    ]
    title = names[index]
    new_page(c, number, title, "Design a life aligned with your values.",
             "GOALS")

    card(c, LEFT, 220, 310, 125, "WHAT DO I WANT?")
    writing_lines(c, LEFT + 12, 315, 285, 4, 22)

    card(c, LEFT, 75, 310, 125, "WHY DOES THIS MATTER?")
    writing_lines(c, LEFT + 12, 170, 285, 4, 22)

    card(c, 390, 220, 300, 125, "FIRST STEPS")
    checkbox_list(c, 405, 310, 270, 4, 24)

    card(c, 390, 75, 300, 125, "HOW WILL I MEASURE PROGRESS?")
    writing_lines(c, 405, 170, 270, 4, 22)
    c.showPage()


def month_page(c, number, month_index):
    month = calendar.month_name[month_index]
    new_page(c, number, f"{month} 2027",
             "Monthly overview, priorities and reflection.", "MONTH")

    card(c, LEFT, 260, 300, 85, "MONTHLY INTENTION")
    writing_lines(c, LEFT + 12, 308, 275, 2, 23)

    card(c, LEFT, 145, 300, 100, "TOP THREE PRIORITIES")
    checkbox_list(c, LEFT + 13, 210, 275, 3, 25)

    card(c, LEFT, 65, 300, 65, "IMPORTANT DATES")
    writing_lines(c, LEFT + 12, 92, 275, 2, 18)

    x, y = 365, 330
    width, height = 44, 35
    days = ["M", "T", "W", "T", "F", "S", "S"]

    for i, d in enumerate(days):
        centered(c, x + i * width + width / 2, y + 9, d,
                 8, FOREST, "Helvetica-Bold")

    first_weekday, total_days = calendar.monthrange(YEAR, month_index)
    for day in range(1, total_days + 1):
        index = first_weekday + day - 1
        row, col = divmod(index, 7)
        xx = x + col * width
        yy = y - 10 - (row + 1) * height
        rounded(c, xx, yy, width - 3, height - 3,
                WHITE, BEIGE, 4)
        text(c, xx + 4, yy + height - 14, day, 7, FOREST)

    card(c, 365, 65, 305, 58, "MONTH-END REFLECTION")
    writing_lines(c, 377, 88, 275, 2, 16)
    c.showPage()


def week_page(c, number, week_start, week_num):
    week_end = week_start + timedelta(days=6)
    new_page(c, number, f"Weekly Plan • Week {week_num:02d}",
             f"{week_start:%d %b} – {week_end:%d %b %Y}", "WEEK")

    card(c, LEFT, 270, 300, 75, "WEEKLY FOCUS")
    writing_lines(c, LEFT + 12, 312, 275, 2, 22)

    card(c, LEFT, 155, 300, 100, "TOP PRIORITIES")
    checkbox_list(c, LEFT + 13, 220, 275, 3, 25)

    card(c, LEFT, 65, 300, 75, "NOTES & REMINDERS")
    writing_lines(c, LEFT + 12, 108, 275, 2, 22)

    x, y = 365, 330
    col_w, row_h = 145, 78
    day_names = ["Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday", "Sunday"]

    for i, day_name in enumerate(day_names):
        col = i % 2
        row = i // 2
        xx = x + col * (col_w + 12)
        yy = y - row * (row_h + 8) - row_h
        day = week_start + timedelta(days=i)
        card(c, xx, yy, col_w, row_h,
             f"{day_name} • {day.day} {day.strftime('%b')}")
        writing_lines(c, xx + 10, yy + 36, col_w - 20, 2, 18)

    c.showPage()


def day_page(c, number, current):
    date_title = current.strftime("%A, %d %B %Y")
    new_page(c, number, date_title,
             "A new day to live with intention.", "DAY")

    card(c, LEFT, 275, 300, 70, "TODAY'S INTENTION")
    writing_lines(c, LEFT + 12, 310, 275, 2, 22)

    card(c, LEFT, 135, 300, 125, "TOP THREE PRIORITIES")
    checkbox_list(c, LEFT + 13, 225, 275, 3, 28)

    card(c, LEFT, 65, 300, 55, "GRATITUDE")
    writing_lines(c, LEFT + 12, 87, 275, 2, 17)

    card(c, 365, 220, 305, 125, "SCHEDULE & APPOINTMENTS")
    for hour in range(7, 20):
        yy = 320 - (hour - 7) * 7
        text(c, 378, yy, f"{hour:02d}:00", 6.5, MUTED)
        line(c, 415, yy - 2, 655, yy - 2, BEIGE, 0.5)

    card(c, 365, 65, 305, 140, "NOTES & REFLECTION")
    writing_lines(c, 378, 170, 275, 5, 20)
    c.showPage()


def notes_page(c, number, index):
    new_page(c, number, f"Notes & Ideas • {index:02d}",
             "A little space for everything on your mind.", "NOTES")
    card(c, LEFT, 65, RIGHT - LEFT - 75, 280, "NOTES")
    writing_lines(c, LEFT + 14, 310, RIGHT - LEFT - 105, 14, 17)
    c.showPage()


def build():
    c = canvas.Canvas(OUTPUT, pagesize=(W, H))
    c.setTitle("2027 Intentional Life Planner")
    c.setAuthor("2027 Intentional Life Planner")

    page_number = 1
    cover(c)

    page_number += 1
    index_page(c, page_number)

    page_number += 1
    yearly_page(c, page_number)

    for i in range(12):
        page_number += 1
        goal_page(c, page_number, i)

    for month in range(1, 13):
        page_number += 1
        month_page(c, page_number, month)

    first_monday = date(YEAR, 1, 1)
    first_monday -= timedelta(days=first_monday.weekday())

    for week in range(1, 53):
        page_number += 1
        start = first_monday + timedelta(days=(week - 1) * 7)
        week_page(c, page_number, start, week)

    current = date(YEAR, 1, 1)
    for _ in range(365):
        page_number += 1
        day_page(c, page_number, current)
        current += timedelta(days=1)

    for i in range(36):
        page_number += 1
        notes_page(c, page_number, i + 1)

    c.save()
    print(f"PDF created: {os.path.abspath(OUTPUT)}")
    print(f"Pages generated: {page_number}")


if __name__ == "__main__":
    build()

