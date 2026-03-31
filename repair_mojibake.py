import os
import re

# Comprehensive map of Mojibake to UTF-8
REPLACEMENTS = {
    'Ã°Å¸Å’Â ': '🌐',
    'Ã Â¤Â¹Ã Â¤Â¿Ã Â¤Â¨Ã Â¥Â Ã Â¤Â¦Ã Â¥â‚¬': 'हिन्दी',
    'Ã¢ËœÂ°': '☰',
    'Ã°Å¸Â«â‚¬': '🫀',
    'Ã°Å¸â€ Â¬': '🔬',
    'Ã¢Å¡Â¡': '⚡',
    'Ã¢â€ â€”': '➔',
    'Ã¢Ëœâ€¦': '★',
    'Ã¢â‚¬Â¢': '•',
    'Ã°Å¸â€œÅ¾': '📞',
    'Ã¢Å“â€°Ã¯Â¸Â ': '✉️',
    'Ã°Å¸â€œÂ ': '📍',
    'Ã°Å¸â€œÂ¨': '📧',
    'Ã°Å¸â€˜Â¨Ã¢â‚¬Â Ã¢Å¡â€¢Ã¯Â¸Â ': '👨‍⚕️',
    'Ã¢â‚¬â€': '—'
}

def fix_mojibake(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        for mojibake, correct in REPLACEMENTS.items():
            content = content.replace(mojibake, correct)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed Mojibake in {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    root_dir = r'c:\Users\DELL\website'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.html', '.css', '.js')):
                fix_mojibake(os.path.join(root, file))

if __name__ == "__main__":
    main()
