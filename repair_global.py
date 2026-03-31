import os
import re

# Precise replacement block for all pages
NEW_SELECT = """<select id="languageSelect" class="lang-dropdown" onchange="changeLanguage(this.value)">
            <option value="en">🌐 English</option>
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
            <option value="ne">नेपाली</option>
          </select>"""

FILES = ['index.html', 'about.html', 'services.html', 'gallery.html', 'contact.html', 'appointment.html', 'feedback.html']
BASE_DIR = r'c:\Users\DELL\website'

def repair_dropdown(filename):
    filepath = os.path.join(BASE_DIR, filename)
    if not os.path.exists(filepath): return
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Precise Language Fix using full select block replacement
    content = re.sub(r'<select id="languageSelect".*?</select>', NEW_SELECT, content, flags=re.DOTALL)

    # 2. Fix Action Buttons (FABs)
    content = re.sub(r'<(button|a)([^>]*?class=["\'])fab\s+', r'<\1\2fab-btn ', content)
    content = re.sub(r'<(button|a)([^>]*?class=["\'])fab(["\'])', r'<\1\2fab-btn\3', content)

    # 3. Fix Footer Contact Icons using specific mojibake sequences
    # These exact sequences are what the tool output shows
    mappings = {
        'ð\u009f\u0093\u009e': '📞',
        'ðŸ“ž': '📞',
        'â\u009c\u0089ï¸\u008f': '✉️',
        'âœ‰ï¸ ': '✉️',
        'ð\u009f\u0093\u008d': '📍',
        'ðŸ“ ': '📍'
    }
    for k, v in mappings.items():
        content = content.replace(k, v)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Repaired: {filename}")

if __name__ == "__main__":
    for f in FILES:
        repair_dropdown(f)
