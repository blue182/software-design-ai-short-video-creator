
import os
import textwrap
import matplotlib.pyplot as plt
import matplotlib.patheffects as path_effects
from matplotlib import font_manager
import matplotlib.colors as mcolors

# ==== FONT CONFIG ====
FONT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "fonts")
FONT_MAP = {
    "regular": os.path.join(FONT_DIR, "NotoSans-Regular.ttf"),
    "bold": os.path.join(FONT_DIR, "NotoSans-Bold.ttf"),
    "italic": os.path.join(FONT_DIR, "NotoSans-Italic.ttf"),
    "bold_italic": os.path.join(FONT_DIR, "NotoSans-BoldItalic.ttf"),
}
DEFAULT_FONT = FONT_MAP["regular"]

DPI = 100


import re

def parse_color(color):
    if isinstance(color, str):
        # rgba(...) string
        rgba_match = re.match(r'rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)', color)
        if rgba_match:
            r, g, b, a = rgba_match.groups()
            return (int(r)/255, int(g)/255, int(b)/255, float(a))
        # hex or named color
        return color
    return color

def generate_subtitle_image(
    text,
    output_path,
    text_color="white",
    bg_color="rgba(0,0,0,0.5)",
    font_size=20,
    text_styles=None,
    stroke_color="black",
    stroke_width=2,
    VIDEO_SIZE=(720, 1208),
    space_bottom=10  # ✅ luôn cách mép dưới 10px
):
    print("Generating subtitle image with text:", text)
    if not text:
        text = " "

    text_styles = text_styles or []
    text_color = parse_color(text_color)
    bg_color = parse_color(bg_color)
    stroke_color = parse_color(stroke_color)
    text_size_new = font_size + 10

    # Font logic
    is_bold = "bold" in text_styles
    is_italic = "italic" in text_styles

    font_variant = (
        "bold_italic" if is_bold and is_italic else
        "bold" if is_bold else
        "italic" if is_italic else
        "regular"
    )

    font_path = FONT_MAP.get(font_variant, DEFAULT_FONT)
    font_prop = font_manager.FontProperties(fname=font_path)

    # Text wrapping
    max_chars_per_line = 35
    wrapped_text = textwrap.fill(text, width=max_chars_per_line)
    num_lines = wrapped_text.count('\n') + 1

    line_height = int((text_size_new) * 1.6)
    padding = 20
    text_box_height = num_lines * line_height + 2 * padding
    img_w = VIDEO_SIZE[0]
    img_h = VIDEO_SIZE[1]  # ✅ full video size

    fig_w_in = img_w / DPI
    fig_h_in = img_h / DPI

    fig, ax = plt.subplots(figsize=(fig_w_in, fig_h_in), dpi=DPI)
    fig.patch.set_facecolor('none')  # transparent
    ax.set_facecolor('none')

    # ✅ Tính y dựa theo VIDEO_SIZE chứ không theo ảnh con
    # y = 1 - (space_bottom + text_box_height) / img_h
    # y = space_bottom / img_h
    y = 1 - (space_bottom / img_h)

    txt_obj = ax.text(
        0.5, y, wrapped_text,
        fontsize=text_size_new,
        color=text_color,
        ha='center', 
        # va='bottom',
        va='top',  # ✅ căn trên cùng
        wrap=True,
        fontproperties=font_prop,
        bbox=dict(
            facecolor=parse_color(bg_color),
            edgecolor='none',
            boxstyle='round,pad=0.4'
        )
    )

    # Stroke / Shadow
    txt_obj.set_path_effects([
        path_effects.Stroke(linewidth=stroke_width, foreground=parse_color(stroke_color)),
        path_effects.Normal()
    ])


    ax.axis("off")
    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    # plt.savefig(output_path, bbox_inches='tight', pad_inches=0, transparent=True)
    # plt.savefig(output_path, pad_inches=0, transparent=True)
    plt.savefig(output_path, bbox_inches=None, pad_inches=0, transparent=True)
    plt.close(fig)
