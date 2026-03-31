import os
import re

# Comprehensive mapping of mangled (mojibake) strings to correct native characters
REPLACEMENTS = {
    'ðŸŒ ': '🌐',
    'à¤¹à¤¿à¤‚à¤¦à¥€': 'हिन्दी',
    'à¦¬à¦¾à¦‚à¦²à¦¾': 'বাংলা',
    'à®¤à®®à®¿à®´à¯ ': 'தமிழ்',
    'à°¤±†à°²à± à°—à± ': 'తెలుగు',
    'à°¤±\u0086à°²à±\u0081à°—à±\u0081': 'తెలుగు',
    'à°¤\u00ad\u00e2\u0080\u00a0\u00e1\u00ba\u00bd\u00c3\u00a0\u00c2\u00b0\u00c2\u00b2\u00c3\u00b9\u00c2\u0081\u00c3\u00a0\u00c2\u00b0\u00e2\u0080\u0094\u00c3\u00b9\u00c2\u0081': 'తెలుగు', # Handle severe mangling if any
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
    'à¤¨à¥‡à¤ªà¤¾à¤²à¥€': 'नेपाली',
    # Icons & Emojis
    'ðŸ“ž': '📞',
    'âœ‰ï¸ ': '✉️',
    'ðŸ“ ': '📍',
    'â˜°': '☰',
    'ðŸ«€': '🫀',
    'ðŸ”¬': '🔬',
    'âš⚡': '⚡',
    'ðŸ”Š': '🔊',
    'ðŸ”‡': '🔇',
    'ðŸŽ¤': '🎙️',
    'âž¤': '➤',
    'â˜…': '★',
    'ðŸ“¨': '📧',
    'ðŸ‘¨â€ âš•ï¸ ': '👨‍⚕️',
    'ðŸ¤–': '🤖',
    'ðŸš€': '🚀',
}

# Newline and previous script corruption fixes
CORRUPTION_FIXES = {
    '`n': '\n',             # Fix PowerShell style newlines if any
    '</p>`n': '</p>\n',
    'Gallery</a>`n': 'Gallery</a>\n',
    'Services</a>`n': 'Services</a>\n',
    'Home</a>`n': 'Home</a>\n',
}

FILES_TO_FIX = [
    'index.html',
    'about.html',
    'services.html',
    'gallery.html',
    'contact.html',
    'appointment.html',
    'feedback.html',
    'js/script.js',
    'css/style.css'
]

BASE_DIR = r'c:\Users\DELL\website'

def fix_content(content):
    # 1. Fix Mojibake
    for mangled, correct in REPLACEMENTS.items():
        content = content.replace(mangled, correct)
    
    # 2. Fix literal corruption strings
    for mangled, correct in CORRUPTION_FIXES.items():
        content = content.replace(mangled, correct)
    
    # 3. Specific FAB class normalization (fixing legacy issues)
    content = content.replace('class="fab fab-chat-toggle"', 'class="fab-btn fab-chat-toggle"')
    content = content.replace('class="fab fab-whatsapp"', 'class="fab-btn fab-whatsapp"')
    content = content.replace('class="fab fab-call"', 'class="fab-btn fab-call"')
    
    return content

def process_files():
    for rel_path in FILES_TO_FIX:
        filepath = os.path.join(BASE_DIR, rel_path.replace('/', os.sep))
        if not os.path.exists(filepath):
            print(f"Skipping {rel_path}: Not found")
            continue
            
        print(f"Processing {rel_path}...")
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                original_content = f.read()
            
            fixed_content = fix_content(original_content)
            
            if fixed_content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                print(f"  - FIXED: {rel_path}")
            else:
                print(f"  - No changes needed for {rel_path}")
                
        except Exception as e:
            print(f"  - ERROR processing {rel_path}: {e}")

if __name__ == "__main__":
    process_files()
    print("\nGlobal fix completed.")
