import os

NEW_SELECT_OPTIONS = """            <option value="en">🌐 English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="mr">मराठी</option>
            <option value="gu">ગુજરાતી</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="ml">മലയാളം</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="ur">اردو</option>
            <option value="ar">العربية</option>
            <option value="zh-CN">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
            <option value="pt">Português</option>
            <option value="ru">Русский</option>
            <option value="it">Italiano</option>
            <option value="nl">Nederlands</option>
            <option value="tr">Türkçe</option>
            <option value="th">ไทย</option>
            <option value="vi">Tiếng Việt</option>
            <option value="id">Bahasa Indonesia</option>
            <option value="ms">Bahasa Melayu</option>
            <option value="sw">Kiswahili</option>
            <option value="af">Afrikaans</option>
            <option value="ne">नेपाली</option>"""

# Mapping for footer/contact icons
ICON_MAP = {
    "ðŸ“ž": "📞", "ð\u009f\u0093\u009e": "📞",
    "âœ‰ï¸ ": "✉️", "â\u009c\u0089ï¸\u008f": "✉️",
    "ðŸ“ ": "📍", "ð\u009f\u0093\u008d": "📍"
}

FILES = ['index.html', 'about.html', 'services.html', 'gallery.html', 'contact.html', 'appointment.html', 'feedback.html']
BASE_DIR = r'c:\Users\DELL\website'

def repair_file(filename):
    filepath = os.path.join(BASE_DIR, filename)
    if not os.path.exists(filepath): return
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    new_lines = []
    in_select = False
    
    for line in lines:
        # 1. Handle Language Select
        if 'id="languageSelect"' in line:
            new_lines.append(line)
            new_lines.append(NEW_SELECT_OPTIONS + '\n')
            in_select = True
            continue
        if in_select:
            if '</select>' in line:
                new_lines.append(line)
                in_select = False
            continue
            
        # 2. Handle FAB button classes
        if ('class="fab ' in line or 'class=\"fab\"' in line) and ('<button' in line or '<a' in line):
            line = line.replace('class="fab ', 'class="fab-btn ')
            line = line.replace('class=\"fab\"', 'class=\"fab-btn\"')
            line = line.replace('class=\'fab\'', 'class=\'fab-btn\'')

        # 3. Handle Footer/Contact Icons
        for mangled, correct in ICON_MAP.items():
            line = line.replace(mangled, correct)
            
        new_lines.append(line)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Fixed: {filename}")

if __name__ == "__main__":
    for f in FILES:
        repair_file(f)
