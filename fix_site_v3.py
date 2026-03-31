import os
import re

# Comprehensive mapping of mangled (mojibake) strings to correct native characters
LANGUAGE_REPLACEMENTS = {
    'ðŸŒ ': '🌐',
    'à¤¹à¤¿à¤‚à¤¦à¥€': 'हिन्दी',
    'à¦¬à¦¾à¦‚à¦²à¦¾': 'বাংলা',
    'à®¤à®®à®¿à®´à¯ ': 'தமிழ்',
    'à°¤±†à°²à± à°—à± ': 'తెలుగు',
    'à°¤±\u0086à°²à±\u0081à°—à±\u0081': 'తెలుగు',
    'à¤®à¤°à¤¾à¤ à¥€': 'मराठी',
    'àª—à« àªœàª°àª¾àª¤à«€': 'ગુજરાતી',
    'à²•à²¨à³ à²¨à²¡': 'ಕನ್ನಡ',
    'à´®à´²à´¯à´¾à´³à´‚': 'മലയാളം',
    'à¨ªà©°à¨œà¨¾à¨¬à©€': 'ਪੰਜਾਬੀ',
    'Ø§Ø±Ø¯Ùˆ': 'اردو',
    'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©': 'العربية',
    'ä¸\u00adæ–‡': '中文',
    'æ—¥æœ¬èªž': '日本語',
    'í•œêµ\u00adì–´': '한국어',
    'FranÃ§ais': 'Français',
    'Deutsch': 'Deutsch',
    'EspaÃ±ol': 'Español',
    'PortuguÃªs': 'Português',
    'Ð ÑƒÑ Ñ ÐºÐ¸Ð¹': 'Русский',
    'Italiano': 'Italiano',
    'Nederlands': 'Nederlands',
    'TÃ¼rkÃ§e': 'Türkçe',
    'à¹„à¸—à¸¢': 'ไทย',
    'Tiáº¿ng Viá»‡t': 'Tiếng Việt',
    'Bahasa Indonesia': 'Bahasa Indonesia',
    'Bahasa Melayu': 'Bahasa Melayu',
    'Kiswahili': 'Kiswahili',
    'Afrikaans': 'Afrikaans',
    'à¤¨à¥‡à¤ªà¤¾à¤²à¥€': 'नेपाली',
    # Contact Icons (Emoji Mojibake)
    'ðŸ“ž': '📞',
    'âœ‰ï¸ ': '✉️',
    'ðŸ“ ': '📍',
    'ð\u009f\u0093\u009e': '📞',
    'â\u009c\u0089ï¸\u008f': '✉️',
    'ð\u009f\u0093\u008d': '📍'
}

FILES = [
    'index.html',
    'about.html',
    'services.html',
    'gallery.html',
    'contact.html',
    'appointment.html',
    'feedback.html'
]

BASE_DIR = r'c:\Users\DELL\website'

def fix_file(filename):
    filepath = os.path.join(BASE_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename}: Not found")
        return

    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Global language/icon replacements
    for mangled, correct in LANGUAGE_REPLACEMENTS.items():
        content = content.replace(mangled, correct)

    # 2. Rename custom .fab to .fab-btn in buttons and links
    # This specifically renames class="fab" when it appears on interactive elements
    # but avoids Font Awesome tags like <i class="fab ...">
    content = re.sub(r'<(button|a)([^>]*?class=["\'])\s*fab\s+', r'<\1\2fab-btn ', content)
    content = re.sub(r'<(button|a)([^>]*?class=["\'])\s*fab(["\'])', r'<\1\2fab-btn\3', content)

    # Specific common patterns for FAB classes
    content = content.replace('class="fab fab-chat-toggle"', 'class="fab-btn fab-chat-toggle"')
    content = content.replace('class="fab fab-whatsapp"', 'class="fab-btn fab-whatsapp"')
    content = content.replace('class="fab fab-call"', 'class="fab-btn fab-call"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Re-processed and fixed: {filename}")

if __name__ == "__main__":
    for f in FILES:
        fix_file(f)
