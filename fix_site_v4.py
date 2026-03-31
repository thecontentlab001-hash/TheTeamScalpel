import os
import re

# Precise mapping for all languages in the dropdown
LANG_MAP = {
    'hi': 'हिन्दी',
    'bn': 'বাংলা',
    'ta': 'தமிழ்',
    'te': 'తెలుగు',
    'mr': 'मराठी',
    'gu': 'ગુજરાતી',
    'kn': 'ಕನ್ನಡ',
    'ml': 'മലയാളം',
    'pa': 'ਪੰਜਾਬੀ',
    'ur': 'اردو',
    'ar': 'العربية',
    'zh-CN': '中文',
    'ja': '日本語',
    'ko': '한국어',
    'fr': 'Français',
    'de': 'Deutsch',
    'es': 'Español',
    'pt': 'Português',
    'ru': 'Русский',
    'it': 'Italiano',
    'nl': 'Nederlands',
    'tr': 'Türkçe',
    'th': 'ไทย',
    'vi': 'Tiếng Việt',
    'id': 'Bahasa Indonesia',
    'ms': 'Bahasa Melayu',
    'sw': 'Kiswahili',
    'af': 'Afrikaans',
    'ne': 'नेपाली'
}

# Footer/Contact Emojis (Regex-based to avoid mangling issues)
# We look for the patterns in specific contexts
CONTACT_MAP = {
    '📞': ['\+91 8130574541', 'Phone / Emergency'],
    '✉️': ['bkdr.alokagrawal@gmail.com', 'Email Contact'],
    '📍': ['Baraut Medicity Hospital', 'Address']
}

FILES = ['index.html', 'about.html', 'services.html', 'gallery.html', 'contact.html', 'appointment.html', 'feedback.html']
BASE_DIR = r'c:\Users\DELL\website'

def repair_file(filename):
    filepath = os.path.join(BASE_DIR, filename)
    if not os.path.exists(filepath): return
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Fix Language Dropdown using value-based regex
    content = re.sub(r'<option value="en">.*?</option>', r'<option value="en">🌐 English</option>', content)
    for code, native in LANG_MAP.items():
        content = re.sub(rf'<option value="{code}">.*?</option>', rf'<option value="{code}">{native}</option>', content)

    # 2. Fix Action Button Classes (FABs)
    # Target: <button class="fab ..."> or <a class="fab ...">
    content = re.sub(r'<(button|a)([^>]*?class=["\'])fab\s+', r'<\1\2fab-btn ', content)
    content = re.sub(r'<(button|a)([^>]*?class=["\'])fab(["\'])', r'<\1\2fab-btn\3', content)

    # 3. Fix Contact Emojis in Footer and Contact Page
    # We look for lines containing the phone/email/address markers and replace characters before them
    # Example footer: <li>📞 +91 8130574541</li>
    # We'll use a broad replacement for the common mangled icons if they appear near the target text
    content = re.sub(r'[^\w\s]{2,}\s*\+91 8130574541', r'📞 +91 8130574541', content)
    content = re.sub(r'[^\w\s]{2,}\s*bkdr.alokagrawal@gmail.com', r'✉️ bkdr.alokagrawal@gmail.com', content)
    content = re.sub(r'[^\w\s]{2,}\s*Baraut Medicity Hospital', r'📍 Baraut Medicity Hospital', content)
    
    # Catching specific icons in contact-icon divs
    content = re.sub(r'<div class="contact-icon">.*?</div>', lambda m: re.sub(r'>.*?<', f'>📞<', m.group(0)) if '+91' in content else m.group(0), content)
    # Actually, simpler:
    content = content.replace('ðŸ“ž', '📞')
    content = content.replace('âœ‰ï¸ ', '✉️')
    content = content.replace('ðŸ“ ', '📍')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Repaired: {filename}")

if __name__ == "__main__":
    for f in FILES:
        repair_file(f)
